
'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, PlusCircle, Search, Link as LinkIcon, Building, Trash2, ChevronDown, FilterX, Link2Off } from 'lucide-react';
import { mockOrganisations } from '@/lib/data';
import type { Organisation, OrganisationCategory, OrganisationLevel } from '@/lib/types';
import PaginationControls from '@/components/shared/pagination-controls';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';


const statusStyles: Record<Organisation['status'], string> = {
  Active: 'bg-green-500 text-white',
  Pending: 'bg-yellow-500 text-white',
  Suspended: 'bg-red-500 text-white',
};

const LinkOrganisationDialog = ({ organisation }: { organisation: Organisation }) => {
    const availableParents = mockOrganisations.filter(org => org.level === 'Federal');
    const [date, setDate] = useState<Date>();
    
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Link Organisation</DialogTitle>
                <DialogDescription>
                    Link <span className="font-semibold text-foreground">{organisation.name}</span> to a parent organisation.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="linkage-type">Linkage Type</Label>
                    <Select defaultValue="direct">
                        <SelectTrigger id="linkage-type">
                            <SelectValue placeholder="Select linkage type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="direct">Direct Oversight</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="target-org">Parent Organisation</Label>
                    <Select>
                        <SelectTrigger id="target-org">
                            <SelectValue placeholder="Select parent organisation" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableParents.map(parent => (
                                <SelectItem key={parent.id} value={parent.id}>{parent.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="effective-date">Effective Date</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="link-description">Description</Label>
                    <Textarea id="link-description" placeholder="Describe the purpose of this linkage..." />
                 </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" variant="gradient">Create Link</Button>
            </DialogFooter>
        </DialogContent>
    );
};


export default function OrganisationsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);

    const [levelFilter, setLevelFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    
    const levels: OrganisationLevel[] = ['Federal', 'State', 'LGA'];
    const categories: OrganisationCategory[] = ['Government', 'NGO', 'CSO'];
    const statuses: Organisation['status'][] = ['Active', 'Pending', 'Suspended'];

    const filteredOrganisations = useMemo(() => {
        let filtered = mockOrganisations;

        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(org =>
                org.name.toLowerCase().includes(lowercasedQuery) ||
                org.level.toLowerCase().includes(lowercasedQuery) ||
                (org.parent && org.parent.toLowerCase().includes(lowercasedQuery))
            );
        }
        
        if (levelFilter !== 'all') {
            filtered = filtered.filter(org => org.level === levelFilter);
        }
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(org => org.category === categoryFilter);
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(org => org.status === statusFilter);
        }

        return filtered;
    }, [searchQuery, levelFilter, categoryFilter, statusFilter]);
    
    const resetFilters = () => {
        setSearchQuery('');
        setLevelFilter('all');
        setCategoryFilter('all');
        setStatusFilter('all');
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredOrganisations.length / itemsPerPage);

    const paginatedOrganisations = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredOrganisations.slice(startIndex, endIndex);
    }, [currentPage, itemsPerPage, filteredOrganisations]);

    const handleSelectOrg = (orgId: string, isSelected: boolean) => {
        setSelectedOrgs(prev => isSelected ? [...prev, orgId] : prev.filter(id => id !== orgId));
    };

    const handleSelectAll = (isChecked: boolean | 'indeterminate') => {
        if (isChecked === true) {
            setSelectedOrgs(paginatedOrganisations.map(o => o.id));
        } else {
            setSelectedOrgs([]);
        }
    };
    
    const allOnPageSelected = selectedOrgs.length > 0 && paginatedOrganisations.length > 0 && paginatedOrganisations.every(o => selectedOrgs.includes(o.id));
    const someOnPageSelected = selectedOrgs.length > 0 && !allOnPageSelected;

    
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Organisations
          </h1>
          <p className="text-muted-foreground">
            Manage all organisations in the CCIP system.
          </p>
        </div>
        <Button asChild variant="gradient">
            <Link href="/dashboard/organisations/create">
                <PlusCircle />
                Add Organisation
            </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
            placeholder="Search by name, level, or parent..."
            className="h-12 pl-12 w-full"
            value={searchQuery}
            onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
            }}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="h-12"><SelectValue placeholder="Filter by Level" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {levels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12"><SelectValue placeholder="Filter by Category" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12"><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                </SelectContent>
            </Select>
            <Button variant="outline" className="h-12" onClick={resetFilters}>
                <FilterX className="mr-2" />
                Reset Filters
            </Button>
        </div>
      </div>

        {selectedOrgs.length > 0 && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted border">
            <p className="text-sm font-medium">{selectedOrgs.length} selected</p>
            <div className="flex gap-2">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                    Change Status <ChevronDown className="ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Active</DropdownMenuItem>
                    <DropdownMenuItem>Pending</DropdownMenuItem>
                    <DropdownMenuItem>Suspended</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="destructive" onClick={() => setSelectedOrgs([])}>
                <Trash2 className="mr-2" /> Delete
                </Button>
            </div>
            </div>
        )}

        {paginatedOrganisations.length > 0 ? (
          <>
            <div className="rounded-lg border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[50px]">
                        <Checkbox 
                            onCheckedChange={handleSelectAll}
                            checked={allOnPageSelected || someOnPageSelected}
                            data-state={someOnPageSelected ? 'indeterminate' : (allOnPageSelected ? 'checked' : 'unchecked')}
                        />
                    </TableHead>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Activities</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Parent Organisation</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedOrganisations.map((org) => (
                    <TableRow key={org.id} data-state={selectedOrgs.includes(org.id) ? 'selected' : ''}>
                        <TableCell>
                            <Checkbox
                                checked={selectedOrgs.includes(org.id)}
                                onCheckedChange={(checked) => handleSelectOrg(org.id, !!checked)}
                            />
                        </TableCell>
                        <TableCell>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-md">
                                <Building className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <Link href={`/dashboard/organisations/${org.id}`} className="font-medium text-foreground hover:underline">{org.name}</Link>
                        </div>
                        </TableCell>
                        <TableCell>
                        <Badge variant="secondary">{org.category}</Badge>
                        </TableCell>
                        <TableCell>{org.level}</TableCell>
                        <TableCell>{org.members}</TableCell>
                        <TableCell>{org.activities}</TableCell>
                        <TableCell>
                        <Badge className={statusStyles[org.status]}>{org.status}</Badge>
                        </TableCell>
                        <TableCell>{org.parent || 'N/A'}</TableCell>
                        <TableCell>
                        <Dialog>
                            <AlertDialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/organisations/${org.id}`}>View Details</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/organisations/${org.id}/edit`}>Edit Organisation</Link>
                                    </DropdownMenuItem>
                                    {!org.parent ? (
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem>
                                                <LinkIcon className="mr-2 h-4 w-4" />
                                                <span>Link to Parent</span>
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                    ) : (
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem>
                                                <Link2Off className="mr-2 h-4 w-4" />
                                                <span>Unlink from Parent</span>
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                        Suspend
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <LinkOrganisationDialog organisation={org} />
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently unlink the <span className="font-bold text-foreground">{org.name}</span> organisation from its parent. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                                            Yes, unlink organisation
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            </Dialog>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                }}
                totalItems={filteredOrganisations.length}
                itemName="organisations"
            />
          </>
      ) : (
        <Card className="flex items-center justify-center p-16 col-span-full border-dashed">
            <div className="text-center">
                <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No organisations found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your search or filters, or add a new organisation.</p>
                <Button asChild variant="gradient" className="mt-6">
                    <Link href="/dashboard/organisations/create">
                        <PlusCircle className="mr-2" />
                        Add Organisation
                    </Link>
                </Button>
            </div>
        </Card>
      )}
    </div>
  );
}
