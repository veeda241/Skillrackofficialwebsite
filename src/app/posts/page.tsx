import { PostsList } from '@/components/posts/posts-list';
import { getCurrentUser } from '@/app/actions/auth';

export default async function PostsPage() {
  const user = await getCurrentUser();
  return <PostsList user={user} />;
}
