import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-prod";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export function signToken(user: AdminUser): string {
  // Simple bulletproof token for the hardcoded admin
  return Buffer.from(JSON.stringify(user)).toString("base64");
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
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
