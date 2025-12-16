
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Users,
  User as UserIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { navItems } from '@/lib/data';
import type { NavItem } from '@/lib/types';

const mobileNavItems: NavItem[] = [
  navItems.find(item => item.title === 'Dashboard')!,
  navItems.find(item => item.title === 'Activities')!,
  navItems.find(item => item.title === 'Reports')!,
  navItems.find(item => item.title === 'Team')!,
  navItems.find(item => item.title === 'Profile')!,
].filter(Boolean);


export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-40 block w-full border-t bg-background shadow-t-lg md:hidden">
      <div className="mx-auto grid h-20 max-w-lg grid-cols-5 font-medium">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group inline-flex flex-col items-center justify-center px-5 relative',
                isActive ? 'text-primary' : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <div className={cn(
                'absolute top-0 h-1 w-12 rounded-b-full transition-all',
                isActive && 'bg-gradient-to-r from-primary to-accent'
              )} />
              <item.icon className="mb-1 h-6 w-6" />
              <span className="text-xs">{item.title}</span>
              {item.badge && (
                 <Badge variant="destructive" className="absolute top-2 right-4 h-5 w-5 justify-center p-0">{item.badge}</Badge>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
