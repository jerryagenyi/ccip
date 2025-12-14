import { Logo } from "@/components/icons";
import PublicFooter from "@/components/layout/public-footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex w-full flex-1 flex-col items-center justify-center gap-8 px-4 py-24">
        <header className="text-center">
          <div className="flex items-center justify-center gap-2">
              <Logo className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold text-primary">CCIP</h1>
          <p className="text-sm text-muted-foreground">Federal Ministry of Health</p>
          <p className="text-xs text-muted-foreground">Crisis Communication Intelligence Platform</p>
        </header>

        {children}
      </main>

      <PublicFooter />
    </div>
  );
}
