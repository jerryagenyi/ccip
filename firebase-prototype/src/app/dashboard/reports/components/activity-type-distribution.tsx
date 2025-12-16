
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { reportActivityTypes } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function ActivityTypeDistribution() {

    const totalActivities = reportActivityTypes.reduce((sum, item) => sum + item.count, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Campaign Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {reportActivityTypes.map((item) => (
                        <div key={item.name} className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <span className={cn("h-2.5 w-2.5 rounded-full", item.colorClass)} />
                                    <p className="font-medium">{item.name}</p>
                                </div>
                                <p className="font-semibold">{item.count}</p>
                            </div>
                            <Progress value={(item.count / totalActivities) * 100} className="h-2" indicatorClassName={item.colorClass} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
