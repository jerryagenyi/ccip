
'use client';
import { Bell, Search, Wifi, MessageSquare, CheckCheck, Trash2, ChevronDown, ChevronsUpDown, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { navItems, mockActivities, mockNotifications, mockTeamMembers, userRoles, languages } from '@/lib/data';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useState, useMemo } from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { useRouter } from 'next/navigation';

const RoleSwitcher = ({ activeRole, setActiveRole }: { activeRole: string; setActiveRole: (role: string) => void; }) => {
    const currentRole = userRoles.find(r => r.name === activeRole);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 w-full md:w-auto md:min-w-[240px] flex justify-between items-center gap-2 px-3">
                    <div className="text-left flex-1">
                        <p className="font-bold text-sm text-foreground truncate">{currentRole?.name}</p>
                        <p className="text-xs text-muted-foreground">{currentRole?.context}</p>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuLabel>Switch Role Context</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={activeRole} onValueChange={setActiveRole}>
                    {userRoles.map(role => (
                        <DropdownMenuRadioItem key={role.name} value={role.name}>
                            {role.name}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function Header() {
  const pathname = usePathname();
  const pageTitle = navItems.find((item) => item.href === pathname)?.title || 'Dashboard';
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user1');
  const currentUser = mockTeamMembers[0];
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;
  const recentNotifications = mockNotifications.slice(0, 3);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
  const router = useRouter();
  const [activeRole, setActiveRole] = useState(userRoles[0].name);


  const filteredActivities = useMemo(() => {
    if (!searchQuery) return [];
    const lowercasedQuery = searchQuery.toLowerCase();
    return mockActivities.filter(activity =>
      activity.title.toLowerCase().includes(lowercasedQuery) ||
      activity.organization.toLowerCase().includes(lowercasedQuery)
    ).slice(0, 5); // Limit to 5 results
  }, [searchQuery]);
  
  const handleSearchSelection = (activityId: string) => {
    setIsSearchPopoverOpen(false);
    setSearchQuery('');
    router.push(`/dashboard/activities/${activityId}`);
  };


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card/80 px-4 backdrop-blur-lg md:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      <h1 className="hidden text-xl font-semibold md:block">{pageTitle}</h1>
      
      <div className="hidden md:flex ml-auto">
        <RoleSwitcher activeRole={activeRole} setActiveRole={setActiveRole} />
      </div>

      <div className="flex w-full items-center gap-2 md:w-auto">
        <div className="flex items-center gap-2 text-sm text-green-500">
          <Wifi size={16} />
          <span className="hidden md:inline">Online</span>
        </div>
        
        <Popover open={isSearchPopoverOpen} onOpenChange={setIsSearchPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search activities..."
                className="w-full rounded-full bg-background pl-9 md:w-[200px] lg:w-[320px] h-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length > 0) {
                    setIsSearchPopoverOpen(true);
                  } else {
                    setIsSearchPopoverOpen(false);
                  }
                }}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-0" align="start">
             <Command>
              <CommandInput placeholder="Type to search..." className="h-9" />
              <CommandList>
                <CommandEmpty>{searchQuery.length > 2 ? 'No results found.' : 'Keep typing...'}</CommandEmpty>
                <CommandGroup heading="Activities">
                  {filteredActivities.map(activity => (
                    <CommandItem key={activity.id} onSelect={() => handleSearchSelection(activity.id)}>
                      {activity.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <Languages className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Select Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {languages.map(lang => (
              <DropdownMenuItem key={lang}>{lang}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="relative rounded-full h-10 w-10">
          <MessageSquare className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full h-10 w-10">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
                <div className='flex flex-col gap-1'>
                    <span>Notifications</span>
                    {unreadCount > 0 && <Badge variant="destructive" className='w-fit'>{unreadCount} new</Badge>}
                </div>
              <Button variant="ghost" size="sm" onClick={() => console.log('Mark all as read')}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {recentNotifications.map((notif) => (
                <DropdownMenuItem key={notif.id} className="flex items-start gap-3">
                  <div className="mt-1">
                     <notif.icon className={cn("h-5 w-5", notif.iconColor)} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {notif.description}
                    </p>
                     <p className="text-xs text-muted-foreground/70 mt-1">
                      {format(new Date(notif.timestamp), 'PPP p')}
                    </p>
                  </div>
                   {!notif.isRead && <div className="h-2 w-2 rounded-full bg-primary mt-2" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
             <DropdownMenuGroup>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => console.log('Clear all')}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Clear all</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/notifications" className="justify-center">
                <Button variant="outline" className="w-full h-9">View all notifications</Button>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-12 gap-2 px-2">
               <Avatar className="h-10 w-10">
                <AvatarImage src={userAvatar?.imageUrl} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden lg:block">
                <p className="font-semibold text-sm">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings/help">Support</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

    