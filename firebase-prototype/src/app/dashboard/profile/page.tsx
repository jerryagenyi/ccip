
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import MetricCard from '@/components/dashboard/metric-card';
import { ClipboardList, CheckCircle, Clock, UploadCloud } from 'lucide-react';
import RecentActivities from '@/components/dashboard/recent-activities';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import Link from 'next/link';

const userProfileMetrics = [
  {
    title: 'My Activities',
    value: '42',
    trend: '6 completed',
    icon: ClipboardList,
    accentColor: 'bg-primary',
  },
  {
    title: 'Approvals Given',
    value: '18',
    trend: '2 this week',
    icon: CheckCircle,
    accentColor: 'bg-green-500',
  },
  {
    title: 'Pending Tasks',
    value: '5',
    trend: '2 overdue',
    icon: Clock,
    accentColor: 'bg-orange-500',
  },
];

export default function ProfilePage() {
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user1');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your personal information, settings, and activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your photo and personal details here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userAvatar?.imageUrl} />
                  <AvatarFallback>FA</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Change Photo</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Change Profile Photo</DialogTitle>
                        <DialogDescription>
                          Upload a new photo. We recommend a 1:1 aspect ratio.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src={userAvatar?.imageUrl} />
                                <AvatarFallback>FA</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 1MB)</p>
                                    </div>
                                    <Input id="dropzone-file" type="file" className="hidden" />
                                </label>
                            </div> 
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="gradient">Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue="Federal Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="admin@ccip.gov"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+234 123 456 7890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" defaultValue="National Coordinator" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us a little about yourself."
                    className="min-h-[100px]"
                    defaultValue="National Coordinator for the CCIP project, overseeing federal-level activities and ensuring smooth operation across all states."
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button variant="gradient" className="ml-auto">
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <Card>
                <AccordionTrigger className="p-6">
                  <CardHeader className="p-0">
                    <CardTitle>Activity History &amp; Performance</CardTitle>
                    <CardDescription>
                      An overview of your recent activities and key metrics.
                    </CardDescription>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <div className="space-y-8">
                    <div className="grid gap-4 md:grid-cols-3">
                      {userProfileMetrics.map((metric) => (
                        <MetricCard key={metric.title} {...metric} />
                      ))}
                    </div>
                    <RecentActivities />
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right Column */}
        <div className="space-y-8 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Role &amp; Permissions</CardTitle>
              <CardDescription>
                Your current role within the CCIP system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <span className="text-sm font-medium">Current Role</span>
                <Badge variant="destructive">Super Admin</Badge>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  Key Permissions:
                </p>
                <ul className="list-inside list-disc space-y-1">
                  <li>Manage Users & Organisations</li>
                  <li>Approve/Reject any Activity</li>
                  <li>Generate National Reports</li>
                  <li>Full system access</li>
                </ul>
              </div>
              <Button variant="link" className="h-auto p-0">
                Request Permission Change
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="email-notifs" className="text-base">
                  Email Notifications
                </Label>
                <Switch id="email-notifs" defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="push-notifs" className="text-base">
                  Push Notifications
                </Label>
                <Switch id="push-notifs" defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="sms-notifs" className="text-base">
                  SMS Alerts
                </Label>
                <Switch id="sms-notifs" />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/settings/notifications-preferences">Manage Detailed Preferences</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
