
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { mockAnnouncements } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Paperclip, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { Announcement } from '@/lib/types';
import { announcementStyles } from '@/lib/config';

const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
    const router = useRouter();
    const styles = announcementStyles[announcement.type];

    return (
        <Card 
            className="cursor-pointer transition-all hover:border-primary"
            onClick={() => router.push(`/dashboard/announcements/${announcement.id}`)}
        >
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <div className={styles.badge}>
                                <styles.icon className="h-4 w-4" />
                                {announcement.type}
                            </div>
                        </div>
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    </div>
                     <Button variant="ghost" size="icon">
                        <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                <p className="text-xs text-muted-foreground/80 mt-4">{format(new Date(announcement.timestamp), 'PPP')}</p>
            </CardContent>
        </Card>
    )
}

export default function AnnouncementDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const announcement = mockAnnouncements.find(a => a.id === id);

    if (!announcement) {
        return notFound();
    }

    const styles = announcementStyles[announcement.type];
    const relatedAnnouncements = mockAnnouncements
        .filter(a => a.type === announcement.type && a.id !== announcement.id)
        .slice(0, 2);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Announcement
                    </h1>
                    <p className="text-muted-foreground">
                        View announcement details below.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className={styles.badge}>
                                    <styles.icon className="h-4 w-4" />
                                    {announcement.type}
                                </div>
                                {!announcement.isRead && <Badge variant="destructive">Unread</Badge>}
                            </div>
                            <CardTitle className="text-3xl">{announcement.title}</CardTitle>
                            <CardDescription>
                                Posted by {announcement.author} on {format(new Date(announcement.timestamp), 'PPP')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="prose max-w-none">
                            <p>{announcement.content}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8 lg:col-span-1">
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Paperclip className="h-5 w-5" /> Attachments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">No attachments for this announcement.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Related Announcements</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {relatedAnnouncements.length > 0 ? (
                                relatedAnnouncements.map(related => (
                                    <AnnouncementCard key={related.id} announcement={related} />
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No related announcements.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
