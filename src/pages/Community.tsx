import React, { useState, useEffect, useCallback } from 'react';
import { api, ThreadSummaryDto, ThreadDetailDto, ProfileResponse } from '../lib/api';

/* ── helpers ────────────────────────────────────────────────────────────── */

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

/* ── component ──────────────────────────────────────────────────────────── */

export default function Community() {
  const [threads, setThreads] = useState<ThreadSummaryDto[]>([]);
  const [selectedThread, setSelectedThread] = useState<ThreadDetailDto | null>(null);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New thread form
  const [showNewThread, setShowNewThread] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [creating, setCreating] = useState(false);

  // Reply form
  const [replyBody, setReplyBody] = useState('');
  const [replying, setReplying] = useState(false);

  const hasUsername = !!profile?.messageBoardUserName;

  const loadThreads = useCallback(async () => {
    try {
      const [t, p] = await Promise.all([api.community.threads(), api.profile.get()]);
      setThreads(t);
      setProfile(p);
    } catch {
      setError('Failed to load community threads.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  /* ── Open a thread ── */
  const openThread = async (id: number) => {
    setError('');
    try {
      const detail = await api.community.thread(id);
      setSelectedThread(detail);
    } catch {
      setError('Failed to load thread.');
    }
  };

  const closeThread = () => {
    setSelectedThread(null);
    setReplyBody('');
    loadThreads(); // refresh counts
  };

  /* ── Create thread ── */
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    setCreating(true);
    setError('');
    try {
      const created = await api.community.createThread(newTitle.trim(), newBody.trim());
      setNewTitle('');
      setNewBody('');
      setShowNewThread(false);
      await openThread(created.id);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create thread.');
    } finally {
      setCreating(false);
    }
  };

  /* ── Reply ── */
  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim() || !selectedThread) return;
    setReplying(true);
    setError('');
    try {
      await api.community.createPost(selectedThread.id, replyBody.trim());
      setReplyBody('');
      await openThread(selectedThread.id); // refresh
    } catch (err: any) {
      setError(err?.message ?? 'Failed to post reply.');
    } finally {
      setReplying(false);
    }
  };

  /* ── Render ── */

  if (loading) {
    return <div className="content-block"><p>Loading community&hellip;</p></div>;
  }

  // ── Two-column layout: Thread list (left) | Detail / New thread (right) ──
  return (
    <div className="content-block">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h4 className="mb-0">Community</h4>
        {hasUsername && !selectedThread && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowNewThread(!showNewThread)}>
            {showNewThread ? 'Cancel' : '+ New Thread'}
          </button>
        )}
      </div>

      {!selectedThread && !showNewThread && threads.length > 0 && (
        <p className="text-muted mb-3">Select a thread to view the conversation.</p>
      )}

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {!hasUsername && (
        <div className="alert alert-info py-2">
          <i className="fa-solid fa-info-circle me-2" />
          <a href="/profile">Set your Message Board username in Profile</a> to start threads and reply.
        </div>
      )}

      {/* ── Thread cards: 2 per row at col-5 ── */}
      {threads.length === 0 && !showNewThread ? (
        <p className="text-muted">No threads yet. Be the first to start a conversation!</p>
      ) : (
        <div className="row g-3 justify-content-center mb-3">
          {threads.map((t) => (
            <div key={t.id} className="col-5">
              <div
                className="card h-100"
                style={{
                  cursor: 'pointer',
                  borderColor: selectedThread?.id === t.id ? 'var(--hos-primary)' : undefined,
                }}
                onClick={() => openThread(t.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openThread(t.id)}
              >
                <div className="card-body py-2 px-3 d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{t.title}</strong>
                    <small className="text-muted d-block">
                      by {t.createdByDisplayName} &middot; {timeAgo(t.updatedUtc)}
                    </small>
                  </div>
                  <span className="badge bg-secondary">{t.replyCount} {t.replyCount === 1 ? 'post' : 'posts'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── New thread form (full width, centered) ── */}
      {showNewThread && !selectedThread && (
        <div className="row justify-content-center mb-3">
          <div className="col-10">
            <form onSubmit={handleCreateThread} className="card">
              <div className="card-body py-2 px-3">
                <h6 className="mb-2">New Thread</h6>
                <input
                  className="form-control mb-2"
                  type="text"
                  placeholder="Thread title"
                  maxLength={200}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <textarea
                  className="form-control mb-2"
                  rows={3}
                  placeholder="What's on your mind?"
                  maxLength={4000}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                />
                <button
                  className="btn btn-primary btn-sm"
                  disabled={creating || !newTitle.trim() || !newBody.trim()}
                >
                  {creating ? 'Creating…' : 'Create Thread'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Thread detail (full width, centered) ── */}
      {selectedThread && (
        <div className="row justify-content-center">
          <div className="col-10">
            <button className="btn btn-sm btn-outline-secondary mb-3" onClick={closeThread}>
              <i className="fa-solid fa-arrow-left me-1" /> Back
            </button>

            <h5 className="mb-1">{selectedThread.title}</h5>
            <small className="text-muted d-block mb-3">
              Started by <strong>{selectedThread.createdByDisplayName}</strong> &middot; {fmtDate(selectedThread.createdUtc)}
            </small>

            {/* Posts */}
            <div className="d-flex flex-column gap-2 mb-3">
              {selectedThread.posts.map((p) => (
                <div key={p.id} className="card">
                  <div className="card-body py-2 px-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong style={{ fontSize: '0.9rem' }}>{p.createdByDisplayName}</strong>
                      <small className="text-muted">{fmtDate(p.createdUtc)}</small>
                    </div>
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply form */}
            {hasUsername ? (
              <form onSubmit={handleReply}>
                <textarea
                  className="form-control mb-2"
                  rows={3}
                  placeholder="Write a reply…"
                  maxLength={4000}
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                />
                <button className="btn btn-primary btn-sm" disabled={replying || !replyBody.trim()}>
                  {replying ? 'Posting…' : 'Post Reply'}
                </button>
              </form>
            ) : (
              <div className="alert alert-info py-2 mb-0">
                <i className="fa-solid fa-info-circle me-2" />
                <a href="/profile">Set your Message Board username in Profile</a> to post.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
