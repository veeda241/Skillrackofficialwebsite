import { Github, Code, MessageSquare } from 'lucide-react';

export const ConnectedAppIcon = ({ app }: { app: 'github' | 'devpost' | 'slack' }) => {
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
