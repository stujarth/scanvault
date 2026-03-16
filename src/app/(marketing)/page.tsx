import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield, ScanLine, FileText, History, Car, Building2, Plane,
  ShieldCheck, MapPin, ChevronRight, Wrench, BarChart3, Share2,
  Eye, Gauge, Camera
} from 'lucide-react';

const useCases = [
  { icon: Wrench, title: 'Garages', description: 'Before and after service scans protect both garage and customer.', href: '/use-cases/garages' },
  { icon: Car, title: 'Car Sales', description: 'Transparent condition grading builds buyer confidence online.', href: '/use-cases/car-sales' },
  { icon: Building2, title: 'Hire Companies', description: 'Checkout and return scans eliminate deposit disputes.', href: '/use-cases/hire-companies' },
  { icon: ShieldCheck, title: 'Insurance', description: 'Pre-existing condition data prevents fraudulent claims.', href: '/use-cases/insurance' },
  { icon: Shield, title: 'Police', description: 'Evidence-grade scans support accident investigation.', href: '/use-cases/police' },
  { icon: MapPin, title: 'Car Parks', description: 'Entry and exit scans protect valet and parking operators.', href: '/use-cases/car-parks' },
];

const features = [
  { icon: Camera, title: 'AI Body Scanning', description: 'Phone or tablet camera detects scratches, scuffs, dents, and structural damage.' },
  { icon: Eye, title: 'Interactive Body Map', description: 'Visual damage overlay across all panels — top, sides, front, rear, and undercarriage.' },
  { icon: Gauge, title: 'Smart Grading', description: 'Context-aware grading profiles for hire, MOT, insurance, private sale, and more.' },
  { icon: FileText, title: 'Instant Reports', description: 'Professional condition reports generated in seconds, ready to share.' },
  { icon: History, title: 'Vehicle Provenance', description: 'Complete condition history from new — every scan adds to the permanent record.' },
  { icon: BarChart3, title: 'Fleet Analytics', description: 'Organisation-wide condition trends, scan activity, and fleet health dashboard.' },
  { icon: Share2, title: 'Secure Sharing', description: 'Share reports with insurers, buyers, or partners via controlled access links.' },
  { icon: ScanLine, title: 'Undercarriage Scanning', description: 'Detect rust, corrosion, and structural issues beneath the vehicle.' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-100/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 text-teal-700 bg-teal-50 border-teal-200">
              AI-Powered Vehicle Inspection
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Know Your Vehicle&apos;s{' '}
              <span className="text-teal-600">True Condition</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              AI-powered body scanning that builds a complete damage history for every vehicle you manage.
              No specialist equipment — just your phone and the ScanVault app.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-teal-600 hover:bg-teal-700 text-base px-8">
                <Link href="/login">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8">
                <Link href="/login?demo=garage">
                  Try the Demo
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Mock app screenshot */}
          <div className="mt-16 mx-auto max-w-5xl">
            <div className="rounded-xl border bg-white shadow-2xl shadow-teal-500/10 overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center text-sm text-gray-400">app.scanvault.co.uk</div>
              </div>
              <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 rounded-lg border bg-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Vehicle Body Map</h3>
                      <Badge className="bg-teal-50 text-teal-700 border-teal-200">Grade: 82 — Good</Badge>
                    </div>
                    {/* Simplified car outline SVG */}
                    <svg viewBox="0 0 400 200" className="w-full h-auto">
                      <rect x="80" y="60" width="240" height="90" rx="20" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2" />
                      <rect x="120" y="35" width="160" height="55" rx="15" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2" />
                      <circle cx="130" cy="155" r="18" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
                      <circle cx="270" cy="155" r="18" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
                      {/* Damage markers */}
                      <circle cx="300" cy="130" r="6" fill="#f59e0b" opacity="0.9" />
                      <circle cx="95" cy="85" r="6" fill="#22c55e" opacity="0.9" />
                      <circle cx="250" cy="50" r="6" fill="#3b82f6" opacity="0.9" />
                    </svg>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg border bg-white p-4">
                      <div className="text-2xl font-bold text-teal-600">82</div>
                      <div className="text-xs text-gray-500">Overall Grade</div>
                    </div>
                    <div className="rounded-lg border bg-white p-4">
                      <div className="text-2xl font-bold text-gray-900">4</div>
                      <div className="text-xs text-gray-500">Damage Items</div>
                    </div>
                    <div className="rounded-lg border bg-white p-4">
                      <div className="text-2xl font-bold text-gray-900">8</div>
                      <div className="text-xs text-gray-500">Total Scans</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="border-y bg-gray-50/50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-400 mb-6">TRUSTED BY FORWARD-THINKING AUTOMOTIVE BUSINESSES</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-gray-300">
            {['ABC Motors', 'QuickHire Ltd', 'SureCover Insurance', 'Prestige Motors', 'SafePark UK', 'AutoCheck'].map(name => (
              <span key={name} className="text-lg font-semibold tracking-tight">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Three simple steps to a complete vehicle condition record</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: Camera, title: 'Scan', description: 'Walk around the vehicle with your phone. Our AI guides you through each panel, detecting damage in real-time — works in wet or dry conditions.' },
              { step: '2', icon: FileText, title: 'Report', description: 'Instantly generate a professional condition report with damage grades, repair estimates, and an interactive body map.' },
              { step: '3', icon: History, title: 'Track', description: 'Every scan builds the vehicle\'s permanent condition history. Compare over time, share with insurers, and prove provenance.' },
            ].map(item => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <item.icon className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full">
                  <span className="text-6xl font-bold text-teal-100">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Built for Every Part of the Automotive Industry</h2>
            <p className="mt-4 text-lg text-gray-600">From garage forecourts to insurance claims departments</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map(uc => (
              <Link key={uc.title} href={uc.href}>
                <Card className="h-full hover:shadow-md hover:border-teal-200 transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 mb-4">
                      <uc.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{uc.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{uc.description}</p>
                    <span className="inline-flex items-center text-sm font-medium text-teal-600 mt-3">
                      Learn more <ChevronRight className="ml-1 h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Everything You Need</h2>
            <p className="mt-4 text-lg text-gray-600">Comprehensive scanning, grading, and reporting — all from your phone</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(feature => (
              <div key={feature.title} className="rounded-xl border bg-white p-6 hover:shadow-sm transition-shadow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600 mb-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-gray-600">Start free, scale as you grow</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: '29', description: 'For individuals and small garages', features: ['Up to 10 vehicles', '50 scans/month', '2 users', 'Standard grading', 'Basic reports'] },
              { name: 'Professional', price: '99', description: 'For hire companies and dealerships', features: ['Up to 100 vehicles', '500 scans/month', '10 users', 'All grading profiles', 'Full reports + comparison', 'Organisation sharing'], popular: true },
              { name: 'Enterprise', price: 'Custom', description: 'For insurance and large fleets', features: ['Unlimited vehicles', 'Unlimited scans', 'Unlimited users', 'Custom grading profiles', 'White-label reports', 'API access', 'Dedicated support'] },
            ].map(tier => (
              <Card key={tier.name} className={`relative ${tier.popular ? 'border-teal-300 shadow-lg shadow-teal-500/10' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-teal-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{tier.description}</p>
                  <div className="mt-6 mb-6">
                    {tier.price === 'Custom' ? (
                      <span className="text-4xl font-bold text-gray-900">Custom</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-gray-900">&pound;{tier.price}</span>
                        <span className="text-gray-500">/month</span>
                      </>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-center text-sm text-gray-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-teal-500 mr-3 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${tier.popular ? 'bg-teal-600 hover:bg-teal-700' : ''}`} variant={tier.popular ? 'default' : 'outline'}>
                    {tier.price === 'Custom' ? 'Contact Us' : 'Start Free Trial'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-sm text-teal-600 font-medium hover:underline">
              View full pricing details &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to see the full picture?</h2>
          <p className="mt-4 text-lg text-teal-100">
            Join garages, hire companies, and dealerships already using ScanVault to protect their business and build trust with customers.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" asChild className="text-base px-8">
              <Link href="/login">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8 text-white border-white/30 hover:bg-white/10">
              <Link href="/login?demo=garage">Try the Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
