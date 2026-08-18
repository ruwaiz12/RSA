import React from 'react';
import { Link } from 'react-router-dom';
import { useUnionData } from '@/hooks/useUnionData';
import { 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  MessageCircle, 
  ArrowUpRight,
  Heart
} from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { settings } = useUnionData();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 p-1 flex items-center justify-center ring-2 ring-blue-500/30">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.unionName} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Shield className="w-6 h-6 text-blue-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{settings?.unionName || 'RSA Students Union'}</h3>
                <p className="text-xs text-blue-400 font-medium">{settings?.collegeName}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {settings?.tagline || 'Empowering student voice, driving academic excellence and vibrant campus culture.'}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {settings?.socials.instagram && (
                <a
                  href={settings.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-pink-400 hover:bg-slate-700 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.socials.facebook && (
                <a
                  href={settings.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.socials.twitter && (
                <a
                  href={settings.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-sky-400 hover:bg-slate-700 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings?.socials.whatsappCommunity && (
                <a
                  href={settings.socials.whatsappCommunity}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/announcements" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3 h-3 text-slate-500" /> Announcements & Circulars
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3 h-3 text-slate-500" /> Upcoming Campus Events
                </Link>
              </li>
              <li>
                <Link to="/office-bearers" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3 h-3 text-slate-500" /> Current Union Council
                </Link>
              </li>
              <li>
                <Link to="/year-plan" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3 h-3 text-slate-500" /> Academic & Activity Year Plan
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3 h-3 text-slate-500" /> Photo & Media Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Student Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/documents" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3 h-3 text-slate-500" /> Union Constitution & Forms
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3 h-3 text-slate-500" /> Student & College Laurels
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3 h-3 text-slate-500" /> Past Administrations History
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-amber-400">
                  <Shield className="w-3 h-3" /> Admin Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Union Office
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{settings?.address || 'Students Union Council Room, Academic Block A, College Campus'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${settings?.contactEmail}`} className="hover:text-white transition-colors">
                  {settings?.contactEmail || 'union@rsacollege.edu'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${settings?.contactPhone}`} className="hover:text-white transition-colors">
                  {settings?.contactPhone || '+91 98765 43210'}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings?.unionName || 'RSA Students Union'}. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Union Chronicle • Single Source of Truth Application</span>
          </div>
        </div>
      </div>
    </footer>
  );
};