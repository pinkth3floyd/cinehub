import { z } from 'zod';

// Admin login schema
export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>; 