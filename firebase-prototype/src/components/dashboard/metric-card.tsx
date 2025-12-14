import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type MetricCardProps = {
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  accentColor?: string;
  progress?: number;
  trendColor?: string;
};

export default function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  accentColor = 'bg-primary',
  progress,
  trendColor
}: MetricCardProps) {
  return (
    <Card>
       <div className={cn('absolute top-0 left-0 h-1 w-full', accentColor)} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm text-secondary">
          {title}
        </CardTitle>
        <Icon className={cn('h-6 w-6 text-foreground/70')} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
          {value}
        </div>
        <p className={cn("text-xs", trendColor ? trendColor : "text-muted-foreground")}>{trend}</p>
        {progress !== undefined && (
          <Progress value={progress} className="mt-2 h-1" indicatorClassName="bg-primary" />
        )}
      </CardContent>
    </Card>
  );
}
