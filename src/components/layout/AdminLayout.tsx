import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { getAuthSession, logoutAdmin } from '@/services/db';
import { useUnionData } from '@/hooks/useUnionData';
import {
  LayoutDashboard,
  Bell,
  Calendar,
  Image as ImageIcon,
  Award,
  FileText,
  Users,
  History,
  CalendarRange,
  Palette,
  KeyRound,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useUnionData();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getAuthSession().then(session => {
      if (!session.authenticated) {
        navigate('/admin');
      } else {
        setCurrentUser(session.username || 'Admin');
      }
    });
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    await logoutAdmin();
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Announcements', path: '/admin/announcements', icon: Bell },
    { label: 'Events', path: '/admin/events', icon: Calendar },
    { label: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { label: 'Office Bearers', path: '/admin/office-bearers', icon: Users },
    { label: 'Year Plan', path: '/admin/year-plan', icon: CalendarRange },
    { label: 'Achievements', path: '/admin/achievements', icon: Award },
    { label: 'Documents', path: '/admin/documents', icon: FileText },
    { label: 'Administrations', path: '/admin/administrations', icon: History },
    { label: 'Branding & Logo', path: '/admin/settings', icon: Palette },
    { label: 'Account Settings', path: '/admin/account', icon: KeyRound },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-950 border-r border-slate-800 fixed inset-y-0 z-30">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-blue-600/20 p-1 flex items-center justify-center ring-2 ring-blue-500/30">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            )}
          </div>
          <div className="flex-1 truncate">
            <h2 className="font-extrabold text-sm text-white tracking-tight truncate">{settings?.shortName || 'RSA Union'}</h2>
            <span className="text-[11px] text-blue-400 font-semibold">Admin Workspace</span>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            <span>Live Public App</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl h-9 px-3 gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative w-72 bg-slate-950 flex flex-col h-full z-10 p-4 border-r border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-sm text-white">RSA Admin</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full rounded-xl border-slate-800 text-rose-400 hover:bg-rose-950/40 text-xs font-bold"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs text-slate-400">Connected to</span>
              <h2 className="text-sm font-bold text-white leading-none mt-0.5">{settings?.unionName}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 flex items-center gap-2 border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>Admin: <strong className="text-white font-bold">{currentUser}</strong></span>
            </div>
            <Link to="/" target="_blank" rel="noreferrer">
              <Button size="sm" variant="outline" className="rounded-xl border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs h-9 gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> View Public Site
              </Button>
            </Link>
          </div>
        </header>

        {/* Child Views */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};