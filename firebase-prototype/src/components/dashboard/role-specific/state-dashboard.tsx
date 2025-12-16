import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Users } from 'lucide-react';
import MetricCard from '@/components/dashboard/metric-card';
import { stateDashboardMetrics } from '@/lib/data';
import PerformanceCharts from '@/components/dashboard/performance-charts';
import MapCard from '@/components/dashboard/map-card';
import EmergencyCenter from '@/components/dashboard/emergency-center';
import RecentActivities from '@/components/dashboard/recent-activities';

export default function StateDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex gap-4">
          <Button variant="gradient">
            <PlusCircle />
            Create Activity
          </Button>
          <Button variant="outline">
            <FileText />
            View State Reports
          </Button>
           <Button variant="outline">
            <Users />
            Manage State Teams
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stateDashboardMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PerformanceCharts />
        </div>
        <div className="lg:col-span-1">
            <RecentActivities />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
         <EmergencyCenter />
      </div>
    </div>
  );
}
