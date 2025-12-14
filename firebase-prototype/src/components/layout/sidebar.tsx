

'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { navItems, futureNavItems, mockTeamMembers, publicNavItems } from '@/lib/data';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Building, LogOut, ChevronDown, HelpCircle, Sparkles, Globe } from 'lucide-react';
import type { NavItem } from '@/lib/types';
import React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const SidebarNavItem = ({ item, pathname }: { item: NavItem; pathname:string }) => {
  const isDashboard = item.href === '/dashboard';
  
  const isActive = isDashboard
    ? pathname === item.href
    : (item.children 
        ? pathname.startsWith(item.href) && !item.children.some(child => pathname.startsWith(child.href) && child.href.length > item.href.length)
        : pathname === item.href || pathname.startsWith(`${item.href}/`));
    
  const isChildActive = item.children && item.children.some(child => pathname.startsWith(child.href));

  if (item.children) {
    return (
        <Collapsible defaultOpen={isChildActive}>
            <CollapsibleTrigger asChild>
                <SidebarMenuButton
                    isActive={isChildActive}
                    tooltip={{ children: item.title }}
                    className="justify-between"
                >
                    <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:-rotate-180" />
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <SidebarMenuSub>
                    {item.children.map((child) => {
                        const isSubActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                        return (
                            <SidebarMenuSubItem key={child.href}>
                                 <SidebarMenuSubButton asChild isActive={isSubActive}>
                                    <a href={child.href}>
                                        <child.icon className="h-4 w-4" />
                                        <span>{child.title}</span>
                                    </a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        );
                    })}
                </SidebarMenuSub>
            </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      tooltip={{ children: item.title }}
      className="justify-start"
    >
      <a href={item.href}>
        <item.icon className="h-5 w-5" />
        <span>{item.title}</span>
        {item.badge && (
          <Badge variant="destructive" className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </a>
    </SidebarMenuButton>
  );
};


export default function AppSidebar() {
  const pathname = usePathname();
  const currentUser = mockTeamMembers[0];

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r">
      <SidebarHeader className="h-16 items-center justify-start p-4">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">{currentUser.team}</h1>
          </div>
        </div>
        <div className="hidden items-center gap-2 group-data-[collapsible=icon]:flex">
          <Building className="h-8 w-8" />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarNavItem item={item} pathname={pathname} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator className="my-4" />
         <Collapsible>
          <CollapsibleTrigger className="w-full">
            <SidebarGroupLabel className="flex items-center gap-2 w-full">
                <Globe className="h-5 w-5 text-primary" /> 
                <span className="flex-1 text-left">Public & Auth Pages</span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:-rotate-180" />
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu className="mt-2">
                {publicNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarNavItem item={item} pathname={pathname} />
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
        <SidebarSeparator className="my-4" />
        <Collapsible>
          <CollapsibleTrigger className="w-full">
            <SidebarGroupLabel className="flex items-center gap-2 w-full">
                <Sparkles className="h-5 w-5 text-primary" /> 
                <span className="flex-1 text-left">Future Features</span>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:-rotate-180" />
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu className="mt-2">
                {futureNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarNavItem item={item} pathname={pathname} />
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <div className="flex items-center p-2">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">CCIP</h1>
          </div>
          <div className="hidden items-center gap-2 group-data-[collapsible=icon]:flex">
            <Logo className="h-8 w-8" />
          </div>
          <SidebarMenuButton
            variant="ghost"
            size="icon"
            className="ml-auto h-10 w-10 group-data-[collapsible=icon]:hidden"
            asChild
          >
            <a href="/login">
              <LogOut className="h-5 w-5" />
            </a>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
