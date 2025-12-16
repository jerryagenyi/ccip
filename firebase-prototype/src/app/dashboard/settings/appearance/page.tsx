
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

const AppearanceSettings = () => (
  <Card id="appearance">
    <CardHeader>
      <CardTitle>Appearance</CardTitle>
      <CardDescription>
        Customize the accessibility settings for the application.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Accessibility</h3>
        <div className="flex items-start justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="reduced-motion" className="text-base">Reduced Motion</Label>
            <p className="text-sm text-muted-foreground">
              Reduce animations and motion effects across the application.
            </p>
          </div>
          <Switch id="reduced-motion" />
        </div>
      </div>
    </CardContent>
    <CardFooter className="border-t pt-6 flex justify-between">
      <Button variant="outline">Reset to Default</Button>
      <Button variant="gradient" className="ml-auto">Save Changes</Button>
    </CardFooter>
  </Card>
);

export default function AppearanceSettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Appearance
                </h1>
                <p className="text-muted-foreground">
                    Customize the look and feel of the application.
                </p>
            </div>
            <div className="space-y-8">
                <AppearanceSettings />
            </div>
        </div>
    )
}
