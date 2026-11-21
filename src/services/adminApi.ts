// Admin dashboard API (/api/v1/admin). The server checks the admin role on every call.
import axiosClient from "@/config/client";
import {
  AdminAuditRow, AdminBreakdowns, AdminLandmarkRow, AdminLeaderboards, AdminNotificationStats,
  AdminOverview, AdminPropertyRow, AdminReviewRow, AdminSystem, AdminTimeseries, AdminUserDetail,
  AdminUserRow, Paged, SeriesMetric,
} from "@/types/admin";

type Query = Record<string, string | number | boolean | undefined>;

/** Drops empty values so they are not sent as `?q=`. */
const clean = (q: Query = {}) =>
  Object.fromEntries(Object.entries(q).filter(([, v]) => v !== undefined && v !== ""));

const get = <T,>(url: string, params?: Query) =>
  axiosClient.get<T>(url, { params: clean(params), timeout: 20000 }).then((r) => r.data);

export const adminApi = {
  // Stats
  overview: () => get<AdminOverview>("/admin/stats/overview"),
  timeseries: (metric: SeriesMetric, days = 30) => get<AdminTimeseries>("/admin/stats/timeseries", { metric, days }),
  breakdowns: () => get<AdminBreakdowns>("/admin/stats/breakdowns"),
  leaderboards: (limit = 10) => get<AdminLeaderboards>("/admin/stats/leaderboards", { limit }),
  notificationStats: (days = 30) => get<AdminNotificationStats>("/admin/stats/notifications", { days }),
  system: () => get<AdminSystem>("/admin/system"),

  // Users
  users: (q: Query) => get<Paged<AdminUserRow>>("/admin/users", q),
  user: (id: string) => get<AdminUserDetail>(`/admin/users/${id}`),
  setRole: (id: string, role: "admin" | "user") =>
    axiosClient.patch(`/admin/users/${id}/role`, { role }).then((r) => r.data),
  suspend: (id: string, reason: string, hideListings: boolean) =>
    axiosClient.post(`/admin/users/${id}/suspend`, { reason, hideListings }).then((r) => r.data),
  unsuspend: (id: string) => axiosClient.post(`/admin/users/${id}/unsuspend`).then((r) => r.data),
  notifyUser: (id: string, msg: { title: string; body: string; path?: string }) =>
    axiosClient.post(`/admin/users/${id}/notify`, msg).then((r) => r.data),

  // Properties
  properties: (q: Query) => get<Paged<AdminPropertyRow>>("/admin/properties", q),
  setPropertyStatus: (id: string, status: string) =>
    axiosClient.patch(`/admin/properties/${id}/status`, { status }).then((r) => r.data),
  deleteProperty: (id: string, reason: string) =>
    axiosClient.delete(`/admin/properties/${id}`, { data: { reason } }).then((r) => r.data),
  expireStale: () => axiosClient.post<{ expired: number }>("/admin/properties/expire-stale").then((r) => r.data),

  // Moderation
  reviews: (q: Query) => get<Paged<AdminReviewRow>>("/admin/reviews", q),
  deleteReview: (id: string, reason: string) =>
    axiosClient.delete(`/admin/reviews/${id}`, { data: { reason } }).then((r) => r.data),
  landmarks: (q: Query) => get<Paged<AdminLandmarkRow>>("/admin/landmarks", q),
  deleteLandmark: (id: string) => axiosClient.delete(`/admin/landmarks/${id}`).then((r) => r.data),

  // Notifications, jobs, audit
  broadcast: (msg: { title: string; body: string; path?: string }) =>
    axiosClient.post("/admin/notifications/broadcast", msg, { timeout: 60000 }).then((r) => r.data),
  runJob: (name: string) => axiosClient.post(`/admin/jobs/${name}/run`, undefined, { timeout: 60000 }).then((r) => r.data),
  audit: (q: Query) => get<Paged<AdminAuditRow>>("/admin/audit", q),
};

/** The server's message for a failed call, or a fallback. */
export function adminError(err: unknown, fallback = "Something went wrong"): string {
  const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return typeof msg === "string" && msg ? msg : fallback;
}
