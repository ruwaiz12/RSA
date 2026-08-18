import React, { useState } from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { createGalleryItem, updateGalleryItem, deleteGalleryItem } from '@/services/db';
import { Image as ImageIcon, Plus, Trash2, Edit2, Upload, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { GalleryItem } from '@/types/union';

export const AdminGallery: React.FC = () => {
  const { gallery } = useUnionData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('Arts Fest');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingItem(null);
    setTitle('');
    setCaption('');
    setCategory('Arts Fest');
    setImageUrl('');
    setDate(new Date().toISOString().split('T')[0]);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCaption(item.caption || '');
    setCategory(item.category);
    setImageUrl(item.imageUrl);
    setDate(item.date);
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
    if (!title.trim() || !imageUrl.trim()) {
      toast.error('Photo title and image are required');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await updateGalleryItem(editingItem.id, {
          title,
          caption: caption || undefined,
          category,
          imageUrl,
          date,
        });
        toast.success('Gallery photo updated');
      } else {
        await createGalleryItem({
          title,
          caption: caption || undefined,
          category,
          imageUrl,
          date,
        });
        toast.success('Gallery photo uploaded');
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error('Failed to save gallery item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete photo "${name}"?`)) {
      await deleteGalleryItem(id);
      toast.success('Photo removed from gallery');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-pink-500" />
            Media & Gallery Manager
          </h1>
          <p className="text-xs text-slate-400">Upload campus photos, add captions, and organize album categories</p>
        </div>
        <Button onClick={handleOpenNew} className="rounded-xl font-bold bg-pink-600 hover:bg-pink-500 text-white text-xs h-10 px-4 gap-2">
          <Upload className="w-4 h-4" /> Upload Photo
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="rounded-2xl bg-slate-950/60 border border-slate-800 overflow-hidden flex flex-col group">
            <div className="h-44 w-full bg-slate-900 relative">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <Badge className="absolute top-2 left-2 bg-pink-600/80 backdrop-blur-sm text-white text-[9px]">
                {item.category}
              </Badge>
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h4 className="font-bold text-xs text-white line-clamp-1">{item.title}</h4>
                {item.caption && <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{item.caption}</p>}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500">{item.date}</span>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleOpenEdit(item)} className="h-7 w-7 text-slate-300">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id, item.title)} className="h-7 w-7 text-rose-400 hover:bg-rose-950/30">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl bg-slate-900 border-slate-800 text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-white">
              {editingItem ? 'Edit Photo Details' : 'Upload Gallery Photo'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Photo Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Inauguration Ceremony 2026"
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
                  <option value="Arts Fest">Arts Fest</option>
                  <option value="Sports Meet">Sports Meet</option>
                  <option value="Campus Life">Campus Life</option>
                  <option value="Inauguration">Inauguration</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Celebrations">Celebrations</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Event Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Caption (Optional)</label>
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Brief description of the captured moment..."
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Select Image File</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageFile}
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
              />
              {imageUrl && (
                <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-800 border border-slate-700 mt-2">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="text-xs text-slate-400">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs h-10 px-6">
                {saving ? 'Saving...' : 'Save to Gallery'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};