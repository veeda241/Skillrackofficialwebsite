'use server';

import { type User } from '@/lib/users';
import fs from 'fs/promises';
import path from 'path';

// Simple in-memory session store (session can remain in-memory for simplicity)
if (!global.session) {
  global.session = { currentUser: null };
}
let session: { currentUser: Omit<User, 'password'> | null } = global.session;

const usersFilePath = path.join(process.cwd(), 'src', 'data', 'users.json');

async function getUsersFromFile(): Promise<User[]> {
    try {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return []; // File doesn't exist
        }
        throw error;
    }
}

async function saveUsersToFile(users: User[]): Promise<void> {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}


export async function login(values: { email: string; password?: string }): Promise<{ success: boolean; error?: string }> {
  console.log('Attempting to log in with:', values.email);
  const usersDb = await getUsersFromFile();
  const user = usersDb.find((u) => u.email === values.email);

  if (!user) {
    return { success: false, error: 'User not found.' };
  }

  if (user.password !== values.password) {
    return { success: false, error: 'Invalid password.' };
  }

  const { password, ...userWithoutPassword } = user;
  session.currentUser = userWithoutPassword;
  console.log('User logged in, session set:', session.currentUser);

  return { success: true };
}

export async function logout(): Promise<{ success: true }> {
    session.currentUser = null;
    console.log('User logged out, session cleared.');
    return { success: true };
}


export async function getCurrentUser(): Promise<Omit<User, 'password'> | null> {
    return session.currentUser;
}


export async function signup(values: Omit<User, 'role'>): Promise<{ success: boolean; error?: string }> {
    console.log('Attempting to sign up with:', values.email);
    const usersDb = await getUsersFromFile();
    const existingUser = usersDb.find((u) => u.email === values.email);

    if (existingUser) {
        return { success: false, error: 'A user with this email already exists.' };
    }

    const newUser: User = {
        ...values,
        role: 'member', // Default role
    };

    usersDb.push(newUser);
    await saveUsersToFile(usersDb);
    console.log('New user created:', newUser.email);

    return { success: true };
}

export async function signupAdmin(values: Omit<User, 'role'>): Promise<{ success: boolean; error?: string }> {
    console.log('Attempting to sign up admin with:', values.email);
    const usersDb = await getUsersFromFile();
    const existingUser = usersDb.find((u) => u.email === values.email);

    if (existingUser) {
        return { success: false, error: 'A user with this email already exists.' };
    }

    const newUser: User = {
        ...values,
        role: 'admin',
    };

    usersDb.push(newUser);
    await saveUsersToFile(usersDb);
    console.log('New admin user created:', newUser.email);

    return { success: true };
}

export async function getUsers(): Promise<{ success: true, data: Omit<User, 'password'>[] } | { success: false, error: string }> {
    try {
        const usersDb = await getUsersFromFile();
        // Return users without their passwords
        const safeUsers = usersDb.map(({ password, ...user }) => user);
        return { success: true, data: safeUsers };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}