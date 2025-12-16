
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { mockOrganisations, mockTeamMembers, mockActivities } from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import MetricCard from '@/components/dashboard/metric-card';
import RecentActivities from '@/components/dashboard/recent-activities';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowLeft, Edit, UserPlus, Users, ClipboardList, DollarSign, CheckCircle } from 'lucide-react';
import type { User as UserType, ActivityStatus, Organisation } from '@/lib/types';
import Link from 'next/link';

const statusStyles: Record<UserType['status'], string> = {
  Active: 'bg-green-500 text-white',
  Invited: 'bg-yellow-500 text-white',
};

const activityStatusColors: Record<ActivityStatus, string> = {
    Draft: "bg-gray-500",
    Submitted: "bg-blue-500",
    Approved: "bg-green-600",
    Rejected: "bg-red-600",
    Completed: "bg-primary"
};


export default function OrganisationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const organisation = mockOrganisations.find((o) => o.id === id);

  if (!organisation) {
    return notFound();
  }

  const teamMembers = mockTeamMembers.filter(m => m.team === organisation.name);
  const activities = mockActivities.filter(a => a.organization === organisation.name);

  const orgMetrics = [
    {
      title: 'Total Members',
      value: String(organisation.members),
      trend: `${teamMembers.filter(m => m.status === 'Active').length} active`,
      icon: Users,
      accentColor: 'bg-primary',
    },
    {
      title: 'Active Activities',
      value: String(activities.filter(a => a.status === 'Approved' || a.status === 'Submitted').length),
      trend: `${activities.length} total activities`,
      icon: ClipboardList,
      accentColor: 'bg-accent',
    },
    {
      title: 'Completed This Month',
      value: String(activities.filter(a => a.status === 'Completed' && new Date(a.lastModified).getMonth() === new Date().getMonth()).length),
      trend: 'monthly target',
      icon: CheckCircle,
      accentColor: 'bg-green-500',
    },
    {
      title: 'Budget Utilisation',
      value: '72%',
      trend: '$1.8M / $2.5M spent',
      icon: DollarSign,
      accentColor: 'bg-orange-500',
      progress: 72,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
            </Button>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {organisation.name}
                </h1>
                <p className="text-muted-foreground">
                    Part of <span className="font-semibold text-primary">{organisation.parent || 'National Network'}</span>
                </p>
            </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/organisations/${id}/edit`}>
              <Edit /> Edit Details
            </Link>
          </Button>
          <Button variant="gradient">
            <UserPlus /> Invite Member
          </Button>
        </div>
      </div>
      
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {orgMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Team Members */}
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Members belonging to {organisation.name}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamMembers.map(member => {
                                const avatar = PlaceHolderImages.find((p) => p.id === member.avatarId);
                                return (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={avatar?.imageUrl} />
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{member.name}</p>
                                                    <p className="text-sm text-muted-foreground">{member.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{member.role}</TableCell>
                                        <TableCell>
                                            <Badge className={statusStyles[member.status]}>{member.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Latest activities from this organisation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {activities.slice(0, 5).map(activity => (
                            <li key={activity.id} className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-semibold">
                                    {activity.location.substring(0,2).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-foreground truncate">{activity.title}</p>
                                    <p className="text-sm text-muted-foreground">{activity.type}</p>
                                </div>
                                <Badge className={`${activityStatusColors[activity.status]} text-white`}>{activity.status}</Badge>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
