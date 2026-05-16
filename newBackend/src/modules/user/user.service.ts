import { randomBytes } from "crypto";
import type { User, RegisterUserInput, UpdateUserInput } from "./user.schema";

// ============================================================
// Custom Errors
// ============================================================

export class UserNotFoundError extends Error {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
    this.name = "UserNotFoundError";
  }
}

export class UserConflictError extends Error {
  constructor(email: string) {
    super(`User with email "${email}" already exists`);
    this.name = "UserConflictError";
  }
}

// ============================================================
// In-Memory Store (swap for Repository when ready)
// ============================================================

const store = new Map<string, User & { password: string }>();

function generateId(): string {
  return randomBytes(12).toString("base64url");
}

// ============================================================
// UserService
// ============================================================

export class UserService {
  /** List all users (admin use) */
  async getUsers(): Promise<User[]> {
    return [...store.values()].map(({ password: _pw, ...user }) => user);
  }

  /** Get single user by ID */
  async getUserById(id: string): Promise<User> {
    const record = store.get(id);
    if (!record) throw new UserNotFoundError(id);
    const { password: _pw, ...user } = record;
    return user;
  }

  /** Get single user by email */
  async getUserByEmail(email: string): Promise<User> {
    const record = [...store.values()].find((u) => u.email === email);
    if (!record) throw new UserNotFoundError(email);
    const { password: _pw, ...user } = record;
    return user;
  }

  /** Register (create) a new user */
  async registerUser(data: RegisterUserInput): Promise<User> {
    const exists = [...store.values()].some((u) => u.email === data.email);
    if (exists) throw new UserConflictError(data.email);

    const now = new Date();
    const newUser: User & { password: string } = {
      id: generateId(),
      email: data.email,
      password: data.password, // hash before storing in real impl
      name: data.name,
      role: "USER",
      isActive: true,
      emailVerified: false,
      avatar: null,
      createdAt: now,
      updatedAt: now,
    };

    store.set(newUser.id, newUser);

    const { password: _pw, ...user } = newUser;
    return user;
  }

  /** Update user profile */
  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const record = store.get(id);
    if (!record) throw new UserNotFoundError(id);

    const updated = { ...record, ...data, updatedAt: new Date() };
    store.set(id, updated);

    const { password: _pw, ...user } = updated;
    return user;
  }

  /** Soft-delete: deactivate user */
  async deactivateUser(id: string): Promise<void> {
    const record = store.get(id);
    if (!record) throw new UserNotFoundError(id);
    store.set(id, { ...record, isActive: false, updatedAt: new Date() });
  }
}
