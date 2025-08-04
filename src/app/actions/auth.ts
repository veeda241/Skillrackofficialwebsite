'use server';

import { usersDb, type User } from '@/lib/users';

// Simple in-memory session store
if (!global.session) {
  global.session = { currentUser: null };
}

let session: { currentUser: Omit<User, 'password'> | null } = global.session;


export async function login(values: { email: string; password?: string }): Promise<{ success: boolean; error?: string }> {
  console.log('Attempting to log in with:', values.email);

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

    const existingUser = usersDb.find((u) => u.email === values.email);

    if (existingUser) {
        return { success: false, error: 'A user with this email already exists.' };
    }

    const newUser: User = {
        ...values,
        role: 'member', // Default role
    };

    usersDb.push(newUser);
    console.log('New user created:', newUser.email);
    console.log('Current user DB:', usersDb);

    return { success: true };
}

export async function signupAdmin(values: Omit<User, 'role'>): Promise<{ success: boolean; error?: string }> {
    console.log('Attempting to sign up admin with:', values.email);

    const existingUser = usersDb.find((u) => u.email === values.email);

    if (existingUser) {
        return { success: false, error: 'A user with this email already exists.' };
    }

    const newUser: User = {
        ...values,
        role: 'admin',
    };

    usersDb.push(newUser);
    console.log('New admin user created:', newUser.email);

    return { success: true };
}

export async function getUsers(): Promise<{ success: true, data: Omit<User, 'password'>[] } | { success: false, error: string }> {
    try {
        // Return users without their passwords
        const safeUsers = usersDb.map(({ password, ...user }) => user);
        return { success: true, data: safeUsers };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}
