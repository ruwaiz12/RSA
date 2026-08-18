import React, { useState } from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { Calendar, Clock, MapPin, Search, ExternalLink, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const EventsPage: React.FC = () => {
  const { events } = useUnionData();
  const [statusFilter, setStatusFilter] = useState<'All' | 'Upcoming' | 'Ongoing' | 'Completed'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = events.filter(e => {
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.description.toLowerCase().includes(searchTerm.toLowerCase()) || e.venue.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 px-3.5 py-1 rounded-full text-xs font-bold">
          <Calendar className="w-3.5 h-3.5" /> Campus Festivities & Programs
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Union Events Schedule
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Discover all upcoming college fests, inter-departmental tournaments, academic conclaves, and cultural nights.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events or venues..."
            className="pl-10 rounded-xl bg-slate-50 border-slate-200 text-xs h-10"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {(['All', 'Upcoming', 'Ongoing', 'Completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed text-slate-400 text-xs">
          No events found for this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card key={item.id} className="rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all overflow-hidden flex flex-col group bg-white">
              {item.imageUrl && (
                <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 right-3">
                    <Badge className={`text-[10px] font-extrabold shadow-md ${
                      item.status === 'Upcoming' ? 'bg-emerald-600 text-white' : item.status === 'Ongoing' ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-white'
                    }`}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              )}
              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] font-bold border-indigo-200 bg-indigo-50 text-indigo-700">
                      {item.category}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-900">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{item.venue}</span>
                  </div>

                  {item.registrationUrl && (
                    <div className="pt-2">
                      <a href={item.registrationUrl} target="_blank" rel="noreferrer">
                        <Button size="sm" className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 gap-1.5">
                          Register Now <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};