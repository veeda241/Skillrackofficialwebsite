'use client';

import { Github, Code, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const ConnectedAppIcon = ({ app }: { app: 'github' | 'devpost' | 'slack' }) => {
  const styles = "h-8 w-8 text-muted-foreground";
  switch (app) {
    case 'github':
      return <Github className={styles} />;
    case 'devpost':
      return <Code className={styles} />;
    case 'slack':
      return <MessageSquare className={styles} />;
    default:
      return null;
  }
};

export function ConnectedApps() {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Connected Apps</CardTitle>
                <CardDescription>Manage your third-party app connections.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <ConnectedAppIcon app="github" />
                      <div>
                          <p className="font-medium">GitHub</p>
                          <p className="text-sm text-muted-foreground">Code hosting and version control</p>
                      </div>
                  </div>
                  <Button variant="outline">Connect</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <ConnectedAppIcon app="devpost" />
                      <div>
                          <p className="font-medium">Devpost</p>
                          <p className="text-sm text-muted-foreground">Hackathon platform</p>
                      </div>
                  </div>
                  <Button variant="outline">Connect</Button>
              </div>
               <Separator />
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <ConnectedAppIcon app="slack" />
                      <div>
                          <p className="font-medium">Slack</p>
                          <p className="text-sm text-muted-foreground">Team communication</p>
                      </div>
                  </div>
                  <Button variant="outline">Connect</Button>
              </div>
            </CardContent>
        </Card>
    )
}
