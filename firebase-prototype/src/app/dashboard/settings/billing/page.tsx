
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';

const CurrentPlanFeature = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span className="text-muted-foreground">{children}</span>
    </div>
);

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground">
          Manage your organisation's plan and billing details.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Your organisation is currently on the Free Tier.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">Free Plan</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/month</span></p>
            <div className="grid sm:grid-cols-2 gap-4">
                <CurrentPlanFeature>Up to 100 Members</CurrentPlanFeature>
                <CurrentPlanFeature>Basic Activity Tracking</CurrentPlanFeature>
                <CurrentPlanFeature>Standard Reporting</CurrentPlanFeature>
                <CurrentPlanFeature>Community Support</CurrentPlanFeature>
            </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/30 p-6 flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h4 className="font-semibold flex items-center gap-2"><Star className="h-5 w-5 text-yellow-500 fill-yellow-500" /> Unlock Premium Features</h4>
                <p className="text-sm text-muted-foreground">Upgrade to get unlimited members, AI-powered insights, and priority support.</p>
            </div>
            <Button asChild variant="gradient">
                <Link href="/pricing">Upgrade to Premium <ArrowRight className="ml-2" /></Link>
            </Button>
        </CardFooter>
      </Card>

    </div>
  );
}
