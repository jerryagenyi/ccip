
'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import NationalDashboard from '@/components/dashboard/role-specific/national-dashboard';
import StateDashboard from '@/components/dashboard/role-specific/state-dashboard';
import LgaDashboard from '@/components/dashboard/role-specific/lga-dashboard';

export default function DashboardPage() {
  const [role, setRole] = useState('federal');

  const getGreeting = () => {
    switch(role) {
      case 'federal':
        return { title: 'National Overview', description: 'Welcome back, here\'s a look at the nation\'s health campaigns.'};
      case 'state':
        return { title: 'State Overview (Lagos)', description: 'Welcome back, here\'s a look at your state\'s health campaigns.'};
      case 'lga':
        return { title: 'LGA Dashboard (Ikeja)', description: 'Welcome back, here are your tasks for today.'};
      default:
        return { title: 'Dashboard', description: 'Welcome back.'};
    }
  }

  const { title, description } = getGreeting();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>
         <Tabs value={role} onValueChange={setRole} className="w-auto">
          <TabsList>
            <TabsTrigger value="federal">Federal</TabsTrigger>
            <TabsTrigger value="state">State</TabsTrigger>
            <TabsTrigger value="lga">LGA</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={role}>
        <TabsContent value="federal">
            <NationalDashboard />
        </TabsContent>
        <TabsContent value="state">
            <StateDashboard />
        </TabsContent>
         <TabsContent value="lga">
            <LgaDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
