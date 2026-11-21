"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminApi, adminError } from "@/services/adminApi";
import { AdminPropertyRow, Paged } from "@/types/admin";
import {
  Badge, Button, Card, ConfirmDialog, ErrorNote, Loading, PageTitle, Pager, SearchInput, Select, Table,
  fmtDate, label, statusTone,
} from "@/components/admin/ui";

const STATUSES = ["available", "rented", "sold", "unavailable", "expired"];
const CATEGORIES = ["house", "shortlet", "hotel", "office", "land", "shop", "others"];
const opts = (values: string[], all: string) => [{ value: "", label: all }, ...values.map((v) => ({ value: v, label: label(v) }))];

export default function AdminPropertiesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [listedFor, setListedFor] = useState("");
  const [stale, setStale] = useState(false);
  const [user, setUser] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<AdminPropertyRow> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<AdminPropertyRow | null>(null);
  const [confirmExpire, setConfirmExpire] = useState(false);
  const [busy, setBusy] = useState(false);

  // Deep links: ?stale=true or ?user=<id>
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("stale") === "true") setStale(true);
    if (p.get("user")) setUser(p.get("user")!);
  }, []);

  const load = useCallback(async () => {
    setError(null);
    try {
      setData(await adminApi.properties({
        q, status: stale ? undefined : status, category, listed_for: listedFor,
        stale: stale ? "true" : undefined, user: user || undefined, page, limit: 25,
      }));
    } catch (err) {
      setError(adminError(err, "Could not load listings"));
    }
  }, [q, status, category, listedFor, stale, user, page]);

  useEffect(() => { load(); }, [load]);
  const onSearch = useCallback((v: string) => { setQ(v); setPage(1); }, []);

  const changeStatus = async (row: AdminPropertyRow, next: string) => {
    if (next === row.status) return;
    try {
      await adminApi.setPropertyStatus(row._id, next);
      toast.success(`Marked ${label(next).toLowerCase()}`);
      setData((d) => d && { ...d, items: d.items.map((p) => (p._id === row._id ? { ...p, status: next } : p)) });
    } catch (err) {
      toast.error(adminError(err));
    }
  };

  const doDelete = async (reason: string) => {
    if (!toDelete) return;
    setBusy(true);
    try {
      const res = await adminApi.deleteProperty(toDelete._id, reason);
      toast.success(`Deleted with ${res.removed.reviews} reviews and ${res.removed.images} images`);
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(adminError(err));
    } finally {
      setBusy(false);
    }
  };

  const doExpire = async () => {
    setBusy(true);
    try {
      const res = await adminApi.expireStale();
      toast.success(`${res.expired} listings marked expired`);
      setConfirmExpire(false);
      load();
    } catch (err) {
      toast.error(adminError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageTitle action={<Button variant="ghost" small onClick={() => setConfirmExpire(true)}>Expire stale listings</Button>}>
        Listings
      </PageTitle>
      <Card>
        <div className="flex flex-wrap gap-2 mb-3 items-center">
          <SearchInput onSearch={onSearch} placeholder="Title, address, username or id" />
          <Select ariaLabel="Status" value={stale ? "" : status} onChange={(v) => { setStatus(v); setStale(false); setPage(1); }} options={opts(STATUSES, "Any status")} />
          <Select ariaLabel="Category" value={category} onChange={(v) => { setCategory(v); setPage(1); }} options={opts(CATEGORIES, "Any category")} />
          <Select ariaLabel="Rent or sale" value={listedFor} onChange={(v) => { setListedFor(v); setPage(1); }} options={opts(["rent", "sale"], "Rent & sale")} />
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            <input type="checkbox" checked={stale} onChange={(e) => { setStale(e.target.checked); setPage(1); }} />
            Past expiry, still available
          </label>
          {user && (
            <button type="button" onClick={() => { setUser(""); setPage(1); }} className="text-xs">
              <Badge tone="brand">Owner {user.slice(-6)} ✕</Badge>
            </button>
          )}
        </div>

        {error && <ErrorNote text={error} onRetry={load} />}
        {!data && !error && <Loading />}
        {data && (
          <>
            <Table head={["Listing", "Owner", "Price", "Type", "Status", "Expires", "Listed", ""]}>
              {data.items.map((p) => (
                <tr key={p._id}>
                  <td className="py-2 pr-3 max-w-[260px]">
                    <a href={`/property/details/${p._id}`} target="_blank" rel="noreferrer" className="font-semibold hover:underline block truncate">{p.title}</a>
                    <span className="text-xs text-gray-500 block truncate">{[p.place?.subregion, p.place?.region, p.country].filter(Boolean).join(", ") || p.address}</span>
                  </td>
                  <td className="py-2 pr-3 text-xs">
                    <a href={`/admin/users?id=${p.user}`} className="hover:underline">@{p.username}</a>
                  </td>
                  <td className="py-2 pr-3 text-xs whitespace-nowrap tabular-nums">{p.currency} {p.price.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-xs">{label(p.category)} · {p.listed_for}</td>
                  <td className="py-2 pr-3">
                    <select
                      aria-label={`Status of ${p.title}`}
                      value={p.status}
                      onChange={(e) => changeStatus(p, e.target.value)}
                      className="text-xs rounded-lg border border-gray-200 px-1.5 py-1 bg-white"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
                    </select>{" "}
                    <span className="sr-only"><Badge tone={statusTone(p.status)}>{p.status}</Badge></span>
                  </td>
                  <td className={`py-2 pr-3 text-xs whitespace-nowrap ${new Date(p.expired_by) < new Date() ? "text-amber-700 font-semibold" : ""}`}>
                    {fmtDate(p.expired_by)}
                  </td>
                  <td className="py-2 pr-3 text-xs whitespace-nowrap">{fmtDate(p.createdAt)}</td>
                  <td className="py-2 text-right"><Button small variant="danger" onClick={() => setToDelete(p)}>Delete</Button></td>
                </tr>
              ))}
            </Table>
            {!data.items.length && <p className="text-sm text-gray-500 py-6 text-center">No listings match.</p>}
            <Pager page={data.page} pages={data.pages} total={data.total} onPage={setPage} />
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this listing?"
        message={<>“{toDelete?.title}” by @{toDelete?.username} is removed for good, with its images, reviews and enquiry records. To hide it instead, set its status to Unavailable.</>}
        confirmLabel="Delete for good"
        danger
        reasonLabel="Reason (kept in the audit log)"
        busy={busy}
        onCancel={() => setToDelete(null)}
        onConfirm={doDelete}
      />
      <ConfirmDialog
        open={confirmExpire}
        title="Expire stale listings?"
        message="Every listing still marked available after its expiry date is set to Expired (up to 1,000 per run). Owners can relist them."
        confirmLabel="Expire them"
        busy={busy}
        onCancel={() => setConfirmExpire(false)}
        onConfirm={doExpire}
      />
    </>
  );
}
