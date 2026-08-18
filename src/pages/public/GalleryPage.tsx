import React, { useState } from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { Image as ImageIcon, Sparkles, X, Calendar, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { GalleryItem } from '@/types/union';

export const GalleryPage: React.FC = () => {
  const { gallery } = useUnionData();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Arts Fest', 'Sports Meet', 'Campus Life', 'Inauguration', 'Workshops', 'Celebrations'];

  const filtered = gallery.filter(g => activeCategory === 'All' || g.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 px-3.5 py-1 rounded-full text-xs font-bold">
          <ImageIcon className="w-3.5 h-3.5" /> Media & Campus Chronicles
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Union Photo Gallery
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Relive landmark festivities, sports triumphs, cultural showcases, and student union memories.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-pink-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPhoto(item)}
            className="group relative h-64 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-sm hover:shadow-xl transition-all"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-white">
              <Badge className="bg-pink-500 text-white text-[9px] w-fit mb-1 font-bold">
                {item.category}
              </Badge>
              <h3 className="font-bold text-sm leading-snug">{item.title}</h3>
              {item.caption && <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{item.caption}</p>}
              <span className="text-[10px] text-pink-300 mt-1">{item.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800" onClick={(e) => e.stopPropagation()}>
            <div className="max-h-[70vh] bg-black flex items-center justify-center">
              <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} className="max-h-[70vh] w-auto object-contain" />
            </div>
            <div className="p-6 text-white space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-pink-600 text-white text-xs">{selectedPhoto.category}</Badge>
                <span className="text-xs text-slate-400">{selectedPhoto.date}</span>
              </div>
              <h2 className="text-xl font-bold">{selectedPhoto.title}</h2>
              {selectedPhoto.caption && <p className="text-sm text-slate-300">{selectedPhoto.caption}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};