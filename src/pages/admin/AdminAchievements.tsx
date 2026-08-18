import React, { useState } from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { createAchievement, updateAchievement, deleteAchievement } from '@/services/db';
import { Award, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Achievement } from '@/types/union';

export const AdminAchievements: React.FC = () => {
  const { achievements } = useUnionData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientCategory, setRecipientCategory] = useState<Achievement['recipientCategory']>('Team');
  const [awardDate, setAwardDate] = useState(new Date().toISOString().split('T')[0]);
  const [badgeTag, setBadgeTag] = useState('First Prize - Gold');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setRecipientName('');
    setRecipientCategory('Team');
    setAwardDate(new Date().toISOString().split('T')[0]);
    setBadgeTag('First Prize - Gold');
    setImageUrl('');
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: Achievement) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setRecipientName(item.recipientName);
    setRecipientCategory(item.recipientCategory);
    setAwardDate(item.awardDate);
    setBadgeTag(item.badgeTag);
    setImageUrl(item.imageUrl || '');
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
    if (!title.trim() || !recipientName.trim()) {
      toast.error('Title and recipient are required');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await updateAchievement(editingItem.id, {
          title,
          description,
          recipientName,
          recipientCategory,
          awardDate,
          badgeTag,
          imageUrl: imageUrl || undefined,
        });
        toast.success('Achievement updated');
      } else {
        await createAchievement({
          title,
          description,
          recipientName,
          recipientCategory,
          awardDate,
          badgeTag,
          imageUrl: imageUrl || undefined,
        });
        toast.success('Achievement added');
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error('Failed to save achievement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete achievement "${name}"?`)) {
      await deleteAchievement(id);
      toast.success('Achievement deleted');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            Manage Laurels & Achievements
          </h1>
          <p className="text-xs text-slate-400">Highlight student awards, championship trophies, and honors</p>
        </div>
        <Button onClick={handleOpenNew} className="rounded-xl font-bold bg-amber-600 hover:bg-amber-500 text-white text-xs h-10 px-4 gap-2">
          <Plus className="w-4 h-4" /> Add Achievement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-950 text-amber-300 border-amber-800 text-[10px] font-bold">{item.badgeTag}</Badge>
                <span className="text-[10px] text-slate-500">{item.awardDate}</span>
              </div>
              <h3 className="font-bold text-white text-base leading-snug">{item.title}</h3>
              <p className="text-xs text-amber-300/90 font-medium">Recipient: {item.recipientName}</p>
              <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
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
              {editingItem ? 'Edit Achievement' : 'Add New Achievement'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Award Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Overall Champions - Youth Fest 2026"
                required
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Recipient Name / Team</label>
                <Input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. RSA Varsity Contingent"
                  required
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Badge Tag</label>
                <Input
                  value={badgeTag}
                  onChange={(e) => setBadgeTag(e.target.value)}
                  placeholder="e.g. First Prize - Gold"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Category</label>
                <select
                  value={recipientCategory}
                  onChange={(e) => setRecipientCategory(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white text-xs h-10 px-3"
                >
                  <option value="Student">Student</option>
                  <option value="Team">Team</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Union Body">Union Body</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Date Awarded</label>
                <Input
                  type="date"
                  value={awardDate}
                  onChange={(e) => setAwardDate(e.target.value)}
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of the victory and significance..."
                rows={3}
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Photo / Award Trophy Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageFile}
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
              />
              {imageUrl && (
                <div className="h-24 w-36 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 mt-2">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="text-xs text-slate-400">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs h-10 px-6">
                {saving ? 'Saving...' : 'Save Achievement'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};