
'use client';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockOrganisations } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, CheckCircle, Building, MapPin } from 'lucide-react';
import type { Organisation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Step2Organisation() {
  const { control, setValue, watch } = useFormContext();
  const [search, setSearch] = useState('');
  
  const selectedOrgId = watch('organisationId');

  const filteredOrgs = mockOrganisations.filter(org => 
    org.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectOrg = (orgId: string) => {
    setValue('organisationId', orgId, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
       <div className="text-center">
            <h2>Select Your Organisation</h2>
            <p className="text-muted-foreground">Find and select the organisation you belong to.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search for your organisation..." 
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <FormField
        control={control}
        name="organisationId"
        render={({ field }) => (
          <FormItem>
            <FormDescription className="text-center">
              Showing {filteredOrgs.length} of {mockOrganisations.length} organisations
            </FormDescription>
            <ScrollArea className="h-64">
                <div className="space-y-3 pr-4">
                {filteredOrgs.map(org => (
                    <Card 
                    key={org.id} 
                    className={cn(
                        "cursor-pointer transition-all hover:border-primary",
                        selectedOrgId === org.id && "border-2 border-primary ring-2 ring-primary/20"
                    )}
                    onClick={() => handleSelectOrg(org.id)}
                    >
                    <CardContent className="p-4 flex items-start justify-between">
                        <div className="space-y-1">
                        <p className="font-bold text-foreground">{org.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5"><Building className="h-4 w-4" /> {org.level}</div>
                            <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {org.parent || 'National Level'}</div>
                        </div>
                        </div>
                        {selectedOrgId === org.id && (
                        <CheckCircle className="h-6 w-6 text-primary" />
                        )}
                    </CardContent>
                    </Card>
                ))}
                </div>
            </ScrollArea>
             <FormMessage className="text-center pt-2" />
          </FormItem>
        )}
      />

       <div className="text-center text-sm">
        <p className="text-muted-foreground">Can't find your organisation?</p>
        <Button variant="link" className="h-auto p-0">Request to add your organisation</Button>
      </div>
    </div>
  );
}
