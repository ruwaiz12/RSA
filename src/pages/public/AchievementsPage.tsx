import React from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { Award, Trophy, Star, Medal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const AchievementsPage: React.FC = () => {
  const { achievements } = useUnionData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3.5 py-1 rounded-full text-xs font-bold">
          <Trophy className="w-3.5 h-3.5" /> Laurels & Accomplishments
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Hall of Achievements
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Honoring outstanding accomplishments by our students, teams, and union council in arts, athletics, technology, and academia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((item) => (
          <Card key={item.id} className="rounded-3xl border border-slate-200 hover:border-amber-300 hover:shadow-xl transition-all overflow-hidden bg-white flex flex-col group">
            {item.imageUrl && (
              <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-amber-500 text-slate-950 font-extrabold text-[10px] shadow-md flex items-center gap-1">
                    <Medal className="w-3 h-3" /> {item.badgeTag}
                  </Badge>
                </div>
              </div>
            )}
            <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-bold border-amber-200 bg-amber-50 text-amber-800">
                    {item.recipientCategory} Award
                  </Badge>
                  <span className="text-xs text-slate-400">{item.awardDate}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-amber-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-slate-700">Recipient: {item.recipientName}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};