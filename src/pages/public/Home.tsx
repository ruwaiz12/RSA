import React from 'react';
import { Link } from 'react-router-dom';
import { useUnionData } from '@/hooks/useUnionData';
import { 
  Bell, 
  Calendar, 
  Award, 
  Users, 
  ArrowRight, 
  CalendarRange, 
  Sparkles, 
  MapPin, 
  Clock, 
  FileText, 
  Image as ImageIcon,
  CheckCircle2,
  ChevronRight,
  Flame,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const Home: React.FC = () => {
  const { 
    settings, 
    announcements, 
    events, 
    officeBearers, 
    achievements, 
    gallery, 
    yearPlan,
    loading 
  } = useUnionData();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">Loading Union Chronicle database...</p>
      </div>
    );
  }

  const pinnedAnnouncements = announcements.filter(a => a.isPinned);
  const regularAnnouncements = announcements.filter(a => !a.isPinned).slice(0, 3);
  const upcomingEvents = events.filter(e => e.status === 'Upcoming' || e.status === 'Ongoing').slice(0, 3);
  const keyBearers = officeBearers.slice(0, 4);
  const recentGallery = gallery.slice(0, 6);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-sky-300 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Official Student Portal • Academic Session {settings?.academicYear}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Welcome to <br />
              <span className="bg-gradient-to-r from-sky-400 via-blue-200 to-indigo-300 bg-clip-text text-transparent">
                {settings?.unionName || 'RSA Students Union'}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              {settings?.tagline || 'Leading with integrity, fostering student talents, and building a united campus community.'}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link to="/announcements">
                <Button className="rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 text-sm h-11 px-6 gap-2">
                  <Bell className="w-4 h-4" /> Announcements
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="outline" className="rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white border-white/20 text-sm h-11 px-6 gap-2">
                  <Calendar className="w-4 h-4" /> View Events
                </Button>
              </Link>
              <Link to="/office-bearers">
                <Button variant="ghost" className="rounded-xl font-semibold text-slate-300 hover:text-white hover:bg-white/10 text-sm h-11 px-4 gap-1">
                  Meet the Council <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center lg:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">{announcements.length}</div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Notices Issued</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">{events.length}</div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Campus Events</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">{officeBearers.length}</div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Council Bearers</div>
              </div>
            </div>
          </div>

          {/* Dynamic Logo / Union Crest Showcase */}
          <div className="relative group">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl p-3 bg-gradient-to-tr from-blue-500/30 to-indigo-500/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center relative shadow-inner">
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.unionName}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Shield className="w-16 h-16 text-blue-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">{settings?.shortName}</span>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-center">
                  <p className="text-xs font-bold text-white tracking-wide">{settings?.collegeName}</p>
                  <p className="text-[10px] text-blue-300 font-medium">Council Year {settings?.academicYear}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pinned / Urgent Announcements Banner */}
      {pinnedAnnouncements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 shrink-0 font-bold">
                <Flame className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase">Pinned Circular</Badge>
                  <span className="text-xs text-slate-500 font-medium">{pinnedAnnouncements[0].date}</span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                  {pinnedAnnouncements[0].title}
                </h2>
                <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                  {pinnedAnnouncements[0].content}
                </p>
              </div>
            </div>
            <Link to="/announcements" className="shrink-0 w-full sm:w-auto">
              <Button size="sm" variant="default" className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold">
                Read Notice <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Section 1: Latest Announcements & Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Announcements list (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Bell className="w-6 h-6 text-blue-600" />
                  Latest Announcements
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Official circulars, schedules, and alerts</p>
              </div>
              <Link to="/announcements">
                <Button variant="ghost" size="sm" className="text-blue-600 font-bold text-xs gap-1">
                  View All ({announcements.length}) <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((item) => (
                <Card key={item.id} className="border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all rounded-2xl overflow-hidden group">
                  <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start">
                    {item.imageUrl && (
                      <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-bold border-blue-200 bg-blue-50 text-blue-700">
                          {item.category}
                        </Badge>
                        {item.isPinned && (
                          <Badge className="text-[10px] bg-amber-500 text-slate-950 font-bold">Important</Badge>
                        )}
                        <span className="text-[11px] text-slate-400 ml-auto">{item.date}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right: Upcoming Events (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                  Upcoming Events
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Campus festivities, sports & workshops</p>
              </div>
              <Link to="/events">
                <Button variant="ghost" size="sm" className="text-indigo-600 font-bold text-xs gap-1">
                  All Events <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((evt) => (
                  <div key={evt.id} className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] font-bold">
                          {evt.category}
                        </Badge>
                        <h3 className="font-bold text-slate-900 text-sm mt-1">{evt.title}</h3>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {evt.status}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2 truncate">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center bg-white rounded-2xl border border-dashed text-slate-400 text-xs">
                  No upcoming events scheduled right now. Check back soon!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Office Bearers Spotlight */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-widest">
                <Users className="w-4 h-4" /> Union Leadership
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white mt-1">
                Office Bearers {settings?.academicYear}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Dedicated student leaders working round the clock to represent your voice, organize campus events, and uphold student welfare.
              </p>
            </div>
            <Link to="/office-bearers">
              <Button className="rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white text-xs h-10 px-5 gap-2">
                Full Executive Council <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyBearers.map((bearer) => (
              <div
                key={bearer.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-blue-400/50 hover:bg-white/15 transition-all group flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-blue-400 to-indigo-400 mb-4 shadow-xl">
                  <img
                    src={bearer.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                    alt={bearer.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-bold text-white text-base leading-tight">{bearer.name}</h3>
                <span className="text-xs font-semibold text-blue-300 mt-1 bg-blue-500/20 px-3 py-0.5 rounded-full">
                  {bearer.position}
                </span>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">{bearer.department}</p>
                <p className="text-[11px] text-slate-300/80 mt-2 line-clamp-2 italic">
                  "{bearer.bio || 'Serving the student community with dedication.'}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Year Plan & Achievements Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Year Plan Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                  <CalendarRange className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Activity Year Plan</h3>
                  <p className="text-xs text-slate-500">Upcoming flagship initiatives</p>
                </div>
              </div>
              <Link to="/year-plan">
                <Button variant="ghost" size="sm" className="text-blue-600 font-bold text-xs">
                  Full Plan <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3 pt-2">
              {yearPlan.slice(0, 4).map((yp) => (
                <div key={yp.id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-blue-50/50 transition-colors">
                  <div className="p-1.5 rounded-xl bg-white text-blue-600 shadow-sm shrink-0 mt-0.5">
                    <CheckCircle2 className={`w-4 h-4 ${yp.status === 'Completed' ? 'text-emerald-500' : 'text-blue-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{yp.title}</span>
                      <span className="text-[10px] font-semibold text-slate-500">{yp.month}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{yp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Pride & Laurels</h3>
                  <p className="text-xs text-slate-500">Honoring outstanding triumphs</p>
                </div>
              </div>
              <Link to="/achievements">
                <Button variant="ghost" size="sm" className="text-amber-600 font-bold text-xs">
                  All Laurels <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3 pt-2">
              {achievements.slice(0, 3).map((ach) => (
                <div key={ach.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  {ach.imageUrl && (
                    <img src={ach.imageUrl} alt={ach.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="flex-1">
                    <Badge className="bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase">
                      {ach.badgeTag}
                    </Badge>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{ach.title}</h4>
                    <p className="text-[11px] text-slate-500">{ach.recipientName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Recent Moments / Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-pink-600" />
              Campus Moments & Gallery
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Capturing celebrations, fests & memories</p>
          </div>
          <Link to="/gallery">
            <Button variant="ghost" size="sm" className="text-pink-600 font-bold text-xs gap-1">
              Explore Gallery <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {recentGallery.map((item) => (
            <Link
              key={item.id}
              to="/gallery"
              className="group relative h-40 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-white line-clamp-1">{item.title}</span>
                <span className="text-[9px] text-pink-300 font-medium">{item.category}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 5: Documents & Transparency Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <Badge className="bg-white/20 text-white font-bold text-xs">Official Transparency</Badge>
            <h3 className="text-2xl font-black">Official Union Documents & Constitution</h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Access the codified Union bylaws, committee regulations, budget allocations, and event registration forms directly from our repository.
            </p>
          </div>
          <Link to="/documents" className="shrink-0">
            <Button size="lg" className="rounded-2xl font-bold bg-white hover:bg-slate-100 text-blue-700 shadow-lg text-sm px-6 gap-2">
              <Download className="w-4 h-4" /> Browse Document Vault
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};