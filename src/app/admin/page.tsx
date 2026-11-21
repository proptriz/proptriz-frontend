"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { adminApi, adminError } from "@/services/adminApi";
import { AdminBreakdowns, AdminLeaderboards, AdminOverview, AdminTimeseries, SeriesMetric } from "@/types/admin";
import {
  Card, DailyBars, ErrorNote, Loading, PageTitle, RankedBars, Select, StatTile, fmt, Badge, statusTone, Button,
} from "@/components/admin/ui";

const METRICS: { value: SeriesMetric; label: string; unit: string }[] = [
  { value: "users", label: "New users", unit: "sign-ups" },
  { value: "logins", label: "Last sign-in", unit: "users" },
  { value: "properties", label: "New listings", unit: "listings" },
  { value: "contacts", label: "Enquiries", unit: "contacts" },
  { value: "reviews", label: "Reviews", unit: "reviews" },
  { value: "alerts", label: "Alerts created", unit: "alerts" },
];
const RANGES = [{ value: "7", label: "7 days" }, { value: "30", label: "30 days" }, { value: "90", label: "90 days" }];

const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "—");

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [breakdowns, setBreakdowns] = useState<AdminBreakdowns | null>(null);
  const [boards, setBoards] = useState<AdminLeaderboards | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [metric, setMetric] = useState<SeriesMetric>("users");
  const [days, setDays] = useState("30");
  const [series, setSeries] = useState<AdminTimeseries | null>(null);
  const [seriesError, setSeriesError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [o, b, l] = await Promise.all([adminApi.overview(), adminApi.breakdowns(), adminApi.leaderboards(8)]);
      setOverview(o); setBreakdowns(b); setBoards(l);
    } catch (err) {
      setError(adminError(err, "Could not load the dashboard"));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let live = true;
    setSeriesError(null);
    adminApi.timeseries(metric, Number(days))
      .then((s) => live && setSeries(s))
      .catch((err) => live && setSeriesError(adminError(err, "Could not load the chart")));
    return () => { live = false; };
  }, [metric, days]);

  const unit = METRICS.find((m) => m.value === metric)?.unit ?? "";

  return (
    <>
      <PageTitle action={<Button variant="ghost" small onClick={load}>Refresh</Button>}>Overview</PageTitle>
      {error && <ErrorNote text={error} onRetry={load} />}
      {!overview && !error && <Loading />}

      {overview && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <StatTile label="Users" value={fmt(overview.users.total)} hint={`+${fmt(overview.users.new7d)} this week · +${fmt(overview.users.new30d)} in 30d`} />
            <StatTile label="Active users (30d)" value={fmt(overview.users.active30d)}
              hint={`${fmt(overview.users.active7d)} in 7d · ${pct(overview.users.active30d, overview.users.total)} of all`} />
            <StatTile label="Listings" value={fmt(overview.properties.total)}
              hint={`${fmt(overview.properties.available)} available · +${fmt(overview.properties.new30d)} in 30d`} />
            <StatTile label="Enquiries (30d)" value={fmt(overview.contacts.new30d)} hint={`${fmt(overview.contacts.total)} all time`} />
            <StatTile label="Reviews" value={fmt(overview.reviews.total)}
              hint={`avg ${overview.reviews.averageRating ?? "—"} ★ · +${fmt(overview.reviews.new30d)} in 30d`} />
            <StatTile label="Push-ready devices" value={fmt(overview.engagement.liveDevices)}
              hint={`${fmt(overview.engagement.pushOptIn)} push · ${fmt(overview.engagement.emailOptIn)} email opt-ins`} />
            <StatTile label="Expiring in 7 days" value={fmt(overview.properties.expiringIn7d)} hint="Available listings" />
            <StatTile
              label="Past expiry, still live"
              value={fmt(overview.properties.staleAvailable)}
              tone={overview.properties.staleAvailable ? "warn" : undefined}
              hint={overview.properties.staleAvailable
                ? <Link href="/admin/properties?stale=true" className="underline font-semibold">Review &amp; expire</Link>
                : "Nothing to clean up"}
            />
          </div>

          <Card
            className="mb-4"
            title={`${METRICS.find((m) => m.value === metric)?.label} per day${series ? ` · ${fmt(series.total)} total` : ""}`}
            action={
              <div className="flex gap-2">
                <Select ariaLabel="Metric" value={metric} onChange={(v) => setMetric(v as SeriesMetric)}
                  options={METRICS.map(({ value, label }) => ({ value, label }))} />
                <Select ariaLabel="Range" value={days} onChange={setDays} options={RANGES} />
              </div>
            }
          >
            {seriesError ? <ErrorNote text={seriesError} /> : series ? <DailyBars points={series.points} unit={unit} /> : <Loading />}
          </Card>

          <div className="grid md:grid-cols-3 gap-3 mb-4">
            <Card title="Listings by status"><RankedBars data={overview.properties.byStatus} /></Card>
            <Card title="Listings by category">{breakdowns ? <RankedBars data={breakdowns.properties.category} /> : <Loading />}</Card>
            <Card title="Top regions">
              {breakdowns ? <RankedBars data={breakdowns.properties.topRegions.map((r) => ({ key: r.region, count: r.count }))} /> : <Loading />}
            </Card>
            <Card title="Rent vs sale">{breakdowns ? <RankedBars data={breakdowns.properties.listedFor} /> : <Loading />}</Card>
            <Card title="Sign-in method">{breakdowns ? <RankedBars data={breakdowns.users.authProvider} /> : <Loading />}</Card>
            <Card title="Enquiry channel"><RankedBars data={overview.contacts.byChannel} /></Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-3">
            <Card title="Top listers">
              {boards ? (
                <ol className="flex flex-col gap-2 text-sm">
                  {boards.topListers.map((r) => (
                    <li key={r.userId} className="flex items-center justify-between gap-2">
                      <Link href={`/admin/users?id=${r.userId}`} className="truncate hover:underline">
                        {r.user?.display_name ?? r.username}
                        {r.user?.status === "suspended" && <> <Badge tone="bad">suspended</Badge></>}
                      </Link>
                      <span className="tabular-nums text-gray-700 shrink-0">{r.listings} <span className="text-gray-400">({r.available} live)</span></span>
                    </li>
                  ))}
                </ol>
              ) : <Loading />}
            </Card>
            <Card title="Most enquired listings">
              {boards ? (
                <ol className="flex flex-col gap-2 text-sm">
                  {boards.mostContacted.map((r) => (
                    <li key={r.propertyId} className="flex items-center justify-between gap-2">
                      <Link href={`/property/details/${r.propertyId}`} target="_blank" className="truncate hover:underline">
                        {r.property?.title ?? "Deleted listing"}
                      </Link>
                      <span className="tabular-nums text-gray-700 shrink-0">{r.contacts}</span>
                    </li>
                  ))}
                  {!boards.mostContacted.length && <li className="text-xs text-gray-400">No enquiries yet</li>}
                </ol>
              ) : <Loading />}
            </Card>
            <Card title="Best rated">
              {boards ? (
                <ol className="flex flex-col gap-2 text-sm">
                  {boards.topRated.map((p) => (
                    <li key={p._id} className="flex items-center justify-between gap-2">
                      <span className="truncate">{p.title} <Badge tone={statusTone(p.status)}>{p.status}</Badge></span>
                      <span className="tabular-nums text-gray-700 shrink-0">{p.average_rating.toFixed(1)}★ <span className="text-gray-400">({p.review_count})</span></span>
                    </li>
                  ))}
                  {!boards.topRated.length && <li className="text-xs text-gray-400">No reviews yet</li>}
                </ol>
              ) : <Loading />}
            </Card>
          </div>

          <p className="text-[11px] text-gray-400 mt-4">
            Updated {new Date(overview.generatedAt).toLocaleString()} · {fmt(overview.users.admins)} admins · {fmt(overview.users.suspended)} suspended ·{" "}
            {fmt(overview.landmarks.total)} landmarks · {pct(overview.users.onboardingCompleted, overview.users.total)} finished onboarding
          </p>
        </>
      )}
    </>
  );
}
