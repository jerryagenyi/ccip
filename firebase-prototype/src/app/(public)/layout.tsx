
import PublicHeader from '@/components/layout/public-header';
import PublicFooter from '@/components/layout/public-footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="container mx-auto flex flex-1 flex-col">{children}</main>
      <PublicFooter />
    </div>
  );
}
