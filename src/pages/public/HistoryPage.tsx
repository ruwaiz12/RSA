import React from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { History, Award, CheckCircle, Calendar, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const HistoryPage: React.FC = () => {
  const { administrations, settings } = useUnionData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold">
          <History className="w-3.5 h-3.5" /> Heritage & Legacy
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Union Administration History
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Honoring past student council administrations, their flagship initiatives, and enduring legacy at {settings?.collegeName}.
        </p>
      </div>

      <div className="space-y-8">
        {administrations.map((adm, idx) => (
          <Card key={adm.id} className="rounded-3xl border border-slate-200 hover:shadow-xl transition-all overflow-hidden bg-white">
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <Badge className="bg-blue-500 text-white font-black text-xs uppercase mb-2">
                  Academic Year {adm.academicYear}
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{adm.themeTitle}</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-blue-300 font-semibold">Leadership Council #{administrations.length - idx}</span>
              </div>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Council Key Members */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">President / Chairman</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{adm.president}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">General Secretary</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{adm.generalSecretary}</p>
                </div>
                {adm.vicePresident && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Vice Chairperson</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{adm.vicePresident}</p>
                  </div>
                )}
                {adm.artsSecretary && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Arts Secretary</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{adm.artsSecretary}</p>
                  </div>
                )}
              </div>

              {/* Major Milestones */}
              {adm.majorMilestones && adm.majorMilestones.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" /> Key Milestones & Enduring Legacies
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {adm.majorMilestones.map((m, mIdx) => (
                      <div key={mIdx} className="flex items-start gap-2 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};