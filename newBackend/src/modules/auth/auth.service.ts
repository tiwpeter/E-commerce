import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ChangePasswordInput,
  AuthUser,
  TokenPair,
  AuthResponse,
} from "./auth.schema";

// ============================================================
// Config (wire from env in production)
// ============================================================

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "change-me-access";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "change-me-refresh";
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";
const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 900; // 15 min
const SALT_ROUNDS = 12;

// ============================================================
// Helpers
// ============================================================

function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    emailVerified: user.emailVerified,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

function issueTokens(userId: string, role: string): TokenPair {
  const accessToken = jwt.sign({ sub: userId, role }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
  const refreshToken = jwt.sign({ sub: userId }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL,
  });
  return { accessToken, refreshToken, expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS };
}

// ============================================================
// Service
// ============================================================

export class AuthService {
  constructor(private readonly db: PrismaClient) {}

  // ----------------------------------------------------------
  // Register
  // ----------------------------------------------------------

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existing = await this.db.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw Object.assign(new Error("Email already in use"), { status: 409 });
    }

    const hashed = await bcrypt.hash(input.password, SALT_ROUNDS);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await this.db.user.create({
      data: {
        email: input.email,
        password: hashed,
        name: input.name,
        // Store the token temporarily — in production use a separate table
        refreshToken: verificationToken,
      },
    });

    // TODO: send verification email with verificationToken

    const tokens = issueTokens(user.id, user.role);
    await this.db.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return { user: toAuthUser(user), tokens };
  }

  // ----------------------------------------------------------
  // Login
  // ----------------------------------------------------------

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.db.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) {
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    if (!user.isActive) {
      throw Object.assign(new Error("Account is inactive"), { status: 403 });
    }
/*
    if (!user.emailVerified) {
      throw Object.assign(new Error("Email not verified"), { status: 403 });
    }
*/
    const tokens = issueTokens(user.id, user.role);
    await this.db.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return { user: toAuthUser(user), tokens };
  }

  // ----------------------------------------------------------
  // Logout
  // ----------------------------------------------------------

  async logout(userId: string): Promise<void> {
    await this.db.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  // ----------------------------------------------------------
  // Refresh
  // ----------------------------------------------------------

  async refresh(input: RefreshTokenInput): Promise<TokenPair> {
    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(input.refreshToken, JWT_REFRESH_SECRET) as jwt.JwtPayload;
    } catch {
      throw Object.assign(new Error("Invalid or expired refresh token"), { status: 401 });
    }

    const user = await this.db.user.findUnique({ where: { id: payload.sub as string } });
    if (!user || user.refreshToken !== input.refreshToken) {
      throw Object.assign(new Error("Refresh token revoked"), { status: 401 });
    }

    const tokens = issueTokens(user.id, user.role);
    await this.db.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return tokens;
  }

  // ----------------------------------------------------------
  // Get current user
  // ----------------------------------------------------------

  async me(userId: string): Promise<AuthUser> {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }
    return toAuthUser(user);
  }

  // ----------------------------------------------------------
  // Verify email
  // ----------------------------------------------------------

  async verifyEmail(input: VerifyEmailInput): Promise<void> {
    // In production: look up a dedicated email_verifications table
    const user = await this.db.user.findFirst({
      where: { refreshToken: input.token, emailVerified: false },
    });
    if (!user) {
      throw Object.assign(new Error("Invalid or expired verification token"), { status: 400 });
    }

    await this.db.user.update({
      where: { id: user.id },
      data: { emailVerified: true, refreshToken: null },
    });
  }

  // ----------------------------------------------------------
  // Forgot password
  // ----------------------------------------------------------

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    const user = await this.db.user.findUnique({ where: { email: input.email } });
    // Always resolve — never leak whether the email exists
    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString("hex");
    // In production: store hashed token + expiry in a password_resets table
    await this.db.user.update({
      where: { id: user.id },
      data: { refreshToken: resetToken },
    });

    // TODO: send reset email with resetToken
  }

  // ----------------------------------------------------------
  // Reset password
  // ----------------------------------------------------------

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    // In production: look up the password_resets table
    const user = await this.db.user.findFirst({ where: { refreshToken: input.token } });
    if (!user) {
      throw Object.assign(new Error("Invalid or expired reset token"), { status: 400 });
    }

    const hashed = await bcrypt.hash(input.password, SALT_ROUNDS);
    await this.db.user.update({
      where: { id: user.id },
      data: { password: hashed, refreshToken: null },
    });
  }

  // ----------------------------------------------------------
  // Change password (authenticated)
  // ----------------------------------------------------------

  async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }

    const valid = await bcrypt.compare(input.currentPassword, user.password);
    if (!valid) {
      throw Object.assign(new Error("Current password is incorrect"), { status: 400 });
    }

    const hashed = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
    await this.db.user.update({
      where: { id: user.id },
      data: { password: hashed, refreshToken: null }, // revoke all sessions
    });
  }
}
