'use client';

import { useAuth } from '@/providers/auth-provider';
import { getOrgById } from '@/data/organisations';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { user } = useAuth();
  if (!user) return null;

  const org = user.organisationId ? getOrgById(user.organisationId) : null;

  const roleLabels: Record<string, string> = {
    garage: 'Garage',
    hire_company: 'Hire Company',
    insurance: 'Insurance',
    dealership: 'Dealership',
    individual: 'Individual',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Account Details</h3>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input defaultValue={user.name} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input defaultValue={user.email} type="email" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm text-gray-700">{roleLabels[user.role] || user.role}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                <Badge className="bg-teal-50 text-teal-700 border-teal-200">Active — Demo</Badge>
              </div>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {org && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Organisation</h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organisation Name</label>
                  <Input defaultValue={org.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscription</label>
                  <Badge variant="secondary" className="capitalize">{org.subscription}</Badge>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <Input defaultValue={`${org.address}, ${org.postcode}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Default Grading Profile</h3>
          <p className="text-sm text-gray-500 mb-3">Choose the grading standard used for new scans.</p>
          <select className="w-full max-w-sm rounded-md border border-gray-200 bg-white px-3 py-2 text-sm" defaultValue={org?.defaultGradingProfile || 'private_sale'}>
            <option value="hire_checkout">Hire Checkout</option>
            <option value="hire_return">Hire Return</option>
            <option value="private_sale">Private Sale</option>
            <option value="garage_mot">Garage / MOT</option>
            <option value="insurance_claim">Insurance Claim</option>
          </select>
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-red-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-500 mb-4">These actions cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Delete Account</Button>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Export All Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
