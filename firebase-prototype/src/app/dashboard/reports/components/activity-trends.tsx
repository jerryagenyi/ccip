

'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { reportActivityTrendsWeek, reportActivityTrendsMonth, reportActivityTrendsYear } from "@/lib/data";

type TrendData = {
    period: string;
    activities: string;
    date: string;
    progress: number;
}

const TrendItem = ({ period, activities, date, progress }: TrendData) => (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <div className="space-y-1">
            <div className="flex justify-between items-center">
                <p className="font-semibold">{period}</p>
                <div className="hidden sm:flex items-center gap-4">
                    <p className="font-bold text-primary">{activities}</p>
                    <p className="text-sm text-muted-foreground">{date}</p>
                </div>
            </div>
            <Progress value={progress} className="h-3" indicatorClassName="bg-primary" />
             <div className="flex sm:hidden justify-between items-center pt-1">
                <p className="font-bold text-primary text-sm">{activities}</p>
                <p className="text-xs text-muted-foreground">{date}</p>
            </div>
        </div>
    </div>
);

const TrendList = ({ data }: { data: TrendData[] }) => (
    <div className="space-y-6">
        {data.map((trend) => (
            <TrendItem key={trend.period} {...trend} />
        ))}
    </div>
);


export default function ActivityTrends() {
    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Campaign Trends</CardTitle>
                 <Tabs defaultValue="week" className="w-auto">
                    <TabsList>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="week">
                    <TabsContent value="week">
                        <TrendList data={reportActivityTrendsWeek} />
                    </TabsContent>
                    <TabsContent value="month">
                        <TrendList data={reportActivityTrendsMonth} />
                    </TabsContent>
                    <TabsContent value="year">
                        <TrendList data={reportActivityTrendsYear} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
