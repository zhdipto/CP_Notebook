import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { listSnippets, deleteSnippet } from '../api/snippets';
import FavoriteButton from './FavoriteButton';

// Must match the backend's REST_FRAMEWORK["PAGE_SIZE"] to compute total
// pages correctly from `count`.
const PAGE_SIZE = 10;

// Rotating Bauhaus corner decoration: circle → square → triangle, in
// red → blue → yellow, cycling by card index. Pure geometric ornament.
function CornerShape({ index }) {
  const shape = index % 3; // 0 circle, 1 square, 2 triangle
  const color = ['bg-bh-red', 'bg-bh-blue', 'bg-bh-yellow'][index % 3];
  if (shape === 0) {
    return <span className={`absolute right-3 top-3 h-4 w-4 rounded-full border-2 border-ink ${color}`} />;
  }
  if (shape === 1) {
    return <span className={`absolute right-3 top-3 h-4 w-4 rotate-45 border-2 border-ink ${color}`} />;
  }
  return (
    <span
      className={`absolute right-3 top-3 h-4 w-4 ${color}`}
      style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
    />
  );
}

export default function SnippetList() {
  const [snippets, setSnippets] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Debounce so typing doesn't fire a request per keystroke — `search_fields`
    // includes the unindexed `code` column, so this matters.
    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);
      listSnippets({
        page,
        search: search || undefined,
        language: language || undefined,
      })
        .then((data) => {
          setSnippets(data.results);
          setCount(data.count);
        })
        .catch(() => setError('Failed to load snippets'))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [page, search, language]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this snippet?')) return;
    try {
      await deleteSnippet(id);
      setSnippets((prev) => prev.filter((s) => s.id !== id));
      setCount((prev) => prev - 1);
    } catch {
      setError('Failed to delete snippet');
    }
  };

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div>
      {/* Poster-style header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-bh-red">Your personal bin</p>
          <h1 className="text-5xl font-black uppercase leading-[0.85] tracking-tighter sm:text-7xl">
            Snippets
          </h1>
        </div>
        <Link to="/snippets/new" className="bh-btn bh-btn-red self-start sm:self-auto">
          <Plus className="h-4 w-4" strokeWidth={3} />
          New Snippet
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" strokeWidth={2.5} />
          <input
            placeholder="Search title / code..."
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="bh-input pl-9"
            aria-label="Search snippets"
          />
        </div>
        {/* NOTE: language is exact-match on the backend, not fuzzy. */}
        <input
          placeholder="Filter by exact language..."
          value={language}
          onChange={(e) => { setPage(1); setLanguage(e.target.value); }}
          className="bh-input"
          aria-label="Filter by language"
        />
      </div>

      {loading && (
        <p className="border-2 border-ink bg-surface px-4 py-3 text-sm font-bold uppercase tracking-wide shadow-hard-sm">
          Loading...
        </p>
      )}
      {error && (
        <p className="border-2 border-ink bg-bh-red px-4 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-hard-sm">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {snippets.length === 0 ? (
            <div className="bh-card flex flex-col items-center gap-3 p-10 text-center">
              <span className="h-8 w-8 rotate-45 border-2 border-ink bg-bh-yellow" />
              <p className="text-lg font-bold uppercase tracking-wide">No snippets yet</p>
              <Link to="/snippets/new" className="bh-btn bh-btn-blue">Create one</Link>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2">
              {snippets.map((s, i) => (
                <li
                  key={s.id}
                  className="bh-card relative p-5 transition-transform duration-200 ease-out hover:-translate-y-1"
                >
                  <CornerShape index={i} />
                  <p className="mb-1 inline-block border-2 border-ink bg-bh-yellow px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black">
                    {s.language}
                  </p>
                  <h2 className="pr-6 text-xl font-black uppercase leading-tight tracking-tight">
                    {s.title}
                  </h2>
                  <pre className="mt-3 max-h-28 overflow-hidden border-2 border-ink bg-canvas p-3 font-mono text-xs">
                    {s.code}
                  </pre>
                  <div className="mt-4 flex items-center gap-2">
                    <FavoriteButton snippetId={s.id} initialFavorited={s.is_favorited} />
                    <Link to={`/snippets/${s.id}/edit`} className="bh-btn bh-btn-outline px-2.5" aria-label="Edit snippet">
                      <Pencil className="h-4 w-4" strokeWidth={2.5} />
                    </Link>
                    <button onClick={() => handleDelete(s.id)} className="bh-btn bh-btn-outline px-2.5" aria-label="Delete snippet">
                      <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Pagination */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="bh-btn bh-btn-outline px-3"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={3} />
        </button>
        <span className="text-sm font-bold uppercase tracking-widest">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="bh-btn bh-btn-outline px-3"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
