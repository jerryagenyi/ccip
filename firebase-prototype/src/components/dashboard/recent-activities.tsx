
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockActivities } from "@/lib/data";
import type { ActivityStatus } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const statusColors: Record<ActivityStatus, string> = {
    Draft: "bg-gray-500",
    Submitted: "bg-blue-500",
    Approved: "bg-green-600",
    Rejected: "bg-red-600",
    Completed: "bg-primary"
};

export default function RecentActivities() {
    const recent = mockActivities.slice(0, 4);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Campaigns</CardTitle>
                    <CardDescription>A summary of the latest campaigns.</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/activities">
                        View All <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {recent.map(activity => (
                        <li key={activity.id} className="flex items-center gap-4 overflow-hidden">
                             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-semibold">
                                {activity.location.substring(0,2).toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-semibold text-foreground truncate">{activity.title}</p>
                                <p className="text-sm text-muted-foreground">{activity.organization}</p>
                            </div>
                            <Badge className={`${statusColors[activity.status]} text-white`}>{activity.status}</Badge>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
