import React, { useState } from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { createYearPlanItem, updateYearPlanItem, deleteYearPlanItem } from '@/services/db';
import { CalendarRange, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { YearPlanItem } from '@/types/union';

export const AdminYearPlan: React.FC = () => {
  const { yearPlan } = useUnionData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<YearPlanItem | null>(null);

  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('April 2026');
  const [tentativeDate, setTentativeDate] = useState('2026-04-15');
  const [category, setCategory] = useState<YearPlanItem['category']>('Arts & Culture');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<YearPlanItem['status']>('Planned');
  const [coordinator, setCoordinator] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingItem(null);
    setTitle('');
    setMonth('April 2026');
    setTentativeDate('2026-04-15');
    setCategory('Arts & Culture');
    setDescription('');
    setStatus('Planned');
    setCoordinator('');
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: YearPlanItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setMonth(item.month);
    setTentativeDate(item.tentativeDate);
    setCategory(item.category);
    setDescription(item.description);
    setStatus(item.status);
    setCoordinator(item.coordinator || '');
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Activity title is required');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await updateYearPlanItem(editingItem.id, {
          title,
          month,
          tentativeDate,
          category,
          description,
          status,
          coordinator: coordinator || undefined,
        });
        toast.success('Year plan item updated');
      } else {
        await createYearPlanItem({
          title,
          month,
          tentativeDate,
          category,
          description,
          status,
          coordinator: coordinator || undefined,
        });
        toast.success('Year plan item added');
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error('Failed to save year plan item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete plan item "${name}"?`)) {
      await deleteYearPlanItem(id);
      toast.success('Item deleted');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CalendarRange className="w-6 h-6 text-blue-500" />
            Manage Activity Year Plan
          </h1>
          <p className="text-xs text-slate-400">Plan monthly programs, assign committee coordinators, and track execution</p>
        </div>
        <Button onClick={handleOpenNew} className="rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white text-xs h-10 px-4 gap-2">
          <Plus className="w-4 h-4" /> Add Activity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {yearPlan.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-950 text-blue-300 border-blue-800 text-[10px] font-bold">{item.category}</Badge>
                <Badge className={`text-[10px] font-extrabold ${
                  item.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.status}
                </Badge>
              </div>
              <h3 className="font-bold text-white text-base leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-400">{item.description}</p>
              <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                <span>Month: <strong className="text-slate-300">{item.month}</strong></span>
                {item.coordinator && <span>Lead: <strong className="text-blue-400">{item.coordinator}</strong></span>}
              </div>
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
              {editingItem ? 'Edit Year Plan Activity' : 'Add Activity to Year Plan'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Activity Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. College Cultural Fest 'TARANG 2026'"
                required
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Target Month</label>
                <Input
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="e.g. April 2026"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white text-xs h-10 px-3"
                >
                  <option value="Arts & Culture">Arts & Culture</option>
                  <option value="Sports">Sports</option>
                  <option value="Academics & Tech">Academics & Tech</option>
                  <option value="Social Service">Social Service</option>
                  <option value="Union Administration">Union Administration</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white text-xs h-10 px-3"
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Deferred">Deferred</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Coordinator / Committee</label>
                <Input
                  value={coordinator}
                  onChange={(e) => setCoordinator(e.target.value)}
                  placeholder="e.g. Arts Secretary"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Scope of work and event goals..."
                rows={3}
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="text-xs text-slate-400">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 px-6">
                {saving ? 'Saving...' : 'Save Plan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};