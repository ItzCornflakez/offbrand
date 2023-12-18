import { hash, compare } from 'bcrypt';

const saltRounds = 10; // Number of salt rounds for bcrypt

export async function hashPassword(password: string): Promise<string> {
  return hash(password, saltRounds);
}

export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return compare(plainPassword, hashedPassword);
}