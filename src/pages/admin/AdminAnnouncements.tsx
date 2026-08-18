import React, { useState } from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/services/db';
import { Bell, Plus, Edit2, Trash2, Pin, Image as ImageIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Announcement } from '@/types/union';

export const AdminAnnouncements: React.FC = () => {
  const { announcements } = useUnionData();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('General');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingItem(null);
    setTitle('');
    setContent('');
    setCategory('General');
    setDate(new Date().toISOString().split('T')[0]);
    setImageUrl('');
    setIsPinned(false);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: Announcement) => {
    setEditingItem(item);
    setTitle(item.title);
    setContent(item.content);
    setCategory(item.category);
    setDate(item.date);
    setImageUrl(item.imageUrl || '');
    setIsPinned(item.isPinned);
    setDialogOpen(true);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await updateAnnouncement(editingItem.id, {
          title,
          content,
          category,
          date,
          imageUrl: imageUrl || undefined,
          isPinned,
        });
        toast.success('Announcement updated successfully');
      } else {
        await createAnnouncement({
          title,
          content,
          category,
          date,
          imageUrl: imageUrl || undefined,
          isPinned,
        });
        toast.success('Announcement created successfully');
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error('Failed to save announcement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteAnnouncement(id);
      toast.success('Announcement deleted');
    }
  };

  const filtered = announcements.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-500" />
            Manage Announcements
          </h1>
          <p className="text-xs text-slate-400">Publish notices, pin urgent alerts, and update circulars</p>
        </div>
        <Button onClick={handleOpenNew} className="rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white text-xs h-10 px-4 gap-2">
          <Plus className="w-4 h-4" /> Create Announcement
        </Button>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-4">
        <Search className="w-4 h-4 text-slate-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search announcements by title or content..."
          className="bg-transparent border-0 text-white text-xs placeholder:text-slate-500 focus-visible:ring-0 p-0"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600/30 text-blue-300 border-blue-500/30 text-[10px] font-bold">{item.category}</Badge>
                {item.isPinned && <Badge className="bg-amber-500 text-slate-950 text-[10px] font-extrabold">Pinned</Badge>}
              </div>
              <span className="text-[11px] text-slate-500">{item.date}</span>
            </div>

            <h3 className="font-bold text-white text-base leading-snug">{item.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2">{item.content}</p>

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

      {/* Modal Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl rounded-3xl bg-slate-900 border-slate-800 text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-white">
              {editingItem ? 'Edit Announcement' : 'Create New Announcement'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Arts Fest TARANG 2026 Schedule"
                required
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white text-xs h-10 px-3"
                >
                  <option value="General">General</option>
                  <option value="Academic">Academic</option>
                  <option value="Arts">Arts</option>
                  <option value="Sports">Sports</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Election">Election</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Publish Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Content / Details</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full details of the circular..."
                rows={4}
                required
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Announcement Image (Optional)</label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:text-xs"
                />
                {imageUrl && (
                  <Button type="button" size="sm" variant="ghost" onClick={() => setImageUrl('')} className="text-xs text-rose-400">
                    Remove
                  </Button>
                )}
              </div>
              {imageUrl && (
                <div className="h-28 w-44 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isPinned"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
              />
              <label htmlFor="isPinned" className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Pin className="w-3.5 h-3.5 text-amber-400" /> Pin as Important Banner
              </label>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="text-xs text-slate-400">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 px-6">
                {saving ? 'Saving...' : 'Save Announcement'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};