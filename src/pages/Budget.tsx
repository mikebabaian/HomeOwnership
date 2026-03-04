import React, { useState, useEffect, useCallback } from 'react';
import { api, BudgetItemDto, ProfileResponse } from '../lib/api';

const CATEGORIES = ['Housing', 'Utilities', 'Insurance', 'Debt', 'Transportation', 'Food', 'Other'];

const emptyForm = { category: 'Other', name: '', amount: '', notes: '' };

export default function Budget() {
  const [items, setItems] = useState<BudgetItemDto[]>([]);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add-new form
  const [form, setForm] = useState(emptyForm);
  const [adding, setAdding] = useState(false);

  // Inline edit state (null = not editing)
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ category: '', name: '', amount: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const totalExpenses = items.reduce((sum, i) => sum + i.amount, 0);
  const monthlyTakeHome = profile?.monthlyTakeHome ?? null;

  const reload = useCallback(async () => {
    try {
      const [budgetItems, prof] = await Promise.all([api.budget.list(), api.profile.get()]);
      setItems(budgetItems);
      setProfile(prof);
    } catch {
      setError('Failed to load budget data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  // ── Add item ──────────────────────────────────────────────────────────────
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.amount) return;
    setAdding(true);
    setError('');
    try {
      await api.budget.create({
        category: form.category,
        name: form.name.trim(),
        amount: Number(form.amount),
        notes: form.notes.trim() || null,
      });
      setForm(emptyForm);
      await reload();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to add item.');
    } finally {
      setAdding(false);
    }
  };

  // ── Start inline edit ─────────────────────────────────────────────────────
  const startEdit = (item: BudgetItemDto) => {
    setEditId(item.id);
    setEditForm({
      category: item.category,
      name: item.name,
      amount: String(item.amount),
      notes: item.notes ?? '',
    });
  };

  const cancelEdit = () => setEditId(null);

  const handleUpdate = async (id: number) => {
    if (!editForm.name.trim() || !editForm.amount) return;
    setSaving(true);
    setError('');
    try {
      await api.budget.update(id, {
        category: editForm.category,
        name: editForm.name.trim(),
        amount: Number(editForm.amount),
        notes: editForm.notes.trim() || null,
      });
      setEditId(null);
      await reload();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to update item.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setError('');
    try {
      await api.budget.remove(id);
      await reload();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to delete item.');
    }
  };

  if (loading) {
    return (
      <div className="content-block">
        <p className="muted">Loading budget…</p>
      </div>
    );
  }

  return (
    <div className="content-block">
      <h2 style={{ marginBottom: 8 }}>Budget</h2>
      <p className="muted" style={{ marginBottom: 20 }}>
        Track your monthly expenses in one place.
      </p>

      {/* ── Summary header ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ background: 'var(--hos-panel-bg, #f7faf8)', border: '1px solid var(--hos-border, #d5ddd8)', borderRadius: 8, padding: '14px 22px', minWidth: 180 }}>
          <div className="muted" style={{ fontSize: 13, marginBottom: 2 }}>Total Monthly Expenses</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--hos-green, #2F7D5C)' }}>
            ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        {monthlyTakeHome != null && (
          <div style={{ background: 'var(--hos-panel-bg, #f7faf8)', border: '1px solid var(--hos-border, #d5ddd8)', borderRadius: 8, padding: '14px 22px', minWidth: 180 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 2 }}>Monthly Take Home</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              ${monthlyTakeHome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        )}
        {monthlyTakeHome != null && (
          <div style={{ background: 'var(--hos-panel-bg, #f7faf8)', border: '1px solid var(--hos-border, #d5ddd8)', borderRadius: 8, padding: '14px 22px', minWidth: 180 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 2 }}>Remaining</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: monthlyTakeHome - totalExpenses >= 0 ? 'var(--hos-green, #2F7D5C)' : '#b91c1c' }}>
              ${(monthlyTakeHome - totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        )}
      </div>

      {error && <div className="alert alert-danger" style={{ marginBottom: 16 }}>{error}</div>}

      {/* ── Add new item form ──────────────────────────────────────────── */}
      <form onSubmit={handleAdd} style={{ marginBottom: 20, padding: 16, background: 'var(--hos-panel-bg, #f7faf8)', border: '1px solid var(--hos-border, #d5ddd8)', borderRadius: 8 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '0 0 130px' }}>
            <label htmlFor="add-category" style={{ fontSize: 13 }}>Category</label>
            <select
              id="add-category"
              className="form-control"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label htmlFor="add-name" style={{ fontSize: 13 }}>Name</label>
            <input id="add-name" className="form-control" placeholder="e.g. Electric" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div style={{ flex: '0 0 110px' }}>
            <label htmlFor="add-amount" style={{ fontSize: 13 }}>Amount ($)</label>
            <input id="add-amount" className="form-control" type="number" step="0.01" min="0" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label htmlFor="add-notes" style={{ fontSize: 13 }}>Notes</label>
            <input id="add-notes" className="form-control" placeholder="Optional" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="submit" className="btn btn-primary btn-sm" disabled={adding}>
            {adding ? 'Adding…' : 'Add'}
          </button>
        </div>
      </form>

      {/* ── Items table ────────────────────────────────────────────────── */}
      {items.length === 0 ? (
        <p className="muted">No budget items yet. Add your first expense above.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--hos-border, #d5ddd8)', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px' }}>Category</th>
                <th style={{ padding: '8px 10px' }}>Name</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '8px 10px' }}>Notes</th>
                <th style={{ padding: '8px 10px', width: 120 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--hos-border, #e5e7eb)' }}>
                  {editId === item.id ? (
                    <>
                      <td style={{ padding: '6px 10px' }}>
                        <select className="form-control" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '6px 10px' }}>
                        <input className="form-control" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                      </td>
                      <td style={{ padding: '6px 10px' }}>
                        <input className="form-control" type="number" step="0.01" min="0" value={editForm.amount} onChange={e => setEditForm(f => ({ ...f, amount: e.target.value }))} style={{ textAlign: 'right' }} />
                      </td>
                      <td style={{ padding: '6px 10px' }}>
                        <input className="form-control" value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} />
                      </td>
                      <td style={{ padding: '6px 10px', whiteSpace: 'nowrap' }}>
                        <button className="btn btn-primary" style={{ fontSize: 13, padding: '4px 10px', marginRight: 4 }} onClick={() => handleUpdate(item.id)} disabled={saving}>Save</button>
                        <button className="btn btn-secondary" style={{ fontSize: 13, padding: '4px 10px' }} onClick={cancelEdit}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: '8px 10px' }}>{item.category}</td>
                      <td style={{ padding: '8px 10px' }}>{item.name}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td style={{ padding: '8px 10px', color: '#888' }}>{item.notes ?? ''}</td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>
                        <button className="btn btn-secondary" style={{ fontSize: 13, padding: '4px 10px', marginRight: 4 }} onClick={() => startEdit(item)}>Edit</button>
                        <button className="btn btn-secondary" style={{ fontSize: 13, padding: '4px 10px', color: '#b91c1c' }} onClick={() => handleDelete(item.id, item.name)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
