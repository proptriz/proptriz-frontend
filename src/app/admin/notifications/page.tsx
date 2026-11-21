"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminApi, adminError } from "@/services/adminApi";
import { AdminNotificationStats } from "@/types/admin";
import {
  Button, Card, ConfirmDialog, ErrorNote, Loading, PageTitle, RankedBars, Select, StatTile, fmt, inputCls,
} from "@/components/admin/ui";

export default function AdminNotificationsPage() {
  const [days, setDays] = useState("30");
  const [stats, setStats] = useState<AdminNotificationStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState({ title: "", body: "", path: "" });
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try { setStats(await adminApi.notificationStats(Number(days))); }
    catch (err) { setError(adminError(err, "Could not load alert stats")); }
  }, [days]);
  useEffect(() => { load(); }, [load]);

  const send = async () => {
    setBusy(true);
    try {
      const res = await adminApi.broadcast({ ...msg, path: msg.path.trim() || undefined });
      toast.success(`Sent to ${fmt(res.inbox)} inboxes and ${fmt(res.push.successCount)} devices`);
      setConfirm(false);
      setMsg({ title: "", body: "", path: "" });
      load();
    } catch (err) {
      toast.error(adminError(err, "Broadcast failed"));
    } finally {
      setBusy(false);
    }
  };

  const valid = msg.title.trim() && msg.body.trim() && (!msg.path || msg.path.startsWith("/"));

  return (
    <>
      <PageTitle action={
        <Select ariaLabel="Range" value={days} onChange={setDays}
          options={[{ value: "7", label: "7 days" }, { value: "30", label: "30 days" }, { value: "90", label: "90 days" }]} />
      }>
        Alerts
      </PageTitle>

      {error && <ErrorNote text={error} onRetry={load} />}
      {!stats && !error && <Loading />}
      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <StatTile label="Alerts created" value={fmt(stats.total)} hint={`last ${stats.days} days`} />
            <StatTile label="Opened" value={fmt(stats.opened)} hint={`${Math.round(stats.openRate * 100)}% open rate`} />
            <StatTile label="Push sent" value={fmt(stats.push.sent ?? 0)} hint={`${fmt(stats.push.failed ?? 0)} failed`} tone={(stats.push.failed ?? 0) > (stats.push.sent ?? 0) ? "warn" : undefined} />
            <StatTile label="Email sent" value={fmt(stats.email.sent ?? 0)} hint={`${fmt(stats.email.failed ?? 0)} failed`} />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <Card title="By type"><RankedBars data={stats.byType} /></Card>
            <Card title="Push outcome"><RankedBars data={stats.push} /></Card>
            <Card title="Email outcome"><RankedBars data={stats.email} /></Card>
            <Card title="Opened from"><RankedBars data={stats.openedVia} empty="Nothing opened yet" /></Card>
          </div>
        </>
      )}

      <Card title="Broadcast to all users" className="max-w-2xl">
        <p className="text-xs text-gray-600 mb-3">
          Puts a message in every active user&apos;s inbox and pushes it to devices of people who turned push on.
          No email is sent. Quiet hours are not applied, so use this sparingly.
        </p>
        <div className="flex flex-col gap-2">
          <input className={inputCls} placeholder="Title" maxLength={120} value={msg.title}
            onChange={(e) => setMsg({ ...msg, title: e.target.value })} aria-label="Broadcast title" />
          <textarea className={inputCls} placeholder="Message" rows={3} maxLength={500} value={msg.body}
            onChange={(e) => setMsg({ ...msg, body: e.target.value })} aria-label="Broadcast message" />
          <input className={inputCls} placeholder="Link path, e.g. /explore (optional)" value={msg.path}
            onChange={(e) => setMsg({ ...msg, path: e.target.value })} aria-label="Link path" />
          <div><Button disabled={!valid} onClick={() => setConfirm(true)}>Review &amp; send</Button></div>
        </div>
      </Card>

      <ConfirmDialog
        open={confirm}
        title="Send to every user?"
        message={<><strong>{msg.title}</strong><br />{msg.body}</>}
        confirmLabel="Send broadcast"
        danger
        busy={busy}
        onCancel={() => setConfirm(false)}
        onConfirm={send}
      />
    </>
  );
}
