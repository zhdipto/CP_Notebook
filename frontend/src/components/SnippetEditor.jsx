import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Trash2, Star } from 'lucide-react';
import CodeEditor from './CodeEditor';
import { LANGUAGES, isKnownLanguage } from '../constants/languages';
import {
  getSnippet,
  createSnippet,
  updateSnippet,
  deleteSnippet,
  toggleFavorite,
} from '../api/snippets';
import { useSnippets } from '../context/SnippetsContext';

const EMPTY = { title: '', code: '', language: '' };

export default function SnippetEditor() {
  const { id } = useParams(); // undefined on /snippets/new
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { refresh } = useSnippets();

  const [form, setForm] = useState(EMPTY);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Selecting a different row in the sidebar changes :id without remounting
  // this component, so the fetch is keyed on id and resets the form each time.
  useEffect(() => {
    if (!isEdit) {
      setForm(EMPTY);
      setFavorited(false);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getSnippet(id)
      .then((data) => {
        if (cancelled) return;
        setForm({ title: data.title, code: data.code, language: data.language });
        setFavorited(data.is_favorited);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load snippet');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEdit) {
        await updateSnippet(id, form);
        refresh(); // title/date changed — the sidebar row must follow
      } else {
        const created = await createSnippet(form);
        refresh();
        navigate(`/snippets/${created.id}`, { replace: true });
      }
    } catch {
      setError('Failed to save — check your input');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this snippet?')) return;
    try {
      await deleteSnippet(id);
      refresh();
      navigate('/snippets', { replace: true });
    } catch {
      setError('Failed to delete snippet');
    }
  };

  const handleFavorite = async () => {
    const previous = favorited;
    setFavorited(!previous); // optimistic
    try {
      const data = await toggleFavorite(id);
      setFavorited(data.status === 'added to favorites');
      refresh(); // keeps the sidebar star (and the starred filter) in sync
    } catch {
      setFavorited(previous);
    }
  };

  // A snippet saved before this dropdown existed could hold a value that isn't
  // an option. Surfacing it as one keeps the select showing the truth instead
  // of silently snapping to C++ and rewriting the language on the next save.
  const languageOptions = useMemo(() => {
    if (!form.language || isKnownLanguage(form.language)) return LANGUAGES;
    return [{ value: form.language, label: `${form.language} (unlisted)` }, ...LANGUAGES];
  }, [form.language]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="border-2 border-ink bg-surface px-4 py-3 text-sm font-bold uppercase tracking-wide shadow-hard-sm">
          Loading...
        </p>
      </div>
    );
  }

  const lines = form.code ? form.code.split('\n').length : 0;

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      {/* Action bar */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b-2 border-ink bg-surface px-4 py-3">
        <p className="mr-auto text-xs font-bold uppercase tracking-widest opacity-70">
          {isEdit ? 'Editing' : 'New entry'}
        </p>
        {isEdit && (
          <>
            <button
              type="button"
              onClick={handleFavorite}
              aria-pressed={favorited}
              aria-label={favorited ? 'Unstar snippet' : 'Star snippet'}
              className={`bh-btn px-2.5 ${favorited ? 'bh-btn-yellow' : 'bh-btn-outline'}`}
            >
              <Star className="h-4 w-4" strokeWidth={3} fill={favorited ? 'currentColor' : 'none'} />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Delete snippet"
              className="bh-btn bh-btn-outline px-2.5"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </>
        )}
        <button type="submit" disabled={saving} className="bh-btn bh-btn-red">
          <Save className="h-4 w-4" strokeWidth={3} />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {error && (
        <p className="shrink-0 border-b-2 border-ink bg-bh-red px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
          {error}
        </p>
      )}

      {/* Title + language */}
      <div className="shrink-0 space-y-3 border-b-2 border-ink bg-surface px-4 py-3 sm:flex sm:items-end sm:gap-3 sm:space-y-0">
        <div className="flex-1">
          <label htmlFor="snip-title" className="bh-label">Title</label>
          <input
            id="snip-title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="bh-input text-lg font-black uppercase tracking-tight"
          />
        </div>
        <div className="sm:w-52">
          <label htmlFor="snip-language" className="bh-label">Language</label>
          <select
            id="snip-language"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            required
            className="bh-input cursor-pointer"
          >
            <option value="" disabled>Select language...</option>
            {languageOptions.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Code fills the remaining height, editor-style. */}
      <div className="flex min-h-0 flex-1 flex-col">
        <label htmlFor="snip-code" className="sr-only">Code</label>
        <CodeEditor
          id="snip-code"
          value={form.code}
          onChange={(code) => setForm({ ...form, code })}
          placeholder="Paste your code here..."
        />
        <p className="shrink-0 border-t-2 border-ink bg-surface px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest opacity-70">
          {lines} {lines === 1 ? 'line' : 'lines'} · {form.code.length} chars
          <span className="ml-3 opacity-70">Tab indents · Shift+Tab outdents</span>
        </p>
      </div>
    </form>
  );
}
