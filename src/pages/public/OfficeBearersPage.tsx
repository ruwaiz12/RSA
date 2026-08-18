import React from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { Users, Phone, Mail, Instagram, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const OfficeBearersPage: React.FC = () => {
  const { officeBearers, settings } = useUnionData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" /> Student Council Executive Body
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Office Bearers ({settings?.academicYear})
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Meet the elected and appointed representatives leading {settings?.unionName}. Reach out anytime for assistance or initiatives.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {officeBearers.map((bearer, idx) => (
          <Card key={bearer.id} className="rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all overflow-hidden bg-white group flex flex-col">
            <div className="p-6 flex flex-col items-center text-center space-y-4 flex-1">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg">
                  <img
                    src={bearer.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                    alt={bearer.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow">
                  #{idx + 1}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{bearer.name}</h3>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-extrabold">
                  {bearer.position}
                </Badge>
              </div>

              <div className="text-xs text-slate-500 space-y-0.5">
                <p className="font-semibold text-slate-700">{bearer.department}</p>
                <p className="text-[11px] text-slate-400">{bearer.yearOfStudy}</p>
              </div>

              {bearer.bio && (
                <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-2xl leading-relaxed border border-slate-100">
                  "{bearer.bio}"
                </p>
              )}
            </div>

            {/* Contact row */}
            <div className="bg-slate-50 border-t border-slate-100 p-3 flex items-center justify-around text-xs text-slate-600">
              {bearer.email && (
                <a href={`mailto:${bearer.email}`} className="hover:text-blue-600 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-500" /> Email
                </a>
              )}
              {bearer.phone && (
                <a href={`tel:${bearer.phone}`} className="hover:text-blue-600 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" /> Call
                </a>
              )}
              {bearer.instagram && (
                <a href={`https://instagram.com/${bearer.instagram}`} target="_blank" rel="noreferrer" className="hover:text-pink-600 flex items-center gap-1">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" /> Insta
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};