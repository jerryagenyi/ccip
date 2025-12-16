
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Mail, GraduationCap } from 'lucide-react';

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3">
        <Check className="h-5 w-5 text-primary mt-1 shrink-0" />
        <span className="text-muted-foreground">{children}</span>
    </li>
);

export default function TrainingPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <Card className="border-primary border-2 shadow-primary/10">
                        <CardHeader className="bg-primary/5">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                    <GraduationCap className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                        Training & Development Center
                                    </h1>
                                    <p className="text-muted-foreground">
                                        Comprehensive training management for healthcare teams.
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">The Problem We're Solving</h2>
                                <p className="text-muted-foreground">
                                   Tracking training and certifications for a large workforce is a logistical nightmare. It's hard to know who has been trained on what, identify skill gaps, and measure the real-world effectiveness of training programs, especially in preparation for emergencies.
                                </p>
                            </div>
                            
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                                <ul className="space-y-4">
                                    <FeatureListItem>
                                        <strong>Course Creation and Enrollment:</strong> Design training modules, from online courses to in-person workshops, and manage enrollment for individuals and teams.
                                    </FeatureListItem>
                                    <FeatureListItem>
                                        <strong>Progress Tracking and Certification:</strong> Monitor completion rates, track assessment scores, and automatically issue digital certificates upon successful completion.
                                    </FeatureListItem>
                                    <FeatureListItem>
                                        <strong>Skills Assessment and Gap Analysis:</strong> Map your team's skills against required competencies to proactively identify and address training needs before they become critical.
                                    </FeatureListItem>
                                     <FeatureListItem>
                                        <strong>Training Effectiveness Analytics:</strong> Correlate training data with activity outcomes to measure the real-world impact of your training programs. Did the Cholera response training lead to faster containment? Now you'll know.
                                    </FeatureListItem>
                                </ul>
                            </div>

                             <div>
                                <h2 className="text-xl font-semibold mb-4">Use Cases</h2>
                                <p className="text-muted-foreground">
                                   A State Coordinator can quickly identify all field officers who have not completed the latest "Disease Outbreak Response" training, enroll them with one click, and track their progress to ensure the entire state is prepared for the next emergency.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Development Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-primary">Planning</span>
                                        <span className="text-sm font-medium text-muted-foreground">20%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                        <div className="bg-primary h-2.5 rounded-full" style={{width: "20%"}}></div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground"><strong>Timeline:</strong> Phase 2 Release (6-12 months post-MVP)</p>
                                <p className="text-xs text-muted-foreground"><strong>Current Status:</strong> User story mapping and requirements definition.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Get Notified</CardTitle>
                            <CardDescription>Join the waitlist to get early access and updates.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="flex gap-2">
                                <input type="email" placeholder="you@example.com" className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" />
                                <Button variant="gradient"><Mail className="mr-2" /> Notify Me</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
