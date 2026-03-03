import React, { useState, useEffect } from 'react';
import { api, ProfileResponse, UpsertProfileRequest } from '../lib/api';

const empty: ProfileResponse = {
  messageBoardUserName: null,
  currentMortgageRate: null,
  homeOwnersInsuranceMonthly: null,
  monthlyTakeHome: null,
  currentMortgageBalance: null,
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileResponse>(empty);
  const [form, setForm] = useState<UpsertProfileRequest>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // The username is locked once it has been saved (non-null/non-empty from server)
  const userNameLocked = !!profile.messageBoardUserName;

  useEffect(() => {
    api.profile
      .get()
      .then((data) => {
        setProfile(data);
        setForm({
          messageBoardUserName: data.messageBoardUserName ?? '',
          currentMortgageRate: data.currentMortgageRate,
          homeOwnersInsuranceMonthly: data.homeOwnersInsuranceMonthly,
          monthlyTakeHome: data.monthlyTakeHome,
          currentMortgageBalance: data.currentMortgageBalance,
        });
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value === '' ? null : name === 'messageBoardUserName' ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const saved = await api.profile.save(form);
      setProfile(saved);
      setSuccess('Profile saved successfully.');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="content-block">
        <p className="muted">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="content-block">
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 8 }}>Your Profile</h2>
        <p className="muted" style={{ marginBottom: 24 }}>
          Manage your personal details and financial snapshot.
        </p>

        {error && <div className="alert alert-danger" style={{ marginBottom: 16 }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ marginBottom: 16 }}>{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Message Board User Name */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="profile-username">Message Board User Name</label>
            <input
              id="profile-username"
              name="messageBoardUserName"
              type="text"
              className="form-control"
              placeholder="Choose a display name"
              maxLength={50}
              value={form.messageBoardUserName ?? ''}
              onChange={handleChange}
              disabled={userNameLocked}
            />
            {userNameLocked && (
              <small className="muted" style={{ display: 'block', marginTop: 4, fontStyle: 'italic' }}>
                Display name is permanent and cannot be changed.
              </small>
            )}
          </div>

          {/* Current Mortgage Rate */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="profile-rate">Current Mortgage Rate (%)</label>
            <input
              id="profile-rate"
              name="currentMortgageRate"
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              placeholder="e.g. 6.75"
              value={form.currentMortgageRate ?? ''}
              onChange={handleChange}
            />
          </div>

          {/* Home Owner's Insurance */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="profile-insurance">Home Owner's Insurance ($/mo)</label>
            <input
              id="profile-insurance"
              name="homeOwnersInsuranceMonthly"
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              placeholder="e.g. 210.50"
              value={form.homeOwnersInsuranceMonthly ?? ''}
              onChange={handleChange}
            />
          </div>

          {/* Monthly Take Home */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="profile-income">Monthly Take Home ($)</label>
            <input
              id="profile-income"
              name="monthlyTakeHome"
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              placeholder="e.g. 5200.00"
              value={form.monthlyTakeHome ?? ''}
              onChange={handleChange}
            />
          </div>

          {/* Current Mortgage Balance */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="profile-balance">Current Mortgage Balance ($)</label>
            <input
              id="profile-balance"
              name="currentMortgageBalance"
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              placeholder="e.g. 248000.00"
              value={form.currentMortgageBalance ?? ''}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 4 }}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
