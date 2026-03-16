import Link from 'next/link';
import { Shield } from 'lucide-react';

export function MarketingFooter() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-teal-600" />
              <span className="text-lg font-bold">Scan<span className="text-teal-600">Vault</span></span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI-powered vehicle body condition scanning. Building trusted vehicle histories for the automotive industry.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Use Cases</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/use-cases/garages" className="hover:text-teal-600">Garages</Link></li>
              <li><Link href="/use-cases/hire-companies" className="hover:text-teal-600">Hire Companies</Link></li>
              <li><Link href="/use-cases/insurance" className="hover:text-teal-600">Insurance</Link></li>
              <li><Link href="/use-cases/car-sales" className="hover:text-teal-600">Car Sales</Link></li>
              <li><Link href="/use-cases/police" className="hover:text-teal-600">Police</Link></li>
              <li><Link href="/use-cases/car-parks" className="hover:text-teal-600">Car Parks</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/pricing" className="hover:text-teal-600">Pricing</Link></li>
              <li><Link href="/login?demo=garage" className="hover:text-teal-600">Try Demo</Link></li>
              <li><Link href="/about" className="hover:text-teal-600">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-teal-600">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
              <li><span className="cursor-default">Cookie Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} ScanVault Ltd. All rights reserved. Registered in England & Wales.
        </div>
      </div>
    </footer>
  );
}
