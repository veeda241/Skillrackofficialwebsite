import { SignupForm } from '@/components/auth/signup-form';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function AdminSignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2 font-bold mb-4">
                <Logo className="h-8 w-8 text-primary" />
                <span className="text-2xl font-headline">SkillRack</span>
            </Link>
          <h1 className="text-3xl font-bold tracking-tight">Admin Account</h1>
          <p className="text-muted-foreground">Create an administrator account.</p>
        </div>
        <SignupForm isAdmin />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
