import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Shield className="h-8 w-8 text-teal-600" />
        <span className="text-2xl font-bold">Scan<span className="text-teal-600">Vault</span></span>
      </Link>
      {children}
    </div>
  );
}
