
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Mail, FlaskConical } from 'lucide-react';

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3">
        <Check className="h-5 w-5 text-primary mt-1 shrink-0" />
        <span className="text-muted-foreground">{children}</span>
    </li>
);

export default function ResearchPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <Card className="border-primary border-2 shadow-primary/10">
                        <CardHeader className="bg-primary/5">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                    <FlaskConical className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                        Research & Analytics Lab
                                    </h1>
                                    <p className="text-muted-foreground">
                                        Advanced analytics for groundbreaking public health insights.
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">The Problem We're Solving</h2>
                                <p className="text-muted-foreground">
                                    Traditional public health research is often slow, relying on manually collected data and lagging indicators. By the time research is published, the situation on the ground may have already changed. There's a need for real-time, automated analytics to stay ahead of public health challenges.
                                </p>
                            </div>
                            
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                                <ul className="space-y-4">
                                    <FeatureListItem>
                                        <strong>Automated Sentiment Analysis:</strong> Continuously monitor social media and news sources to gauge public perception and sentiment related to health topics, providing an early warning system for misinformation.
                                    </FeatureListItem>
                                    <FeatureListItem>
                                        <strong>Outbreak Prediction Modeling:</strong> Leverage machine learning models that analyze activity data, climate patterns, and historical trends to predict potential disease outbreaks before they occur.
                                    </FeatureListItem>
                                    <FeatureListItem>
                                        <strong>Cross-Jurisdictional Analytics:</strong> Compare the effectiveness of different interventions across various states and LGAs to identify what truly works in different contexts.
                                    </FeatureListItem>
                                     <FeatureListItem>
                                        <strong>Custom Research Dashboard Builder:</strong> Build your own real-time dashboards to track specific research questions, combining data from RCAP activities, DHIS2, and other integrated sources.
                                    </FeatureListItem>
                                </ul>
                            </div>

                             <div>
                                <h2 className="text-xl font-semibold mb-4">Use Cases</h2>
                                <p className="text-muted-foreground">
                                    Just as HMPV research tracks virus trends, the Research Lab will allow an epidemiologist to automatically and continuously track public anxiety about a new vaccine, correlate it with case numbers from DHIS2, and measure the impact of risk communication campaigns, all from a single dashboard.
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
                                        <span className="text-sm font-medium text-primary">Conceptualization</span>
                                        <span className="text-sm font-medium text-muted-foreground">10%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                        <div className="bg-primary h-2.5 rounded-full" style={{width: "10%"}}></div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground"><strong>Timeline:</strong> Post-Phase 3</p>
                                <p className="text-xs text-muted-foreground"><strong>Current Status:</strong> Early-stage research and feasibility studies.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Get Notified</CardTitle>
                            <CardDescription>Join the waitlist to contribute ideas and get updates.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <form className="flex gap-2">
                                <input type="email" placeholder="you@example.com" className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" />
                                <Button variant="gradient"><Mail className="mr-2" /> Request Early Access</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
