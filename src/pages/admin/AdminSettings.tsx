import React, { useState } from 'react';
import { useUnionData } from '@/hooks/useUnionData';
import { updateUnionSettings, exportFullDatabaseBackup, importDatabaseBackup } from '@/services/db';
import { Palette, Upload, Shield, Save, Check, RefreshCw, Download, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export const AdminSettings: React.FC = () => {
  const { settings } = useUnionData();

  const [unionName, setUnionName] = useState(settings?.unionName || 'RSA Students Union');
  const [shortName, setShortName] = useState(settings?.shortName || 'RSA Union');
  const [tagline, setTagline] = useState(settings?.tagline || '');
  const [collegeName, setCollegeName] = useState(settings?.collegeName || 'Royal Science & Arts College');
  const [academicYear, setAcademicYear] = useState(settings?.academicYear || '2025 - 2026');
  const [logoUrl, setLogoUrl] = useState(settings?.logoUrl || '');
  const [contactEmail, setContactEmail] = useState(settings?.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(settings?.contactPhone || '');
  const [address, setAddress] = useState(settings?.address || '');
  const [instagram, setInstagram] = useState(settings?.socials.instagram || '');
  const [whatsapp, setWhatsapp] = useState(settings?.socials.whatsappCommunity || '');
  const [saving, setSaving] = useState(false);

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setLogoUrl(reader.result as string);
        toast.success('New logo selected! Click "Save Branding" to apply across the public app.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUnionSettings({
        unionName,
        shortName,
        tagline,
        collegeName,
        academicYear,
        logoUrl,
        contactEmail,
        contactPhone,
        address,
        socials: {
          ...settings?.socials,
          instagram,
          whatsappCommunity: whatsapp,
        },
      });
      toast.success('Union branding and information updated across the entire app!');
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleExportBackup = async () => {
    const json = await exportFullDatabaseBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UnionChronicle_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Database backup exported successfully');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const ok = await importDatabaseBackup(reader.result as string);
        if (ok) {
          toast.success('Database restored successfully from backup JSON!');
        } else {
          toast.error('Invalid backup file format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-blue-500" />
          Union Branding & System Settings
        </h1>
        <p className="text-xs text-slate-400">
          Upload new Union Crest / Logo, adjust college headers, academic session, and contact info. All changes reflect live on the public site immediately.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Logo & Branding */}
        <Card className="rounded-3xl border-slate-800 bg-slate-950/60 overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Shield className="w-4 h-4 text-blue-400" />
              Union Logo & Crest Branding
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Logo Preview */}
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold text-slate-300">Live Logo Preview:</span>
                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-900 border-2 border-blue-500/40 p-1 flex items-center justify-center shadow-xl">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Union Logo" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <Shield className="w-12 h-12 text-slate-600" />
                  )}
                </div>
              </div>

              {/* Upload input */}
              <div className="flex-1 space-y-3">
                <label className="text-xs font-bold text-slate-300">
                  Upload New Union Logo File (PNG, JPG, SVG)
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-11 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:text-xs"
                />
                <p className="text-[11px] text-slate-400">
                  Replacing the logo here will automatically update the header, footer, splash hero, and badges throughout the public Union Chronicle.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: General Union Info */}
        <Card className="rounded-3xl border-slate-800 bg-slate-950/60 overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-black text-white border-b border-slate-800 pb-3">
              General Union & College Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Union Name</label>
                <Input
                  value={unionName}
                  onChange={(e) => setUnionName(e.target.value)}
                  placeholder="e.g. RSA Students Union"
                  required
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Short Name</label>
                <Input
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="e.g. RSA Union"
                  required
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">College Name</label>
                <Input
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. Royal Science & Arts College"
                  required
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Academic Year</label>
                <Input
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="e.g. 2025 - 2026"
                  required
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Tagline / Motto</label>
              <Input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Empowering Student Voices, Building Tomorrow’s Leaders"
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Contact & Socials */}
        <Card className="rounded-3xl border-slate-800 bg-slate-950/60 overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-black text-white border-b border-slate-800 pb-3">
              Union Office Contacts & Channels
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Official Contact Email</label>
                <Input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="union@rsacollege.edu"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Contact Phone Number</label>
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Instagram Profile URL</label>
                <Input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/rsastudentsunion"
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">WhatsApp Community URL</label>
                <Input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="https://chat.whatsapp.com/..."
                  className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Office Location / Council Room</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Students Union Council Room, Academic Block A"
                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs h-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-11 px-8 gap-2 shadow-lg shadow-blue-600/30"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save All Branding Changes'}
          </Button>
        </div>
      </form>

      {/* Database Backup & Restore */}
      <Card className="rounded-3xl border-slate-800 bg-slate-950/60 overflow-hidden mt-8">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            Database Backup & Snapshot Restore
          </h2>
          <p className="text-xs text-slate-400">
            Export a full JSON snapshot of all announcements, events, gallery images, documents, and settings, or restore from a previous backup file.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              type="button"
              onClick={handleExportBackup}
              variant="outline"
              className="rounded-xl border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs h-10 px-4 gap-2"
            >
              <Download className="w-4 h-4 text-blue-400" /> Export JSON Backup
            </Button>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer">
              <FileUp className="w-4 h-4 text-emerald-400" /> Restore From Backup
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};