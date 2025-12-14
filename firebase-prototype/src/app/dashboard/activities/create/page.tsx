
import { ActivityForm } from "@/app/dashboard/activities/components/activity-form";

export default function CreateActivityPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Campaign
        </h1>
        <p className="text-muted-foreground">
          Fill out the form below to create and submit a new campaign.
        </p>
      </div>
      <ActivityForm mode="create" />
    </div>
  );
}

    
