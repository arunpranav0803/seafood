import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET ?? 'changeme';
const COOKIE_NAME = 'seafood_session';
const SALT_BYTES = 16;
const HASH_KEY_LEN = 64;

export type JwtPayload = {
  userId: string;
  role: 'CUSTOMER' | 'ADMIN';
};

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(SALT_BYTES).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, HASH_KEY_LEN).toString('hex');
  return `${salt}:${derivedKey}`;
}

export async function verifyPassword(password: string, hash: string) {
  const [salt, storedKey] = hash.split(':');
  if (!salt || !storedKey) {
    return false;
  }
  const derivedKey = crypto.scryptSync(password, salt, HASH_KEY_LEN).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(storedKey, 'hex'), Buffer.from(derivedKey, 'hex'));
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSessionCookie() {
  cookies().set({
    name: COOKIE_NAME,
    value: '',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0
  });
}

export function getSessionToken() {
  return cookies().get(COOKIE_NAME)?.value ?? null;
}

function isNextRequest(request: Request | import('next/server').NextRequest): request is import('next/server').NextRequest {
  return typeof (request as any).cookies !== 'undefined';
}

export function getPayloadFromRequest(request: Request | import('next/server').NextRequest) {
  const token = isNextRequest(request) ? request.cookies.get(COOKIE_NAME)?.value ?? null : null;
  if (!token) {
    return null;
  }
  return verifyToken(token);
}
