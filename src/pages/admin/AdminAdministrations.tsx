import React, { useState } from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { createAdministration, updateAdministration, deleteAdministration } from '@/services/db';
import { History, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { AdministrationHistory } from '@/types/union';

export const AdminAdministrations: React.FC = () => {
  const { administrations } = useUnionData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdministrationHistory | null>(null);

  const [academicYear, setAcademicYear] = useState('2024 - 2025');
  const [themeTitle, setThemeTitle] = useState('');
  const [president, setPresident] = useState('');
  const [generalSecretary, setGeneralSecretary] = useState('');
  const [vicePresident, setVicePresident] = useState('');
  const [artsSecretary, setArtsSecretary] = useState('');
  const [milestonesText, setMilestonesText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingItem(null);
    setAcademicYear('2024 - 2025');
    setThemeTitle('');
    setPresident('');
    setGeneralSecretary('');
    setVicePresident('');
    setArtsSecretary('');
    setMilestonesText('');
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: AdministrationHistory) => {
    setEditingItem(item);
    setAcademicYear(item.academicYear);
    setThemeTitle(item.themeTitle);
    setPresident(item.president);
    setGeneralSecretary(item.generalSecretary);
    setVicePresident(item.vicePresident || '');
    setArtsSecretary(item.artsSecretary || '');
    setMilestonesText(item.majorMilestones ? item.majorMilestones.join('\n') : '');
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!academicYear.trim() || !president.trim()) {
      toast.error('Academic year and president name are required');
      return;
    }

    const milestones = milestonesText
      .split('\n')
      .map(m => m.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      if (editingItem) {
        await updateAdministration(editingItem.id, {
          academicYear,
          themeTitle,
          president,
          generalSecretary,
          vicePresident: vicePresident || undefined,
          artsSecretary: artsSecretary || undefined,
          majorMilestones: milestones,
        });
        toast.success('Administration record updated');
      } else {
        await createAdministration({
          academicYear,
          themeTitle,
          president,
          generalSecretary,
          vicePresident: vicePresident || undefined,
          artsSecretary: artsSecretary || undefined,
          majorMilestones: milestones,
        });
        toast.success('Administration record added');
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error('Failed to save administration history');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, year: string) => {
    if (confirm(`Delete administration record for "${year}"?`)) {
      await deleteAdministration(id);
      toast.success('Record deleted');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <History className="w-6 h-6 text-purple-500" />
            Manage Administration History
          </h1>
          <p className="text-xs text-slate-400">Record past student union leadership councils and achievements</p>
        </div>
        <Button onClick={handleOpenNew} className="rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white text-xs h-10 px-4 gap-2">
          <Plus className="w-4 h-4" /> Add Past Administration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {administrations.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-purple-950 text-purple-300 border-purple-800 text-[10px] font-bold">
                  {item.academicYear}
                </Badge>
              </div>
              <h3 className="font-bold text-white text-base leading-snug">{item.themeTitle}</h3>
              <div className="text-xs text-slate-400 space-y-1">
                <p>President: <strong className="text-slate-200">{item.president}</strong></p>
                <p>Gen Secretary: <strong className="text-slate-200">{item.generalSecretary}</strong></p>
              </div>
              {item.majorMilestones && (
                <p className="text-[11px] text-slate-500">{item.majorMilestones.length} milestones recorded</p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800/80">
              <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(item)} className="text-xs text-slate-300 hover:text-white h-8 gap-1">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id, item.academicYear)} className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 h-8 gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg rounded-3xl bg-slate-900 border-slate-800 text-white p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-white">
              {editingItem ? 'Edit Administration History' : 'Add Administration History'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Academic Year</label>
                <Input
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="e.g. 2024 - 2025"
                  required
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Council Theme / Motto</label>
                <Input
                  value={themeTitle}
                  onChange={(e) => setThemeTitle(e.target.value)}
                  placeholder="e.g. DHWANI: Echoing Every Voice"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">President / Chairman</label>
                <Input
                  value={president}
                  onChange={(e) => setPresident(e.target.value)}
                  placeholder="President full name"
                  required
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">General Secretary</label>
                <Input
                  value={generalSecretary}
                  onChange={(e) => setGeneralSecretary(e.target.value)}
                  placeholder="Gen Sec full name"
                  required
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Vice President</label>
                <Input
                  value={vicePresident}
                  onChange={(e) => setVicePresident(e.target.value)}
                  placeholder="Vice President name"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Arts Secretary</label>
                <Input
                  value={artsSecretary}
                  onChange={(e) => setArtsSecretary(e.target.value)}
                  placeholder="Arts Secretary name"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Major Milestones (one per line)</label>
              <Textarea
                value={milestonesText}
                onChange={(e) => setMilestonesText(e.target.value)}
                placeholder="Inaugurated 24/7 student grievance portal&#10;Won Inter-University Youth Fest&#10;Renovated Open Amphitheater"
                rows={4}
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="text-xs text-slate-400">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-10 px-6">
                {saving ? 'Saving...' : 'Save Administration'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};