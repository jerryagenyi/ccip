
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Mail, Box } from 'lucide-react';

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3">
        <Check className="h-5 w-5 text-primary mt-1 shrink-0" />
        <span className="text-muted-foreground">{children}</span>
    </li>
);

export default function ResourcesPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <Card className="border-primary border-2 shadow-primary/10">
                        <CardHeader className="bg-primary/5">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                    <Box className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                        Resource Management Hub
                                    </h1>
                                    <p className="text-muted-foreground">
                                        Optimize allocation of personnel, equipment, and budgets.
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">The Problem We're Solving</h2>
                                <p className="text-muted-foreground">
                                    Coordinating field activities is complex. Managing who is available, what equipment is needed (and where it is), and how it all aligns with the budget is a constant challenge. This often leads to scheduling conflicts, resource shortages, and budget overruns.
                                </p>
                            </div>
                            
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                                <ul className="space-y-4">
                                    <FeatureListItem>
                                        <strong>Resource Scheduling:</strong> A master calendar to view and assign personnel and equipment to activities, with automatic conflict resolution to prevent double-booking.
                                    </FeatureListItem>
                                    <FeatureListItem>
                                        <strong>Budget Tracking:</strong> Link resources directly to activity budgets, providing a real-time view of expenditures and financial reporting.
                                    </FeatureListItem>
                                    <FeatureListItem>
                                        <strong>Inventory Management:</strong> Track your inventory of critical equipment, from vehicles to vaccine carriers, including maintenance schedules and current location.
                                    </FeatureListItem>
                                    <FeatureListItem>
                                        <strong>Personnel Capacity Planning:</strong> Understand your team's availability and workload to ensure you have the right people for the job without causing burnout.
                                    </FeatureListItem>
                                </ul>
                            </div>

                             <div>
                                <h2 className="text-xl font-semibold mb-4">Use Cases</h2>
                                <p className="text-muted-foreground">
                                   When creating a new "Vaccination Drive" activity, a planner can immediately see which field officers are available, reserve a refrigerated vehicle for the required dates, and see the immediate impact on the activity's budget—all within a single, integrated workflow.
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
                                        <span className="text-sm font-medium text-muted-foreground">15%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                        <div className="bg-primary h-2.5 rounded-full" style={{width: "15%"}}></div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground"><strong>Timeline:</strong> Phase 2 Release (6-12 months post-MVP)</p>
                                <p className="text-xs text-muted-foreground"><strong>Current Status:</strong> High-level planning and architecture.</p>
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
