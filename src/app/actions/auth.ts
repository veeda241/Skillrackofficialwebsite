'use server';

// This is a placeholder for a real authentication system.
// In a production app, you would use a service like Firebase Auth,
// validate credentials against a database, and manage sessions/JWTs.

export async function login(values: { email: string; password?: string }): Promise<{ success: boolean; error?: string }> {
  console.log('Attempting to log in with:', values.email);

  // Simulate a successful login for any provided email
  if (values.email) {
    return { success: true };
  }

  return { success: false, error: 'Invalid email or password.' };
}
