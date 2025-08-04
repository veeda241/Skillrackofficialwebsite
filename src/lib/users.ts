import { z } from "zod";

// This is a simple in-memory user store.
// In a real application, you would use a database.

export const UserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum(['admin', 'member']),
});

export type User = z.infer<typeof UserSchema>;

// By storing it in a global object, we can ensure it persists across
// serverless function invocations during a single session.
// This is a common pattern for development/prototyping in Next.js.
if (!global.usersDb) {
  global.usersDb = [];
}

export const usersDb: User[] = global.usersDb;

// You can pre-populate with a default user for testing if you like:
// if (usersDb.length === 0) {
//     usersDb.push({
//         name: 'Admin User',
//         email: 'admin@example.com',
//         password: 'password',
//         role: 'admin'
//     });
// }
