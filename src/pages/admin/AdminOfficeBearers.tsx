import React, { useState } from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { createOfficeBearer, updateOfficeBearer, deleteOfficeBearer } from '@/services/db';
import { Users, Plus, Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { OfficeBearer } from '@/types/union';

export const AdminOfficeBearers: React.FC = () => {
  const { officeBearers } = useUnionData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OfficeBearer | null>(null);

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('Final Year');
  const [photoUrl, setPhotoUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [bio, setBio] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingItem(null);
    setName('');
    setPosition('');
    setDepartment('');
    setYearOfStudy('Final Year');
    setPhotoUrl('');
    setPhone('');
    setEmail('');
    setInstagram('');
    setBio('');
    setDisplayOrder(officeBearers.length + 1);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: OfficeBearer) => {
    setEditingItem(item);
    setName(item.name);
    setPosition(item.position);
    setDepartment(item.department);
    setYearOfStudy(item.yearOfStudy);
    setPhotoUrl(item.photoUrl);
    setPhone(item.phone || '');
    setEmail(item.email || '');
    setInstagram(item.instagram || '');
    setBio(item.bio || '');
    setDisplayOrder(item.displayOrder);
    setDialogOpen(true);
  };

  const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position.trim()) {
      toast.error('Bearer name and position are required');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await updateOfficeBearer(editingItem.id, {
          name,
          position,
          department,
          yearOfStudy,
          photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
          phone: phone || undefined,
          email: email || undefined,
          instagram: instagram || undefined,
          bio: bio || undefined,
          displayOrder: Number(displayOrder),
        });
        toast.success('Office Bearer updated');
      } else {
        await createOfficeBearer({
          name,
          position,
          department,
          yearOfStudy,
          photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
          phone: phone || undefined,
          email: email || undefined,
          instagram: instagram || undefined,
          bio: bio || undefined,
          displayOrder: Number(displayOrder),
        });
        toast.success('Office Bearer added');
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error('Failed to save office bearer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Remove "${name}" from Office Bearers?`)) {
      await deleteOfficeBearer(id);
      toast.success('Office bearer removed');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-500" />
            Manage Office Bearers
          </h1>
          <p className="text-xs text-slate-400">Update Union leadership council, assign designations, and reorder ranks</p>
        </div>
        <Button onClick={handleOpenNew} className="rounded-xl font-bold bg-sky-600 hover:bg-sky-500 text-white text-xs h-10 px-4 gap-2">
          <Plus className="w-4 h-4" /> Add Office Bearer
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {officeBearers.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 shrink-0 ring-2 ring-sky-500/30">
                <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-sky-950 text-sky-300 border-sky-800 text-[10px] font-bold">
                    Order #{item.displayOrder}
                  </Badge>
                </div>
                <h3 className="font-bold text-white text-sm">{item.name}</h3>
                <p className="text-xs font-semibold text-sky-400">{item.position}</p>
                <p className="text-[11px] text-slate-400">{item.department}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800/80">
              <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(item)} className="text-xs text-slate-300 hover:text-white h-8 gap-1">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id, item.name)} className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 h-8 gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl rounded-3xl bg-slate-900 border-slate-800 text-white p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-white">
              {editingItem ? 'Edit Office Bearer' : 'Add New Office Bearer'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aravind Swaminathan"
                  required
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Position / Designation</label>
                <Input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Chairman / President"
                  required
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-300">Department</label>
                <Input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Dept of Mechanical Engg"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Display Order</label>
                <Input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  min={1}
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Phone</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91..."
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Instagram Handle</label>
                <Input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="username"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Bio / Statement</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Personal motto or statement..."
                rows={2}
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Bearer Profile Photo</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoFile}
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
              />
              {photoUrl && (
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 border border-slate-700 mt-2">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="text-xs text-slate-400">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs h-10 px-6">
                {saving ? 'Saving...' : 'Save Office Bearer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};