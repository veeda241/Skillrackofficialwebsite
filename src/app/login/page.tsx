import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { RecommendedAccounts } from '@/components/auth/recommended-accounts';
import { Separator } from '@/components/ui/separator';
import { login } from '@/app/actions/auth';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2 font-bold mb-4">
                <Logo className="h-8 w-8 text-primary" />
                <span className="text-2xl font-headline">SkillRack</span>
            </Link>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">Choose an account or sign in below.</p>
        </div>
        
        <RecommendedAccounts onLogin={login} />

        <div className="my-6 flex items-center">
            <Separator className="flex-1" />
            <span className="px-4 text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
        </div>

        <LoginForm onLogin={login} />

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
