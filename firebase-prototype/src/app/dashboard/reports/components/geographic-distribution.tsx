
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { reportGeographicDistribution } from "@/lib/data";

const LocationBar = ({ name, count, progress, colorClass }: { name: string, count: number, progress: number, colorClass: string }) => (
    <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
            <p className="font-medium">{name}</p>
            <p className="font-semibold">{count} activities</p>
        </div>
        <Progress value={progress} className="h-2" indicatorClassName={colorClass} />
    </div>
);

export default function GeographicDistribution() {
    const maxCount = Math.max(...reportGeographicDistribution.map(item => item.count));
    const halfLength = Math.ceil(reportGeographicDistribution.length / 2);
    const firstHalf = reportGeographicDistribution.slice(0, halfLength);
    const secondHalf = reportGeographicDistribution.slice(halfLength);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-4">
                        {firstHalf.map((item, index) => (
                            <LocationBar 
                                key={item.name} 
                                name={item.name} 
                                count={item.count} 
                                progress={(item.count / maxCount) * 100}
                                colorClass={item.colorClass}
                            />
                        ))}
                    </div>
                     <div className="space-y-4">
                        {secondHalf.map((item, index) => (
                             <LocationBar 
                                key={item.name} 
                                name={item.name} 
                                count={item.count} 
                                progress={(item.count / maxCount) * 100}
                                colorClass={item.colorClass}
                            />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
