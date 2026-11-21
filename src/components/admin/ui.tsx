"use client";

// Small building blocks for the admin dashboard: stat tiles, a daily bar chart,
// ranked bars, tables, pager and a confirm dialog. Brand colours only.
import { ReactNode, useEffect, useState } from "react";

export const BRAND = "#164e66";
export const BRAND_SOFT = "#e0f0f5";

export const fmt = (n: number | null | undefined) =>
  n == null ? "—" : new Intl.NumberFormat("en", { notation: n >= 100000 ? "compact" : "standard" }).format(n);

export const fmtDate = (d?: string | null, withTime = false) =>
  d ? new Date(d).toLocaleString("en-GB", withTime
    ? { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
    : { day: "2-digit", month: "short", year: "numeric" }) : "—";

export const label = (s: string) => s.replace(/[_-]/g, " ").replace(/^\w/, (c) => c.toUpperCase());

// ─── Layout pieces ───────────────────────────────────────────────────────────

export function Card({ title, action, children, className = "" }: {
  title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <section className={`bg-white rounded-2xl border border-gray-200 p-4 min-w-0 ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-2 mb-3">
          {title && <h2 className="text-sm font-bold text-[#143d4d]">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <h1 className="text-xl font-extrabold text-[#143d4d]" style={{ fontFamily: "var(--font-raleway), sans-serif" }}>
        {children}
      </h1>
      {action}
    </div>
  );
}

export function StatTile({ label: text, value, hint, tone }: {
  label: string; value: ReactNode; hint?: ReactNode; tone?: "warn";
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 min-w-0">
      <p className="text-xs font-semibold text-gray-500 truncate">{text}</p>
      <p className={`text-2xl font-extrabold mt-1 tabular-nums ${tone === "warn" ? "text-[#b45309]" : "text-[#111827]"}`}>
        {value}
      </p>
      {hint && <p className="text-[11px] text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" | "bad" | "brand" }) {
  const tones = {
    neutral: "bg-gray-100 text-gray-700",
    good: "bg-green-50 text-green-800",
    warn: "bg-amber-50 text-amber-800",
    bad: "bg-red-50 text-red-700",
    brand: "bg-[#e0f0f5] text-[#164e66]",
  };
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${tones[tone]}`}>{children}</span>;
}

export const statusTone = (s?: string): "good" | "warn" | "bad" | "neutral" | "brand" => {
  switch (s) {
    case "available": case "active": case "ok": return "good";
    case "expired": case "unavailable": case "running": return "warn";
    case "suspended": case "failed": return "bad";
    case "rented": case "sold": return "brand";
    default: return "neutral";
  }
};

export function Loading({ text = "Loading…" }: { text?: string }) {
  return <p className="text-sm text-gray-400 py-6 text-center">{text}</p>;
}

export function ErrorNote({ text, onRetry }: { text: string; onRetry?: () => void }) {
  return (
    <p className="text-sm text-red-600 py-3">
      {text}{" "}
      {onRetry && <button type="button" onClick={onRetry} className="underline font-semibold">Retry</button>}
    </p>
  );
}

// ─── Buttons & inputs ────────────────────────────────────────────────────────

export function Button({ children, onClick, variant = "primary", disabled, type = "button", small }: {
  children: ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "danger";
  disabled?: boolean; type?: "button" | "submit"; small?: boolean;
}) {
  const v = {
    primary: "bg-[#164e66] text-white hover:bg-[#123f53]",
    ghost: "border border-[#164e66] text-[#164e66] hover:bg-[#e0f0f5]",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${v} ${small ? "px-2.5 py-1 text-xs" : "px-3.5 py-2 text-sm"} rounded-xl font-semibold transition-colors disabled:opacity-50 whitespace-nowrap`}
    >
      {children}
    </button>
  );
}

export const inputCls =
  "rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#164e66]/30 min-w-0";

export function Select({ value, onChange, options, ariaLabel }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; ariaLabel: string;
}) {
  return (
    <select aria-label={ariaLabel} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

/** Text input that reports its value after the person stops typing. */
export function SearchInput({ onSearch, placeholder }: { onSearch: (q: string) => void; placeholder: string }) {
  const [q, setQ] = useState("");
  useEffect(() => {
    const t = setTimeout(() => onSearch(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q, onSearch]);
  return (
    <input
      type="search"
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={`${inputCls} w-full sm:w-64`}
    />
  );
}

export function Pager({ page, pages, total, onPage }: { page: number; pages: number; total: number; onPage: (p: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-2 pt-3 text-xs text-gray-600">
      <span>{fmt(total)} total</span>
      <div className="flex items-center gap-2">
        <Button small variant="ghost" disabled={page <= 1} onClick={() => onPage(page - 1)}>Prev</Button>
        <span className="tabular-nums">{page} / {pages}</span>
        <Button small variant="ghost" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</Button>
      </div>
    </div>
  );
}

/** Horizontally scrollable table wrapper so wide tables never stretch the page. */
export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-gray-500 border-b">
            {head.map((h) => <th key={h} className="py-2 pr-3 font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  );
}

// ─── Dialog ──────────────────────────────────────────────────────────────────

export function Dialog({ open, title, onClose, children }: {
  open: boolean; title: string; onClose: () => void; children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-500 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-bold text-[#143d4d] mb-3">{title}</h3>
        {children}
      </div>
    </div>
  );
}

/**
 * Confirm a destructive or important action. With `reasonLabel`, a reason is
 * asked for (and required when `reasonRequired`).
 */
export function ConfirmDialog({ open, title, message, confirmLabel, danger, reasonLabel, reasonRequired,
  extra, busy, onCancel, onConfirm }: {
  open: boolean; title: string; message: ReactNode; confirmLabel: string; danger?: boolean;
  reasonLabel?: string; reasonRequired?: boolean; extra?: ReactNode; busy?: boolean;
  onCancel: () => void; onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  useEffect(() => { if (open) setReason(""); }, [open]);
  return (
    <Dialog open={open} title={title} onClose={onCancel}>
      <div className="text-sm text-gray-700 mb-3">{message}</div>
      {reasonLabel && (
        <label className="block mb-3">
          <span className="text-xs font-semibold text-gray-600">{reasonLabel}</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            maxLength={500}
            className={`${inputCls} w-full mt-1`}
          />
        </label>
      )}
      {extra}
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button
          variant={danger ? "danger" : "primary"}
          disabled={busy || (reasonRequired && !reason.trim())}
          onClick={() => onConfirm(reason.trim())}
        >
          {busy ? "Working…" : confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}

// ─── Charts ──────────────────────────────────────────────────────────────────

/**
 * Daily counts as thin columns (one series, brand colour), with a hover/focus
 * tooltip per day. Columns share a baseline; rounded tops only.
 */
export function DailyBars({ points, height = 160, unit }: {
  points: { date: string; count: number }[]; height?: number; unit: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...points.map((p) => p.count));
  const ticks = [max, Math.round(max / 2), 0];
  const active = hover != null ? points[hover] : null;

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="flex flex-col justify-between text-[10px] text-gray-400 tabular-nums text-right w-7 shrink-0" style={{ height }}>
          {ticks.map((t, i) => <span key={i}>{fmt(t)}</span>)}
        </div>
        <div
          className="relative flex-1 flex items-end gap-[2px] border-b border-gray-200"
          style={{ height }}
          onMouseLeave={() => setHover(null)}
        >
          {[0.5, 1].map((f) => (
            <div key={f} className="absolute left-0 right-0 border-t border-dashed border-gray-100 pointer-events-none" style={{ bottom: `${f * 100}%` }} />
          ))}
          {points.map((p, i) => (
            <button
              key={p.date}
              type="button"
              aria-label={`${p.date}: ${p.count} ${unit}`}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className="relative flex-1 h-full flex items-end focus:outline-none"
            >
              <span
                className="block w-full rounded-t-[4px] transition-opacity"
                style={{
                  height: `${(p.count / max) * 100}%`,
                  minHeight: p.count ? 2 : 0,
                  background: BRAND,
                  opacity: hover == null || hover === i ? 1 : 0.45,
                }}
              />
            </button>
          ))}
          {active && hover != null && (
            <div
              className="absolute -top-2 -translate-y-full -translate-x-1/2 bg-[#111827] text-white text-[11px] rounded-lg px-2 py-1 whitespace-nowrap pointer-events-none z-10"
              style={{ left: `${((hover + 0.5) / points.length) * 100}%` }}
            >
              <span className="font-bold tabular-nums">{fmt(active.count)}</span> {unit} · {fmtDate(active.date)}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1 pl-9">
        <span>{points[0] && fmtDate(points[0].date)}</span>
        <span>{points.at(-1) && fmtDate(points.at(-1)!.date)}</span>
      </div>
    </div>
  );
}

/** Ranked horizontal bars for a breakdown (`{key: count}`), largest first, labels and values in text ink. */
export function RankedBars({ data, limit = 8, empty = "No data yet" }: {
  data: Record<string, number> | { key: string; count: number }[]; limit?: number; empty?: string;
}) {
  const rows = (Array.isArray(data) ? data : Object.entries(data).map(([key, count]) => ({ key, count })))
    .sort((a, b) => b.count - a.count);
  const shown = rows.slice(0, limit);
  const rest = rows.slice(limit).reduce((s, r) => s + r.count, 0);
  if (rest) shown.push({ key: "Other", count: rest });
  const max = Math.max(1, ...shown.map((r) => r.count));
  const total = rows.reduce((s, r) => s + r.count, 0);

  if (!shown.length) return <p className="text-xs text-gray-400">{empty}</p>;
  return (
    <ul className="flex flex-col gap-2">
      {shown.map((r) => (
        <li key={r.key} title={`${label(r.key)}: ${r.count} (${total ? Math.round((r.count / total) * 100) : 0}%)`}>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-gray-700 truncate">{label(r.key)}</span>
            <span className="text-gray-900 font-semibold tabular-nums ml-2">
              {fmt(r.count)} <span className="text-gray-400 font-normal">{total ? Math.round((r.count / total) * 100) : 0}%</span>
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div className="h-2 rounded-full" style={{ width: `${(r.count / max) * 100}%`, background: BRAND }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
