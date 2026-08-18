import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import { PublicLayout } from "./components/layout/PublicLayout";
import { Home } from "./pages/public/Home";
import { AnnouncementsPage } from "./pages/public/AnnouncementsPage";
import { EventsPage } from "./pages/public/EventsPage";
import { OfficeBearersPage } from "./pages/public/OfficeBearersPage";
import { GalleryPage } from "./pages/public/GalleryPage";
import { YearPlanPage } from "./pages/public/YearPlanPage";
import { AchievementsPage } from "./pages/public/AchievementsPage";
import { DocumentsPage } from "./pages/public/DocumentsPage";
import { HistoryPage } from "./pages/public/HistoryPage";

// Admin Pages
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminAnnouncements } from "./pages/admin/AdminAnnouncements";
import { AdminEvents } from "./pages/admin/AdminEvents";
import { AdminGallery } from "./pages/admin/AdminGallery";
import { AdminOfficeBearers } from "./pages/admin/AdminOfficeBearers";
import { AdminYearPlan } from "./pages/admin/AdminYearPlan";
import { AdminAchievements } from "./pages/admin/AdminAchievements";
import { AdminDocuments } from "./pages/admin/AdminDocuments";
import { AdminAdministrations } from "./pages/admin/AdminAdministrations";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AdminAccount } from "./pages/admin/AdminAccount";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          {/* Public Union Chronicle Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/office-bearers" element={<OfficeBearersPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/year-plan" element={<YearPlanPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>

          {/* Admin Login Gateway */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Admin Control Center Protected Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="office-bearers" element={<AdminOfficeBearers />} />
            <Route path="year-plan" element={<AdminYearPlan />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="administrations" element={<AdminAdministrations />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="account" element={<AdminAccount />} />
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;