import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    price: '29',
    description: 'For individuals and small garages getting started with vehicle condition tracking.',
    features: [
      'Up to 10 vehicles',
      '50 scans per month',
      '2 user accounts',
      'Standard grading profile',
      'Basic condition reports',
      'Email support',
      'Link sharing',
    ],
  },
  {
    name: 'Professional',
    price: '99',
    description: 'For hire companies, mid-size garages, and dealerships needing full capabilities.',
    popular: true,
    features: [
      'Up to 100 vehicles',
      '500 scans per month',
      '10 user accounts',
      'All grading profiles',
      'Full reports + comparison',
      'Organisation sharing',
      'Priority support',
      'Fleet analytics dashboard',
      'Undercarriage scanning',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For insurance companies, police forces, and large fleet operators.',
    features: [
      'Unlimited vehicles',
      'Unlimited scans',
      'Unlimited users',
      'Custom grading profiles',
      'White-label reports',
      'API access',
      'Dedicated account manager',
      'Data export & integration',
      'SLA guarantee',
      'On-site training',
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Pricing</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, transparent pricing that scales with your business. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map(tier => (
            <Card key={tier.name} className={`relative ${tier.popular ? 'border-teal-300 shadow-lg shadow-teal-500/10 scale-105' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-teal-600 text-white">Most Popular</Badge>
                </div>
              )}
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900">{tier.name}</h2>
                <p className="text-sm text-gray-500 mt-2 min-h-[40px]">{tier.description}</p>
                <div className="mt-6 mb-8">
                  {tier.price === 'Custom' ? (
                    <span className="text-4xl font-bold text-gray-900">Custom</span>
                  ) : (
                    <>
                      <span className="text-5xl font-bold text-gray-900">&pound;{tier.price}</span>
                      <span className="text-gray-500 text-lg">/month</span>
                    </>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start text-sm text-gray-600">
                      <Check className="h-4 w-4 text-teal-500 mr-3 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${tier.popular ? 'bg-teal-600 hover:bg-teal-700' : ''}`} variant={tier.popular ? 'default' : 'outline'} asChild>
                  <Link href={tier.price === 'Custom' ? '/contact' : '/login'}>
                    {tier.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'How does the free trial work?', a: 'All plans come with a 14-day free trial. No credit card required. You get full access to all features in your chosen plan.' },
              { q: 'Can I change plan later?', a: 'Yes, you can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.' },
              { q: 'What counts as a scan?', a: 'Each complete vehicle inspection counts as one scan, regardless of how many photos are taken or panels inspected.' },
              { q: 'Do I need special equipment?', a: 'No. ScanVault works with any modern smartphone or tablet camera. No specialist hardware required.' },
              { q: 'Is my data secure?', a: 'All data is encrypted in transit and at rest. We are GDPR compliant and ISO 27001 certified.' },
            ].map(faq => (
              <div key={faq.q} className="border-b pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
