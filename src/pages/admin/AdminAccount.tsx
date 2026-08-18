import React, { useState } from 'react';
import { changeAdminCredentials } from '@/services/db';
import { KeyRound, ShieldAlert, Check, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export const AdminAccount: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error('Current password is required to verify authorization');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (!newUsername && !newPassword) {
      toast.error('Provide a new username or new password to update');
      return;
    }

    setSaving(true);
    try {
      const res = await changeAdminCredentials(
        currentPassword,
        newUsername || undefined,
        newPassword || undefined
      );

      if (res.success) {
        toast.success('Admin credentials updated successfully! Old credentials are now invalidated.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setNewUsername('');
      } else {
        toast.error(res.error || 'Failed to update credentials');
      }
    } catch (e) {
      toast.error('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-amber-500" />
          Admin Account Credentials
        </h1>
        <p className="text-xs text-slate-400">
          Change your administrator login username and password. Changes take effect immediately.
        </p>
      </div>

      <Card className="rounded-3xl border-slate-800 bg-slate-950/60 overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> Current Password (Required)
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password (e.g. RSA@Admin2026!)"
                required
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-11"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" /> New Admin Username (Optional)
                </label>
                <Input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Leave blank to keep existing"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" /> New Password (Optional)
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Confirm New Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-11"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs h-11 gap-2 shadow-lg shadow-amber-600/30"
              >
                {saving ? 'Updating Credentials...' : 'Update Admin Credentials'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};