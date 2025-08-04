import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Briefcase, Lightbulb, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg">SkillRack</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              <Link href="/signup">Create Account</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
              Level Up Your AI/ML Skills
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
              SkillRack provides personalized course recommendations, connects you with your team, and keeps you updated on the latest hackathons.
            </p>
            <div className="mt-6">
              <Button size="lg" asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-card py-12 md:py-24 lg:py-32">
          <div className="container grid gap-8 md:grid-cols-3">
            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <Lightbulb className="h-8 w-8 text-primary" />
                <CardTitle>AI-Powered Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Get course suggestions in the AI/ML domain tailored to your profile and goals, helping you learn what matters most.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <Briefcase className="h-8 w-8 text-primary" />
                <CardTitle>Hackathon Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Stay ahead of the curve with a curated feed of the latest and most exciting hackathon competitions.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <Users className="h-8 w-8 text-primary"/>
                <CardTitle>Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">View your team's roster and progress, fostering a collaborative environment for your hackathon journey.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <footer className="border-t">
        <div className="container py-6 flex justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SkillRack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
