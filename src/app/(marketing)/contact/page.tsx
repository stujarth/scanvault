'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-teal-700 bg-teal-50 border-teal-200">Get In Touch</Badge>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600">Have a question or want to discuss enterprise pricing? We&apos;d love to hear from you.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          <div className="md:col-span-3">
            {submitted ? (
              <Card className="border-teal-200 bg-teal-50">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Message Sent</h2>
                  <p className="text-gray-600">Thank you for your interest. Our team will be in touch within 24 hours.</p>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <Input placeholder="John" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <Input placeholder="Smith" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input type="email" placeholder="john@company.co.uk" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <Input placeholder="Your company name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                    <option value="">Select your industry</option>
                    <option value="garage">Garage / Service Centre</option>
                    <option value="hire">Hire Company</option>
                    <option value="insurance">Insurance</option>
                    <option value="dealership">Dealership / Car Sales</option>
                    <option value="police">Police / Emergency Services</option>
                    <option value="car-park">Car Park / Valet</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm min-h-[120px]" placeholder="Tell us about your needs..." required />
                </div>
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Send Message</Button>
              </form>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-sm text-gray-600">hello@scanvault.co.uk</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-sm text-gray-600">020 7946 0958</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Address</h3>
                    <p className="text-sm text-gray-600">ScanVault Ltd<br />71-75 Shelton Street<br />London WC2H 9JQ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
