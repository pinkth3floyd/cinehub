import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_SESSION_KEY = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface AdminSession {
  email: string;
  isAdmin: boolean;
  expiresAt: number;
}

// Create admin session
export async function createAdminSession(email: string) {
  const session: AdminSession = {
    email,
    isAdmin: true,
    expiresAt: Date.now() + SESSION_DURATION,
  };

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_KEY, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  });
}

// Get admin session
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_SESSION_KEY);
    
    if (!sessionCookie?.value) {
      return null;
    }

    const session: AdminSession = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      await deleteAdminSession();
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
}

// Delete admin session
export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_KEY);
}

// Check if admin is authenticated
export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null && session.isAdmin;
}

// Get admin session from request (for middleware)
export function getAdminSessionFromRequest(request: NextRequest): AdminSession | null {
  try {
    const sessionCookie = request.cookies.get(ADMIN_SESSION_KEY);
    
    if (!sessionCookie?.value) {
      return null;
    }

    const session: AdminSession = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
} 