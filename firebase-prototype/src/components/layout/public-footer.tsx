
import Link from 'next/link';
import { Logo } from '@/components/icons';

const footerSections = [
    {
        title: 'Product',
        links: [
            { label: 'Home', href: '/#home' },
            { label: 'Features', href: '/#features' },
            { label: 'Pricing', href: '/#pricing' },
            { label: 'Contact', href: '/#contact' },
        ],
    },
    {
        title: 'Application',
        links: [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Sign In', href: '/login' },
            { label: 'Register', href: '/register' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Terms of Service', href: '#' },
            { label: 'Privacy Policy', href: '#' },
        ],
    },
];

export default function PublicFooter() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container mx-auto py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    <div className="col-span-1 md:col-span-4 lg:col-span-2 space-y-4">
                        <Link href="/#home" className="flex items-center gap-3">
                            <Logo className="h-10 w-10" />
                            <span className="text-2xl font-bold">CCIP</span>
                        </Link>
                        <div className="text-muted-foreground text-sm max-w-xs">
                            <p className="font-semibold text-foreground">Crisis Communication Intelligence Platform</p>
                            <p>Predictive Intelligence for Culturally-Resonant Crisis Communication.</p>
                        </div>
                    </div>

                    {footerSections.map(section => (
                        <div key={section.title} className="space-y-4">
                            <h4 className="font-semibold text-foreground">{section.title}</h4>
                            <ul className="space-y-2">
                                {section.links.map(link => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary hover:underline">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="py-8 border-t">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} CCIP. All rights reserved.
                </div>
            </div>
      </footer>
    );
}
