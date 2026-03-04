import React, { useEffect, useRef, useState } from 'react';
import { api, DashboardSummaryResponse, ConciergeMessageDto, MortgageRatesResponse } from '../lib/api';

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
  const [topRates, setTopRates] = useState<MortgageRatesResponse | null>(null);

  /* ---- Concierge chat state ---- */
  const INTRO_MSG: ConciergeMessageDto = {
    role: 'assistant',
    content: "Hi! I'm your Home Owner Concierge. What are you trying to do today with your home — save more, manage your budget, plan upkeep, or ask a question?",
    createdUtc: new Date().toISOString(),
  };
  const [chatMessages, setChatMessages] = useState<ConciergeMessageDto[]>([INTRO_MSG]);
  const [chatInput, setChatInput] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const [chatSize, setChatSize] = useState<'minimized' | 'normal' | 'expanded'>(() => {
    const saved = localStorage.getItem('concierge-size');
    if (saved === 'minimized' || saved === 'normal' || saved === 'expanded') return saved;
    return 'normal';
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    api.dashboard
      .summary()
      .then(setData)
      .catch(() => setError('Unable to load dashboard data.'))
      .finally(() => setLoading(false));

    api.market.topRates(30, 'fixed', 3)
      .then(setTopRates)
      .catch(() => { /* non-critical — rates card just won't show */ });
  }, []);

  /* Load chat history on mount */
  useEffect(() => {
    api.concierge.history(50)
      .then((res) => {
        if (res.messages.length > 0) setChatMessages(res.messages);
      })
      .catch(() => { /* first visit or not logged in — use intro */ });
  }, []);

  /* Auto-scroll when messages change */
  useEffect(scrollToBottom, [chatMessages]);

  const handleChatSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const msg = chatInput.trim();
    if (!msg || chatSending) return;

    const userMsg: ConciergeMessageDto = {
      role: 'user',
      content: msg,
      createdUtc: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatSending(true);

    try {
      const res = await api.concierge.send(msg);
      const assistantMsg: ConciergeMessageDto = {
        role: 'assistant',
        content: res.reply,
        createdUtc: res.createdUtc,
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.', createdUtc: new Date().toISOString() },
      ]);
    } finally {
      setChatSending(false);
    }
  };

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

  /* ---- welcome header helpers ---- */
  const welcomeSubtitle = (() => {
    if (data.monthlyTakeHome === null) {
      return 'Set Monthly Take Home in Profile to see your monthly snapshot.';
    }
    if (data.remainingThisMonth !== null && data.remainingThisMonth >= 0) {
      return `You have ${fmt(data.remainingThisMonth)} left after expenses this month.`;
    }
    return `You're ${fmt(Math.abs(data.remainingThisMonth ?? 0))} over budget this month.`;
  })();

  return (
    <div className="content-block">

      {/* ── Welcome Header ───────────────────────────────────── */}
      <div
        className="d-flex flex-wrap align-items-center justify-content-between mb-5"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)',
          borderRadius: 16,
          padding: '20px 28px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div className="d-flex align-items-start gap-3">
          <i className="fa-solid fa-hand-wave" style={{ color: '#f59e0b', fontSize: '1.3rem', marginTop: 4, flexShrink: 0 }} />
          <div>
            <h4 className="fw-bold mb-1" style={{ color: '#1e293b', fontSize: '1.35rem' }}>
              Welcome back, {data.displayName}
            </h4>
            <span style={{ color: '#64748b', fontSize: '0.95rem' }}>
            {welcomeSubtitle}
            {' '}
            {data.monthlyTakeHome !== null && (
              data.isInTheRed
                ? <span className="badge bg-danger ms-2" style={{ fontSize: '0.72rem', verticalAlign: 'middle' }}>
                    <i className="fa-solid fa-triangle-exclamation me-1" />In the red
                  </span>
                : <span className="badge ms-2" style={{ fontSize: '0.72rem', verticalAlign: 'middle', background: '#dcfce7', color: '#16a34a' }}>
                    <i className="fa-solid fa-circle-check me-1" />On track
                  </span>
            )}
          </span>
          </div>
        </div>
        <div className="d-flex gap-2 mt-2 mt-md-0">
          <a href="/profile" className="btn btn-sm btn-outline-primary" style={{ borderRadius: 10, fontSize: '0.85rem' }}>
            <i className="fa-solid fa-user-pen me-1" />Update Profile
          </a>
          <a href="/budget" className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 10, fontSize: '0.85rem' }}>
            <i className="fa-solid fa-plus me-1" />Add Budget Item
          </a>
        </div>
      </div>

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
        .concierge-panel {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 6px 24px rgba(11,34,56,0.07);
          border: 1px solid #edf0f4;
          padding: 0;
          display: flex;
          flex-direction: column;
          height: 420px;
          transition: height 0.3s ease, box-shadow 0.2s ease, transform 0.2s ease;
          overflow: hidden;
        }
        .concierge-panel.expanded {
          height: 820px;
        }
        .concierge-panel.minimized {
          height: auto;
        }
        .concierge-panel:hover {
          box-shadow: 0 10px 32px rgba(11,34,56,0.11);
          transform: translateY(-2px);
        }
        .concierge-header {
          padding: 16px 24px 12px;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 20px 20px 0 0;
        }
        .concierge-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .concierge-bubble {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 0.9rem;
          line-height: 1.45;
          word-wrap: break-word;
          white-space: pre-wrap;
        }
        .concierge-bubble.user {
          align-self: flex-end;
          background: #1e3a5f;
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        .concierge-bubble.assistant {
          align-self: flex-start;
          background: #f1f5f9;
          color: #1e293b;
          border-bottom-left-radius: 4px;
        }
        .concierge-input-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px 16px;
          border-top: 1px solid #f1f5f9;
        }
      `}</style>

      {!hasProfile && (
        <div className="alert alert-info py-2 mb-3">
          <i className="fa-solid fa-info-circle me-2" />
          Complete your <a href="/profile">Profile</a> to see your best-rate cards and income data.
        </div>
      )}

      {/* ── Home Owner Concierge Chat ── */}
      <div className="row g-4 justify-content-center mb-3">
        <div className="col-11">
          <div className={`concierge-panel ${chatSize}`}>
            <div className="concierge-header d-flex align-items-center gap-3">
              <i className="fa-solid fa-comments" style={{ color: '#2eb88a', fontSize: '1.3rem', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h5 className="fw-semibold mb-0" style={{ color: '#1e293b', fontSize: '1.15rem' }}>
                  Home Owner Concierge
                </h5>
                {chatSize !== 'minimized' && (
                  <small style={{ color: '#94a3b8' }}>Your AI home-ownership assistant</small>
                )}
              </div>
              <div className="d-flex gap-1">
                {chatSize !== 'minimized' && (
                  <button
                    className="btn btn-sm"
                    onClick={() => { setChatSize('minimized'); localStorage.setItem('concierge-size', 'minimized'); }}
                    title="Minimize chat"
                    style={{
                      color: '#64748b',
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                      padding: '4px 10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      background: '#fff',
                    }}
                  >
                    <i className="fa-solid fa-minus me-1" />Minimize
                  </button>
                )}
                {chatSize === 'minimized' && (
                  <button
                    className="btn btn-sm"
                    onClick={() => { setChatSize('normal'); localStorage.setItem('concierge-size', 'normal'); }}
                    title="Open chat"
                    style={{
                      color: '#64748b',
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                      padding: '4px 10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      background: '#fff',
                    }}
                  >
                    <i className="fa-solid fa-chevron-up me-1" />Open
                  </button>
                )}
                {chatSize === 'normal' && (
                  <button
                    className="btn btn-sm"
                    onClick={() => { setChatSize('expanded'); localStorage.setItem('concierge-size', 'expanded'); }}
                    title="Expand chat"
                    style={{
                      color: '#64748b',
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                      padding: '4px 10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      background: '#fff',
                    }}
                  >
                    <i className="fa-solid fa-expand me-1" />Expand
                  </button>
                )}
                {chatSize === 'expanded' && (
                  <button
                    className="btn btn-sm"
                    onClick={() => { setChatSize('normal'); localStorage.setItem('concierge-size', 'normal'); }}
                    title="Normal size"
                    style={{
                      color: '#64748b',
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                      padding: '4px 10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      background: '#fff',
                    }}
                  >
                    <i className="fa-solid fa-compress me-1" />Collapse
                  </button>
                )}
              </div>
            </div>

            {chatSize !== 'minimized' && (
              <>
                <div className="concierge-messages" ref={chatMessagesRef}>
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`concierge-bubble ${m.role}`}>
                      {m.content}
                    </div>
                  ))}
                  {chatSending && (
                    <div className="concierge-bubble assistant" style={{ fontStyle: 'italic', color: '#94a3b8' }}>
                      Thinking&hellip;
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form className="concierge-input-bar" onSubmit={handleChatSend}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ask me anything about home ownership…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={chatSending}
                    maxLength={4000}
                    style={{ borderRadius: 12, flex: 1 }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary d-flex align-items-center gap-1"
                    disabled={chatSending || !chatInput.trim()}
                    style={{ borderRadius: 12, padding: '0 16px', fontSize: '0.88rem', whiteSpace: 'nowrap', height: 38, position: 'relative', top: -4 }}
                  >
                    {chatSending ? (
                      <><i className="fa-solid fa-spinner fa-spin" /> Sending</>
                    ) : (
                      <><i className="fa-solid fa-paper-plane" /> Send</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="row g-4 justify-content-center align-items-start">
        {/* ── Left column: Monthly Snapshot (wider) ── */}
        <div className="col-8">
          <div className="snapshot-panel">
            {/* Title + subtitle */}
            <div className="mb-3">
              <h5 className="fw-semibold mb-1" style={{ color: '#1e293b', fontSize: '1.3rem' }}>Monthly Snapshot</h5>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Breakdown of your monthly cash flow</span>
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
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1 }}>Remaining</span>
                  <span
                    className="fw-bold"
                    style={{
                      fontSize: '1rem',
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
                        <span style={{ fontSize: '0.9rem', color: '#334155' }}>{s.label}</span>
                      </div>
                      <div className="text-end" style={{ marginLeft: 10 }}>
                        <span className="fw-semibold" style={{ fontSize: '0.9rem', color: '#1e293b' }}>{fmt(s.value)}</span>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: 4 }}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary metrics */}
            <div className="d-flex justify-content-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
              <div className="text-center">
                <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.82rem' }}>Income</small>
                <span className="fw-semibold" style={{ fontSize: '1.05rem', color: '#1e293b' }}>
                  {data.monthlyTakeHome !== null ? fmt(data.monthlyTakeHome) : '—'}
                </span>
              </div>
              <div className="text-center">
                <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.82rem' }}>Expenses</small>
                <span className="fw-semibold" style={{ fontSize: '1.05rem', color: '#1e293b' }}>{fmt(data.totalMonthlyExpenses)}</span>
              </div>
              <div className="text-center">
                <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.82rem' }}>Remaining</small>
                <span
                  className="fw-bold"
                  style={{ fontSize: '1.15rem', color: data.isInTheRed ? '#dc3545' : '#1a9e5c' }}
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
                    <small className="text-muted d-block" style={{ fontSize: '0.95rem', lineHeight: 1.2 }}>Mortgage Rate</small>
                    <span className="fw-semibold" style={{ fontSize: '1.6rem', lineHeight: 1.3 }}>
                      {data.currentMortgageRate !== null ? `${data.currentMortgageRate}%` : '—'}
                    </span>
                    <small className="text-muted d-block" style={{ fontSize: '0.8rem', lineHeight: 1.2 }}>as of {asOf}</small>
                  </div>
                </div>
              </div>
              <div className="card border-success" style={{ flex: 1, overflow: 'hidden' }}>
                <div className="card-body p-2 d-flex align-items-center justify-content-center">
                  <i className="fa-solid fa-circle-check text-success me-2" style={{ fontSize: '0.9rem' }} />
                  <div>
                    <small className="text-muted d-block" style={{ fontSize: '0.95rem', lineHeight: 1.2 }}>Homeowner's Insurance</small>
                    <span className="fw-semibold" style={{ fontSize: '1.6rem', lineHeight: 1.3 }}>
                      {data.homeOwnersInsuranceMonthly !== null ? fmt(data.homeOwnersInsuranceMonthly) : '—'}
                    </span>
                    <small className="text-muted d-block" style={{ fontSize: '0.8rem', lineHeight: 1.2 }}>as of {asOf}</small>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Top 3 Lowest Mortgage Rates ─────────────────────── */}
      {topRates && topRates.items.length > 0 && (
        <div className="row g-4 justify-content-center mt-2">
          <div className="col-11">
            <div
              style={{
                background: '#fff',
                borderRadius: 20,
                boxShadow: '0 6px 24px rgba(11,34,56,0.07)',
                border: '1px solid #edf0f4',
                padding: '24px 28px',
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h5 className="fw-semibold mb-0" style={{ color: '#1e293b', fontSize: '1.15rem' }}>
                    <i className="fa-solid fa-chart-line me-2" style={{ color: '#2eb88a' }} />
                    Top {topRates.items.length} Lowest {topRates.termYears}-Year {topRates.rateType === 'fixed' ? 'Fixed' : topRates.rateType} Rates
                  </h5>
                  <small style={{ color: '#94a3b8' }}>
                    As of {new Date(topRates.asOfUtc).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    {' · '}Source: {topRates.items[0]?.source ?? 'N/A'}
                  </small>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-sm mb-0" style={{ fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ color: '#64748b', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ fontWeight: 600 }}>Lender</th>
                      <th className="text-end" style={{ fontWeight: 600 }}>Rate</th>
                      <th className="text-end" style={{ fontWeight: 600 }}>APR</th>
                      <th className="text-end" style={{ fontWeight: 600 }}>Points</th>
                      <th style={{ fontWeight: 600 }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topRates.items.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="fw-medium" style={{ color: '#1e293b' }}>
                          {r.url
                            ? <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>{r.lender}</a>
                            : r.lender}
                        </td>
                        <td className="text-end fw-semibold" style={{ color: '#1e293b' }}>{r.rate.toFixed(3)}%</td>
                        <td className="text-end" style={{ color: '#64748b' }}>{r.apr.toFixed(3)}%</td>
                        <td className="text-end" style={{ color: '#64748b' }}>{r.points.toFixed(2)}</td>
                        <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{r.notes ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
