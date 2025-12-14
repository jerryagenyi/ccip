
'use client';

import { useState, useMemo } from 'react';
import { mockTeamMembers } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, MessageSquare, MoreVertical, Edit, User, Briefcase, Mail as MailIcon, Send, X, UploadCloud, Download, Trash2, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { User as UserType } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import PaginationControls from '@/components/shared/pagination-controls';
import { Checkbox } from '@/components/ui/checkbox';


const statusStyles: Record<UserType['status'], string> = {
  Active: 'bg-green-500 text-white',
  Invited: 'bg-yellow-500 text-white',
};

const TeamMemberProfileDialog = ({ member, open, onOpenChange }: { member: UserType; open: boolean; onOpenChange: (open: boolean) => void; }) => {
    const avatar = PlaceHolderImages.find((p) => p.id === member.avatarId);
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                 <DialogHeader>
                    <DialogTitle>Team Member Profile</DialogTitle>
                    <DialogDescription>
                        Viewing the profile of {member.name}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={avatar?.imageUrl} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold">{member.name}</h3>
                            <p className="text-muted-foreground">{member.role}</p>
                            <p className="text-primary font-medium">{member.team}</p>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <MailIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{member.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>Status: <Badge className={statusStyles[member.status]}>{member.status}</Badge></span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline">Edit Profile</Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

const TeamMemberCard = ({ member, isSelected, onSelect }: { member: UserType, isSelected: boolean, onSelect: (id: string, selected: boolean) => void }) => {
  const avatar = PlaceHolderImages.find((p) => p.id === member.avatarId);
  const userRoles = [...new Set(mockTeamMembers.map(m => m.role))];
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  return (
    <>
        <Card className="p-6">
            <div className="absolute top-4 left-4">
                <Checkbox checked={isSelected} onCheckedChange={(checked) => onSelect(member.id, !!checked)} />
            </div>
          <CardContent className="flex flex-col items-center text-center p-0 pt-8">
            <div className="relative w-24 h-24">
                <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={avatar?.imageUrl} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Badge className={`absolute -bottom-1 right-0 border-2 border-card ${statusStyles[member.status]}`}>{member.status}</Badge>
            </div>
            <h3 className="text-lg font-bold text-foreground mt-4">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{member.role}</p>
            <p className="text-xs text-primary mt-1">{member.team}</p>

            <div className="flex gap-2 mt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Send Message to {member.name}</DialogTitle>
                        <DialogDescription>Compose your message below. The recipient will be notified.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="message-subject">Subject</Label>
                            <Input id="message-subject" placeholder="Regarding the recent activity report..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message-body">Message</Label>
                            <Textarea id="message-body" placeholder={`Hi ${member.name.split(' ')[0]}, I wanted to discuss...`} className="min-h-[120px]" />
                        </div>
                    </div>
                    <DialogFooter>
                         <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" variant="gradient">
                            <Send className="mr-2 h-4 w-4" /> Send Message
                        </Button>
                    </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>View Profile</DropdownMenuItem>
                        <DialogTrigger asChild>
                           <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuSeparator />
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Remove User</DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>

                   <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Permissions</DialogTitle>
                            <DialogDescription>Change the role for {member.name}.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select defaultValue={member.role}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userRoles.map(role => (
                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" variant="gradient">Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently remove {member.name} from the team and revoke their access to the CCIP platform.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Yes, remove user
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      <TeamMemberProfileDialog member={member} open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </>
  );
};

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const userRoles = [...new Set(mockTeamMembers.map(m => m.role))];
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  
  const filteredMembers = useMemo(() => {
    if (!searchQuery) {
      return mockTeamMembers;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return mockTeamMembers.filter(member =>
      member.name.toLowerCase().includes(lowercasedQuery) ||
      member.email.toLowerCase().includes(lowercasedQuery) ||
      member.role.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMembers.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, filteredMembers]);

   const handleSelectMember = (memberId: string, isSelected: boolean) => {
        setSelectedMembers(prev => isSelected ? [...prev, memberId] : prev.filter(id => id !== memberId));
    };

    const handleSelectAll = (isChecked: boolean | 'indeterminate') => {
        if (isChecked === true) {
            setSelectedMembers(paginatedMembers.map(m => m.id));
        } else {
            setSelectedMembers([]);
        }
    };
    
    const allOnPageSelected = selectedMembers.length > 0 && paginatedMembers.length > 0 && paginatedMembers.every(m => selectedMembers.includes(m.id));
    const someOnPageSelected = selectedMembers.length > 0 && !allOnPageSelected;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Team Directory
          </h1>
          <p className="text-muted-foreground">Manage and view team members across the organization.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <UserPlus />
              Invite Members
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Invite New Team Members</DialogTitle>
              <DialogDescription>
                Enter email addresses and assign a role to send invitations.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="emails">Email Addresses</Label>
                <Textarea id="emails" placeholder="Enter emails separated by commas, spaces, or new lines..." className="min-h-[120px]" />
                <p className="text-xs text-muted-foreground">You can paste a list of emails here.</p>
              </div>
               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="csv-upload">Upload a CSV</Label>
                        <Button variant="link" className="h-auto p-0 text-xs">
                           <Download className="mr-1.5 h-3 w-3" />
                           Download CSV template
                        </Button>
                    </div>
                    <label htmlFor="csv-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">CSV file with an 'email' column</p>
                        </div>
                        <Input id="csv-upload" type="file" className="hidden" accept=".csv" />
                    </label>
                </div>
              <div className="space-y-2">
                <Label htmlFor="role-invite">Assign Role</Label>
                <Select>
                  <SelectTrigger id="role-invite">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant="gradient">Send Invitations</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

       <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                placeholder="Search by name, email, or role..." 
                className="h-12 pl-12 w-full" 
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1);
                }}
                />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                 <Checkbox 
                    id="select-all-members"
                    onCheckedChange={handleSelectAll}
                    checked={allOnPageSelected || someOnPageSelected}
                    data-state={someOnPageSelected ? 'indeterminate' : (allOnPageSelected ? 'checked' : 'unchecked')}
                />
                <Label htmlFor="select-all-members" className="text-sm font-medium">Select all</Label>
            </div>
        </div>

        {selectedMembers.length > 0 && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted border">
                <p className="text-sm font-medium">{selectedMembers.length} member(s) selected</p>
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Edit className="mr-2" /> Bulk Edit Role
                            </Button>
                        </DialogTrigger>
                         <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Bulk Edit Role</DialogTitle>
                                <DialogDescription>Assign a new role to {selectedMembers.length} selected members.</DialogDescription>
                            </DialogHeader>
                             <div className="py-4 space-y-2">
                                <Label htmlFor="bulk-role">New Role</Label>
                                <Select>
                                    <SelectTrigger id="bulk-role">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userRoles.map(role => (
                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" variant="gradient">Apply Role</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2" /> Remove from Team
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This will permanently remove {selectedMembers.length} members from the team.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                                Yes, remove members
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        )}
      {paginatedMembers.length > 0 ? (
        <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedMembers.map((member) => (
                <TeamMemberCard 
                    key={member.id} 
                    member={member} 
                    isSelected={selectedMembers.includes(member.id)}
                    onSelect={handleSelectMember}
                />
                ))}
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
                totalItems={filteredMembers.length}
                itemName="members"
                itemsPerPageOptions={[8, 12, 16]}
            />
        </>
      ) : (
        <Card className="flex items-center justify-center p-16 col-span-full border-dashed">
            <div className="text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No team members found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your search, or invite a new member.</p>
                <Button asChild variant="gradient" className="mt-6">
                    <Link href="/dashboard/team">
                        <UserPlus className="mr-2" />
                        Invite Member
                    </Link>
                </Button>
            </div>
        </Card>
      )}
    </div>
  );
}
