'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Car, ScanLine, FileText, Users, Share2,
  Settings, LogOut, Shield, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/vehicles', icon: Car, label: 'Vehicles' },
  { href: '/scan', icon: ScanLine, label: 'New Scan' },
  { href: '/reports', icon: FileText, label: 'Reports' },
  { href: '/fleet', icon: Users, label: 'Fleet' },
  { href: '/sharing', icon: Share2, label: 'Sharing' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const roleLabels: Record<string, string> = {
    garage: 'Garage',
    hire_company: 'Hire Company',
    insurance: 'Insurance',
    dealership: 'Dealership',
    individual: 'Individual',
    police: 'Police',
    car_park: 'Car Park',
    admin: 'Admin',
  };

  return (
    <aside className={cn(
      'hidden md:flex flex-col border-r bg-white transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-teal-600" />
            <span className="font-bold text-gray-900">Scan<span className="text-teal-600">Vault</span></span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <Shield className="h-6 w-6 text-teal-600" />
          </Link>
        )}
        <Button variant="ghost" size="icon" className={cn('h-7 w-7', collapsed && 'hidden')} onClick={() => setCollapsed(true)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {collapsed && (
          <Button variant="ghost" size="icon" className="h-7 w-7 absolute -right-3 top-4 bg-white border rounded-full shadow-sm z-10" onClick={() => setCollapsed(false)}>
            <ChevronRight className="h-3 w-3" />
          </Button>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        {!collapsed && user && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500">{roleLabels[user.role] || user.role}</p>
          </div>
        )}
        <button
          onClick={() => { logout(); window.location.href = '/'; }}
          className={cn(
            'flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors w-full',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
