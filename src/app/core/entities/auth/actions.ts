'use server';

import { createAdminSession, getAdminSession, deleteAdminSession } from './session';
import { adminLoginSchema, type AdminLoginInput } from './schema';

// Admin login action
export async function adminLogin(data: AdminLoginInput) {
  try {
    // Validate input
    const validatedData = adminLoginSchema.parse(data);
    
    // Check against environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PW;
    
    if (!adminEmail || !adminPassword) {
      return { 
        success: false, 
        error: 'Admin credentials not configured' 
      };
    }
    
    // Validate credentials
    if (validatedData.email === adminEmail && validatedData.password === adminPassword) {
      // Create session
      await createAdminSession(validatedData.email);
      
      return { 
        success: true, 
        data: { 
          email: validatedData.email,
          isAdmin: true 
        } 
      };
    } else {
      return { 
        success: false, 
        error: 'Invalid email or password' 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Login failed' 
    };
  }
}

// Check if user is authenticated (for server-side checks)
export async function checkAdminAuth() {
  const session = await getAdminSession();
  return { 
    success: true, 
    data: { 
      isAuthenticated: session !== null,
      session 
    } 
  };
}

// Logout action
export async function adminLogout() {
  try {
    await deleteAdminSession();
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Logout failed' 
    };
  }
} 