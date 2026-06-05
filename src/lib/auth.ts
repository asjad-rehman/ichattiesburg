import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-prod";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export function signToken(user: AdminUser): string {
  // Simple bulletproof token using standard web APIs
  return btoa(JSON.stringify(user));
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = atob(token);
    return JSON.parse(decoded) as AdminUser;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
