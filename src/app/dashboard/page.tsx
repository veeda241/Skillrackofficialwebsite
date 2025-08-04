import { HackathonUpdates } from '@/components/dashboard/hackathon-updates';
import { TeamRoster } from '@/components/dashboard/team-roster';

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <HackathonUpdates />
      <TeamRoster />
    </div>
  );
}
