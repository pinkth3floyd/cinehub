'use server';

import { db } from '../index';
import { users } from './schema';
import { eq, desc, like, or, sql } from 'drizzle-orm';
import { createUserSchema, updateUserSchema, loginUserSchema, type CreateUserInput, type UpdateUserInput, type LoginUserInput } from './schema';
import bcrypt from 'bcryptjs';

// Create a new user
export async function createUser(data: CreateUserInput) {
  try {
    // Validate input
    const validatedData = createUserSchema.parse(data);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Create user
    const [user] = await db.insert(users).values({
      ...validatedData,
      password: hashedPassword,
      updatedAt: new Date(),
    }).returning();
    
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create user' };
  }
}

// Get all users with pagination
export async function getUsers(page: number = 1, limit: number = 10, search?: string) {
  try {
    const offset = (page - 1) * limit;
    
    let whereClause = undefined;
    if (search) {
      whereClause = or(
        like(users.fullName, `%${search}%`),
        like(users.email, `%${search}%`),
        like(users.username, `%${search}%`)
      );
    }
    
    const usersList = await db.select().from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);
    
    const totalCountResult = await db.select({ count: sql`count(*)` }).from(users).where(whereClause);
    const totalCount = totalCountResult[0] ? Number(totalCountResult[0].count) : 0;
    
    return {
      success: true,
      data: {
        users: usersList,
        pagination: {
          page,
          limit,
                  total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
        }
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get users' };
  }
}

// Get user by ID
export async function getUserById(id: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get user' };
  }
}

// Get user by email
export async function getUserByEmail(email: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get user' };
  }
}

// Update user
export async function updateUser(id: string, data: UpdateUserInput) {
  try {
    // Validate input
    const validatedData = updateUserSchema.parse(data);
    
    // Hash password if provided
    const updateData = { ...validatedData, updatedAt: new Date() };
    if (validatedData.password) {
      updateData.password = await bcrypt.hash(validatedData.password, 10);
    }
    
    const [user] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update user' };
  }
}

// Delete user
export async function deleteUser(id: string) {
  try {
    const [user] = await db.delete(users).where(eq(users.id, id)).returning();
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete user' };
  }
}

// Login user
export async function loginUser(data: LoginUserInput) {
  try {
    // Validate input
    const validatedData = loginUserSchema.parse(data);
    
    // Get user by email
    const userResult = await getUserByEmail(validatedData.email);
    if (!userResult.success) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    const user = userResult.data;
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      return { success: false, error: 'Account is not active' };
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    return { success: true, data: userWithoutPassword };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to login' };
  }
}

// Get users statistics
export async function getUserStats() {
  try {
    const [totalUsers, activeUsers, bannedUsers] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(users),
      db.select({ count: sql`count(*)` }).from(users).where(eq(users.status, 'active')),
      db.select({ count: sql`count(*)` }).from(users).where(eq(users.status, 'banned'))
    ]);
    
    return {
      success: true,
      data: {
        total: totalUsers[0] ? Number(totalUsers[0].count) : 0,
        active: activeUsers[0] ? Number(activeUsers[0].count) : 0,
        banned: bannedUsers[0] ? Number(bannedUsers[0].count) : 0
      }
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get user stats' };
  }
}
