import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authenticateAdmin, getAuthSession } from '@/services/db';
import { useUnionData } from '@/hooks/useUnionData';
import { Shield, Lock, User, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useUnionData();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAuthSession().then(session => {
      if (session.authenticated) {
        navigate('/admin/dashboard');
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const res = await authenticateAdmin(username, password);
      if (res.success) {
        toast.success(`Welcome back, ${res.username}!`);
        navigate('/admin/dashboard');
      } else {
        toast.error(res.error || 'Authentication failed');
      }
    } catch (err) {
      toast.error('An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-xl mb-2">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Union Admin Control Portal
          </h1>
          <p className="text-xs text-slate-400">
            {settings?.unionName || 'RSA Students Union'} • Authorized Personnel Only
          </p>
        </div>

        {/* Login Card */}
        <Card className="rounded-3xl border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" /> Username
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="rounded-xl bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 h-11 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" /> Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  required
                  className="rounded-xl bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 h-11 text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 text-xs gap-2 shadow-lg shadow-blue-600/30 mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'} <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* Default Initial Credentials Notice */}
            <div className="mt-6 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
                <KeyRound className="w-3.5 h-3.5" /> Initial Admin Setup Credentials:
              </div>
              <div className="text-[11px] text-slate-300 font-mono space-y-0.5 pt-1">
                <div>Username: <span className="text-white font-bold">admin</span></div>
                <div>Password: <span className="text-white font-bold">RSA@Admin2026!</span></div>
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                * You can change these credentials anytime from Account Settings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to public link */}
        <div className="text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Return to Public Union Chronicle
          </Link>
        </div>
      </div>
    </div>
  );
};