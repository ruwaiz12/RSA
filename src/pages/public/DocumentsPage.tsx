import React from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { FileText, Download, FileCheck, Shield, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const DocumentsPage: React.FC = () => {
  const { documents } = useUnionData();

  const handleDownload = (doc: typeof documents[0]) => {
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = `${doc.title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold">
          <FileCheck className="w-3.5 h-3.5" /> Official Repository
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Union Documents & Bylaws
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Official PDFs, bylaws, constitutions, budget audit statements, and application forms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => (
          <Card key={doc.id} className="rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden bg-white">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800 text-[10px] font-extrabold">{doc.fileType}</Badge>
                  {doc.isOfficial && (
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold">Verified Official</Badge>
                  )}
                  <span className="text-[11px] text-slate-400 ml-auto">{doc.fileSize}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{doc.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{doc.description}</p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Published {doc.publishDate}</span>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(doc)}
                    className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-4 gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};