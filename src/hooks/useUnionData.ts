import { useState, useEffect } from 'react';
import {
  initializeDatabase,
  subscribeToDB,
  getUnionSettings,
  getAnnouncements,
  getEvents,
  getGallery,
  getAchievements,
  getDocuments,
  getOfficeBearers,
  getAdministrations,
  getYearPlan,
  getAuditLogs
} from '@/services/db';
import type {
  UnionSettings,
  Announcement,
  EventItem,
  GalleryItem,
  Achievement,
  UnionDocument,
  OfficeBearer,
  AdministrationHistory,
  YearPlanItem,
  AuditLog
} from '@/types/union';

export function useUnionData() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<UnionSettings | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [documents, setDocuments] = useState<UnionDocument[]>([]);
  const [officeBearers, setOfficeBearers] = useState<OfficeBearer[]>([]);
  const [administrations, setAdministrations] = useState<AdministrationHistory[]>([]);
  const [yearPlan, setYearPlan] = useState<YearPlanItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const loadAll = async () => {
    try {
      await initializeDatabase();
      const [
        s,
        ann,
        evts,
        gal,
        ach,
        docs,
        obs,
        adms,
        yp,
        logs
      ] = await Promise.all([
        getUnionSettings(),
        getAnnouncements(),
        getEvents(),
        getGallery(),
        getAchievements(),
        getDocuments(),
        getOfficeBearers(),
        getAdministrations(),
        getYearPlan(),
        getAuditLogs(),
      ]);

      setSettings(s);
      setAnnouncements(ann);
      setEvents(evts);
      setGallery(gal);
      setAchievements(ach);
      setDocuments(docs);
      setOfficeBearers(obs);
      setAdministrations(adms);
      setYearPlan(yp);
      setAuditLogs(logs);
    } catch (e) {
      console.error('Failed to load union data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const unsubscribe = subscribeToDB(() => {
      loadAll();
    });
    return () => unsubscribe();
  }, []);

  return {
    loading,
    settings,
    announcements,
    events,
    gallery,
    achievements,
    documents,
    officeBearers,
    administrations,
    yearPlan,
    auditLogs,
    refresh: loadAll,
  };
}