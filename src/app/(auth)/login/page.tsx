'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/providers/auth-provider';
import { demoAccounts } from '@/data/users';
import { Wrench, Building2, ShieldCheck, Car, Loader2 } from 'lucide-react';

const demoIcons: Record<string, React.ElementType> = {
  garage: Wrench,
  hire_company: Building2,
  insurance: ShieldCheck,
  dealership: Car,
};

const demoColours: Record<string, string> = {
  garage: 'hover:border-amber-300 hover:bg-amber-50',
  hire_company: 'hover:border-blue-300 hover:bg-blue-50',
  insurance: 'hover:border-purple-300 hover:bg-purple-50',
  dealership: 'hover:border-green-300 hover:bg-green-50',
};

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { login, resetPassword, isSupabase } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const demoType = searchParams.get('demo');
    if (demoType) {
      const account = demoAccounts.find(a => a.role === demoType || a.id === `demo-${demoType}`);
      if (account) {
        login(account.credentials.email, 'demo').then(success => {
          if (success) router.push('/dashboard');
        });
      }
    }
  }, [searchParams, login, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    } else {
      setError(isSupabase ? 'Invalid credentials.' : 'Invalid credentials. Try a demo account below.');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email address first.');
      return;
    }
    setResetLoading(true);
    setError('');
    const result = await resetPassword(email);
    setResetLoading(false);
    if (result.success) {
      setResetSent(true);
    } else {
      setError(result.error || 'Failed to send reset email.');
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    const success = await login(demoEmail, 'demo');
    if (success) router.push('/dashboard');
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Sign In</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {isSupabase ? 'Enter your credentials to sign in' : 'Enter your credentials or try a demo account'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.co.uk" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {resetSent && <p className="text-sm text-teal-600">Password reset link sent — check your email.</p>}
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Sign In</Button>
          {isSupabase && (
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="w-full text-sm text-gray-500 hover:text-teal-600 transition-colors flex items-center justify-center gap-1"
            >
              {resetLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              Forgot password?
            </button>
          )}
        </form>

        <div className="text-center mt-4">
          <Link href="/register" className="text-sm text-teal-600 hover:underline">Create an account</Link>
        </div>

        {!isSupabase && (
          <>
            <div className="relative my-6">
              <Separator />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-gray-400">
                Or try a demo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {demoAccounts.map(account => {
                const Icon = demoIcons[account.role] || Wrench;
                return (
                  <button
                    key={account.id}
                    onClick={() => handleDemoLogin(account.credentials.email)}
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all ${demoColours[account.role] || ''}`}
                  >
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">{account.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
