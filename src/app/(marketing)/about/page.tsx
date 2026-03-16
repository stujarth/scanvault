import { Badge } from '@/components/ui/badge';
import { Shield, Target, Eye, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-teal-700 bg-teal-50 border-teal-200">About Us</Badge>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Building Trust in Vehicle Condition</h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            ScanVault was founded on a simple observation: the automotive industry lacks a trusted, standardised way to document and verify vehicle body condition over time.
          </p>
        </div>

        <div className="prose prose-gray max-w-none mb-16">
          <p className="text-gray-600 leading-relaxed">
            Whether you&apos;re hiring a car and worried about losing your deposit, buying a used vehicle described as &ldquo;perfect condition&rdquo;,
            or running a garage and defending against false damage claims — the problem is the same: there&apos;s no objective, trusted record of a vehicle&apos;s body condition.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            ScanVault changes that. Using AI-powered camera scanning available on any phone or tablet, we create detailed, graded condition reports that build
            into a vehicle&apos;s permanent body history — its provenance. Every scan is timestamped, every mark is catalogued, and the data is available to those
            who need it most.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 mb-16">
          {[
            { icon: Target, title: 'Our Mission', description: 'To create the definitive vehicle body condition record — trusted by owners, businesses, and insurers alike.' },
            { icon: Eye, title: 'Our Vision', description: 'A world where every vehicle has a transparent, verifiable condition history from factory to scrapyard.' },
            { icon: Shield, title: 'Our Values', description: 'Accuracy, transparency, and fairness. We believe everyone deserves protection from false claims and hidden damage.' },
            { icon: Users, title: 'Our Team', description: 'Automotive experts, AI engineers, and insurance professionals united by a shared belief in better vehicle data.' },
          ].map(item => (
            <div key={item.title} className="rounded-xl border bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 mb-4">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
