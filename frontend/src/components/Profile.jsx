import { useEffect, useState } from 'react';
import { User, Pencil, FileCode } from 'lucide-react';
import { getProfile, updateProfile } from '../api/profile';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ email: '', first_name: '', last_name: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setForm({ email: data.email, first_name: data.first_name, last_name: data.last_name });
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProfile(form);
      setProfile(updated);
      setEditing(false);
    } catch {
      setError('Failed to save — check your input');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setForm({ email: profile.email, first_name: profile.first_name, last_name: profile.last_name });
    setEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <p className="border-2 border-ink bg-surface px-4 py-3 text-sm font-bold uppercase tracking-wide shadow-hard-sm">
        Loading...
      </p>
    );
  }
  if (!profile) {
    return (
      <p className="border-2 border-ink bg-bh-red px-4 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-hard-sm">
        {error || 'Profile unavailable'}
      </p>
    );
  }

  const joined = new Date(profile.date_joined).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="bh-card relative">
        {/* color-blocked header with avatar + handle */}
        <div className="flex items-center gap-4 border-b-4 border-ink bg-bh-blue px-6 py-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-ink bg-bh-yellow text-black">
            <User className="h-8 w-8" strokeWidth={3} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Profile</p>
            <h1 className="text-3xl font-black uppercase leading-[0.9] tracking-tighter text-white sm:text-4xl">
              {profile.username}
            </h1>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <p className="mb-4 border-2 border-ink bg-bh-red px-3 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-hard-sm">
              {error}
            </p>
          )}

          {/* stat strip */}
          <div className="mb-6 grid grid-cols-2 divide-x-2 divide-[color:var(--bh-ink)] border-2 border-ink">
            <div className="flex items-center gap-3 p-4">
              <FileCode className="h-6 w-6 text-bh-red" strokeWidth={2.5} />
              <div>
                <p className="text-2xl font-black leading-none">{profile.snippet_count}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Snippets</p>
              </div>
            </div>
            <div className="flex items-center p-4">
              <div>
                <p className="text-sm font-black leading-none">{joined}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Joined</p>
              </div>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="pf-first" className="bh-label">First name</label>
                <input id="pf-first" value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="bh-input" />
              </div>
              <div>
                <label htmlFor="pf-last" className="bh-label">Last name</label>
                <input id="pf-last" value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="bh-input" />
              </div>
              <div>
                <label htmlFor="pf-email" className="bh-label">Email</label>
                <input id="pf-email" type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} className="bh-input" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="bh-btn bh-btn-red">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={cancelEdit} className="bh-btn bh-btn-outline">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <Field label="Name" value={[profile.first_name, profile.last_name].filter(Boolean).join(' ') || '—'} />
              <Field label="Email" value={profile.email || '—'} />
              <button onClick={() => setEditing(true)} className="bh-btn bh-btn-blue">
                <Pencil className="h-4 w-4" strokeWidth={3} />
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="border-b-2 border-[color:var(--bh-ink)]/20 pb-3">
      <p className="bh-label mb-0">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
