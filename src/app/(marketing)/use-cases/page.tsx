import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Car, Building2, ShieldCheck, Shield, MapPin, ChevronRight } from 'lucide-react';

const useCases = [
  { slug: 'garages', icon: Wrench, title: 'Garages & Service Centres', description: 'Scan vehicles on arrival and departure to protect your business from false damage claims. Give customers peace of mind and differentiate your service.', stats: '85% reduction in damage disputes' },
  { slug: 'car-sales', icon: Car, title: 'Car Sales & Dealerships', description: 'Provide transparent, graded condition reports that build buyer confidence. Like a vehicle HPI check, but for bodywork. Perfect for online listings.', stats: '23% faster sales with condition reports' },
  { slug: 'hire-companies', icon: Building2, title: 'Hire Companies', description: 'Checkout and return scans create an indisputable record. No more clipboards, no more disputes. Protect your fleet and your customers.', stats: '92% deposit dispute resolution' },
  { slug: 'insurance', icon: ShieldCheck, title: 'Insurance Companies', description: 'Access pre-existing condition data to validate claims. Reduce fraudulent payouts and offer lower premiums to ScanVault policyholders.', stats: 'Up to 15% reduction in fraudulent claims' },
  { slug: 'police', icon: Shield, title: 'Police & Accident Investigation', description: 'Evidence-grade, timestamped scans support accident reconstruction. Know the pre-impact condition of any vehicle with a ScanVault history.', stats: 'Forensic-grade documentation' },
  { slug: 'car-parks', icon: MapPin, title: 'Car Parks & Valet Services', description: 'Scan vehicles on entry and exit. Protect your business from false claims and give customers confidence in your service.', stats: 'Complete liability protection' },
];

export default function UseCasesPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Use Cases</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            ScanVault serves the entire automotive ecosystem — from the garage forecourt to the insurance claims desk.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map(uc => (
            <Link key={uc.slug} href={`/use-cases/${uc.slug}`}>
              <Card className="h-full hover:shadow-lg hover:border-teal-200 transition-all cursor-pointer group">
                <CardContent className="p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-6 group-hover:bg-teal-100 transition-colors">
                    <uc.icon className="h-7 w-7" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{uc.title}</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">{uc.description}</p>
                  <div className="text-sm font-semibold text-teal-600 mb-4">{uc.stats}</div>
                  <span className="inline-flex items-center text-sm font-medium text-teal-600 group-hover:underline">
                    Learn more <ChevronRight className="ml-1 h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
