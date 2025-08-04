import { AppLayout } from '@/components/app-layout';

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
