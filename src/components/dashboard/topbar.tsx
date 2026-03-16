'use client';

import { useAuth } from '@/providers/auth-provider';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Shield, ScanLine, Bell } from 'lucide-react';
import { useState } from 'react';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/vehicles': 'Vehicles',
  '/scan': 'New Scan',
  '/reports': 'Reports',
  '/fleet': 'Fleet Management',
  '/sharing': 'Data Sharing',
  '/settings': 'Settings',
};

export function Topbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const title = Object.entries(titles).find(([path]) => pathname.startsWith(path))?.[1] || 'ScanVault';

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-accent hover:text-accent-foreground">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex items-center gap-2 h-16 px-4 border-b">
              <Shield className="h-6 w-6 text-teal-600" />
              <span className="font-bold">Scan<span className="text-teal-600">Vault</span></span>
            </div>
            <nav className="px-2 py-4 space-y-1">
              {[
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/vehicles', label: 'Vehicles' },
                { href: '/scan', label: 'New Scan' },
                { href: '/reports', label: 'Reports' },
                { href: '/fleet', label: 'Fleet' },
                { href: '/sharing', label: 'Sharing' },
                { href: '/settings', label: 'Settings' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {user?.isDemo && (
          <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 hidden sm:inline-flex">
            Demo Mode
          </Badge>
        )}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-teal-500" />
        </Button>
        <Button size="sm" asChild className="bg-teal-600 hover:bg-teal-700">
          <Link href="/scan">
            <ScanLine className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Scan</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
