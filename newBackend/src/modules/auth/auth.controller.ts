import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
  ChangePasswordSchema,
} from "./auth.schema";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ----------------------------------------------------------
  // POST /auth/register
  // ----------------------------------------------------------

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = RegisterSchema.parse(req.body);
      const result = await this.authService.register(input);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  // ----------------------------------------------------------
  // POST /auth/login
  // ----------------------------------------------------------

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = LoginSchema.parse(req.body);
      const result = await this.authService.login(input);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // ----------------------------------------------------------
  // POST /auth/logout
  // ----------------------------------------------------------

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.logout(req.user!.sub);
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  };

  // ----------------------------------------------------------
  // POST /auth/refresh
  // ----------------------------------------------------------

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = RefreshTokenSchema.parse(req.body);
      const tokens = await this.authService.refresh(input);
      res.status(200).json(tokens);
    } catch (err) {
      next(err);
    }
  };

  // ----------------------------------------------------------
  // GET /auth/me
  // ----------------------------------------------------------

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.me(req.user!.sub);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  // ----------------------------------------------------------
  // POST /auth/verify-email
  // ----------------------------------------------------------

  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = VerifyEmailSchema.parse(req.body);
      await this.authService.verifyEmail(input);
      res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
      next(err);
    }
  };

  // ----------------------------------------------------------
  // POST /auth/forgot-password
  // ----------------------------------------------------------

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = ForgotPasswordSchema.parse(req.body);
      await this.authService.forgotPassword(input);
      res.status(200).json({ message: "If that email is registered, a reset link has been sent." });
    } catch (err) {
      next(err);
    }
  };

  // ----------------------------------------------------------
  // POST /auth/reset-password
  // ----------------------------------------------------------

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = ResetPasswordSchema.parse(req.body);
      await this.authService.resetPassword(input);
      res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
      next(err);
    }
  };

  // ----------------------------------------------------------
  // POST /auth/change-password
  // ----------------------------------------------------------

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = ChangePasswordSchema.parse(req.body);
      await this.authService.changePassword(req.user!.sub, input);
      res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
      next(err);
    }
  };
}
