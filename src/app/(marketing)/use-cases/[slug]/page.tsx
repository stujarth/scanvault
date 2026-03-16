import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowLeft } from 'lucide-react';

const useCaseData: Record<string, { title: string; subtitle: string; heroDescription: string; problem: string; solution: string; benefits: string[]; workflow: { step: string; description: string }[]; cta: string; demoAccount: string }> = {
  garages: {
    title: 'Garages & Service Centres',
    subtitle: 'Protect your reputation and your customers',
    heroDescription: 'Every vehicle that enters your workshop is a potential liability. ScanVault creates an indisputable before-and-after record, protecting both you and your customers.',
    problem: 'A customer drops off their car for a service. When they collect it, they claim there\'s a new scratch on the bumper. Without evidence, who\'s right? You either absorb the cost or lose a customer.',
    solution: 'ScanVault scans the vehicle on arrival, documenting every existing mark. After the work is complete, scan again. The comparison report proves no new damage occurred — or flags exactly what did.',
    benefits: ['Eliminate false damage claims', 'Build customer trust and loyalty', 'Professional USP over competitors', 'MOT body condition documentation', 'Undercarriage rust and corrosion checks', 'Complete service history records'],
    workflow: [
      { step: 'Vehicle arrives', description: 'Quick scan on arrival — takes under 5 minutes. Customer reviews and accepts the condition report.' },
      { step: 'Work completed', description: 'Post-service scan creates a comparison record. Any changes are flagged automatically.' },
      { step: 'Customer collection', description: 'Share the before/after report with the customer. Full transparency, full protection.' },
    ],
    cta: 'See the Garage Demo',
    demoAccount: 'garage',
  },
  'car-sales': {
    title: 'Car Sales & Dealerships',
    subtitle: 'Transparent condition, confident buyers',
    heroDescription: 'We\'ve all travelled two hours to see a car described as "perfect condition" only to find it\'s anything but. ScanVault gives buyers the truth before they travel.',
    problem: 'Online car listings rely on subjective descriptions and carefully angled photos. Buyers can\'t trust condition claims, leading to wasted journeys, disputes, and lost sales.',
    solution: 'Every vehicle gets a ScanVault condition grade and detailed body map. Buyers see exactly what marks exist before they visit. Transparent listings sell faster and build your reputation.',
    benefits: ['Condition-graded listings build trust', 'Reduce wasted viewings', 'Full provenance history for each vehicle', 'Professional reports for buyers', 'Partnership opportunity with platforms like AutoTrader', 'Higher conversion rates'],
    workflow: [
      { step: 'Vehicle intake', description: 'Scan the vehicle when it arrives at the dealership. Document every mark from day one.' },
      { step: 'Listing creation', description: 'Include the ScanVault grade and body map in your listing. Buyers see the truth upfront.' },
      { step: 'Sale completion', description: 'Provide the buyer with the full provenance report — every scan from the vehicle\'s history.' },
    ],
    cta: 'See the Car Sales Demo',
    demoAccount: 'sales',
  },
  'hire-companies': {
    title: 'Hire Companies',
    subtitle: 'End deposit disputes forever',
    heroDescription: 'No more spotty kids with clipboards. No more customers losing deposits unfairly. ScanVault creates a digital, timestamped record at checkout and return.',
    problem: 'Hire cars get scuffed. The question is always: was it the customer or was it already there? Manual inspections miss things, customers dispute charges, and everyone loses.',
    solution: 'A 3-minute scan at checkout and return creates an indisputable comparison. New damage is flagged automatically with location, severity, and repair cost estimate.',
    benefits: ['Automated checkout/return comparison', 'Fair, evidence-based damage charges', 'Customer confidence and satisfaction', 'Fleet-wide condition analytics', 'Reduced insurance claims', 'Works in wet or dry conditions'],
    workflow: [
      { step: 'Customer checkout', description: 'Scan the vehicle before handover. Customer views and accepts the condition report on their phone.' },
      { step: 'Customer return', description: 'Return scan automatically compares against checkout. New damage is flagged instantly.' },
      { step: 'Fair resolution', description: 'If damage is found, the comparison report provides clear evidence. No arguments, no guesswork.' },
    ],
    cta: 'See the Hire Company Demo',
    demoAccount: 'hire',
  },
  insurance: {
    title: 'Insurance Companies',
    subtitle: 'The data is absolute gold',
    heroDescription: 'Know the true condition of a vehicle before a claim lands on your desk. ScanVault\'s lifetime condition history eliminates the guesswork from claims assessment.',
    problem: 'Claimants add pre-existing damage to claims. Without baseline data, insurers either pay out or face costly disputes. That extra claimed scratch costs hundreds — which we all pay for in premiums.',
    solution: 'ScanVault policyholders share their vehicle\'s condition history. You see every mark documented over time. Pre-existing damage is clearly identified, and claims can be assessed against the last scan.',
    benefits: ['Pre-existing damage documentation', 'Reduce fraudulent claim payouts', 'Offer lower premiums for sharing customers', 'Instant access to condition history', 'Evidence-grade scan reports', 'API integration for claims systems'],
    workflow: [
      { step: 'Policy setup', description: 'Policyholder shares their ScanVault history. You see the vehicle\'s current and historical condition.' },
      { step: 'Claim received', description: 'Compare claimed damage against the last scan. Was that dent already there?' },
      { step: 'Fair assessment', description: 'Evidence-based decisions. Pay for genuine damage, reject pre-existing items.' },
    ],
    cta: 'See the Insurance Demo',
    demoAccount: 'insurance',
  },
  police: {
    title: 'Police & Accident Investigation',
    subtitle: 'Evidence-grade vehicle condition data',
    heroDescription: 'When investigating a collision, knowing the pre-impact condition of the vehicle can be critical. ScanVault provides timestamped, location-tagged, forensic-grade condition data.',
    problem: 'Accident investigators need to determine pre-existing damage versus impact damage. Without baseline data, this requires expert estimation.',
    solution: 'Vehicles with ScanVault histories have documented conditions at multiple points in time. Investigators can see the exact state of the vehicle before the incident.',
    benefits: ['Timestamped, location-tagged evidence', 'Pre-impact condition baseline', 'Support accident reconstruction', 'Chain-of-custody metadata', 'Integration with evidence management', 'Structural integrity assessment'],
    workflow: [
      { step: 'Incident occurs', description: 'Post-incident scan documents current condition in forensic detail.' },
      { step: 'History review', description: 'Access the vehicle\'s ScanVault history to see pre-incident condition.' },
      { step: 'Investigation report', description: 'Compare pre and post condition to determine impact damage versus pre-existing.' },
    ],
    cta: 'Contact Us for Police Access',
    demoAccount: 'garage',
  },
  'car-parks': {
    title: 'Car Parks & Valet Services',
    subtitle: 'Proof of care, protection from claims',
    heroDescription: 'When you take someone\'s car keys, you take responsibility. ScanVault proves the condition at handover, protecting your business and giving customers confidence.',
    problem: 'Airport parking, valet services, and multi-storey car parks all face the same issue: customers claiming damage that was already there. Without proof, you pay.',
    solution: 'Quick scan on entry, quick scan on exit. The comparison is automatic. If no new damage occurred, the proof is there. If something did happen, you know exactly what.',
    benefits: ['Entry/exit comparison scans', 'Automatic new damage detection', 'Customer confidence in your service', 'Protection from fraudulent claims', 'Quick scan — under 3 minutes', 'Works in covered and open-air locations'],
    workflow: [
      { step: 'Vehicle entry', description: 'Scan the vehicle when the customer hands over the keys. Share the report immediately.' },
      { step: 'Vehicle in care', description: 'Your team operates with confidence, knowing the baseline is documented.' },
      { step: 'Vehicle return', description: 'Exit scan confirms no new damage. Customer drives away satisfied.' },
    ],
    cta: 'See the Demo',
    demoAccount: 'garage',
  },
};

export function generateStaticParams() {
  return Object.keys(useCaseData).map(slug => ({ slug }));
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = useCaseData[slug];
  if (!data) notFound();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/use-cases" className="inline-flex items-center text-sm text-gray-500 hover:text-teal-600 mb-8">
          <ArrowLeft className="h-4 w-4 mr-1" /> All Use Cases
        </Link>

        <Badge variant="secondary" className="mb-4 text-teal-700 bg-teal-50 border-teal-200">{data.subtitle}</Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{data.title}</h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-12">{data.heroDescription}</p>

        {/* Problem / Solution */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-red-100 bg-red-50/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-red-800 mb-3">The Problem</h3>
              <p className="text-sm text-red-700 leading-relaxed">{data.problem}</p>
            </CardContent>
          </Card>
          <Card className="border-teal-100 bg-teal-50/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-teal-800 mb-3">The ScanVault Solution</h3>
              <p className="text-sm text-teal-700 leading-relaxed">{data.solution}</p>
            </CardContent>
          </Card>
        </div>

        {/* Workflow */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h2>
        <div className="space-y-6 mb-16">
          {data.workflow.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white text-sm font-bold">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{step.step}</h3>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Key Benefits</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {data.benefits.map(benefit => (
            <div key={benefit} className="flex items-start gap-3 p-4 rounded-lg border bg-white">
              <Check className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{data.cta}</h2>
          <p className="text-teal-100 mb-6">See ScanVault in action with our interactive demo.</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href={`/login?demo=${data.demoAccount}`}>Launch Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
