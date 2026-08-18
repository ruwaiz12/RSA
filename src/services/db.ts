import { idbGet, idbSet } from './storage';
import { hashPassword, verifyPassword } from './crypto';
import type {
  Announcement,
  EventItem,
  GalleryItem,
  Achievement,
  UnionDocument,
  OfficeBearer,
  AdministrationHistory,
  YearPlanItem,
  UnionSettings,
  AdminUser,
  AuditLog
} from '@/types/union';

// Keys
const KEYS = {
  ANNOUNCEMENTS: 'announcements',
  EVENTS: 'events',
  GALLERY: 'gallery',
  ACHIEVEMENTS: 'achievements',
  DOCUMENTS: 'documents',
  OFFICE_BEARERS: 'office_bearers',
  ADMINISTRATIONS: 'administrations',
  YEAR_PLAN: 'year_plan',
  SETTINGS: 'union_settings',
  ADMIN_USER: 'admin_user',
  AUDIT_LOGS: 'audit_logs',
  AUTH_SESSION: 'auth_session',
  INITIALIZED: 'db_initialized_v2',
};

// Initial Seed Data for RSA Union
const SEED_SETTINGS: UnionSettings = {
  id: 'settings-1',
  unionName: 'RSA Students Union',
  shortName: 'RSA Union',
  tagline: 'Empowering Student Voices, Building Tomorrow’s Leaders',
  collegeName: 'Royal Science & Arts College',
  academicYear: '2025 - 2026',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&auto=format&fit=crop&q=80',
  heroBannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80',
  contactEmail: 'union@rsacollege.edu',
  contactPhone: '+91 98765 43210',
  address: 'Students Union Council Room, Academic Block A, RSA Campus',
  socials: {
    instagram: 'https://instagram.com/rsastudentsunion',
    facebook: 'https://facebook.com/rsastudentsunion',
    twitter: 'https://twitter.com/rsastudentsunion',
    youtube: 'https://youtube.com',
    whatsappCommunity: 'https://chat.whatsapp.com/sample',
  },
  aboutText: 'The RSA Students Union is the official representative body for all students of Royal Science & Arts College. We foster a vibrant campus culture through cultural festivities, technical expos, academic advocacy, social responsibility, and student welfare initiatives.',
  visionText: 'To champion student rights, cultivate exceptional extracurricular talent, and create an inclusive campus ecosystem that values leadership, creativity, and unity.',
  updatedAt: new Date().toISOString(),
};

const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'College Arts Fest "TARANG 2026" Schedule Released',
    content: 'The official schedule and guidelines for the inter-departmental cultural fest TARANG 2026 are now live. Registration for on-stage and off-stage events closes this Friday.',
    category: 'Arts',
    date: '2026-03-24',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    isPinned: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ann-2',
    title: 'Union General Body Meeting - March Edition',
    content: 'All class representatives and student council delegates are hereby requested to assemble in the Central Auditorium on March 28th at 3:30 PM for the budgetary discussion.',
    category: 'Urgent',
    date: '2026-03-22',
    isPinned: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ann-3',
    title: 'Inter-College Football Tournament Trials',
    content: 'Selections for the RSA Varsity Football Team will be held at the Main Sports Pavilion on Saturday morning from 6:30 AM onwards. Bring valid college ID and sports kit.',
    category: 'Sports',
    date: '2026-03-20',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    isPinned: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ann-4',
    title: 'Library Extended Study Hours for Mid-Semester Exams',
    content: 'In response to the union petition, the Central Library reading halls will now remain open until 11:00 PM during exam weeks with complimentary Wi-Fi and safe transit assistance.',
    category: 'Academic',
    date: '2026-03-18',
    isPinned: false,
    createdAt: new Date().toISOString(),
  },
];

const SEED_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'TARANG 2026 - Annual Cultural Fest',
    description: 'A 3-day extravaganza of dance, music, theater, literary competitions, and celebrity musical night featuring leading bands.',
    date: '2026-04-10',
    time: '09:00 AM - 09:30 PM',
    venue: 'College Main Grounds & Amphitheatre',
    category: 'Cultural',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    status: 'Upcoming',
    registrationUrl: 'https://forms.gle/tarang2026',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-2',
    title: 'RSA TechSprint Hackathon',
    description: '36-hour non-stop student hackathon solving civic and campus automation challenges with cash prizes worth ₹50,000.',
    date: '2026-04-18',
    time: '10:00 AM onwards',
    venue: 'Turing Computer Science Complex',
    category: 'Academic',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    status: 'Upcoming',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-3',
    title: 'Annual Inter-Department Sports Meet',
    description: 'Athletics, track events, basketball, badminton, cricket, and volleyball tournaments across 14 academic departments.',
    date: '2026-03-15',
    time: '08:00 AM - 06:00 PM',
    venue: 'RSA Sports Complex',
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    status: 'Completed',
    createdAt: new Date().toISOString(),
  },
];

const SEED_OFFICE_BEARERS: OfficeBearer[] = [
  {
    id: 'ob-1',
    name: 'Aravind Swaminathan',
    position: 'Chairman / President',
    department: 'Dept of Mechanical Engineering',
    yearOfStudy: 'Final Year',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    phone: '+91 98765 00001',
    email: 'president.rsa@rsacollege.edu',
    instagram: 'aravind_swami',
    displayOrder: 1,
    bio: 'Passionate about student rights, transparent union governance, and infrastructural development on campus.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ob-2',
    name: 'Fathima Zahra',
    position: 'Vice Chairperson',
    department: 'Dept of Computer Science',
    yearOfStudy: 'Third Year',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    phone: '+91 98765 00002',
    email: 'vicepresident.rsa@rsacollege.edu',
    instagram: 'fathima_zahra',
    displayOrder: 2,
    bio: 'Spearheading women representation and academic grievance redressal cells across departments.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ob-3',
    name: 'Rohit K. Menon',
    position: 'General Secretary',
    department: 'Dept of Commerce & Management',
    yearOfStudy: 'Final Year',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    phone: '+91 98765 00003',
    email: 'gensec.rsa@rsacollege.edu',
    instagram: 'rohit_menon',
    displayOrder: 3,
    bio: 'Managing union administrative communications, club coordinating councils, and university liaisons.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ob-4',
    name: 'Ananya Deshmukh',
    position: 'Arts Club Secretary',
    department: 'Dept of English Literature',
    yearOfStudy: 'Second Year',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    phone: '+91 98765 00004',
    email: 'arts.rsa@rsacollege.edu',
    instagram: 'ananya_arts',
    displayOrder: 4,
    bio: 'Organizing literary debates, dance performances, theater groups, and the iconic TARANG fest.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ob-5',
    name: 'Vikram Singh Rawat',
    position: 'General Sports Secretary',
    department: 'Dept of Physical Sciences',
    yearOfStudy: 'Third Year',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    phone: '+91 98765 00005',
    email: 'sports.rsa@rsacollege.edu',
    instagram: 'vikram_sports',
    displayOrder: 5,
    bio: 'National track medalist coordinating inter-collegiate tournaments, fitness clubs, and indoor games.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ob-6',
    name: 'Kavya Nair',
    position: 'Student Editor / Magazine Editor',
    department: 'Dept of Journalism & Media',
    yearOfStudy: 'Final Year',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    phone: '+91 98765 00006',
    email: 'editor.rsa@rsacollege.edu',
    displayOrder: 6,
    bio: 'Chief editor of the college annual publication "The RSA Chronicle" and campus creative digests.',
    createdAt: new Date().toISOString(),
  },
];

const SEED_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Union Oath Taking Ceremony 2025-26',
    caption: 'The newly elected Union council swearing oath in presence of the Principal and faculty deans.',
    category: 'Inauguration',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop&q=80',
    date: '2025-10-14',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gal-2',
    title: 'Battle of Bands - TARANG Prelims',
    caption: 'Electric performances during the inter-collegiate musical fest.',
    category: 'Arts Fest',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&auto=format&fit=crop&q=80',
    date: '2026-02-18',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gal-3',
    title: 'Championship Trophy Victory',
    caption: 'RSA Basketball team lifting the University Zonal Rolling Trophy.',
    category: 'Sports Meet',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&auto=format&fit=crop&q=80',
    date: '2026-02-28',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gal-4',
    title: 'Campus Green Initiative Tree Plantation',
    caption: 'Union volunteers planting 200 saplings across the north campus trail.',
    category: 'Campus Life',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&auto=format&fit=crop&q=80',
    date: '2025-11-20',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gal-5',
    title: 'Onam & Ethnic Day Celebrations',
    caption: 'Vibrant cultural dress showcase, traditional pookkalam and festive feast.',
    category: 'Celebrations',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&auto=format&fit=crop&q=80',
    date: '2025-09-08',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gal-6',
    title: 'AI & Robotics Tech Symposium',
    caption: 'Student demonstration of autonomous robotics prototypes in the seminar hall.',
    category: 'Workshops',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=80',
    date: '2026-01-25',
    createdAt: new Date().toISOString(),
  },
];

const SEED_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Overall Champions - University Youth Festival 2026',
    description: 'RSA College secured 1st place among 48 affiliated colleges with a record 142 total points in drama, classical dance, and folk arts.',
    recipientName: 'RSA Arts Contingent',
    recipientCategory: 'Team',
    awardDate: '2026-02-25',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
    badgeTag: 'First Prize - Gold',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ach-2',
    title: 'National Best Student Innovator Award',
    description: 'Awarded by the Ministry of Education for designing a low-cost solar-powered water filtration device for rural communities.',
    recipientName: 'Priya Sundaram (ECE Dept)',
    recipientCategory: 'Student',
    awardDate: '2026-01-15',
    imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&auto=format&fit=crop&q=80',
    badgeTag: 'National Recognition',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ach-3',
    title: 'State Inter-Collegiate Cricket Trophy 2026',
    description: 'Undefeated throughout the season, defeating St. Xavier’s College in the finals by 38 runs.',
    recipientName: 'RSA Varsity Cricket Team',
    recipientCategory: 'Team',
    awardDate: '2026-03-05',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80',
    badgeTag: 'State Champions',
    createdAt: new Date().toISOString(),
  },
];

const SEED_DOCUMENTS: UnionDocument[] = [
  {
    id: 'doc-1',
    title: 'RSA Students Union Constitution & Bylaws',
    description: 'Official codified constitution governing elections, council powers, committee mandates, and budget procedures.',
    fileType: 'PDF',
    fileSize: '1.4 MB',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publishDate: '2025-10-01',
    isOfficial: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-2',
    title: 'TARANG 2026 Rulebook & Registration Form',
    description: 'Official rulebook for fine arts, literary events, dance rules, music time limits, and eligibility criteria.',
    fileType: 'PDF',
    fileSize: '850 KB',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publishDate: '2026-03-20',
    isOfficial: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-3',
    title: 'Annual Union Budget Allocation Statement 2025-26',
    description: 'Transparency report on club funding, fest allocations, and student infrastructure investments.',
    fileType: 'REPORT',
    fileSize: '620 KB',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publishDate: '2025-11-15',
    isOfficial: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'doc-4',
    title: 'Student Grievance Redressal Cell Notice',
    description: 'Official operating hours, committee contacts, and anonymous digital reporting channels.',
    fileType: 'NOTICE',
    fileSize: '320 KB',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publishDate: '2025-10-25',
    isOfficial: false,
    createdAt: new Date().toISOString(),
  },
];

const SEED_ADMINISTRATIONS: AdministrationHistory[] = [
  {
    id: 'adm-1',
    academicYear: '2024 - 2025',
    themeTitle: 'DHWANI: Echoing Every Voice',
    president: 'Nithin Varghese',
    generalSecretary: 'Meera Nandakumar',
    vicePresident: 'Adarsh P.',
    jointSecretary: 'Devika Sharma',
    artsSecretary: 'Shyam Sundar',
    sportsSecretary: 'Basil Eldho',
    majorMilestones: [
      'Inaugurated the 24/7 digital student grievance portal',
      'Hosted national inter-collegiate debate "Vakya 2024"',
      'Won University Arts Fest Runners-Up title',
      'Installed sanitary napkin vending units across all blocks'
    ],
    bannerImageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'adm-2',
    academicYear: '2023 - 2024',
    themeTitle: 'AURA: Illuminating Excellence',
    president: 'Mohammed Ashik',
    generalSecretary: 'Sneha R. Pillai',
    vicePresident: 'Gokul Krishna',
    jointSecretary: 'Aparna Nair',
    artsSecretary: 'Arjun Das',
    sportsSecretary: 'Hariprasad K.',
    majorMilestones: [
      'Revived the flagship fest TARANG after a 3-year gap',
      'Secured 1st place in University Athletics Championship',
      'Initiated Campus Blood Donor Registry with 800+ student donors',
      'Established the Student Innovation Incubation Cell'
    ],
    bannerImageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'adm-3',
    academicYear: '2022 - 2023',
    themeTitle: 'CHETANA: Awakening Possibilities',
    president: 'Sanjay Kumar',
    generalSecretary: 'Anjali Ramesh',
    vicePresident: 'Rahul Thomas',
    artsSecretary: 'Sreya Suresh',
    sportsSecretary: 'Abhishek Roy',
    majorMilestones: [
      'Digitized student council records and voting feedback',
      'Hosted the State Science Congress on Campus',
      'Renovated the open-air student amphitheater'
    ],
    createdAt: new Date().toISOString(),
  },
];

const SEED_YEAR_PLAN: YearPlanItem[] = [
  {
    id: 'yp-1',
    title: 'Fresher Induction & Campus Orientation "Prarambh"',
    month: 'October 2025',
    tentativeDate: '2025-10-15',
    category: 'Union Administration',
    description: 'Welcome gala, icebreaking games, department stalls, and union mandate orientation.',
    status: 'Completed',
    coordinator: 'General Secretary',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'yp-2',
    title: 'Campus Leadership & Skill Summit',
    month: 'November 2025',
    tentativeDate: '2025-11-28',
    category: 'Academics & Tech',
    description: 'Interactive workshops on public speaking, parliamentary procedure, and conflict resolution.',
    status: 'Completed',
    coordinator: 'Vice Chairperson',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'yp-3',
    title: 'Annual Sports League & Athletics Meet',
    month: 'January 2026',
    tentativeDate: '2026-01-20',
    category: 'Sports',
    description: 'Inter-department leagues in cricket, football, basketball, and track meets.',
    status: 'Completed',
    coordinator: 'Sports Secretary',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'yp-4',
    title: 'College Cultural Fest "TARANG 2026"',
    month: 'April 2026',
    tentativeDate: '2026-04-10',
    category: 'Arts & Culture',
    description: 'Flagship 3-day arts festival, literary quiz, rock night, and celebrity performance.',
    status: 'Planned',
    coordinator: 'Arts Club Secretary',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'yp-5',
    title: 'TechSprint Hackathon & Project Expo',
    month: 'April 2026',
    tentativeDate: '2026-04-18',
    category: 'Academics & Tech',
    description: '36-hour hackathon, robotics arena, and startup pitch showcase.',
    status: 'Planned',
    coordinator: 'Academic Committee',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'yp-6',
    title: 'Annual Union Valedictory & Chronicle Release',
    month: 'May 2026',
    tentativeDate: '2026-05-25',
    category: 'Union Administration',
    description: 'Honoring outgoing final years, presenting annual accounts report, and unveiling magazine.',
    status: 'Planned',
    coordinator: 'President & Magazine Editor',
    createdAt: new Date().toISOString(),
  },
];

// PubSub for Live Changes
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeToDB(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifySubscribers() {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('Subscriber error', e);
    }
  });
}

// Database Initialization
export async function initializeDatabase(): Promise<void> {
  const isInit = await idbGet<boolean>(KEYS.INITIALIZED);
  if (!isInit) {
    // Seed initial admin: username "admin", password "RSA@Admin2026!"
    const { hash, salt } = await hashPassword('RSA@Admin2026!');
    const adminUser: AdminUser = {
      id: 'admin-1',
      username: 'admin',
      passwordHash: hash,
      salt: salt,
      role: 'superadmin',
      updatedAt: new Date().toISOString(),
    };

    await idbSet(KEYS.ADMIN_USER, adminUser);
    await idbSet(KEYS.SETTINGS, SEED_SETTINGS);
    await idbSet(KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
    await idbSet(KEYS.EVENTS, SEED_EVENTS);
    await idbSet(KEYS.GALLERY, SEED_GALLERY);
    await idbSet(KEYS.ACHIEVEMENTS, SEED_ACHIEVEMENTS);
    await idbSet(KEYS.DOCUMENTS, SEED_DOCUMENTS);
    await idbSet(KEYS.OFFICE_BEARERS, SEED_OFFICE_BEARERS);
    await idbSet(KEYS.ADMINISTRATIONS, SEED_ADMINISTRATIONS);
    await idbSet(KEYS.YEAR_PLAN, SEED_YEAR_PLAN);
    await idbSet(KEYS.AUDIT_LOGS, [
      {
        id: 'log-1',
        action: 'SYSTEM_INITIALIZATION',
        target: 'System',
        performedBy: 'System Setup',
        timestamp: new Date().toISOString(),
        details: 'Initial database created with RSA seed data and secured admin account',
      },
    ]);
    await idbSet(KEYS.INITIALIZED, true);
    notifySubscribers();
  }
}

// Log audit action
export async function addAuditLog(action: string, target: string, performedBy: string, details?: string) {
  const logs = (await idbGet<AuditLog[]>(KEYS.AUDIT_LOGS)) || [];
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    action,
    target,
    performedBy,
    timestamp: new Date().toISOString(),
    details,
  };
  const updated = [newLog, ...logs].slice(0, 100);
  await idbSet(KEYS.AUDIT_LOGS, updated);
}

// Generic CRUD helpers
async function getCollection<T>(key: string, defaultSeed: T[] = []): Promise<T[]> {
  const data = await idbGet<T[]>(key);
  return data !== null ? data : defaultSeed;
}

async function saveCollection<T>(key: string, data: T[]): Promise<void> {
  await idbSet(key, data);
  notifySubscribers();
}

// ========================
// PUBLIC & ADMIN CRUD API
// ========================

// 1. Union Settings / Branding
export async function getUnionSettings(): Promise<UnionSettings> {
  const settings = await idbGet<UnionSettings>(KEYS.SETTINGS);
  return settings || SEED_SETTINGS;
}

export async function updateUnionSettings(updated: Partial<UnionSettings>, actor = 'Admin'): Promise<UnionSettings> {
  const current = await getUnionSettings();
  const merged: UnionSettings = {
    ...current,
    ...updated,
    updatedAt: new Date().toISOString(),
  };
  await idbSet(KEYS.SETTINGS, merged);
  await addAuditLog('UPDATE_SETTINGS', 'Union Branding & Info', actor, 'Updated union profile details/logo');
  notifySubscribers();
  return merged;
}

// 2. Announcements
export async function getAnnouncements(): Promise<Announcement[]> {
  return getCollection<Announcement>(KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
}

export async function createAnnouncement(item: Omit<Announcement, 'id' | 'createdAt'>, actor = 'Admin'): Promise<Announcement> {
  const all = await getAnnouncements();
  const newItem: Announcement = {
    ...item,
    id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...all];
  await saveCollection(KEYS.ANNOUNCEMENTS, updated);
  await addAuditLog('CREATE', `Announcement: ${item.title}`, actor);
  return newItem;
}

export async function updateAnnouncement(id: string, updates: Partial<Announcement>, actor = 'Admin'): Promise<Announcement> {
  const all = await getAnnouncements();
  const index = all.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Announcement not found');
  all[index] = { ...all[index], ...updates };
  await saveCollection(KEYS.ANNOUNCEMENTS, all);
  await addAuditLog('UPDATE', `Announcement: ${all[index].title}`, actor);
  return all[index];
}

export async function deleteAnnouncement(id: string, actor = 'Admin'): Promise<void> {
  const all = await getAnnouncements();
  const target = all.find(a => a.id === id);
  const updated = all.filter(a => a.id !== id);
  await saveCollection(KEYS.ANNOUNCEMENTS, updated);
  await addAuditLog('DELETE', `Announcement: ${target?.title || id}`, actor);
}

// 3. Events
export async function getEvents(): Promise<EventItem[]> {
  return getCollection<EventItem>(KEYS.EVENTS, SEED_EVENTS);
}

export async function createEvent(item: Omit<EventItem, 'id' | 'createdAt'>, actor = 'Admin'): Promise<EventItem> {
  const all = await getEvents();
  const newItem: EventItem = {
    ...item,
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...all];
  await saveCollection(KEYS.EVENTS, updated);
  await addAuditLog('CREATE', `Event: ${item.title}`, actor);
  return newItem;
}

export async function updateEvent(id: string, updates: Partial<EventItem>, actor = 'Admin'): Promise<EventItem> {
  const all = await getEvents();
  const index = all.findIndex(e => e.id === id);
  if (index === -1) throw new Error('Event not found');
  all[index] = { ...all[index], ...updates };
  await saveCollection(KEYS.EVENTS, all);
  await addAuditLog('UPDATE', `Event: ${all[index].title}`, actor);
  return all[index];
}

export async function deleteEvent(id: string, actor = 'Admin'): Promise<void> {
  const all = await getEvents();
  const target = all.find(e => e.id === id);
  const updated = all.filter(e => e.id !== id);
  await saveCollection(KEYS.EVENTS, updated);
  await addAuditLog('DELETE', `Event: ${target?.title || id}`, actor);
}

// 4. Gallery
export async function getGallery(): Promise<GalleryItem[]> {
  return getCollection<GalleryItem>(KEYS.GALLERY, SEED_GALLERY);
}

export async function createGalleryItem(item: Omit<GalleryItem, 'id' | 'createdAt'>, actor = 'Admin'): Promise<GalleryItem> {
  const all = await getGallery();
  const newItem: GalleryItem = {
    ...item,
    id: `gal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...all];
  await saveCollection(KEYS.GALLERY, updated);
  await addAuditLog('CREATE', `Gallery: ${item.title}`, actor);
  return newItem;
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>, actor = 'Admin'): Promise<GalleryItem> {
  const all = await getGallery();
  const index = all.findIndex(g => g.id === id);
  if (index === -1) throw new Error('Gallery item not found');
  all[index] = { ...all[index], ...updates };
  await saveCollection(KEYS.GALLERY, all);
  await addAuditLog('UPDATE', `Gallery: ${all[index].title}`, actor);
  return all[index];
}

export async function deleteGalleryItem(id: string, actor = 'Admin'): Promise<void> {
  const all = await getGallery();
  const target = all.find(g => g.id === id);
  const updated = all.filter(g => g.id !== id);
  await saveCollection(KEYS.GALLERY, updated);
  await addAuditLog('DELETE', `Gallery: ${target?.title || id}`, actor);
}

// 5. Achievements
export async function getAchievements(): Promise<Achievement[]> {
  return getCollection<Achievement>(KEYS.ACHIEVEMENTS, SEED_ACHIEVEMENTS);
}

export async function createAchievement(item: Omit<Achievement, 'id' | 'createdAt'>, actor = 'Admin'): Promise<Achievement> {
  const all = await getAchievements();
  const newItem: Achievement = {
    ...item,
    id: `ach-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...all];
  await saveCollection(KEYS.ACHIEVEMENTS, updated);
  await addAuditLog('CREATE', `Achievement: ${item.title}`, actor);
  return newItem;
}

export async function updateAchievement(id: string, updates: Partial<Achievement>, actor = 'Admin'): Promise<Achievement> {
  const all = await getAchievements();
  const index = all.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Achievement not found');
  all[index] = { ...all[index], ...updates };
  await saveCollection(KEYS.ACHIEVEMENTS, all);
  await addAuditLog('UPDATE', `Achievement: ${all[index].title}`, actor);
  return all[index];
}

export async function deleteAchievement(id: string, actor = 'Admin'): Promise<void> {
  const all = await getAchievements();
  const target = all.find(a => a.id === id);
  const updated = all.filter(a => a.id !== id);
  await saveCollection(KEYS.ACHIEVEMENTS, updated);
  await addAuditLog('DELETE', `Achievement: ${target?.title || id}`, actor);
}

// 6. Documents
export async function getDocuments(): Promise<UnionDocument[]> {
  return getCollection<UnionDocument>(KEYS.DOCUMENTS, SEED_DOCUMENTS);
}

export async function createDocument(item: Omit<UnionDocument, 'id' | 'createdAt'>, actor = 'Admin'): Promise<UnionDocument> {
  const all = await getDocuments();
  const newItem: UnionDocument = {
    ...item,
    id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...all];
  await saveCollection(KEYS.DOCUMENTS, updated);
  await addAuditLog('CREATE', `Document: ${item.title}`, actor);
  return newItem;
}

export async function updateDocument(id: string, updates: Partial<UnionDocument>, actor = 'Admin'): Promise<UnionDocument> {
  const all = await getDocuments();
  const index = all.findIndex(d => d.id === id);
  if (index === -1) throw new Error('Document not found');
  all[index] = { ...all[index], ...updates };
  await saveCollection(KEYS.DOCUMENTS, all);
  await addAuditLog('UPDATE', `Document: ${all[index].title}`, actor);
  return all[index];
}

export async function deleteDocument(id: string, actor = 'Admin'): Promise<void> {
  const all = await getDocuments();
  const target = all.find(d => d.id === id);
  const updated = all.filter(d => d.id !== id);
  await saveCollection(KEYS.DOCUMENTS, updated);
  await addAuditLog('DELETE', `Document: ${target?.title || id}`, actor);
}

// 7. Office Bearers
export async function getOfficeBearers(): Promise<OfficeBearer[]> {
  const all = await getCollection<OfficeBearer>(KEYS.OFFICE_BEARERS, SEED_OFFICE_BEARERS);
  return all.sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function createOfficeBearer(item: Omit<OfficeBearer, 'id' | 'createdAt'>, actor = 'Admin'): Promise<OfficeBearer> {
  const all = await getOfficeBearers();
  const newItem: OfficeBearer = {
    ...item,
    id: `ob-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [...all, newItem].sort((a, b) => a.displayOrder - b.displayOrder);
  await saveCollection(KEYS.OFFICE_BEARERS, updated);
  await addAuditLog('CREATE', `Office Bearer: ${item.name} (${item.position})`, actor);
  return newItem;
}

export async function updateOfficeBearer(id: string, updates: Partial<OfficeBearer>, actor = 'Admin'): Promise<OfficeBearer> {
  const all = await getOfficeBearers();
  const index = all.findIndex(o => o.id === id);
  if (index === -1) throw new Error('Office Bearer not found');
  all[index] = { ...all[index], ...updates };
  all.sort((a, b) => a.displayOrder - b.displayOrder);
  await saveCollection(KEYS.OFFICE_BEARERS, all);
  await addAuditLog('UPDATE', `Office Bearer: ${all[index].name}`, actor);
  return all[index];
}

export async function deleteOfficeBearer(id: string, actor = 'Admin'): Promise<void> {
  const all = await getOfficeBearers();
  const target = all.find(o => o.id === id);
  const updated = all.filter(o => o.id !== id);
  await saveCollection(KEYS.OFFICE_BEARERS, updated);
  await addAuditLog('DELETE', `Office Bearer: ${target?.name || id}`, actor);
}

// 8. Administrations / History
export async function getAdministrations(): Promise<AdministrationHistory[]> {
  return getCollection<AdministrationHistory>(KEYS.ADMINISTRATIONS, SEED_ADMINISTRATIONS);
}

export async function createAdministration(item: Omit<AdministrationHistory, 'id' | 'createdAt'>, actor = 'Admin'): Promise<AdministrationHistory> {
  const all = await getAdministrations();
  const newItem: AdministrationHistory = {
    ...item,
    id: `adm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...all];
  await saveCollection(KEYS.ADMINISTRATIONS, updated);
  await addAuditLog('CREATE', `Administration: ${item.academicYear} - ${item.president}`, actor);
  return newItem;
}

export async function updateAdministration(id: string, updates: Partial<AdministrationHistory>, actor = 'Admin'): Promise<AdministrationHistory> {
  const all = await getAdministrations();
  const index = all.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Administration record not found');
  all[index] = { ...all[index], ...updates };
  await saveCollection(KEYS.ADMINISTRATIONS, all);
  await addAuditLog('UPDATE', `Administration: ${all[index].academicYear}`, actor);
  return all[index];
}

export async function deleteAdministration(id: string, actor = 'Admin'): Promise<void> {
  const all = await getAdministrations();
  const target = all.find(a => a.id === id);
  const updated = all.filter(a => a.id !== id);
  await saveCollection(KEYS.ADMINISTRATIONS, updated);
  await addAuditLog('DELETE', `Administration: ${target?.academicYear || id}`, actor);
}

// 9. Year Plan
export async function getYearPlan(): Promise<YearPlanItem[]> {
  return getCollection<YearPlanItem>(KEYS.YEAR_PLAN, SEED_YEAR_PLAN);
}

export async function createYearPlanItem(item: Omit<YearPlanItem, 'id' | 'createdAt'>, actor = 'Admin'): Promise<YearPlanItem> {
  const all = await getYearPlan();
  const newItem: YearPlanItem = {
    ...item,
    id: `yp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [...all, newItem];
  await saveCollection(KEYS.YEAR_PLAN, updated);
  await addAuditLog('CREATE', `Year Plan Item: ${item.title}`, actor);
  return newItem;
}

export async function updateYearPlanItem(id: string, updates: Partial<YearPlanItem>, actor = 'Admin'): Promise<YearPlanItem> {
  const all = await getYearPlan();
  const index = all.findIndex(y => y.id === id);
  if (index === -1) throw new Error('Year plan item not found');
  all[index] = { ...all[index], ...updates };
  await saveCollection(KEYS.YEAR_PLAN, all);
  await addAuditLog('UPDATE', `Year Plan: ${all[index].title}`, actor);
  return all[index];
}

export async function deleteYearPlanItem(id: string, actor = 'Admin'): Promise<void> {
  const all = await getYearPlan();
  const target = all.find(y => y.id === id);
  const updated = all.filter(y => y.id !== id);
  await saveCollection(KEYS.YEAR_PLAN, updated);
  await addAuditLog('DELETE', `Year Plan: ${target?.title || id}`, actor);
}

// 10. Audit Logs
export async function getAuditLogs(): Promise<AuditLog[]> {
  return getCollection<AuditLog>(KEYS.AUDIT_LOGS, []);
}

// 11. Authentication & Account Management
export async function getAdminAccount(): Promise<AdminUser | null> {
  return idbGet<AdminUser>(KEYS.ADMIN_USER);
}

export async function authenticateAdmin(username: string, passwordAttempt: string): Promise<{ success: boolean; token?: string; error?: string; username?: string }> {
  await initializeDatabase();
  const admin = await getAdminAccount();
  if (!admin) {
    return { success: false, error: 'Admin user not configured' };
  }

  if (admin.username.toLowerCase() !== username.trim().toLowerCase()) {
    return { success: false, error: 'Invalid username or password' };
  }

  const isValid = await verifyPassword(passwordAttempt, admin.passwordHash, admin.salt);
  if (!isValid) {
    return { success: false, error: 'Invalid username or password' };
  }

  // Create session token
  const token = `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const sessionData = {
    token,
    username: admin.username,
    role: admin.role,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  await idbSet(KEYS.AUTH_SESSION, sessionData);
  localStorage.setItem('uc_session_token', token);

  // Update last login
  admin.lastLoginAt = new Date().toISOString();
  await idbSet(KEYS.ADMIN_USER, admin);
  await addAuditLog('LOGIN', 'Admin Portal', admin.username, 'Successful authentication');

  return { success: true, token, username: admin.username };
}

export async function getAuthSession(): Promise<{ authenticated: boolean; username?: string; role?: string }> {
  const token = localStorage.getItem('uc_session_token');
  if (!token) return { authenticated: false };

  const session = await idbGet<{ token: string; username: string; role: string; expiresAt: number }>(KEYS.AUTH_SESSION);
  if (!session || session.token !== token || session.expiresAt < Date.now()) {
    localStorage.removeItem('uc_session_token');
    return { authenticated: false };
  }

  return { authenticated: true, username: session.username, role: session.role };
}

export async function logoutAdmin(): Promise<void> {
  const session = await getAuthSession();
  if (session.username) {
    await addAuditLog('LOGOUT', 'Admin Portal', session.username, 'Admin logged out');
  }
  await idbSet(KEYS.AUTH_SESSION, null);
  localStorage.removeItem('uc_session_token');
}

export async function changeAdminCredentials(
  currentPassword: string,
  newUsername?: string,
  newPassword?: string,
): Promise<{ success: boolean; error?: string }> {
  const admin = await getAdminAccount();
  if (!admin) return { success: false, error: 'Admin account not found' };

  // Validate current password
  const isValid = await verifyPassword(currentPassword, admin.passwordHash, admin.salt);
  if (!isValid) {
    return { success: false, error: 'Current password is incorrect' };
  }

  let updatedUsername = admin.username;
  if (newUsername && newUsername.trim().length >= 3) {
    updatedUsername = newUsername.trim();
  }

  let updatedHash = admin.passwordHash;
  let updatedSalt = admin.salt;

  if (newPassword && newPassword.length >= 6) {
    const hashed = await hashPassword(newPassword);
    updatedHash = hashed.hash;
    updatedSalt = hashed.salt;
  }

  const updatedAdmin: AdminUser = {
    ...admin,
    username: updatedUsername,
    passwordHash: updatedHash,
    salt: updatedSalt,
    updatedAt: new Date().toISOString(),
  };

  await idbSet(KEYS.ADMIN_USER, updatedAdmin);
  
  // Refresh current session with updated username
  const session = await idbGet<{ token: string; username: string; role: string; expiresAt: number }>(KEYS.AUTH_SESSION);
  if (session) {
    session.username = updatedUsername;
    await idbSet(KEYS.AUTH_SESSION, session);
  }

  await addAuditLog('ACCOUNT_UPDATE', 'Admin Account', updatedUsername, 'Credentials updated successfully');
  return { success: true };
}

// Export / Import Full Database Backup
export async function exportFullDatabaseBackup(): Promise<string> {
  const data = {
    settings: await getUnionSettings(),
    announcements: await getAnnouncements(),
    events: await getEvents(),
    gallery: await getGallery(),
    achievements: await getAchievements(),
    documents: await getDocuments(),
    officeBearers: await getOfficeBearers(),
    administrations: await getAdministrations(),
    yearPlan: await getYearPlan(),
    exportDate: new Date().toISOString(),
    version: '2.0',
  };
  return JSON.stringify(data, null, 2);
}

export async function importDatabaseBackup(jsonString: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString);
    if (data.settings) await idbSet(KEYS.SETTINGS, data.settings);
    if (data.announcements) await idbSet(KEYS.ANNOUNCEMENTS, data.announcements);
    if (data.events) await idbSet(KEYS.EVENTS, data.events);
    if (data.gallery) await idbSet(KEYS.GALLERY, data.gallery);
    if (data.achievements) await idbSet(KEYS.ACHIEVEMENTS, data.achievements);
    if (data.documents) await idbSet(KEYS.DOCUMENTS, data.documents);
    if (data.officeBearers) await idbSet(KEYS.OFFICE_BEARERS, data.officeBearers);
    if (data.administrations) await idbSet(KEYS.ADMINISTRATIONS, data.administrations);
    if (data.yearPlan) await idbSet(KEYS.YEAR_PLAN, data.yearPlan);
    notifySubscribers();
    await addAuditLog('DATABASE_RESTORE', 'System Database', 'Admin', 'Database successfully restored from JSON backup');
    return true;
  } catch (err) {
    console.error('Backup import error:', err);
    return false;
  }
}