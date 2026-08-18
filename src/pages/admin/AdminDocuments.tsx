import React, { useState } from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { createDocument, updateDocument, deleteDocument } from '@/services/db';
import { FileText, Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { UnionDocument } from '@/types/union';

export const AdminDocuments: React.FC = () => {
  const { documents } = useUnionData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UnionDocument | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState<UnionDocument['fileType']>('PDF');
  const [fileSize, setFileSize] = useState('1.2 MB');
  const [fileUrl, setFileUrl] = useState('');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [isOfficial, setIsOfficial] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setFileType('PDF');
    setFileSize('1.2 MB');
    setFileUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    setPublishDate(new Date().toISOString().split('T')[0]);
    setIsOfficial(true);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: UnionDocument) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setFileType(item.fileType);
    setFileSize(item.fileSize);
    setFileUrl(item.fileUrl);
    setPublishDate(item.publishDate);
    setIsOfficial(item.isOfficial);
    setDialogOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        toast.error('Document size must be under 15MB');
        return;
      }
      const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
      setFileSize(sizeStr);

      const reader = new FileReader();
      reader.onload = () => {
        setFileUrl(reader.result as string);
        toast.success(`File "${file.name}" loaded (${sizeStr})`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Document title is required');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await updateDocument(editingItem.id, {
          title,
          description,
          fileType,
          fileSize,
          fileUrl,
          publishDate,
          isOfficial,
        });
        toast.success('Document updated');
      } else {
        await createDocument({
          title,
          description,
          fileType,
          fileSize,
          fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          publishDate,
          isOfficial,
        });
        toast.success('Document published');
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error('Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete document "${name}"?`)) {
      await deleteDocument(id);
      toast.success('Document deleted');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-500" />
            Manage Official Documents & PDFs
          </h1>
          <p className="text-xs text-slate-400">Upload constitution amendments, budget statements, rules, and circulars</p>
        </div>
        <Button onClick={handleOpenNew} className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-10 px-4 gap-2">
          <Upload className="w-4 h-4" /> Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-[10px] font-bold">{item.fileType}</Badge>
                <span className="text-[10px] text-slate-500">{item.fileSize} • {item.publishDate}</span>
              </div>
              <h3 className="font-bold text-white text-base leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-400">{item.description}</p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800/80">
              <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(item)} className="text-xs text-slate-300 hover:text-white h-8 gap-1">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id, item.title)} className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 h-8 gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl bg-slate-900 border-slate-800 text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-white">
              {editingItem ? 'Edit Document Details' : 'Upload Official Document'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Document Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Union Constitution 2026"
                required
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">File Type</label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white text-xs h-10 px-3"
                >
                  <option value="PDF">PDF</option>
                  <option value="DOC">DOC</option>
                  <option value="NOTICE">NOTICE</option>
                  <option value="REPORT">REPORT</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Publish Date</label>
                <Input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of the document..."
                rows={3}
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Upload PDF/Document File</label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="text-xs text-slate-400">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 px-6">
                {saving ? 'Saving...' : 'Save Document'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};