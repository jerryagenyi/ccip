
'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockActivities } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, FileText, MapPin, Calendar, Paperclip, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { ActivityStatus } from '@/lib/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const statusStyles: Record<ActivityStatus, string> = {
  Approved: "bg-green-500 text-white",
  Submitted: "bg-blue-500 text-white",
  Draft: "bg-gray-500 text-white",
  Rejected: "bg-red-500 text-white",
  Completed: "bg-primary text-white",
};

const ReviewItem = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-4">
    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
    <dd className="text-sm col-span-2">{value}</dd>
  </div>
);

export default function ActivityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const activity = mockActivities.find(a => a.id === id);

  if (!activity) {
    return notFound();
  }
  
  const { title, type, description, location, status, dateCreated, lastModified, organization } = activity;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
        </Button>
        <Link href={`/dashboard/activities/${id}/edit`}>
          <Button variant="gradient">
            <Edit className="mr-2 h-4 w-4" /> Edit Campaign
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{title}</CardTitle>
              <CardDescription>
                Campaign ID: {id}
              </CardDescription>
            </div>
            <Badge className={`${statusStyles[status]} rounded-lg px-4 py-2`}>{status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 mt-6">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h4 className="text-lg font-semibold">Campaign Details</h4>
            </div>
            <dl className="space-y-3 pl-7">
              <ReviewItem label="Organization" value={organization || 'Not provided'} />
              <ReviewItem label="Type" value={type || 'Not provided'} />
              <ReviewItem label="Description" value={<p className="whitespace-pre-wrap">{description || 'Not provided'}</p>} />
            </dl>
          </div>
          
          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h4 className="text-lg font-semibold">Logistics</h4>
            </div>
            <dl className="space-y-3 pl-7">
              <ReviewItem label="Location" value={location || 'Not provided'} />
              <ReviewItem label="Date Created" value={dateCreated ? format(new Date(dateCreated), 'PPP') : 'Not provided'} />
              <ReviewItem label="Last Modified" value={lastModified ? format(new Date(lastModified), 'PPP') : 'Not provided'} />
            </dl>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-primary" />
                <h4 className="text-lg font-semibold">Attachments</h4>
            </div>
            <div className="pl-7">
                <p className="text-sm text-muted-foreground">No attachments were uploaded.</p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

    
