
'use client';

import { OrganisationForm } from "@/app/dashboard/organisations/components/organisation-form";

export default function CreateOrganisationPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Add New Organisation
        </h1>
        <p className="text-muted-foreground">
          Fill out the form below to register a new organisation or invite an external one to the platform.
        </p>
      </div>
      <OrganisationForm mode="create" />
    </div>
  );
}
