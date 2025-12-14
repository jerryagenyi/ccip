
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { reportStatusBreakdown } from "@/lib/data";

export default function StatusBreakdown() {
    return (
        <Card>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {reportStatusBreakdown.map((status) => (
                        <Card key={status.name} className="p-4 border-2" style={{ borderColor: status.borderColor }}>
                            <p className="text-3xl font-bold">{status.count}</p>
                            <p className="font-semibold">{status.name}</p>
                            <p className="text-xs text-muted-foreground">{status.description}</p>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
