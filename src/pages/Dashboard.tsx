import React, { useEffect, useState } from 'react';
import { api, DashboardSummaryResponse } from '../lib/api';

/* ---------- helpers ---------- */

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

/** Build CSS conic-gradient string from slices with small gap between slices */
function buildConicGradient(slices: { label: string; value: number; color: string }[]) {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  if (total === 0) return 'conic-gradient(#dee2e6 0% 100%)';
  const GAP = 0.6; // degrees of gap between slices
  let cursor = 0;
  const stops: string[] = [];
  for (let i = 0; i < slices.length; i++) {
    const sl = slices[i];
    const pct = (sl.value / total) * 100;
    if (i > 0) {
      stops.push(`transparent ${cursor}% ${cursor + GAP / 3.6}%`);
      cursor += GAP / 3.6;
    }
    stops.push(`${sl.color} ${cursor}% ${cursor + pct - (i < slices.length - 1 ? GAP / 3.6 : 0)}%`);
    cursor += pct - (i < slices.length - 1 ? GAP / 3.6 : 0);
  }
  return `conic-gradient(${stops.join(', ')})`;
}

/** Modern fintech-inspired palette */
const CATEGORY_COLORS: Record<string, string> = {
  Housing: '#1e3a5f',
  Utilities: '#7c5cbf',
  Insurance: '#8b6cae',
  Debt: '#c2395a',
  Transportation: '#e8804c',
  Food: '#2eb88a',
  Other: '#8d99a6',
};

function colorFor(cat: string) {
  return CATEGORY_COLORS[cat] ?? '#adb5bd';
}

/* ---------- component ---------- */

export default function Dashboard() {
  const [data, setData] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.dashboard
      .summary()
      .then(setData)
      .catch(() => setError('Unable to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="content-block"><p>Loading dashboard&hellip;</p></div>;
  if (error) return <div className="content-block"><div className="alert alert-danger">{error}</div></div>;
  if (!data) return null;

  const hasProfile = data.profileUpdatedUtc !== null;
  const asOf = data.profileUpdatedUtc ? fmtDate(data.profileUpdatedUtc) : null;

  /* ---- pie slices ---- */
  const slices = data.expenseByCategory.map((c) => ({
    label: c.category,
    value: c.total,
    color: colorFor(c.category),
  }));
  // Add "Remaining" slice when positive
  if (data.remainingThisMonth !== null && data.remainingThisMonth > 0) {
    slices.push({ label: 'Remaining', value: data.remainingThisMonth, color: '#1a9e5c' });
  }
  const sliceTotal = slices.reduce((s, sl) => s + sl.value, 0);

  return (
    <div className="content-block">

      {/* ── "In the Red" Alert ───────────────────────────────── */}
      {data.isInTheRed && (
        <div className="alert alert-danger d-flex align-items-center py-2 mb-3" role="alert">
          <i className="fa-solid fa-triangle-exclamation me-2 fs-5" />
          <div>
            <strong>You are in the red this month.</strong> Your expenses exceed your take-home
            income by {fmt(Math.abs(data.remainingThisMonth ?? 0))}. Consider reviewing your budget.
          </div>
        </div>
      )}

      {/* ── Two-column: Rate cards (left) | Monthly Snapshot (right) ── */}
      <style>{`
        @keyframes donutFadeIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        .snapshot-panel {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 6px 24px rgba(11,34,56,0.07);
          border: 1px solid #edf0f4;
          padding: 28px;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .snapshot-panel:hover {
          box-shadow: 0 10px 32px rgba(11,34,56,0.11);
          transform: translateY(-2px);
        }
        .donut-wrap {
          animation: donutFadeIn 0.5s ease-out both;
        }
      `}</style>

      {!hasProfile && (
        <div className="alert alert-info py-2 mb-3">
          <i className="fa-solid fa-info-circle me-2" />
          Complete your <a href="/profile">Profile</a> to see your best-rate cards and income data.
        </div>
      )}

      <div className="row g-4 justify-content-center align-items-start">
        {/* ── Left column: Monthly Snapshot (wider) ── */}
        <div className="col-7">
          <div className="snapshot-panel">
            {/* Title + subtitle */}
            <div className="mb-3">
              <h5 className="fw-semibold mb-1" style={{ color: '#1e293b' }}>Monthly Snapshot</h5>
              <small style={{ color: '#94a3b8' }}>Breakdown of your monthly cash flow</small>
            </div>

            {/* Chart + legend */}
            <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
              {/* Donut chart */}
              <div className="donut-wrap" style={{ position: 'relative', width: 170, height: 170, flexShrink: 0 }}>
                <div
                  style={{
                    width: 170,
                    height: 170,
                    borderRadius: '50%',
                    background: buildConicGradient(slices),
                    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                  }}
                />
                {/* Center hole for donut */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 85,
                    height: 85,
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.6rem', color: '#94a3b8', lineHeight: 1 }}>Remaining</span>
                  <span
                    className="fw-bold"
                    style={{
                      fontSize: '0.85rem',
                      color: data.isInTheRed ? '#dc3545' : '#1a9e5c',
                      lineHeight: 1.3,
                    }}
                  >
                    {data.remainingThisMonth !== null ? fmt(data.remainingThisMonth) : '—'}
                  </span>
                </div>
              </div>

              {/* Vertical legend */}
              <div className="d-flex flex-column gap-2" style={{ minWidth: 150 }}>
                {slices.map((s) => {
                  const pct = sliceTotal > 0 ? ((s.value / sliceTotal) * 100).toFixed(1) : '0.0';
                  return (
                    <div key={s.label} className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 3,
                            backgroundColor: s.color,
                            marginRight: 8,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: '0.78rem', color: '#334155' }}>{s.label}</span>
                      </div>
                      <div className="text-end" style={{ marginLeft: 10 }}>
                        <span className="fw-semibold" style={{ fontSize: '0.78rem', color: '#1e293b' }}>{fmt(s.value)}</span>
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginLeft: 4 }}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary metrics */}
            <div className="d-flex justify-content-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
              <div className="text-center">
                <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>Income</small>
                <span className="fw-semibold" style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                  {data.monthlyTakeHome !== null ? fmt(data.monthlyTakeHome) : '—'}
                </span>
              </div>
              <div className="text-center">
                <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>Expenses</small>
                <span className="fw-semibold" style={{ fontSize: '0.9rem', color: '#1e293b' }}>{fmt(data.totalMonthlyExpenses)}</span>
              </div>
              <div className="text-center">
                <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>Remaining</small>
                <span
                  className="fw-bold"
                  style={{ fontSize: '1rem', color: data.isInTheRed ? '#dc3545' : '#1a9e5c' }}
                >
                  {data.remainingThisMonth !== null ? fmt(data.remainingThisMonth) : '—'}
                </span>
              </div>
            </div>

            {/* Status badge */}
            <div className="text-center mt-3">
              {data.isInTheRed ? (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 14px',
                    borderRadius: 20,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: '#fef2f2',
                    color: '#dc3545',
                    border: '1px solid #fecaca',
                  }}
                >
                  <i className="fa-solid fa-triangle-exclamation me-1" />
                  Over budget by {fmt(Math.abs(data.remainingThisMonth ?? 0))}
                </span>
              ) : data.remainingThisMonth !== null && data.remainingThisMonth > 0 ? (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 14px',
                    borderRadius: 20,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                  }}
                >
                  <i className="fa-solid fa-circle-check me-1" />
                  You're in good shape this month
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* ── Right column: Stacked rate cards (match snapshot height) ── */}
        <div className="col-3 d-flex flex-column gap-2" style={{ alignSelf: 'stretch' }}>
          {hasProfile && (
            <>
              <div className="card border-success" style={{ flex: 1, overflow: 'hidden' }}>
                <div className="card-body p-2 d-flex align-items-center justify-content-center">
                  <i className="fa-solid fa-circle-check text-success me-2" style={{ fontSize: '0.9rem' }} />
                  <div>
                    <small className="text-muted d-block" style={{ fontSize: '0.68rem', lineHeight: 1.1 }}>Mortgage Rate</small>
                    <span className="fw-semibold" style={{ fontSize: '1.1rem', lineHeight: 1.2 }}>
                      {data.currentMortgageRate !== null ? `${data.currentMortgageRate}%` : '—'}
                    </span>
                    <small className="text-muted d-block" style={{ fontSize: '0.6rem', lineHeight: 1.1 }}>as of {asOf}</small>
                  </div>
                </div>
              </div>
              <div className="card border-success" style={{ flex: 1, overflow: 'hidden' }}>
                <div className="card-body p-2 d-flex align-items-center justify-content-center">
                  <i className="fa-solid fa-circle-check text-success me-2" style={{ fontSize: '0.9rem' }} />
                  <div>
                    <small className="text-muted d-block" style={{ fontSize: '0.68rem', lineHeight: 1.1 }}>Homeowner's Insurance</small>
                    <span className="fw-semibold" style={{ fontSize: '1.1rem', lineHeight: 1.2 }}>
                      {data.homeOwnersInsuranceMonthly !== null ? fmt(data.homeOwnersInsuranceMonthly) : '—'}
                    </span>
                    <small className="text-muted d-block" style={{ fontSize: '0.6rem', lineHeight: 1.1 }}>as of {asOf}</small>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
