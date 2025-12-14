
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Building, Link2, Send, Loader2 } from 'lucide-react';
import { mockOrganisations } from '@/lib/data';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Organisation, OrganisationCategory, OrganisationLevel } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(3, 'Organisation name must be at least 3 characters.'),
  category: z.string().nonempty('Organisation category is required.'),
  level: z.string().nonempty('Hierarchy level is required.'),
  parent: z.string().optional(),
}).refine(data => {
    if (data.level === 'Federal') return true;
    return !!data.parent;
}, {
    message: "A parent organisation is required for State and LGA levels.",
    path: ["parent"],
}).refine(data => {
    if (data.level !== 'Federal') return true;
    return !data.parent;
}, {
    message: "Federal level organisations cannot have a parent.",
    path: ["parent"],
});


type OrganisationFormProps = {
  mode: 'create' | 'edit';
  organisation?: Organisation;
};

const categories: OrganisationCategory[] = ['Government', 'NGO', 'CSO'];
const levels: OrganisationLevel[] = ['Federal', 'State', 'LGA'];


export function OrganisationForm({ mode, organisation }: OrganisationFormProps) {
    const router = useRouter();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: organisation?.name || '',
            category: organisation?.category || '',
            level: organisation?.level || '',
            parent: organisation?.parent || '',
        },
    });

    const selectedLevel = form.watch('level');
    
    const parentOrgs = mockOrganisations.filter(org => {
        if (selectedLevel === 'State') return org.level === 'Federal';
        if (selectedLevel === 'LGA') return org.level === 'State';
        return false;
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        console.log("Submitting form data:", data);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
          <Card>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold">Organisation {mode === 'create' ? 'Created' : 'Updated'}!</h2>
                <p className="text-muted-foreground mt-2">
                  The organisation has been successfully {mode === 'create' ? 'created' : 'updated'}.
                </p>
                <div className="mt-8 flex gap-4">
                  <Button variant="outline" onClick={() => router.push('/dashboard/organisations/create')}>Create Another</Button>
                  <Button variant="gradient" onClick={() => router.push('/dashboard/organisations')}>View All Organisations</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <CardTitle>Organisation Details</CardTitle>
            </div>
            <CardDescription>Provide the core information about the organisation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Organisation Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Lagos State Ministry of Health" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                    <SelectContent>{categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )} />
                <FormField control={form.control} name="level" render={({ field }) => (
                <FormItem>
                    <FormLabel>Hierarchy Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a level" /></SelectTrigger></FormControl>
                    <SelectContent>{levels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )} />
            </div>
          </CardContent>
        </Card>

        {(selectedLevel === 'State' || selectedLevel === 'LGA') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                <CardTitle>Hierarchy Link</CardTitle>
            </div>
            <CardDescription>Connect this organisation to its parent.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <FormField control={form.control} name="parent" render={({ field }) => (
                <FormItem>
                    <FormLabel>Parent Organisation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedLevel || selectedLevel === 'Federal'}>
                        <FormControl><SelectTrigger>
                            <SelectValue placeholder={
                                selectedLevel === 'State' ? "Select a Federal parent" : 
                                selectedLevel === 'LGA' ? "Select a State parent" : 
                                "Select a level first"
                            } />
                        </SelectTrigger></FormControl>
                        <SelectContent>
                            {parentOrgs.map(org => <SelectItem key={org.id} value={org.name}>{org.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
          </CardContent>
        </Card>
        )}


        <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="gradient" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {mode === 'create' ? 'Create Organisation' : 'Save Changes'} <Send className="ml-2" />
                </>
              )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
