
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, Megaphone } from 'lucide-react';
import { mockAnnouncements } from '@/lib/data';
import type { Announcement, AnnouncementType } from '@/lib/types';
import { announcementStyles } from '@/lib/config';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import PaginationControls from '@/components/shared/pagination-controls';

const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
    const router = useRouter();
    const styles = announcementStyles[announcement.type];

    return (
        <Card 
            className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md flex flex-col"
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
                            {!announcement.isRead && <Badge variant="destructive">Unread</Badge>}
                        </div>
                        <CardTitle className="text-xl hover:underline line-clamp-2 h-14">{announcement.title}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); router.push(`/dashboard/announcements/${announcement.id}`)}}>
                        <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                <p className="text-xs text-muted-foreground/80 mt-4">
                    {announcement.author} • {format(new Date(announcement.timestamp), 'PPP')}
                </p>
            </CardContent>
        </Card>
    )
}

export default function AnnouncementsPage() {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    const filteredAndSortedAnnouncements = useMemo(() => {
        let announcements = mockAnnouncements;

        // Filter by tab
        if (activeTab !== 'all') {
            announcements = announcements.filter(a => a.type.toLowerCase().replace(/ /g, '-') === activeTab);
        }

        // Filter by search query
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            announcements = announcements.filter(a => 
                a.title.toLowerCase().includes(lowercasedQuery) ||
                a.content.toLowerCase().includes(lowercasedQuery)
            );
        }

        // Sort
        announcements.sort((a, b) => {
            if (sortOrder === 'unread') {
                if (a.isRead !== b.isRead) {
                    return a.isRead ? 1 : -1;
                }
            }
            if (sortOrder === 'priority') {
                const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            // Default to newest first
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });

        return announcements;
    }, [activeTab, searchQuery, sortOrder]);

    const totalPages = Math.ceil(filteredAndSortedAnnouncements.length / itemsPerPage);
    const paginatedAnnouncements = filteredAndSortedAnnouncements.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const tabs: { value: AnnouncementType | 'all', label: string }[] = [
        { value: 'all', label: 'All' },
        { value: 'Platform Update', label: 'Platform Updates' },
        { value: 'Federal Announcement', label: 'Federal' },
        { value: 'State Announcement', label: 'State' },
        { value: 'LGA Update', label: 'LGA' },
    ];
    
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Announcements
                </h1>
                <p className="text-muted-foreground">
                    Stay up-to-date with important platform and government updates.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setCurrentPage(1); }} className="w-full">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <TabsList className="grid w-full grid-cols-2 h-auto md:w-auto md:grid-cols-5">
                        {tabs.map(tab => (
                             <TabsTrigger key={tab.value} value={tab.value.toLowerCase().replace(/ /g, '-')}>{tab.label}</TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-initial">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search announcements..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <Select value={sortOrder} onValueChange={setSortOrder}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="priority">By Priority</SelectItem>
                                <SelectItem value="unread">Unread First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <TabsContent value={activeTab.toLowerCase().replace(/ /g, '-')} className="mt-8">
                    {paginatedAnnouncements.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedAnnouncements.map(announcement => (
                                <AnnouncementCard key={announcement.id} announcement={announcement} />
                            ))}
                        </div>
                    ) : (
                        <Card className="flex items-center justify-center p-16 col-span-full border-dashed">
                            <div className="text-center">
                                <Megaphone className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No announcements found</h3>
                                <p className="text-muted-foreground mt-1">Try adjusting your search or filters.</p>
                            </div>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
            
             {totalPages > 1 && (
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={(value) => { setItemsPerPage(Number(value)); setCurrentPage(1); }}
                    totalItems={filteredAndSortedAnnouncements.length}
                    itemName="announcements"
                    itemsPerPageOptions={[6, 9, 12]}
                />
            )}
        </div>
    );
}
