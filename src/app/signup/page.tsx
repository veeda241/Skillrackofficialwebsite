import { SignupForm } from '@/components/auth/signup-form';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2 font-bold mb-4">
                <Logo className="h-8 w-8 text-primary" />
                <span className="text-2xl font-headline">SkillRack</span>
            </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-muted-foreground">Enter your details below to get started as a member.</p>
        </div>
        <SignupForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
         <p className="mt-2 text-center text-sm text-muted-foreground">
          Are you an admin?{' '}
          <Link href="/admin-signup" className="font-medium text-primary hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
