import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSnippet, createSnippet, updateSnippet } from '../api/snippets';

export default function SnippetForm() {
  const { id } = useParams(); // undefined on the "/snippets/new" route
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    getSnippet(id)
      .then((data) => {
        setTitle(data.title);
        setCode(data.code);
        setLanguage(data.language);
      })
      .catch(() => setError('Failed to load snippet'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { title, code, language };
      if (isEdit) {
        await updateSnippet(id, payload);
      } else {
        await createSnippet(payload);
      }
      navigate('/snippets');
    } catch {
      setError('Failed to save snippet — check your input');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="border-2 border-ink bg-surface px-4 py-3 text-sm font-bold uppercase tracking-wide shadow-hard-sm">
        Loading...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="bh-card relative">
        <div className="border-b-4 border-ink bg-bh-yellow px-6 py-6">
          <p className="text-xs font-bold uppercase tracking-widest text-black/70">
            {isEdit ? 'Editing' : 'New entry'}
          </p>
          <h1 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter text-black">
            {isEdit ? 'Edit Snippet' : 'New Snippet'}
          </h1>
        </div>

        <div className="p-6">
          {error && (
            <p className="mb-4 border-2 border-ink bg-bh-red px-3 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-hard-sm">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="snip-title" className="bh-label">Title</label>
              <input
                id="snip-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bh-input"
              />
            </div>
            <div>
              <label htmlFor="snip-language" className="bh-label">Language</label>
              <input
                id="snip-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
                className="bh-input"
              />
            </div>
            <div>
              <label htmlFor="snip-code" className="bh-label">Code</label>
              <textarea
                id="snip-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
                required
                className="bh-input font-mono"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="bh-btn bh-btn-red">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={() => navigate('/snippets')} className="bh-btn bh-btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
