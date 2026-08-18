export type Announcement = {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Academic' | 'Arts' | 'Sports' | 'Urgent' | 'Election';
  date: string;
  imageUrl?: string;
  isPinned: boolean;
  createdAt: string;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'Cultural' | 'Sports' | 'Academic' | 'Workshop' | 'Social' | 'Official';
  imageUrl?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Postponed';
  registrationUrl?: string;
  createdAt: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  caption?: string;
  category: 'Arts Fest' | 'Sports Meet' | 'Campus Life' | 'Inauguration' | 'Workshops' | 'Celebrations';
  imageUrl: string;
  date: string;
  createdAt: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  recipientName: string;
  recipientCategory: 'Student' | 'Team' | 'Faculty' | 'Union Body';
  awardDate: string;
  imageUrl?: string;
  badgeTag: string;
  createdAt: string;
};

export type UnionDocument = {
  id: string;
  title: string;
  description: string;
  fileType: 'PDF' | 'DOC' | 'NOTICE' | 'REPORT';
  fileSize: string;
  fileUrl: string; // Base64 or Blob storage URL
  publishDate: string;
  isOfficial: boolean;
  createdAt: string;
};

export type OfficeBearer = {
  id: string;
  name: string;
  position: string;
  department: string;
  yearOfStudy: string;
  photoUrl: string;
  phone?: string;
  email?: string;
  instagram?: string;
  displayOrder: number;
  bio?: string;
  createdAt: string;
};

export type AdministrationHistory = {
  id: string;
  academicYear: string;
  themeTitle: string;
  president: string;
  generalSecretary: string;
  vicePresident?: string;
  jointSecretary?: string;
  artsSecretary?: string;
  sportsSecretary?: string;
  majorMilestones: string[];
  bannerImageUrl?: string;
  createdAt: string;
};

export type YearPlanItem = {
  id: string;
  title: string;
  month: string;
  tentativeDate: string;
  category: 'Arts & Culture' | 'Sports' | 'Academics & Tech' | 'Social Service' | 'Union Administration';
  description: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Deferred';
  coordinator?: string;
  createdAt: string;
};

export type UnionSettings = {
  id: string;
  unionName: string;
  shortName: string;
  tagline: string;
  collegeName: string;
  academicYear: string;
  logoUrl: string;
  heroBannerUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socials: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    whatsappCommunity?: string;
  };
  aboutText: string;
  visionText: string;
  updatedAt: string;
};

export type AdminUser = {
  id: string;
  username: string;
  passwordHash: string; // SHA-256 hashed
  salt: string;
  role: 'superadmin' | 'admin';
  lastLoginAt?: string;
  updatedAt: string;
};

export type AuditLog = {
  id: string;
  action: string;
  target: string;
  performedBy: string;
  timestamp: string;
  details?: string;
};