import React from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { CalendarRange, CheckCircle2, Clock, Calendar, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const YearPlanPage: React.FC = () => {
  const { yearPlan, settings } = useUnionData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold">
          <CalendarRange className="w-3.5 h-3.5" /> Action Plan & Roadmap
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Activity Year Plan ({settings?.academicYear})
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          The roadmap of planned events, academic summits, sports tourneys, and student welfare initiatives for the academic term.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {yearPlan.map((item) => (
          <Card key={item.id} className="rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden bg-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] font-bold border-blue-200 bg-blue-50 text-blue-700">
                  {item.category}
                </Badge>
                <Badge className={`text-[10px] font-extrabold ${
                  item.status === 'Completed' ? 'bg-emerald-600 text-white' : item.status === 'In Progress' ? 'bg-amber-500 text-slate-950' : 'bg-blue-600 text-white'
                }`}>
                  {item.status}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{item.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" /> {item.month}
                  </span>
                  {item.coordinator && (
                    <span className="text-blue-700 font-semibold">Led by {item.coordinator}</span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};