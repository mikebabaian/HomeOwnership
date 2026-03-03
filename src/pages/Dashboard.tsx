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

/** Build CSS conic-gradient string from slices */
function buildConicGradient(slices: { label: string; value: number; color: string }[]) {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  if (total === 0) return 'conic-gradient(#dee2e6 0% 100%)';
  let cursor = 0;
  const stops: string[] = [];
  for (const sl of slices) {
    const pct = (sl.value / total) * 100;
    stops.push(`${sl.color} ${cursor}% ${cursor + pct}%`);
    cursor += pct;
  }
  return `conic-gradient(${stops.join(', ')})`;
}

const CATEGORY_COLORS: Record<string, string> = {
  Housing: '#0d6efd',
  Utilities: '#6610f2',
  Insurance: '#6f42c1',
  Debt: '#d63384',
  Transportation: '#fd7e14',
  Food: '#20c997',
  Other: '#6c757d',
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
    slices.push({ label: 'Remaining', value: data.remainingThisMonth, color: '#198754' });
  }

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

      {/* ── Best-Rate Cards (always side-by-side) ────────────── */}
      {hasProfile && (
        <div className="row g-5 justify-content-center mb-3">
          <div className="col-5">
            <div className="card border-success h-100">
              <div className="card-body py-2 px-3 d-flex align-items-center">
                <i className="fa-solid fa-circle-check text-success fs-4 me-3" />
                <div>
                  <small className="text-muted d-block">Mortgage Rate</small>
                  <span className="fs-3 fw-semibold">
                    {data.currentMortgageRate !== null ? `${data.currentMortgageRate}%` : '—'}
                  </span>
                  <small className="text-muted d-block">Best Rate as of {asOf}</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-5">
            <div className="card border-success h-100">
              <div className="card-body py-2 px-3 d-flex align-items-center">
                <i className="fa-solid fa-circle-check text-success fs-4 me-3" />
                <div>
                  <small className="text-muted d-block">Homeowner's Insurance</small>
                  <span className="fs-3 fw-semibold">
                    {data.homeOwnersInsuranceMonthly !== null ? fmt(data.homeOwnersInsuranceMonthly) : '—'}
                  </span>
                  <small className="text-muted d-block">Best Rate as of {asOf}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!hasProfile && (
        <div className="alert alert-info py-2 mb-3">
          <i className="fa-solid fa-info-circle me-2" />
          Complete your <a href="/profile">Profile</a> to see your best-rate cards and income data.
        </div>
      )}

      {/* ── Two-column: Budget Summary (left) | Pie Chart (right) */}
      <div className="row g-5 justify-content-center align-items-start">
        {/* Left column — stacked summary + category table */}
        <div className="col-5">
          <h6 className="mb-2">Budget Summary</h6>

          {/* Stacked stat cards */}
          <div className="d-flex flex-column mb-3">
            <div className="d-flex justify-content-between align-items-center border rounded px-3" style={{ height: 32 }}>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Take Home</span>
              <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>
                {data.monthlyTakeHome !== null ? fmt(data.monthlyTakeHome) : '—'}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center border rounded px-3 mt-1" style={{ height: 32 }}>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Expenses</span>
              <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>{fmt(data.totalMonthlyExpenses)}</span>
            </div>
            <div className={`d-flex justify-content-between align-items-center border rounded px-3 mt-1 ${data.isInTheRed ? 'border-danger' : 'border-success'}`} style={{ height: 32 }}>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Remaining</span>
              <span className={`fw-semibold ${data.isInTheRed ? 'text-danger' : 'text-success'}`} style={{ fontSize: '0.85rem' }}>
                {data.remainingThisMonth !== null ? fmt(data.remainingThisMonth) : '—'}
              </span>
            </div>
          </div>

          {/* Category breakdown table */}
          {data.expenseByCategory.length > 0 && (
            <>
              <h6 className="mb-1" style={{ fontSize: '0.85rem' }}>Expenses by Category</h6>
              <table className="table table-sm mb-0" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr><th>Category</th><th className="text-end">Amount</th></tr>
                </thead>
                <tbody>
                  {data.expenseByCategory.map((c) => (
                    <tr key={c.category}>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            width: 10,
                            height: 10,
                            borderRadius: 2,
                            backgroundColor: colorFor(c.category),
                            marginRight: 6,
                          }}
                        />
                        {c.category}
                      </td>
                      <td className="text-end">{fmt(c.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Right column — pie chart */}
        <div className="col-5 text-center">
          <h6 className="mb-2">Monthly Snapshot</h6>
          <div
            style={{
              width: 190,
              height: 190,
              borderRadius: '50%',
              background: buildConicGradient(slices),
              margin: '0 auto',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          />
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
            {slices.map((s) => (
              <span key={s.label} className="d-flex align-items-center" style={{ fontSize: '0.78rem' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    backgroundColor: s.color,
                    marginRight: 5,
                  }}
                />
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
