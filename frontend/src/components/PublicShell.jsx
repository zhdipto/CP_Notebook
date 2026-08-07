import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import GeoLogo from './GeoLogo';

// Marketing/auth shell for anonymous visitors: centered top nav and a normal
// scrolling page. A dashboard sidebar would have nothing to navigate here.
export default function PublicShell({ children }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bh-dotgrid flex min-h-dvh flex-col">
      <header className="border-b-4 border-ink bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <GeoLogo />
            <span className="text-lg font-black uppercase tracking-tighter sm:text-xl">
              CP&nbsp;Notebook
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            {/* No login/register — the notebook just opens. */}
            <Link to="/snippets" className="bh-btn bh-btn-blue">Open Notebook</Link>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="bh-btn bh-btn-yellow px-2.5"
            >
              {theme === 'dark'
                ? <Sun className="h-4 w-4" strokeWidth={3} />
                : <Moon className="h-4 w-4" strokeWidth={3} />}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        {children}
      </main>

      <footer className="border-t-4 border-ink bg-[#121212] px-4 py-6 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-white/90">
          Created by{' '}
          <a
            href="https://zhdipto.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bh-yellow underline decoration-2 underline-offset-2 hover:text-white"
          >
            Zahir Hossain Dipto
          </a>
          {' '}&amp;{' '}
          <a
            href="https://hopebot-it.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bh-yellow underline decoration-2 underline-offset-2 hover:text-white"
          >
            HopeBot.IT
          </a>
        </p>
      </footer>
    </div>
  );
}
