import Header from '@/components/layout/header';
import AppSidebar from '@/components/layout/sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import MobileBottomNav from '@/components/layout/mobile-bottom-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-1">
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-full flex-1 flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-28 md:pb-8">
              {children}
            </main>
            <MobileBottomNav />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
