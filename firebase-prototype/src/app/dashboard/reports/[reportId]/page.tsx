
'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { reportTemplates, mockActivities } from '@/lib/data';
import {
  generateRiskCommunicationReport,
  type GenerateRiskCommunicationReportOutput,
} from '@/ai/flows/generate-risk-communication-report';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, Download, Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const ReportLoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </CardContent>
  </Card>
);

export default function GeneratedReportPage() {
  const params = useParams();
  const { reportId } = params;

  const [reportData, setReportData] = useState<GenerateRiskCommunicationReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const template = reportTemplates.find((t) => t.id === reportId);

  useEffect(() => {
    if (template) {
      const generateReport = async () => {
        setIsLoading(true);
        try {
          const activitiesData = JSON.stringify(mockActivities.slice(0, 10), null, 2);
          // In a real app, outcomes would come from a different data source.
          // Here, we'll just pass a summary of statuses.
          const outcomes = mockActivities.reduce((acc, activity) => {
            acc[activity.status] = (acc[activity.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const outcomesData = JSON.stringify(outcomes, null, 2);

          const result = await generateRiskCommunicationReport({ activitiesData, outcomesData });
          setReportData(result);
        } catch (error) {
          console.error('Failed to generate report:', error);
          // You could set an error state here to show in the UI
        } finally {
          setIsLoading(false);
        }
      };
      generateReport();
    }
  }, [template]);

  if (!template) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/reports">
                    <ArrowLeft />
                </Link>
            </Button>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {template.name}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                    <Bot className="h-4 w-4" /> AI Generated Report
                </p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><Share2 className="mr-2" /> Share</Button>
            <Button variant="gradient"><Download className="mr-2" /> Download PDF</Button>
        </div>
      </div>
      
      {isLoading ? (
        <ReportLoadingSkeleton />
      ) : (
        <Card>
            <CardHeader>
                <CardTitle>AI Analysis: {template.name}</CardTitle>
                <CardDescription>
                    This report was automatically generated on {new Date().toLocaleDateString()}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div 
                    className="prose prose-lg max-w-none prose-headings:font-semibold prose-p:text-foreground prose-li:text-foreground"
                    dangerouslySetInnerHTML={{ __html: reportData?.report.replace(/\n/g, '<br />') || ''}} 
                />
            </CardContent>
        </Card>
      )}
    </div>
  );
}
