"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminApi, adminError } from "@/services/adminApi";
import { AdminUserDetail, AdminUserRow, Paged } from "@/types/admin";
import { useAuth } from "@/context/AppContextProvider";
import {
  Badge, Button, Card, ConfirmDialog, Dialog, ErrorNote, Loading, PageTitle, Pager, SearchInput, Select, Table,
  fmt, fmtDate, inputCls, label, statusTone,
} from "@/components/admin/ui";

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("created");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<AdminUserRow> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setData(await adminApi.users({ q, role, status, sort: sort === "login" ? "last_login" : undefined, page, limit: 25 }));
    } catch (err) {
      setError(adminError(err, "Could not load users"));
    }
  }, [q, role, status, sort, page]);

  useEffect(() => { load(); }, [load]);
  // Deep link from other pages: /admin/users?id=<userId>
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) setOpenId(id);
  }, []);

  const onSearch = useCallback((v: string) => { setQ(v); setPage(1); }, []);

  return (
    <>
      <PageTitle>Users</PageTitle>
      <Card>
        <div className="flex flex-wrap gap-2 mb-3">
          <SearchInput onSearch={onSearch} placeholder="Name, email, Pi username or id" />
          <Select ariaLabel="Role" value={role} onChange={(v) => { setRole(v); setPage(1); }}
            options={[{ value: "", label: "All roles" }, { value: "user", label: "Users" }, { value: "admin", label: "Admins" }]} />
          <Select ariaLabel="Status" value={status} onChange={(v) => { setStatus(v); setPage(1); }}
            options={[{ value: "", label: "Any status" }, { value: "active", label: "Active" }, { value: "suspended", label: "Suspended" }]} />
          <Select ariaLabel="Sort" value={sort} onChange={(v) => { setSort(v); setPage(1); }}
            options={[{ value: "created", label: "Newest" }, { value: "login", label: "Recently active" }]} />
        </div>

        {error && <ErrorNote text={error} onRetry={load} />}
        {!data && !error && <Loading />}
        {data && (
          <>
            <Table head={["User", "Sign-in", "Role", "Status", "Listings", "Joined", "Last active"]}>
              {data.items.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setOpenId(u._id)}>
                  <td className="py-2 pr-3">
                    <button type="button" className="text-left font-semibold text-[#111827] hover:underline">{u.display_name}</button>
                    <div className="text-xs text-gray-500 truncate max-w-[220px]">{u.primary_email ?? (u.username ? `@${u.username}` : u._id)}</div>
                  </td>
                  <td className="py-2 pr-3 text-xs">{u.providers.map(label).join(", ") || "—"}</td>
                  <td className="py-2 pr-3">{u.role === "admin" ? <Badge tone="brand">admin</Badge> : <span className="text-xs text-gray-600">user</span>}</td>
                  <td className="py-2 pr-3"><Badge tone={statusTone(u.status ?? "active")}>{u.status ?? "active"}</Badge></td>
                  <td className="py-2 pr-3 tabular-nums">{fmt(u.listings)}</td>
                  <td className="py-2 pr-3 text-xs whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                  <td className="py-2 pr-3 text-xs whitespace-nowrap">{fmtDate(u.last_login_at)}</td>
                </tr>
              ))}
            </Table>
            {!data.items.length && <p className="text-sm text-gray-500 py-6 text-center">No users match.</p>}
            <Pager page={data.page} pages={data.pages} total={data.total} onPage={setPage} />
          </>
        )}
      </Card>

      <UserDetailDialog id={openId} onClose={() => setOpenId(null)} onChanged={load} />
    </>
  );
}

// ─── Detail + actions ────────────────────────────────────────────────────────

function UserDetailDialog({ id, onClose, onChanged }: { id: string | null; onClose: () => void; onChanged: () => void }) {
  const { authUser } = useAuth();
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<"suspend" | "unsuspend" | "promote" | "demote" | null>(null);
  const [hideListings, setHideListings] = useState(true);
  const [msg, setMsg] = useState({ title: "", body: "" });

  const load = useCallback(async () => {
    if (!id) return;
    setError(null);
    try { setDetail(await adminApi.user(id)); } catch (err) { setError(adminError(err, "Could not load user")); }
  }, [id]);

  useEffect(() => { setDetail(null); setMsg({ title: "", body: "" }); load(); }, [load]);

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    try {
      await fn();
      toast.success(ok);
      setConfirm(null);
      await load();
      onChanged();
    } catch (err) {
      toast.error(adminError(err));
    } finally {
      setBusy(false);
    }
  };

  const u = detail?.user;
  const isSelf = u && authUser?._id === u._id;
  const suspended = u?.status === "suspended";

  return (
    <Dialog open={!!id} title={u ? u.display_name : "User"} onClose={onClose}>
      {error && <ErrorNote text={error} onRetry={load} />}
      {!detail && !error && <Loading />}
      {detail && u && (
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex flex-wrap gap-1.5">
            <Badge tone={u.role === "admin" ? "brand" : "neutral"}>{u.role}</Badge>
            <Badge tone={statusTone(u.status ?? "active")}>{u.status ?? "active"}</Badge>
            {detail.settings?.user_type && <Badge>{detail.settings.user_type}</Badge>}
            {isSelf && <Badge tone="brand">you</Badge>}
          </div>

          {suspended && (
            <p className="rounded-xl bg-red-50 text-red-800 p-3 text-xs">
              Suspended {fmtDate(u.suspended_at, true)}: {u.suspended_reason}
            </p>
          )}

          <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            <dt className="text-gray-500">Id</dt><dd className="font-mono break-all">{u._id}</dd>
            <dt className="text-gray-500">Email</dt><dd className="break-all">{u.primary_email || detail.settings?.email || "—"}</dd>
            <dt className="text-gray-500">Phone / WhatsApp</dt><dd>{detail.settings?.phone || "—"} / {detail.settings?.whatsapp || "—"}</dd>
            <dt className="text-gray-500">Brand</dt><dd>{detail.settings?.brand || "—"}</dd>
            <dt className="text-gray-500">Joined</dt><dd>{fmtDate(u.createdAt)}</dd>
            <dt className="text-gray-500">Last active</dt><dd>{fmtDate(u.last_login_at, true)}</dd>
            <dt className="text-gray-500">Sign-in</dt>
            <dd>{detail.identities.map((i) => `${label(i.provider)}${i.username ? ` @${i.username}` : ""}`).join(", ") || "—"}</dd>
            <dt className="text-gray-500">Alerts</dt>
            <dd>{detail.alertSettings
              ? [
                  detail.alertSettings.pushEnabled && "push",
                  detail.alertSettings.emailEnabled && "email",
                  detail.alertSettings.whatsappEnabled && "whatsapp",
                ].filter(Boolean).join(", ") || "all off"
              : "not set up"} · {detail.devices.length} device(s)</dd>
            <dt className="text-gray-500">Activity</dt>
            <dd>{detail.reviewsSent} reviews · {detail.contactsMade} enquiries</dd>
          </dl>

          <div>
            <h4 className="text-xs font-bold text-gray-600 mb-1">
              Listings ({Object.entries(detail.listingsByStatus).map(([s, n]) => `${n} ${s}`).join(", ") || "none"})
            </h4>
            <ul className="flex flex-col gap-1">
              {detail.recentListings.map((p) => (
                <li key={p._id} className="flex justify-between gap-2 text-xs">
                  <a href={`/property/details/${p._id}`} target="_blank" rel="noreferrer" className="truncate hover:underline">{p.title}</a>
                  <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                </li>
              ))}
            </ul>
            {detail.recentListings.length > 0 && (
              <a href={`/admin/properties?user=${u._id}`} className="text-xs font-semibold text-[#1e5f74] underline mt-1 inline-block">
                Manage all listings
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-2 border-t pt-3">
            {u.role === "admin"
              ? <Button variant="ghost" small disabled={!!isSelf} onClick={() => setConfirm("demote")}>Remove admin</Button>
              : <Button variant="ghost" small onClick={() => setConfirm("promote")}>Make admin</Button>}
            {suspended
              ? <Button small onClick={() => setConfirm("unsuspend")}>Unsuspend</Button>
              : <Button variant="danger" small disabled={!!isSelf || u.role === "admin"} onClick={() => setConfirm("suspend")}>Suspend</Button>}
          </div>

          <form
            className="flex flex-col gap-2 border-t pt-3"
            onSubmit={(e) => {
              e.preventDefault();
              run(() => adminApi.notifyUser(u._id, msg), "Message sent").then(() => setMsg({ title: "", body: "" }));
            }}
          >
            <h4 className="text-xs font-bold text-gray-600">Send a message (inbox, plus push/email if on)</h4>
            <input className={inputCls} placeholder="Title" maxLength={120} value={msg.title}
              onChange={(e) => setMsg({ ...msg, title: e.target.value })} aria-label="Message title" />
            <textarea className={inputCls} placeholder="Message" rows={2} maxLength={500} value={msg.body}
              onChange={(e) => setMsg({ ...msg, body: e.target.value })} aria-label="Message body" />
            <div><Button type="submit" small disabled={busy || !msg.title.trim() || !msg.body.trim()}>Send</Button></div>
          </form>

          {detail.history.length > 0 && (
            <div className="border-t pt-3">
              <h4 className="text-xs font-bold text-gray-600 mb-1">Admin history</h4>
              <ul className="text-xs text-gray-600 flex flex-col gap-1">
                {detail.history.map((h) => (
                  <li key={h._id}>{fmtDate(h.createdAt, true)} · {h.admin_name} · {h.action}</li>
                ))}
              </ul>
            </div>
          )}

          <ConfirmDialog
            open={confirm === "suspend"}
            title={`Suspend ${u.display_name}?`}
            message="They are signed out of every protected action and cannot sign in until unsuspended."
            confirmLabel="Suspend"
            danger
            reasonLabel="Reason (kept in the audit log)"
            reasonRequired
            busy={busy}
            extra={
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={hideListings} onChange={(e) => setHideListings(e.target.checked)} />
                Also mark their available listings as unavailable
              </label>
            }
            onCancel={() => setConfirm(null)}
            onConfirm={(reason) => run(() => adminApi.suspend(u._id, reason, hideListings), "User suspended")}
          />
          <ConfirmDialog
            open={confirm === "unsuspend"}
            title={`Unsuspend ${u.display_name}?`}
            message="They can sign in again. Listings hidden at suspension stay unavailable until changed."
            confirmLabel="Unsuspend"
            busy={busy}
            onCancel={() => setConfirm(null)}
            onConfirm={() => run(() => adminApi.unsuspend(u._id), "User unsuspended")}
          />
          <ConfirmDialog
            open={confirm === "promote" || confirm === "demote"}
            title={confirm === "promote" ? `Make ${u.display_name} an admin?` : `Remove admin from ${u.display_name}?`}
            message={confirm === "promote" ? "Admins can see all data and suspend users or delete listings." : "They lose access to this dashboard."}
            confirmLabel={confirm === "promote" ? "Make admin" : "Remove admin"}
            danger={confirm === "promote"}
            busy={busy}
            onCancel={() => setConfirm(null)}
            onConfirm={() => run(() => adminApi.setRole(u._id, confirm === "promote" ? "admin" : "user"), "Role updated")}
          />
        </div>
      )}
    </Dialog>
  );
}
