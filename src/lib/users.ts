import { z } from "zod";

export const UserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum(['admin', 'member']),
});

export type User = z.infer<typeof UserSchema>;