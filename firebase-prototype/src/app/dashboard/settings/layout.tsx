
'use client';

import {
  User,
  Building,
  Bell,
  Palette,
  Database,
  HelpCircle,
  CreditCard,
  Network,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const settingsNav = [
  {
    name: 'Account',
    href: '/dashboard/settings/account',
    icon: User,
  },
  {
    name: 'Organisation',
    href: '/dashboard/settings/organisation',
    icon: Building,
  },
  {
    name: 'Hierarchy',
    href: '/dashboard/settings/hierarchy',
    icon: Network,
  },
  {
    name: 'Notifications',
    href: '/dashboard/settings/notifications-preferences',
    icon: Bell,
  },
  {
    name: 'Appearance',
    href: '/dashboard/settings/appearance',
    icon: Palette,
  },
  {
    name: 'Data & Sync',
    href: '/dashboard/settings/data',
    icon: Database,
  },
  {
    name: 'Billing',
    href: '/dashboard/settings/billing',
    icon: CreditCard,
  },
  {
    name: 'Help & Documentation',
    href: '/dashboard/settings/help',
    icon: HelpCircle,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 gap-8 items-start">
      <div className="col-span-1">{children}</div>
    </div>
  );
}
