"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminApi, adminError } from "@/services/adminApi";
import { AdminLandmarkRow, AdminReviewRow, Paged } from "@/types/admin";
import {
  Button, Card, ConfirmDialog, ErrorNote, Loading, PageTitle, Pager, SearchInput, Select, Table, fmtDate, label,
} from "@/components/admin/ui";

type Tab = "reviews" | "landmarks";
const LANDMARK_CATEGORIES = ["school", "hospital", "market", "transport", "mall", "bank", "restaurant", "park", "place_of_worship", "other"];

export default function AdminModerationPage() {
  const [tab, setTab] = useState<Tab>("reviews");
  return (
    <>
      <PageTitle>Moderation</PageTitle>
      <div role="tablist" className="flex gap-2 mb-3">
        {(["reviews", "landmarks"] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold ${tab === t ? "bg-[#164e66] text-white" : "bg-white border border-gray-200 text-gray-700"}`}
          >
            {label(t)}
          </button>
        ))}
      </div>
      {tab === "reviews" ? <Reviews /> : <Landmarks />}
    </>
  );
}

function Reviews() {
  const [q, setQ] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<AdminReviewRow> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<AdminReviewRow | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try { setData(await adminApi.reviews({ q, maxRating, page, limit: 25 })); }
    catch (err) { setError(adminError(err, "Could not load reviews")); }
  }, [q, maxRating, page]);
  useEffect(() => { load(); }, [load]);
  const onSearch = useCallback((v: string) => { setQ(v); setPage(1); }, []);

  return (
    <Card>
      <div className="flex flex-wrap gap-2 mb-3">
        <SearchInput onSearch={onSearch} placeholder="Search review text" />
        <Select ariaLabel="Rating" value={maxRating} onChange={(v) => { setMaxRating(v); setPage(1); }}
          options={[{ value: "", label: "Any rating" }, { value: "2", label: "2★ or lower" }, { value: "3", label: "3★ or lower" }]} />
      </div>
      {error && <ErrorNote text={error} onRetry={load} />}
      {!data && !error && <Loading />}
      {data && (
        <>
          <Table head={["Review", "Rating", "By", "Listing", "Date", ""]}>
            {data.items.map((r) => (
              <tr key={r._id}>
                <td className="py-2 pr-3 max-w-[320px]">
                  <p className="text-sm line-clamp-3">{r.comment || <span className="text-gray-400">No text</span>}</p>
                  {r.reply_count > 0 && <span className="text-[11px] text-gray-500">{r.reply_count} replies</span>}
                </td>
                <td className="py-2 pr-3 tabular-nums whitespace-nowrap">{r.rating}★</td>
                <td className="py-2 pr-3 text-xs">
                  {r.sender ? <a href={`/admin/users?id=${r.sender._id}`} className="hover:underline">{r.sender.display_name}</a> : "Deleted user"}
                </td>
                <td className="py-2 pr-3 text-xs max-w-[200px] truncate">
                  {r.property ? <a href={`/property/details/${r.property._id}`} target="_blank" rel="noreferrer" className="hover:underline">{r.property.title}</a> : "Deleted listing"}
                </td>
                <td className="py-2 pr-3 text-xs whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                <td className="py-2 text-right"><Button small variant="danger" onClick={() => setToDelete(r)}>Delete</Button></td>
              </tr>
            ))}
          </Table>
          {!data.items.length && <p className="text-sm text-gray-500 py-6 text-center">No reviews match.</p>}
          <Pager page={data.page} pages={data.pages} total={data.total} onPage={setPage} />
        </>
      )}
      <ConfirmDialog
        open={!!toDelete}
        title="Delete this review?"
        message="The review and its replies are removed for good, and the listing's rating is recalculated."
        confirmLabel="Delete"
        danger
        reasonLabel="Reason (kept in the audit log)"
        busy={busy}
        onCancel={() => setToDelete(null)}
        onConfirm={async (reason) => {
          if (!toDelete) return;
          setBusy(true);
          try { await adminApi.deleteReview(toDelete._id, reason); toast.success("Review deleted"); setToDelete(null); load(); }
          catch (err) { toast.error(adminError(err)); }
          finally { setBusy(false); }
        }}
      />
    </Card>
  );
}

function Landmarks() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<AdminLandmarkRow> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<AdminLandmarkRow | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try { setData(await adminApi.landmarks({ q, category, page, limit: 25 })); }
    catch (err) { setError(adminError(err, "Could not load landmarks")); }
  }, [q, category, page]);
  useEffect(() => { load(); }, [load]);
  const onSearch = useCallback((v: string) => { setQ(v); setPage(1); }, []);

  return (
    <Card>
      <div className="flex flex-wrap gap-2 mb-3">
        <SearchInput onSearch={onSearch} placeholder="Landmark name" />
        <Select ariaLabel="Category" value={category} onChange={(v) => { setCategory(v); setPage(1); }}
          options={[{ value: "", label: "Any category" }, ...LANDMARK_CATEGORIES.map((c) => ({ value: c, label: label(c) }))]} />
      </div>
      {error && <ErrorNote text={error} onRetry={load} />}
      {!data && !error && <Loading />}
      {data && (
        <>
          <Table head={["Name", "Category", "Confirmations", "Added by", "Location", "Added", ""]}>
            {data.items.map((l) => {
              const [lng, lat] = l.map_location?.coordinates ?? [0, 0];
              return (
                <tr key={l._id}>
                  <td className="py-2 pr-3 font-semibold">{l.name}</td>
                  <td className="py-2 pr-3 text-xs">{label(l.category)}</td>
                  <td className="py-2 pr-3 tabular-nums">{l.verifiedCount}</td>
                  <td className="py-2 pr-3 text-xs">{l.createdBy?.display_name ?? "—"}</td>
                  <td className="py-2 pr-3 text-xs">
                    <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`} target="_blank" rel="noreferrer" className="hover:underline tabular-nums">
                      {lat.toFixed(4)}, {lng.toFixed(4)}
                    </a>
                  </td>
                  <td className="py-2 pr-3 text-xs whitespace-nowrap">{fmtDate(l.createdAt)}</td>
                  <td className="py-2 text-right"><Button small variant="danger" onClick={() => setToDelete(l)}>Delete</Button></td>
                </tr>
              );
            })}
          </Table>
          {!data.items.length && <p className="text-sm text-gray-500 py-6 text-center">No landmarks match.</p>}
          <Pager page={data.page} pages={data.pages} total={data.total} onPage={setPage} />
        </>
      )}
      <ConfirmDialog
        open={!!toDelete}
        title={`Delete “${toDelete?.name}”?`}
        message="The landmark disappears from every listing's map."
        confirmLabel="Delete"
        danger
        busy={busy}
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return;
          setBusy(true);
          try { await adminApi.deleteLandmark(toDelete._id); toast.success("Landmark deleted"); setToDelete(null); load(); }
          catch (err) { toast.error(adminError(err)); }
          finally { setBusy(false); }
        }}
      />
    </Card>
  );
}
