import React from 'react';
import { Link } from 'react-router-dom';
import { useUnionData } from '@/hooks/useUnionData';
import {
  Bell,
  Calendar,
  Users,
  Image,
  Award,
  FileText,
  Palette,
  ArrowRight,
  TrendingUp,
  Activity,
  PlusCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const AdminDashboard: React.FC = () => {
  const {
    announcements,
    events,
    gallery,
    achievements,
    documents,
    officeBearers,
    auditLogs,
    settings
  } = useUnionData();

  const statCards = [
    { label: 'Announcements', count: announcements.length, path: '/admin/announcements', icon: Bell, color: 'from-blue-600 to-indigo-600' },
    { label: 'Upcoming & Past Events', count: events.length, path: '/admin/events', icon: Calendar, color: 'from-indigo-600 to-purple-600' },
    { label: 'Office Bearers', count: officeBearers.length, path: '/admin/office-bearers', icon: Users, color: 'from-sky-600 to-blue-600' },
    { label: 'Gallery Photos', count: gallery.length, path: '/admin/gallery', icon: Image, color: 'from-pink-600 to-rose-600' },
    { label: 'Achievements', count: achievements.length, path: '/admin/achievements', icon: Award, color: 'from-amber-500 to-orange-600' },
    { label: 'Official Documents', count: documents.length, path: '/admin/documents', icon: FileText, color: 'from-emerald-600 to-teal-600' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-3 py-0.5 rounded-full text-xs font-bold border border-blue-400/30">
            <Activity className="w-3.5 h-3.5" /> Database Live & Synced
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome to {settings?.shortName || 'RSA Union'} Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Manage your student union content, announcements, events, photos, and executive members in real-time.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link to="/admin/announcements">
            <Button className="rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white text-xs h-10 gap-1.5 shadow-lg shadow-blue-600/30">
              <PlusCircle className="w-4 h-4" /> New Announcement
            </Button>
          </Link>
          <Link to="/admin/settings">
            <Button variant="outline" className="rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-white border-slate-700 text-xs h-10 gap-1.5">
              <Palette className="w-4 h-4" /> Change Logo & Info
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} to={stat.path} className="group">
              <Card className="rounded-3xl border-slate-800 bg-slate-950/60 hover:bg-slate-800/40 hover:border-slate-700 transition-all overflow-hidden">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                    <div className="text-3xl font-black text-white">{stat.count}</div>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-tr ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Real-time Audit Logs */}
      <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Recent Database Activity Logs
            </h2>
            <p className="text-xs text-slate-400">Audit trail of actions taken in the Union database</p>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {auditLogs.slice(0, 6).map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-md bg-blue-900/60 text-blue-300 font-mono text-[10px] font-bold">
                  {log.action}
                </span>
                <div>
                  <p className="font-semibold text-slate-200">{log.target}</p>
                  <p className="text-[11px] text-slate-500">By {log.performedBy} {log.details ? `• ${log.details}` : ''}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};