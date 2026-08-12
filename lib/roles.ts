import { NextRequest } from 'next/server';
import { verifyToken } from './auth';

export function requireRole(request: NextRequest, role: 'CUSTOMER' | 'ADMIN') {
  const token = request.cookies.get('seafood_session')?.value;
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== role) {
    return null;
  }

  return payload;
}
