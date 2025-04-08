import { DashboardOverview } from '@/components/dashboard/overview';
import { ContentTools } from '@/components/dashboard/tools/content-tools';

export default function DashboardPage() {
  return (
    <main className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Generate Content</h1>
              <p className="text-muted-foreground text-lg">
                Create engaging property descriptions and marketing content with AI.
              </p>
            </div>
            <DashboardOverview />
          </div>
          <ContentTools />
        </div>
      </div>
    </main>
  );
}