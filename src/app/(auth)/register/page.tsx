'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/providers/auth-provider';
import { Loader2, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const { signup, isSupabase } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [accountType, setAccountType] = useState('garage');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSupabase) {
      setSuccess(true);
      return;
    }

    setLoading(true);
    const result = await signup(
      email,
      password,
      `${firstName} ${lastName}`.trim(),
      accountType,
      companyName || undefined
    );
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-teal-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isSupabase ? 'Check Your Email' : 'Account Requested'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isSupabase
              ? `We've sent a confirmation link to ${email}. Click the link to activate your account.`
              : 'Thank you for your interest in ScanVault. In this demo, account creation is simulated. Try one of our demo accounts to explore the platform.'
            }
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <Input placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <Input placeholder="Smith" value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input type="email" placeholder="john@company.co.uk" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <Input placeholder="Your company" value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm" value={accountType} onChange={e => setAccountType(e.target.value)}>
              <option value="individual">Individual</option>
              <option value="garage">Garage / Service Centre</option>
              <option value="hire_company">Hire Company</option>
              <option value="dealership">Dealership</option>
              <option value="insurance">Insurance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <Input type="password" placeholder="Create a password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <Link href="/login" className="text-teal-600 hover:underline">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  );
}
