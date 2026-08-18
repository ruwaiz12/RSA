import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUnionData } from '@/hooks/useUnionData';
import { PhoneShareModal } from '@/components/common/PhoneShareModal';
import { 
  Menu, 
  X, 
  Shield, 
  Bell, 
  Calendar, 
  Image, 
  Award, 
  FileText, 
  Users, 
  History, 
  CalendarRange, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PublicHeader: React.FC = () => {
  const { settings } = useUnionData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/', icon: Sparkles },
    { label: 'Announcements', path: '/announcements', icon: Bell },
    { label: 'Events', path: '/events', icon: Calendar },
    { label: 'Gallery', path: '/gallery', icon: Image },
    { label: 'Office Bearers', path: '/office-bearers', icon: Users },
    { label: 'Year Plan', path: '/year-plan', icon: CalendarRange },
    { label: 'Achievements', path: '/achievements', icon: Award },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'History', path: '/history', icon: History },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-sm">
        {/* Top micro-bar */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
            <div className="flex items-center gap-2 truncate">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold">{settings?.collegeName || 'Royal Science & Arts College'}</span>
              <span className="hidden sm:inline text-blue-200">•</span>
              <span className="hidden sm:inline text-blue-100">Academic Year {settings?.academicYear || '2025-2026'}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPhoneModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-full text-xs text-white transition-all cursor-pointer"
              >
                <Smartphone className="w-3 h-3 text-sky-300" />
                <span>Open on Phone</span>
              </button>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-full text-xs text-white transition-all"
              >
                <Shield className="w-3 h-3 text-amber-300" />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Union Brand with Live Dynamic Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-2xl overflow-hidden shadow-md ring-2 ring-blue-600/20 group-hover:ring-blue-600/50 transition-all bg-slate-100 flex items-center justify-center">
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.unionName}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Shield className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none group-hover:text-blue-600 transition-colors">
                  {settings?.shortName || 'RSA UNION'}
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wider">
                  Chronicle
                </span>
              </div>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Quick CTA & Mobile Menu Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPhoneModalOpen(true)}
                className="hidden md:inline-flex rounded-xl border-slate-200 hover:bg-slate-100 text-slate-700 text-xs h-9 px-3 gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                Phone QR
              </Button>

              <Link to="/announcements" className="hidden sm:inline-flex">
                <Button size="sm" className="rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-xs h-9 px-3.5 gap-1.5">
                  <Bell className="w-3.5 h-3.5 animate-bounce" />
                  Alerts
                </Button>
              </Link>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setPhoneModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-slate-600 font-semibold p-2"
              >
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Share to Phone</span>
              </button>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold p-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* QR Share Modal */}
      <PhoneShareModal open={phoneModalOpen} onOpenChange={setPhoneModalOpen} />
    </>
  );
};