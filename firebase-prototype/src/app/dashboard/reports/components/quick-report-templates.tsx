
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { reportTemplates } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function QuickReportTemplates() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Report Templates</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {reportTemplates.map((template) => (
                        <Button key={template.name} variant="outline" className="h-auto py-4 flex-col items-start text-left" asChild>
                            <Link href={`/dashboard/reports/${template.id}`}>
                                <template.icon className="h-6 w-6 mb-2 text-primary" />
                                <p className="font-semibold">{template.name}</p>
                                <p className="text-sm text-muted-foreground font-normal">{template.description}</p>
                            </Link>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
