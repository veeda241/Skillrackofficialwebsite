import { HackathonUpdates } from '@/components/dashboard/hackathon-updates';
import { TeamRoster } from '@/components/dashboard/team-roster';

export default function DashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <HackathonUpdates />
      </div>
      <div>
        <TeamRoster />
      </div>
    </div>
  );
}
