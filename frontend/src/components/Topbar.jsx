import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// The topbar names the current page, so the screens themselves no longer
// need their own oversized poster headings.
function pageTitle(pathname) {
  if (pathname === '/snippets') return 'Snippets';
  if (pathname === '/snippets/new') return 'New Snippet';
  if (pathname.startsWith('/snippets/')) return 'Editor';
  return 'CP Notebook';
}

export default function Topbar({ onOpenDrawer }) {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b-4 border-ink bg-surface px-4 sm:px-8">
      <button
        onClick={onOpenDrawer}
        aria-label="Open menu"
        className="bh-btn bh-btn-outline px-2.5 md:hidden"
      >
        <Menu className="h-4 w-4" strokeWidth={3} />
      </button>

      <h1 className="truncate text-xl font-black uppercase tracking-tighter sm:text-2xl">
        {pageTitle(pathname)}
      </h1>

      <button
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className="bh-btn bh-btn-yellow ml-auto px-2.5"
      >
        {theme === 'dark'
          ? <Sun className="h-4 w-4" strokeWidth={3} />
          : <Moon className="h-4 w-4" strokeWidth={3} />}
      </button>
    </header>
  );
}
