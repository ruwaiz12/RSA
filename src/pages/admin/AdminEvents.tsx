import React, { useState } from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { createEvent, updateEvent, deleteEvent } from '@/services/db';
import { Calendar, Plus, Edit2, Trash2, Clock, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { EventItem } from '@/types/union';

export const AdminEvents: React.FC = () => {
  const { events } = useUnionData();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 AM - 04:00 PM');
  const [venue, setVenue] = useState('College Main Auditorium');
  const [category, setCategory] = useState<EventItem['category']>('Cultural');
  const [status, setStatus] = useState<EventItem['status']>('Upcoming');
  const [imageUrl, setImageUrl] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('10:00 AM - 04:00 PM');
    setVenue('College Main Auditorium');
    setCategory('Cultural');
    setStatus('Upcoming');
    setImageUrl('');
    setRegistrationUrl('');
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: EventItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setDate(item.date);
    setTime(item.time);
    setVenue(item.venue);
    setCategory(item.category);
    setStatus(item.status);
    setImageUrl(item.imageUrl || '');
    setRegistrationUrl(item.registrationUrl || '');
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
    if (!title.trim() || !venue.trim()) {
      toast.error('Event title and venue are required');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await updateEvent(editingItem.id, {
          title,
          description,
          date,
          time,
          venue,
          category,
          status,
          imageUrl: imageUrl || undefined,
          registrationUrl: registrationUrl || undefined,
        });
        toast.success('Event updated successfully');
      } else {
        await createEvent({
          title,
          description,
          date,
          time,
          venue,
          category,
          status,
          imageUrl: imageUrl || undefined,
          registrationUrl: registrationUrl || undefined,
        });
        toast.success('Event created successfully');
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error('Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteEvent(id);
      toast.success('Event deleted');
    }
  };

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-500" />
            Manage Campus Events
          </h1>
          <p className="text-xs text-slate-400">Schedule, update, and manage cultural, academic, and sports events</p>
        </div>
        <Button onClick={handleOpenNew} className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-10 px-4 gap-2">
          <Plus className="w-4 h-4" /> Create Event
        </Button>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-4">
        <Search className="w-4 h-4 text-slate-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search events by title or venue..."
          className="bg-transparent border-0 text-white text-xs placeholder:text-slate-500 focus-visible:ring-0 p-0"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-indigo-600/30 text-indigo-300 border-indigo-500/30 text-[10px] font-bold">
                  {item.category}
                </Badge>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.status === 'Upcoming' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  item.status === 'Ongoing' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {item.status}
                </span>
              </div>

              <h3 className="font-bold text-white text-base leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>

              <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {item.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> {item.time}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {item.venue}
                </div>
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

      {/* Modal Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl rounded-3xl bg-slate-900 border-slate-800 text-white p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-white">
              {editingItem ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Event Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. TARANG 2026 - Inter-Collegiate Arts Fest"
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
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Academic">Academic</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Social">Social</option>
                  <option value="Official">Official</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white text-xs h-10 px-3"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Postponed">Postponed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Event Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Time</label>
                <Input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 09:30 AM - 05:00 PM"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Venue</label>
              <Input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. College Amphitheatre & Sports Arena"
                required
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event description, entry rules, guests, etc."
                rows={3}
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Registration / Link URL (Optional)</label>
              <Input
                value={registrationUrl}
                onChange={(e) => setRegistrationUrl(e.target.value)}
                placeholder="https://forms.gle/..."
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Event Poster / Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageFile}
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
              />
              {imageUrl && (
                <div className="h-28 w-44 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 mt-2">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="text-xs text-slate-400">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-10 px-6">
                {saving ? 'Saving...' : 'Save Event'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};