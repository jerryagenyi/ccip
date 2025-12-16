
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';

const DataSettings = () => (
  <Card id="data">
    <CardHeader>
      <CardTitle>Data & Sync</CardTitle>
      <CardDescription>
        Manage your data synchronization, cache, and usage.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-8">
      <div className="flex items-start justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="auto-sync" className="text-base">Auto-sync in background</Label>
          <p className="text-sm text-muted-foreground">
            Keep your data up-to-date automatically.
          </p>
        </div>
        <Switch id="auto-sync" defaultChecked />
      </div>
      <Separator />
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Clear Local Cache</Label>
          <p className="text-sm text-muted-foreground">
            This can help solve some display issues.
          </p>
        </div>
        <Button variant="outline">
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Cache
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function DataSettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Data & Sync
                </h1>
                <p className="text-muted-foreground">
                    Manage your data synchronization and cache settings.
                </p>
            </div>
            <div className="space-y-8">
                <DataSettings />
            </div>
        </div>
    )
}
