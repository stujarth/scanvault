'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Requested</h1>
          <p className="text-gray-600 mb-6">Thank you for your interest in ScanVault. In this demo, account creation is simulated. Try one of our demo accounts to explore the platform.</p>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link href="/login">Go to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Create Account</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Start your 14-day free trial</p>

        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <Input placeholder="Your company" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
              <option value="individual">Individual</option>
              <option value="garage">Garage / Service Centre</option>
              <option value="hire">Hire Company</option>
              <option value="dealership">Dealership</option>
              <option value="insurance">Insurance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <Input type="password" placeholder="Create a password" required />
          </div>
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Create Account</Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <Link href="/login" className="text-teal-600 hover:underline">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  );
}
