
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Send, FileText, MapPin, Paperclip, CheckCircle, CalendarIcon, UploadCloud, File, X, Loader2, MessageCircle, AlertCircle } from 'lucide-react';
import { mockActivities, mockSemioticPatterns, activityTypes, regions, languages, cultures, messengers } from '@/lib/data';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { Activity, SemioticAssessment } from '@/lib/types';
import SemioticAssessmentDisplay from './semiotic-assessment-display';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { states, statesAndLgas } from '@/lib/geodata';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  type: z.string().nonempty('Activity type is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  location: z.string().min(3, 'Location must be at least 3 characters.'),
  state: z.string().nonempty('State is required.'),
  lga: z.string().nonempty('LGA is required.'),
  startDate: z.date({ required_error: 'A start date is required.' }),
  endDate: z.date({ required_error: 'An end date is required.' }),
  attachments: z.array(z.instanceof(File)).optional(),
  // New Semiotic Fields
  plannedMessage: z.string().optional(),
  targetContextRegion: z.string().optional(),
  targetContextLanguage: z.string().optional(),
  targetContextCulture: z.string().optional(),
  targetMessengers: z.array(z.string()).optional(),
  humanReviewCompleted: z.boolean().default(false),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date cannot be before start date.",
  path: ["endDate"],
});

type FileUpload = {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
};

type ActivityFormProps = {
  mode: 'create' | 'edit';
  activity?: Activity;
};

export function ActivityForm({ mode, activity }: ActivityFormProps) {
    const router = useRouter();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAssessing, setIsAssessing] = useState(false);
    const [assessmentResult, setAssessmentResult] = useState<SemioticAssessment | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: activity?.title || '',
      type: activity?.type || '',
      description: activity?.description || '',
      location: activity?.location.split(',')[0] || '', // Assuming location is "City, LGA"
      state: states.find(s => activity?.location.includes(s)) || undefined,
      lga: activity?.location.split(', ')[1] || undefined,
      startDate: activity?.dateCreated ? new Date(activity.dateCreated) : undefined,
      endDate: activity?.lastModified ? new Date(activity.lastModified) : undefined,
      attachments: [],
      plannedMessage: '',
      targetContextRegion: 'Nigeria',
      targetContextLanguage: 'English',
      targetContextCulture: 'General Audience',
      targetMessengers: [],
      humanReviewCompleted: false,
    },
  });

  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const selectedState = form.watch('state');
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newUploads: FileUpload[] = files.map(file => ({
      id: `${file.name}-${Date.now()}`, file, progress: 0, status: 'uploading',
    }));

    setUploadedFiles(prev => [...prev, ...newUploads]);
    
    newUploads.forEach(upload => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(u => u.id === upload.id ? { ...u, progress: Math.min(u.progress + 20, 100) } : u));
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadedFiles(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'completed', progress: 100 } : u));
      }, 1100);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(a => a.id !== id));
  };
  
  const handleAssessRisk = async () => {
    setIsAssessing(true);
    setAssessmentResult(null);

    const formData = form.getValues();
    const message = formData.plannedMessage || "";
    const context = {
        region: formData.targetContextRegion || 'Any',
        language: formData.targetContextLanguage || 'Any',
        culture: formData.targetContextCulture || 'Any'
    };
    
    // Simulate API call and logic
    await new Promise(resolve => setTimeout(resolve, 1500));

    const matchingPatterns = mockSemioticPatterns.filter(p => {
        const messageContainsElement = message.toLowerCase().includes(p.failedElement.toLowerCase());
        const contextMatches = 
            (p.context.region === 'Any' || p.context.region === context.region) &&
            (p.context.language === 'Any' || p.context.language === context.language) &&
            (p.context.culture === 'General Audience' || p.context.culture === context.culture);
        return messageContainsElement && contextMatches;
    });

    if (matchingPatterns.length > 0) {
        const totalRisk = matchingPatterns.reduce((sum, p) => sum + p.riskScore, 0);
        const avgRisk = Math.round(totalRisk / matchingPatterns.length);
        const totalConfidence = matchingPatterns.reduce((sum, p) => sum + p.confidence, 0);
        const avgConfidence = totalConfidence / matchingPatterns.length;

        setAssessmentResult({
            riskScore: avgRisk,
            confidence: avgConfidence,
            predictedFailures: matchingPatterns.map(p => ({ 
                element: p.failedElement,
                issue: 'Potential cultural mismatch or framing failure.',
                probability: p.confidence,
                patternId: p.patternId
             })),
            recommendations: matchingPatterns.map(p => ({
                priority: p.riskScore > 75 ? 'High' : (p.riskScore > 50 ? 'Medium' : 'Low'),
                suggestion: p.recommendation,
                expectedImprovement: Math.round(p.riskScore * 0.4)
            })),
            assessedAt: new Date(),
        });
    } else {
        setAssessmentResult({
            riskScore: 5,
            confidence: 0.98,
            predictedFailures: [],
            recommendations: [{ 
                priority: 'Low',
                suggestion: 'No obvious high-risk patterns detected based on current rules. Ensure message is clear, concise, and reviewed by a local expert.',
                expectedImprovement: 0
            }],
            assessedAt: new Date(),
        });
    }

    setIsAssessing(false);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    // Combine semiotic assessment data if available
    const finalData = {
        ...data,
        semioticAssessment: assessmentResult
    };
    console.log("Submitting form data:", finalData);
    
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
            <h2 className="text-2xl font-bold">Campaign {mode === 'create' ? 'Submitted' : 'Updated'}!</h2>
            <p className="text-muted-foreground mt-2">
              The campaign has been successfully {mode === 'create' ? 'created and submitted' : 'updated'}.
            </p>
            <div className="mt-8 flex gap-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/activities/create')}>Create Another Campaign</Button>
              <Button variant="gradient" onClick={() => router.push('/dashboard/activities')}>View All Campaigns</Button>
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
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Campaign Details</CardTitle>
            </div>
            <CardDescription>Provide the core information about the campaign.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Statewide Vaccination Drive" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a campaign type" /></SelectTrigger></FormControl>
                  <SelectContent>{activityTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="Detailed description of goals and scope." className="min-h-[120px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle>Logistics</CardTitle>
            </div>
            <CardDescription>Specify the location and duration of the campaign.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="state" render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger></FormControl>
                    <SelectContent>{states.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="lga" render={({ field }) => (
                <FormItem>
                  <FormLabel>LGA / Area Council</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedState}>
                    <FormControl><SelectTrigger><SelectValue placeholder={selectedState ? "Select LGA" : "Select a state first"} /></SelectTrigger></FormControl>
                    <SelectContent>{selectedState && statesAndLgas[selectedState].map(lga => <SelectItem key={lga} value={lga}>{lga}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="location" render={({ field }) => (
              <FormItem>
                <FormLabel>Specific Location / Venue</FormLabel>
                <FormControl><Input placeholder="e.g., National Hospital Abuja, Conference Room A" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild><FormControl>
                      <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal h-12", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                  </Popover><FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild><FormControl>
                      <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal h-12", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < form.getValues('startDate')} initialFocus /></PopoverContent>
                  </Popover><FormMessage />
                </FormItem>
              )} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <CardTitle>Communication Strategy &amp; Semiotic Analysis</CardTitle>
                </div>
                <CardDescription>Define your message and assess its potential risk before deployment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FormField control={form.control} name="plannedMessage" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Planned Message Content</FormLabel>
                        <FormControl><Textarea placeholder="Enter the exact message you plan to disseminate..." className="min-h-[150px]" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <FormField control={form.control} name="targetContextRegion" render={({ field }) => (
                        <FormItem><FormLabel>Target Region</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger></FormControl>
                                <SelectContent>{regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                            </Select><FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="targetContextLanguage" render={({ field }) => (
                        <FormItem><FormLabel>Target Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger></FormControl>
                                <SelectContent>{languages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                            </Select><FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="targetContextCulture" render={({ field }) => (
                        <FormItem><FormLabel>Target Culture</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select culture" /></SelectTrigger></FormControl>
                                <SelectContent>{cultures.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select><FormMessage />
                        </FormItem>
                    )} />
                      <FormField control={form.control} name="targetMessengers" render={({ field }) => (
                        <FormItem><FormLabel>Primary Messenger</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select messenger" /></SelectTrigger></FormControl>
                                <SelectContent>{messengers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                            </Select><FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <Button type="button" onClick={handleAssessRisk} disabled={isAssessing} className="w-full md:w-auto" size="lg">
                    {isAssessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Assessing...</> : 'Assess Semiotic Risk'}
                </Button>
                
                <SemioticAssessmentDisplay result={assessmentResult} isLoading={isAssessing} />

            </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-primary" />
                <CardTitle>Attachments</CardTitle>
            </div>
            <CardDescription>Upload supporting documents like proposals or budgets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-base text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX, or PNG (MAX. 5MB each)</p>
                </div>
                <Input id="dropzone-file" type="file" className="hidden" multiple onChange={handleFileChange} />
              </label>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Uploaded Files</h4>
                <AnimatePresence>
                  {uploadedFiles.map(attachment => (
                    <motion.div key={attachment.id} layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="flex items-center gap-4 rounded-lg border p-3">
                      <File className="h-6 w-6 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold truncate max-w-xs">{attachment.file.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${attachment.progress}%` }}></div></div>
                          {attachment.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin" />}
                          {attachment.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFile(attachment.id)}><X className="h-4 w-4" /></Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Submission &amp; Review</CardTitle>
                <CardDescription>Final checks before submitting your campaign for approval.</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>EU AI Act Compliance</AlertTitle>
                    <AlertDescription>
                        AI-powered assessments are for informational purposes. Human review and approval are required before deployment.
                    </AlertDescription>
                </Alert>
                <FormField
                    control={form.control}
                    name="humanReviewCompleted"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-6">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Confirm Human Review
                                </FormLabel>
                                <FormDescription>
                                    I confirm that this communication strategy and its AI assessment have been reviewed by a human expert.
                                </FormDescription>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
            </CardContent>
             <CardFooter className="flex justify-end gap-4 border-t pt-6">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
                <Button type="button" variant="secondary" disabled={isSubmitting}>Save as Draft</Button>
                <Button type="submit" variant="gradient" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                    </>
                ) : (
                    <>
                    {mode === 'create' ? 'Submit for Approval' : 'Save Changes'} <Send className="ml-2" />
                    </>
                )}
                </Button>
            </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
