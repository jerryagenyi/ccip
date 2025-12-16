
'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrganisationForm } from '@/app/dashboard/organisations/components/organisation-form';
import { mockOrganisations } from '@/lib/data';

export default function EditOrganisationPage() {
    const params = useParams();
    const { id } = params;
    const organisation = mockOrganisations.find(o => o.id === id);

    if (!organisation) {
        notFound();
    }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/organisations">
            <ArrowLeft />
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Edit Organisation
            </h1>
            <p className="text-muted-foreground">
            Update the details for: {organisation.name}
            </p>
        </div>
      </div>
      <OrganisationForm mode="edit" organisation={organisation} />
    </div>
  );
}
