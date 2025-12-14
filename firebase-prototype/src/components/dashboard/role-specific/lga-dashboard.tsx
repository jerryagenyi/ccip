import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';
import MetricCard from '@/components/dashboard/metric-card';
import { lgaDashboardMetrics } from '@/lib/data';
import RecentActivities from '@/components/dashboard/recent-activities';

export default function LgaDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex gap-4">
          <Button variant="gradient">
            <PlusCircle />
            Report Activity
          </Button>
          <Button variant="outline">
            <FileText />
            Submit Weekly Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {lgaDashboardMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
         <RecentActivities />
      </div>
    </div>
  );
}
