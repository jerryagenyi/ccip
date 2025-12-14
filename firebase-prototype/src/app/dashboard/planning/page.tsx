
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Mail, BrainCircuit } from 'lucide-react';

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3">
        <Check className="h-5 w-5 text-primary mt-1 shrink-0" />
        <span className="text-muted-foreground">{children}</span>
    </li>
);

export default function PlanningPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <Card className="border-primary border-2 shadow-primary/10">
                        <CardHeader className="bg-primary/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                    <BrainCircuit className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                        AI-Powered Implementation Planning
                                    </h1>
                                    <p className="text-muted-foreground">
                                        Transform your implementation planning with intelligent automation.
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">The Problem We're Solving</h2>
                                <p className="text-muted-foreground">
                                    Crafting effective implementation plans with measurable KPIs is challenging and time-consuming. It's difficult to know which indicators are most effective or how to allocate resources for maximum impact. This leads to inconsistent tracking and missed opportunities for learning.
                                </p>
                            </div>
                            
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                                <ul className="space-y-4">
                                    <FeatureListItem>
                                        <strong>Automated KPI Extraction:</strong> Our AI will read your uploaded implementation plans and automatically identify and suggest Key Performance Indicators (KPIs).
                                    </FeatureListItem>
                                    <FeatureListItem>
                                        <strong>Intelligent Indicator Suggestions:</strong> Based on historical data from thousands of activities, the AI will recommend the most effective indicators for your specific goals.
                                    </FeatureListItem>
                                    <FeatureListItem>
                                        <strong>Cross-Jurisdictional Learning:</strong> Discover best practices and successful strategies from similar activities conducted in other states or LGAs.
                                    </FeatureListItem>
                                    <FeatureListItem>
                                        <strong>Predictive Optimization:</strong> Get AI-driven recommendations for timelines and resource allocation to maximize your chances of success.
                                    </FeatureListItem>
                                </ul>
                            </div>

                             <div>
                                <h2 className="text-xl font-semibold mb-4">Use Cases</h2>
                                <p className="text-muted-foreground">
                                    A state coordinator uploads a new Malaria prevention plan. The AI instantly suggests five KPIs, including "Percentage of households with at least one ITN" and "Reported malaria cases per 1,000," citing data that shows these were the most impactful indicators from a similar campaign in a neighboring state.
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
                                        <span className="text-sm font-medium text-primary">In Development</span>
                                        <span className="text-sm font-medium text-muted-foreground">25%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                        <div className="bg-primary h-2.5 rounded-full" style={{width: "25%"}}></div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground"><strong>Timeline:</strong> Phase 3 Release (12-18 months post-MVP)</p>
                                <p className="text-xs text-muted-foreground"><strong>Current Status:</strong> Collecting user requirements and developing foundational models.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Get Notified</CardTitle>
                            <CardDescription>Join the waitlist to get early access and help shape this feature.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="flex gap-2">
                                <input type="email" placeholder="you@example.com" className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" />
                                <Button variant="gradient"><Mail className="mr-2" /> Join Waitlist</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
