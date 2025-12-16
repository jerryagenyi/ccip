
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Mail, Network, Code } from 'lucide-react';

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3">
        <Check className="h-5 w-5 text-primary mt-1 shrink-0" />
        <span className="text-muted-foreground">{children}</span>
    </li>
);

export default function IntegrationsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <Card className="border-primary border-2 shadow-primary/10">
                        <CardHeader className="bg-primary/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                    <Network className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                        Integration & APIs
                                    </h1>
                                    <p className="text-muted-foreground">
                                        Connect RCAP with your existing systems and data sources.
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">The Problem We're Solving</h2>
                                <p className="text-muted-foreground">
                                    Public health data often lives in disconnected silos. Manually transferring information between systems like DHIS2, social media platforms, and lab databases is time-consuming, error-prone, and slows down critical response times. RCAP's Integration Hub will break down these barriers, creating a unified data ecosystem.
                                </p>
                            </div>
                            
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                                <ul className="space-y-4">
                                    <FeatureListItem>
                                        <strong>DHIS2 Integration:</strong> Seamlessly sync health data, indicators, and organizational units between RCAP and your DHIS2 instance for a single source of truth.
                                    </FeatureListItem>
                                     <FeatureListItem>
                                        <strong>Social Media Monitoring:</strong> Connect to platforms like X (formerly Twitter) and Facebook to track public sentiment, identify misinformation (infodemiology), and detect early signs of outbreaks.
                                    </FeatureListItem>
                                    <FeatureListItem>
                                        <strong>LIS & EOC Connectivity:</strong> Integrate with Laboratory Information Systems (LIS) for real-time case reporting and link with Emergency Operations Centers (EOC) for coordinated command and control.
                                    </FeatureListItem>
                                     <FeatureListItem>
                                        <strong>Developer-Friendly APIs:</strong> Access powerful RESTful APIs and webhooks to build custom integrations and automate workflows, enabling real-time data synchronization.
                                    </FeatureListItem>
                                </ul>
                            </div>

                             <div>
                                <h2 className="text-xl font-semibold mb-4">Use Cases</h2>
                                <p className="text-muted-foreground">
                                    Imagine automatically pulling weekly case numbers from DHIS2 to inform an RCAP activity, while simultaneously tracking public discussion about symptoms on social media to guide your risk communication strategy.
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
                                        <span className="text-sm font-medium text-muted-foreground">30%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                        <div className="bg-primary h-2.5 rounded-full" style={{width: "30%"}}></div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground"><strong>Timeline:</strong> Phase 3 Release (12-18 months post-MVP)</p>
                                <p className="text-xs text-muted-foreground"><strong>Current Status:</strong> Technical specification and API design.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Get Notified</CardTitle>
                            <CardDescription>Join the waitlist to get early access and updates on our progress.</CardDescription>
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
