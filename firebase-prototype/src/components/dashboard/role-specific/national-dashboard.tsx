
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Users, BrainCircuit, CheckCircle } from 'lucide-react';
import MetricCard from '@/components/dashboard/metric-card';
import { federalDashboardMetrics, mockActivities } from '@/lib/data';
import PerformanceCharts from '@/components/dashboard/performance-charts';
import MapCard from '@/components/dashboard/map-card';
import EmergencyCenter from '@/components/dashboard/emergency-center';
import RecentActivities from '@/components/dashboard/recent-activities';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const SemioticRiskOverview = () => {
    const highRiskActivities = mockActivities.filter(a => (a.semioticRiskScore || 0) > 70).slice(0,3);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    <CardTitle>Semiotic Risk Overview</CardTitle>
                </div>
                <CardDescription>Campaigns with high communication risk.</CardDescription>
            </CardHeader>
            <CardContent>
                {highRiskActivities.length > 0 ? (
                    <ul className="space-y-4">
                        {highRiskActivities.map(activity => (
                             <li key={activity.id} className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive font-bold shrink-0">
                                    {activity.semioticRiskScore}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/dashboard/activities/${activity.id}`} className="font-semibold text-foreground hover:underline truncate block">{activity.title}</Link>
                                    <p className="text-sm text-muted-foreground">{activity.organization}</p>
                                </div>
                                <Badge variant="destructive">High Risk</Badge>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-muted-foreground p-4">
                        <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                        <p className="mt-2 font-medium">No high-risk campaigns detected.</p>
                    </div>
                )}
                 <div className="text-sm text-muted-foreground mt-4 pt-4 border-t">
                    <p>Pattern Database Size: <span className="font-semibold text-foreground">12 Active Patterns</span></p>
                    <p>Last Assessed: <span className="font-semibold text-foreground">{format(new Date(), 'PPP')}</span></p>
                </div>
            </CardContent>
        </Card>
    )
}

export default function NationalDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex gap-4">
          <Button variant="gradient">
            <PlusCircle />
            Create Campaign
          </Button>
          <Button variant="outline">
            <FileText />
            View Reports
          </Button>
           <Button variant="outline">
            <Users />
            Manage Teams
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {federalDashboardMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PerformanceCharts />
        </div>
        <div className="lg:col-span-1">
          <MapCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
         <SemioticRiskOverview />
         <EmergencyCenter />
         <RecentActivities />
      </div>
    </div>
  );
}
