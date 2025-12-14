

'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { UploadCloud, Users, Palette, Building, MoreHorizontal, User as UserIcon, Edit, Trash2, ArrowRight, Info, Save, X, ChevronDown, Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { mockOrganisations, mockTeamMembers } from '@/lib/data';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';

const OrganisationProfile = () => {
    const currentOrg = mockOrganisations[0];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Organisation Profile</CardTitle>
                <CardDescription>Manage your organisation's public details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="orgName">Organisation Name</Label>
                    <Input id="orgName" defaultValue={currentOrg.name} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="orgDescription">Description</Label>
                    <Textarea id="orgDescription" placeholder="A short description of your organisation's mission." className="min-h-[100px]" defaultValue="Overseeing and coordinating national health policies and activities to ensure the well-being of all citizens. The Federal Ministry of Health is the central body for health in the nation."/>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
                <Button variant="gradient" className="ml-auto">Save Changes</Button>
            </CardFooter>
        </Card>
    );
};

const OrganisationBranding = () => {
    const [primaryColor, setPrimaryColor] = useState('#7151B3');

    const colorSwatches = [
        '#7151B3', '#53A7EA', '#2ECC71', '#F1C40F', '#E67E22', '#E74C3C', '#34495E', '#1ABC9C'
    ];

    return (
    <Card>
        <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Customize the look and feel for your organisation's members.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Avatar className="h-20 w-20 rounded-md">
                    <AvatarFallback className="rounded-md">
                        <Building />
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                    <label htmlFor="logo-upload" className="cursor-pointer">
                        <Button variant="outline" asChild>
                            <span className="flex items-center gap-2">
                                <UploadCloud /> Upload Logo
                            </span>
                        </Button>
                        <Input id="logo-upload" type="file" className="hidden" />
                    </label>
                    <p className="text-xs text-muted-foreground">PNG, JPG, or SVG. Max 800x800px.</p>
                </div>
            </div>
            <div className="space-y-4">
                <Label>Primary Color</Label>
                <div className="flex items-center gap-4">
                     <Popover>
                        <PopoverTrigger asChild>
                           <Button variant={'outline'} className="w-auto justify-start text-left font-normal">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-md border" style={{ backgroundColor: primaryColor }} />
                                    <span className="w-28 truncate font-mono text-xs">{primaryColor}</span>
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                            <div className="grid grid-cols-4 gap-2">
                                {colorSwatches.map(color => (
                                    <Button
                                        key={color}
                                        variant="outline"
                                        size="icon"
                                        className={cn("h-8 w-8 rounded-md", primaryColor === color && "ring-2 ring-ring ring-offset-2")}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setPrimaryColor(color)}
                                    />
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Theme Customization</AlertTitle>
                    <AlertDescription>
                        This color will be used as the primary accent for buttons, links, and highlights for all members of your organisation.
                    </AlertDescription>
                </Alert>
            </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <Button variant="gradient" className="ml-auto">Save Branding</Button>
        </CardFooter>
    </Card>
)};

const AccessManagement = () => {
    const [isManaging, setIsManaging] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [openRoles, setOpenRoles] = useState<Record<string, boolean>>({});

    const userRoles = useMemo(() => {
        const grouped = mockTeamMembers.reduce((acc, member) => {
            if (!acc[member.role]) {
                acc[member.role] = [];
            }
            acc[member.role].push(member);
            return acc;
        }, {} as Record<string, typeof mockTeamMembers>);
        
        return Object.entries(grouped).map(([name, members]) => ({ name, members, memberIds: members.map(m => m.id) }));
    }, []);
    
    const allUserRoleNames = [...new Set(mockTeamMembers.map(m => m.role))];
    const allMemberIds = useMemo(() => userRoles.flatMap(role => role.memberIds), [userRoles]);
    
    const allSelected = selectedMembers.length > 0 && selectedMembers.length === allMemberIds.length;
    const someSelected = selectedMembers.length > 0 && !allSelected;

    const handleSelectMember = (memberId: string) => {
        setSelectedMembers(prev => 
            prev.includes(memberId) 
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleSelectAll = (isChecked: boolean | 'indeterminate') => {
        if (isChecked === true) {
            setSelectedMembers(allMemberIds);
        } else {
            setSelectedMembers([]);
        }
    }

    const expandAll = () => {
        const allOpen = userRoles.reduce((acc, role) => {
            acc[role.name] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setOpenRoles(allOpen);
    };

    const collapseAll = () => {
        setOpenRoles({});
    };

    const toggleManageMode = () => {
        const nextIsManaging = !isManaging;
        setIsManaging(nextIsManaging);
        setSelectedMembers([]);
        
        if (nextIsManaging) {
            expandAll();
        } else {
            collapseAll();
        }
    };
    
    const hasOpenRoles = Object.values(openRoles).some(isOpen => isOpen);
    
    const handleOpenChange = (roleName: string, isOpen: boolean) => {
        if (isManaging) return; // Prevent closing while managing
        setOpenRoles(prev => ({ ...prev, [roleName]: isOpen }));
    };

    return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Access Management</CardTitle>
            <CardDescription>
                Define roles and permissions for your organisation's team members.
            </CardDescription>
        </div>
        <div className="flex items-center gap-2">
             {!isManaging ? (
                <>
                    <Button variant="link" onClick={hasOpenRoles ? collapseAll : expandAll}>
                        {hasOpenRoles ? 'Collapse All' : 'Expand All'}
                    </Button>
                    <Button variant="outline" onClick={toggleManageMode}>Manage</Button>
                </>
            ) : (
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={toggleManageMode}>Cancel</Button>
                    <Button variant="gradient">Save Changes</Button>
                </div>
            )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isManaging && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted border">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Checkbox 
                            id="select-all-members"
                            checked={allSelected || someSelected}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all members"
                            data-state={someSelected ? 'indeterminate' : (allSelected ? 'checked' : 'unchecked')}
                        />
                        <Label htmlFor="select-all-members" className="font-semibold">
                            {selectedMembers.length > 0 ? `${selectedMembers.length} selected` : "Select all"}
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" disabled={selectedMembers.length === 0}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Bulk Edit Role
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Bulk Edit Role</DialogTitle>
                                    <DialogDescription>
                                        Assign a new role to {selectedMembers.length} selected member(s). This will override their current roles.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <Label htmlFor="bulk-role-select" className="mb-2 block">New Role</Label>
                                    <Select>
                                        <SelectTrigger id="bulk-role-select">
                                            <SelectValue placeholder="Select a new role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allUserRoleNames.map(role => (
                                                <SelectItem key={role} value={role}>{role}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                    <Button variant="gradient">Apply Changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" disabled={selectedMembers.length === 0}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently remove {selectedMembers.length} member(s) from the organisation. This action cannot be undone.
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
            </div>
        )}
        {userRoles.map(role => (
            <Collapsible 
                key={role.name}
                open={openRoles[role.name] || false}
                onOpenChange={(isOpen) => handleOpenChange(role.name, isOpen)}
                className="rounded-lg border data-[state=open]:border-b-0"
            >
                <div className="flex items-center p-4">
                     <CollapsibleTrigger asChild className='flex-1'>
                        <div className="flex items-center justify-between w-full hover:bg-muted/50 rounded-lg group -m-4 p-4 cursor-pointer">
                            <h4 className="font-semibold text-lg">{role.name} <span className="text-sm text-muted-foreground font-normal">({role.members.length} members)</span></h4>
                            <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:-rotate-180" />
                        </div>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                   <div className="pl-6 ml-4 border-l">
                        <div className="divide-y">
                            {role.members.map((member) => {
                                const avatar = PlaceHolderImages.find(p => p.id === member.avatarId);
                                return (
                                    <div key={member.id} className="flex items-center gap-3 py-3 px-4">
                                        {isManaging && (
                                            <Checkbox 
                                                id={`member-${member.id}`} 
                                                checked={selectedMembers.includes(member.id)}
                                                onCheckedChange={() => handleSelectMember(member.id)}
                                            />
                                        )}
                                        <Avatar className={cn("h-10 w-10")}>
                                            <AvatarImage src={avatar?.imageUrl} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{member.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently remove {member.name} from the organisation.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                                                            Yes, remove member
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
};


const DangerZone = () => {
    const [challengeInput, setChallengeInput] = useState('');
    const [deleteChallengeInput, setDeleteChallengeInput] = useState('');
    const currentAdmins = mockTeamMembers.filter(m => m.role.includes('Admin') || m.role.includes('Coordinator'));
    const isTransferChallengeMet = challengeInput === 'TRANSFER';
    const isDeleteChallengeMet = deleteChallengeInput === 'DELETE';

    return (
        <Card className="border-destructive/50">
             <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription className="text-destructive/80">These actions have significant and permanent consequences.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 pt-0 sm:p-6 sm:pt-6">
                <div className="flex-1">
                    <p className="font-semibold">Transfer Ownership</p>
                    <p className="text-sm text-muted-foreground">Transfer this organisation to another administrator.</p>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full sm:w-auto">Transfer</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Transfer Organisation Ownership</AlertDialogTitle>
                            <AlertDialogDescription>
                                This is a critical action. You will lose all administrative privileges for this organisation.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-4 my-4">
                             <div className="space-y-2">
                                <Label htmlFor="new-owner">Select New Owner</Label>
                                <Select>
                                    <SelectTrigger id="new-owner">
                                        <SelectValue placeholder="Select an administrator" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currentAdmins.map(admin => (
                                            <SelectItem key={admin.id} value={admin.id}>{admin.name} ({admin.email})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="transfer-challenge">To confirm, please type "TRANSFER" below:</Label>
                                <Input 
                                    id="transfer-challenge" 
                                    value={challengeInput}
                                    onChange={(e) => setChallengeInput(e.target.value)}
                                    placeholder="TRANSFER"
                                />
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setChallengeInput('')}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                disabled={!isTransferChallengeMet}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                I understand, transfer ownership
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
            <Separator className="bg-destructive/20" />
            <CardContent className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                    <p className="font-semibold">Delete this Organisation</p>
                    <p className="text-sm text-muted-foreground">Permanently delete this organisation and all its data.</p>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full sm:w-auto">Delete Organisation</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Organisation</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action is irreversible. It will permanently delete the organisation, all associated users, activities, and reports.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-2 my-4">
                            <Label htmlFor="delete-challenge">To confirm, please type "DELETE" below:</Label>
                            <Input 
                                id="delete-challenge" 
                                value={deleteChallengeInput}
                                onChange={(e) => setDeleteChallengeInput(e.target.value)}
                                placeholder="DELETE"
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteChallengeInput('')}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                disabled={!isDeleteChallengeMet}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                I understand, delete this organisation
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
};


export default function OrganisationSettingsPage() {
  return (
    <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Organisation Settings
            </h1>
            <p className="text-muted-foreground">
                Manage your organisation's profile, branding, and structure.
            </p>
        </div>
      <div className="space-y-8">
        <OrganisationProfile />
        <OrganisationBranding />
        <AccessManagement />
        <DangerZone />
      </div>
    </div>
  );
}
