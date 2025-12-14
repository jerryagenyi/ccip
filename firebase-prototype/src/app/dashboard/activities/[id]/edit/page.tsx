
'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActivityForm } from '@/app/dashboard/activities/components/activity-form';
import { mockActivities } from '@/lib/data';

export default function EditActivityPage() {
    const params = useParams();
    const { id } = params;
    const activity = mockActivities.find(a => a.id === id);

    if (!activity) {
        notFound();
    }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/activities/${id}`}>
            <ArrowLeft />
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Edit Campaign
            </h1>
            <p className="text-muted-foreground">
            Update the details for: {activity.title}
            </p>
        </div>
      </div>
      <ActivityForm mode="edit" activity={activity} />
    </div>
  );
}

    
