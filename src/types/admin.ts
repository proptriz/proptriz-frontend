// Shapes returned by /api/v1/admin/*

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export type CountMap = Record<string, number>;

export interface AdminOverview {
  generatedAt: string;
  users: {
    total: number; new7d: number; new30d: number; active7d: number; active30d: number;
    admins: number; suspended: number; onboardingCompleted: number;
  };
  properties: {
    total: number; new7d: number; new30d: number; byStatus: CountMap; available: number;
    expiringIn7d: number; staleAvailable: number;
  };
  reviews: { total: number; new30d: number; averageRating: number | null };
  contacts: { total: number; new30d: number; byChannel: CountMap };
  landmarks: { total: number };
  engagement: { liveDevices: number; pushOptIn: number; emailOptIn: number; alerts30d: number };
}

export type SeriesMetric = "users" | "logins" | "properties" | "reviews" | "contacts" | "alerts";

export interface AdminTimeseries {
  metric: SeriesMetric;
  days: number;
  total: number;
  points: { date: string; count: number }[];
}

export interface AdminBreakdowns {
  properties: {
    category: CountMap; listedFor: CountMap; currency: CountMap; country: CountMap;
    topRegions: { region: string; count: number }[]; status: CountMap;
  };
  users: { authProvider: CountMap; userType: CountMap; devicePlatform: CountMap };
}

export interface AdminLeaderboards {
  topListers: {
    userId: string; username: string; listings: number; available: number;
    user?: { _id: string; display_name: string; primary_email?: string; status?: string };
  }[];
  mostContacted: {
    propertyId: string; contacts: number;
    property?: { _id: string; title: string; slug: string; username: string; status: string; price: number; currency: string };
  }[];
  topRated: { _id: string; title: string; slug: string; username: string; average_rating: number; review_count: number; status: string }[];
}

export interface AdminNotificationStats {
  days: number; total: number; opened: number; openRate: number;
  byType: CountMap; push: CountMap; email: CountMap; openedVia: CountMap;
}

export interface AdminJob {
  name: string; description: string; everyMinutes: number;
  lastStartedAt: string | null; lastFinishedAt: string | null;
  lastStatus: "running" | "ok" | "failed" | "never";
  lastResult: Record<string, unknown> | null; lastError: string | null; overdue: boolean;
}

export interface AdminSystem {
  jobs: { healthy: boolean; items: AdminJob[] };
  postcode: {
    nigeriaListings: number; withPostcode: number; verified: number;
    usage14d: { day: string; kind: string; upstream: number; cacheHits: number; staleServed: number; failures: number }[];
  };
}

export interface AdminUserRow {
  _id: string;
  display_name: string;
  primary_email?: string | null;
  avatar?: string | null;
  role: "user" | "admin";
  status?: "active" | "suspended";
  suspended_reason?: string | null;
  suspended_at?: string | null;
  last_login_at?: string | null;
  createdAt: string;
  providers: string[];
  username: string | null;
  listings: number;
}

export interface AdminPropertyRow {
  _id: string; title: string; slug: string; banner?: string; address: string;
  price: number; currency: string; listed_for: string; category: string; status: string;
  country?: string; place?: { region?: string; subregion?: string };
  user: string; username: string; expired_by: string;
  average_rating: number; review_count: number; createdAt: string;
}

export interface AdminUserDetail {
  user: Omit<AdminUserRow, "providers" | "username" | "listings">;
  settings: { user_type?: string; brand?: string; email?: string; phone?: string; whatsapp?: string } | null;
  identities: { provider: string; username?: string; email?: string; email_verified?: boolean; createdAt: string }[];
  alertSettings: { emailEnabled: boolean; pushEnabled: boolean; whatsappEnabled: boolean; language: string; timezone: string } | null;
  devices: { platform: string; lastSeenAt: string; appVersion?: string }[];
  listingsByStatus: CountMap;
  recentListings: AdminPropertyRow[];
  reviewsSent: number;
  contactsMade: number;
  history: AdminAuditRow[];
}

export interface AdminReviewRow {
  _id: string; rating: number; comment: string; image?: string; reply_count: number; createdAt: string;
  sender?: { _id: string; display_name: string; primary_email?: string; status?: string } | null;
  property?: { _id: string; title: string; slug: string; username: string } | null;
}

export interface AdminLandmarkRow {
  _id: string; name: string; category: string; verifiedCount: number; createdAt: string;
  map_location: { coordinates: [number, number] };
  createdBy?: { _id: string; display_name: string } | null;
}

export interface AdminAuditRow {
  _id: string; admin: string; admin_name: string; action: string;
  target_type: string; target_id?: string; details?: Record<string, unknown>; createdAt: string;
}
