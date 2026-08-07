import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Plus, Search, Star, X, HardDrive, TriangleAlert } from 'lucide-react';
import { useSnippets, SORT_OPTIONS } from '../context/SnippetsContext';
import { languageLabel } from '../constants/languages';
import { isDeviceIdPersistent } from '../api/device';
import GeoLogo from './GeoLogo';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function SidebarBody({ onNavigate }) {
  const {
    items, count, hasNext, loading, loadingMore, error,
    search, setSearch,
    ordering, setOrdering,
    favoritesOnly, setFavoritesOnly,
    loadMore,
  } = useSnippets();

  // Checked once on mount: localStorage can throw or silently no-op in private
  // modes, and if the id can't persist the user needs to know their snippets
  // won't be findable after a reload.
  const [persistent, setPersistent] = useState(true);
  useEffect(() => {
    setPersistent(isDeviceIdPersistent());
  }, []);

  return (
    <>
      {/* Brand. h-16 matches the topbar so the bottom borders form one line. */}
      <Link
        to="/snippets"
        onClick={onNavigate}
        className="flex h-16 shrink-0 items-center gap-3 border-b-4 border-ink px-4 pr-12"
      >
        <GeoLogo />
        <span className="text-base font-black uppercase leading-none tracking-tighter">
          CP&nbsp;Notebook
        </span>
      </Link>

      {/* Create + query controls */}
      <div className="shrink-0 space-y-2 border-b-2 border-ink p-3">
        <Link to="/snippets/new" onClick={onNavigate} className="bh-btn bh-btn-red w-full">
          <Plus className="h-4 w-4" strokeWidth={3} />
          New Snippet
        </Link>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60"
            strokeWidth={2.5}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            aria-label="Search snippets"
            className="bh-input pl-8"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            aria-label="Sort snippets"
            className="bh-input flex-1 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => setFavoritesOnly((v) => !v)}
            aria-pressed={favoritesOnly}
            title={favoritesOnly ? 'Showing starred only' : 'Show starred only'}
            aria-label="Toggle starred only"
            className={`bh-btn px-2.5 ${favoritesOnly ? 'bh-btn-yellow' : 'bh-btn-outline'}`}
          >
            <Star className="h-4 w-4" strokeWidth={3} fill={favoritesOnly ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Document list — the sidebar's real job. */}
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-bh-red">
          {favoritesOnly ? 'Starred' : 'All snippets'} · {count}
        </p>

        {loading && (
          <p className="px-1 text-xs font-bold uppercase tracking-widest opacity-60">Loading...</p>
        )}
        {error && (
          <p className="border-2 border-ink bg-bh-red px-2 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            {error}
          </p>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="px-1 text-xs font-bold uppercase leading-relaxed tracking-wide opacity-60">
            {search || favoritesOnly ? 'Nothing matches.' : 'No snippets yet.'}
          </p>
        )}

        <ul className="space-y-2">
          {items.map((s) => (
            <li key={s.id}>
              <NavLink
                to={`/snippets/${s.id}`}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `block border-2 px-2.5 py-2 transition-colors ${
                    isActive
                      ? 'border-[color:var(--bh-ink)] bg-bh-blue text-white shadow-hard-sm'
                      : 'border-[color:var(--bh-ink)]/25 hover:border-[color:var(--bh-ink)] hover:bg-canvas'
                  }`
                }
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="truncate text-sm font-black uppercase tracking-tight">
                    {s.title}
                  </span>
                  {s.is_favorited && (
                    <Star
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bh-yellow"
                      strokeWidth={3}
                      fill="currentColor"
                    />
                  )}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest opacity-70">
                  <span className="truncate">{languageLabel(s.language)}</span>
                  <span>·</span>
                  <span className="shrink-0">{formatDate(s.updated_at)}</span>
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        {hasNext && (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="bh-btn bh-btn-outline mt-3 w-full text-xs"
          >
            {loadingMore ? 'Loading...' : 'Load more'}
          </button>
        )}
      </div>

      {/* Where the data lives — this replaces the old account card. */}
      <div className="shrink-0 border-t-4 border-ink p-3">
        {!persistent && (
          <p className="mb-2 flex items-start gap-2 border-2 border-ink bg-bh-red px-2 py-1.5 text-[10px] font-bold uppercase leading-relaxed tracking-wide text-white">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={3} />
            Storage blocked — snippets won&apos;t survive a reload.
          </p>
        )}
        <p className="mb-3 flex items-start gap-2 text-[10px] font-bold uppercase leading-relaxed tracking-widest opacity-60">
          <HardDrive className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
          Saved to this browser only. No account — clearing site data erases them.
        </p>
        <p className="text-[9px] font-bold uppercase leading-relaxed tracking-widest opacity-55">
          Created by{' '}
          <a
            href="https://zhdipto.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 underline-offset-2 hover:text-bh-red"
          >
            Zahir Hossain Dipto
          </a>
          {' '}&amp;{' '}
          <a
            href="https://hopebot-it.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 underline-offset-2 hover:text-bh-red"
          >
            HopeBot.IT
          </a>
        </p>
      </div>
    </>
  );
}

export default function SnippetsSidebar({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <aside className="hidden w-72 shrink-0 flex-col border-r-4 border-ink bg-surface md:flex">
        <SidebarBody />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Snippets"
            className="absolute inset-y-0 left-0 flex w-72 flex-col border-r-4 border-ink bg-surface"
          >
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="bh-btn bh-btn-outline absolute right-3 top-4 z-10 px-2"
            >
              <X className="h-4 w-4" strokeWidth={3} />
            </button>
            <SidebarBody onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
