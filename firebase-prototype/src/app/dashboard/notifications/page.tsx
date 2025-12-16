'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockNotifications } from "@/lib/data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/lib/types";
import { Check, Trash2 } from 'lucide-react';

function NotificationCard({ notification }: { notification: Notification }) {
  return (
    <Card className="flex items-start gap-4 p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      {!notification.isRead && <div className="absolute top-4 left-4 h-3 w-3 rounded-full bg-primary" />}
      <div className="mt-1 pl-4">
        <notification.icon className={cn("h-6 w-6", notification.iconColor)} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-foreground">{notification.title}</h3>
        <p className="mt-1 text-muted-foreground">{notification.description}</p>
        <p className="mt-2 text-xs text-muted-foreground/70">
          {format(new Date(notification.timestamp), 'PPP p')}
        </p>
      </div>
    </Card>
  );
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredNotifications = mockNotifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    return notification.type.toLowerCase() === activeTab;
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Manage your notifications and alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline">
                <Check className="mr-2" />
                Mark all as read
            </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="approval">Approvals</TabsTrigger>
          <TabsTrigger value="assignment">Assignments</TabsTrigger>
          <TabsTrigger value="alert">Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
            <div className="mt-6 grid gap-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              ) : (
                <Card className="flex items-center justify-center p-16">
                  <div className="text-center">
                    <p className="text-lg font-semibold">No notifications here</p>
                    <p className="text-muted-foreground">Looks like you're all caught up!</p>
                  </div>
                </Card>
              )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
