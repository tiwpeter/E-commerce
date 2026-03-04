import bcrypt from 'bcryptjs';
import { config } from '../config/app.config';
import { userRepository } from '../repositories/user.repository';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt.util';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from '../utils/errors';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async register(dto: RegisterDto): Promise<AuthResponse> {
    // Check for existing user
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, config.bcrypt.rounds);

    const user = await userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await userRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(dto.email);
    if (!user || !user.isActive || user.deletedAt) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await userRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<Omit<AuthResponse, 'user'>> {
    const payload = verifyRefreshToken(refreshToken);

    const user = await userRepository.findById(payload.sub);
    if (!user || !user.isActive || user.deletedAt) {
      throw new UnauthorizedError('User not found');
    }

    // Token rotation: validate stored refresh token
    if (user.refreshToken !== refreshToken) {
      // Possible token reuse — invalidate all tokens
      await userRepository.updateRefreshToken(user.id, null);
      throw new UnauthorizedError('Refresh token reuse detected');
    }

    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await userRepository.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await userRepository.updateRefreshToken(userId, null);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new BadRequestError('Current password is incorrect');

    const hashed = await bcrypt.hash(newPassword, config.bcrypt.rounds);
    await userRepository.update(userId, { password: hashed });
    // Invalidate refresh token
    await userRepository.updateRefreshToken(userId, null);
  }

  async getProfile(userId: string) {
    const user = await userRepository.findByIdSafe(userId);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }
}

export const authService = new AuthService();
