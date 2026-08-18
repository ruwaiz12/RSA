import React, { useState } from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { Bell, Pin, Search, Filter, Calendar, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Announcement } from '@/types/union';

export const AnnouncementsPage: React.FC = () => {
  const { announcements, loading } = useUnionData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModal, setActiveModal] = useState<Announcement | null>(null);

  const categories = ['All', 'Urgent', 'General', 'Academic', 'Arts', 'Sports', 'Election'];

  const filtered = announcements.filter(a => {
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch = 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold">
          <Bell className="w-3.5 h-3.5" /> Official Communications
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Union Announcements & Circulars
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Stay updated with verified circulars, fest dates, union elections, and academic notices.
        </p>
      </div>

      {/* Search & Category Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search announcements..."
            className="pl-10 rounded-xl bg-slate-50 border-slate-200 text-xs h-10"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed text-slate-400 text-xs">
          No announcements match your search or filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <Card
              key={item.id}
              onClick={() => setActiveModal(item)}
              className={`rounded-3xl border transition-all cursor-pointer hover:shadow-lg overflow-hidden group ${
                item.isPinned ? 'border-amber-300 bg-amber-50/20 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-300'
              }`}
            >
              {item.imageUrl && (
                <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {item.isPinned && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                      <Pin className="w-3 h-3" /> Pinned
                    </div>
                  )}
                </div>
              )}
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-bold border-blue-200 bg-blue-50 text-blue-700">
                    {item.category}
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.content}
                </p>

                <div className="pt-2 flex items-center text-xs font-bold text-blue-600">
                  Read Full Notice →
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Dialog for full view */}
      <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-2xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
          {activeModal && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600 text-white text-xs">{activeModal.category}</Badge>
                {activeModal.isPinned && <Badge className="bg-amber-500 text-slate-950 text-xs font-bold">Important</Badge>}
                <span className="text-xs text-slate-400 ml-auto">{activeModal.date}</span>
              </div>

              <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {activeModal.title}
              </DialogTitle>

              {activeModal.imageUrl && (
                <div className="rounded-2xl overflow-hidden bg-slate-100 max-h-80">
                  <img src={activeModal.imageUrl} alt={activeModal.title} className="w-full h-full object-cover" />
                </div>
              )}

              <DialogDescription className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {activeModal.content}
              </DialogDescription>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};