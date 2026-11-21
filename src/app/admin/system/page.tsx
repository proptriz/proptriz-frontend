"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminApi, adminError } from "@/services/adminApi";
import { AdminAuditRow, AdminSystem, Paged } from "@/types/admin";
import {
  Badge, Button, Card, ErrorNote, Loading, PageTitle, Pager, Select, StatTile, Table, fmt, fmtDate, statusTone,
} from "@/components/admin/ui";

const ACTIONS = [
  "user.role", "user.suspend", "user.unsuspend", "property.status", "property.delete", "property.expire_stale",
  "review.delete", "landmark.delete", "notification.send", "notification.broadcast", "job.run",
];

export default function AdminSystemPage() {
  const [sys, setSys] = useState<AdminSystem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try { setSys(await adminApi.system()); } catch (err) { setError(adminError(err, "Could not load system health")); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const run = async (name: string) => {
    setRunning(name);
    try {
      await adminApi.runJob(name);
      toast.success(`${name} ran`);
      load();
    } catch (err) {
      toast.error(adminError(err, `${name} failed`));
    } finally {
      setRunning(null);
    }
  };

  const usage = sys?.postcode.usage14d.reduce(
    (acc, u) => ({ upstream: acc.upstream + u.upstream, hits: acc.hits + u.cacheHits, failures: acc.failures + u.failures }),
    { upstream: 0, hits: 0, failures: 0 },
  );

  return (
    <>
      <PageTitle action={<Button small variant="ghost" onClick={load}>Refresh</Button>}>System &amp; audit</PageTitle>
      {error && <ErrorNote text={error} onRetry={load} />}
      {!sys && !error && <Loading />}
      {sys && usage && (
        <>
          <Card
            className="mb-4"
            title={<>Scheduled jobs <Badge tone={sys.jobs.healthy ? "good" : "bad"}>{sys.jobs.healthy ? "healthy" : "needs attention"}</Badge></>}
          >
            <Table head={["Job", "Every", "Last run", "Status", "Result", ""]}>
              {sys.jobs.items.map((j) => (
                <tr key={j.name}>
                  <td className="py-2 pr-3">
                    <span className="font-semibold">{j.name}</span>
                    <span className="block text-xs text-gray-500">{j.description}</span>
                  </td>
                  <td className="py-2 pr-3 text-xs whitespace-nowrap">{j.everyMinutes} min</td>
                  <td className="py-2 pr-3 text-xs whitespace-nowrap">{fmtDate(j.lastStartedAt, true)}</td>
                  <td className="py-2 pr-3">
                    <Badge tone={statusTone(j.lastStatus)}>{j.lastStatus}</Badge>{" "}
                    {j.overdue && <Badge tone="warn">overdue</Badge>}
                  </td>
                  <td className="py-2 pr-3 text-xs font-mono max-w-[240px] truncate" title={j.lastError ?? JSON.stringify(j.lastResult)}>
                    {j.lastError ?? (j.lastResult ? JSON.stringify(j.lastResult) : "—")}
                  </td>
                  <td className="py-2 text-right">
                    <Button small variant="ghost" disabled={running === j.name} onClick={() => run(j.name)}>
                      {running === j.name ? "Running…" : "Run now"}
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <StatTile label="Nigerian listings" value={fmt(sys.postcode.nigeriaListings)} />
            <StatTile label="With postcode" value={fmt(sys.postcode.withPostcode)}
              hint={sys.postcode.nigeriaListings ? `${Math.round((sys.postcode.withPostcode / sys.postcode.nigeriaListings) * 100)}% coverage · ${fmt(sys.postcode.verified)} verified` : undefined} />
            <StatTile label="NIPOST calls (14d)" value={fmt(usage.upstream)} hint={`${fmt(usage.hits)} served from cache`} />
            <StatTile label="NIPOST failures (14d)" value={fmt(usage.failures)} tone={usage.failures ? "warn" : undefined} />
          </div>
        </>
      )}

      <AuditLog />
    </>
  );
}

function AuditLog() {
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<AdminAuditRow> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try { setData(await adminApi.audit({ action, page, limit: 30 })); }
    catch (err) { setError(adminError(err, "Could not load the audit log")); }
  }, [action, page]);
  useEffect(() => { load(); }, [load]);

  const targetLink = (r: AdminAuditRow) => {
    if (!r.target_id) return "—";
    if (r.target_type === "user") return <a href={`/admin/users?id=${r.target_id}`} className="hover:underline font-mono">{r.target_id.slice(-8)}</a>;
    return <span className="font-mono">{r.target_id.length > 12 ? r.target_id.slice(-8) : r.target_id}</span>;
  };

  return (
    <Card
      title="Audit log"
      action={<Select ariaLabel="Action" value={action} onChange={(v) => { setAction(v); setPage(1); }}
        options={[{ value: "", label: "All actions" }, ...ACTIONS.map((a) => ({ value: a, label: a }))]} />}
    >
      {error && <ErrorNote text={error} onRetry={load} />}
      {!data && !error && <Loading />}
      {data && (
        <>
          <Table head={["When", "Admin", "Action", "Target", "Details"]}>
            {data.items.map((r) => (
              <tr key={r._id}>
                <td className="py-2 pr-3 text-xs whitespace-nowrap">{fmtDate(r.createdAt, true)}</td>
                <td className="py-2 pr-3 text-xs">{r.admin_name}</td>
                <td className="py-2 pr-3"><Badge tone="brand">{r.action}</Badge></td>
                <td className="py-2 pr-3 text-xs">{r.target_type} {targetLink(r)}</td>
                <td className="py-2 pr-3 text-xs font-mono max-w-[320px] truncate" title={JSON.stringify(r.details)}>
                  {r.details ? JSON.stringify(r.details) : "—"}
                </td>
              </tr>
            ))}
          </Table>
          {!data.items.length && <p className="text-sm text-gray-500 py-6 text-center">No admin actions yet.</p>}
          <Pager page={data.page} pages={data.pages} total={data.total} onPage={setPage} />
        </>
      )}
    </Card>
  );
}
