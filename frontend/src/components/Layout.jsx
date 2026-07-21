import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Plus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// The Bauhaus brand mark: three primary-colored primitives — circle, square,
// triangle — the constructivist signature of the whole system.
function GeoLogo() {
  return (
    <span className="flex items-center gap-1.5" aria-hidden="true">
      <span className="h-4 w-4 rounded-full border-2 border-ink bg-bh-red" />
      <span className="h-4 w-4 border-2 border-ink bg-bh-blue" />
      <span
        className="h-4 w-4 bg-bh-yellow"
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
      />
    </span>
  );
}

export default function Layout({ children }) {
  const { status, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bh-dotgrid flex min-h-screen flex-col">
      <header className="border-b-4 border-ink bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-3">
            <GeoLogo />
            <span className="text-lg font-black uppercase tracking-tighter sm:text-xl">
              CP&nbsp;Notebook
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            {status === 'authenticated' ? (
              <>
                <Link to="/snippets/new" className="bh-btn bh-btn-red">
                  <Plus className="h-4 w-4" strokeWidth={3} />
                  <span className="hidden sm:inline">New</span>
                </Link>
                <Link to="/profile" className="bh-btn bh-btn-outline" aria-label="Profile">
                  <User className="h-4 w-4" strokeWidth={2.5} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button onClick={handleLogout} className="bh-btn bh-btn-outline" aria-label="Log out">
                  <LogOut className="h-4 w-4" strokeWidth={2.5} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="bh-btn bh-btn-outline">Login</Link>
                <Link to="/register" className="bh-btn bh-btn-blue">Register</Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="bh-btn bh-btn-yellow px-2.5"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" strokeWidth={3} /> : <Moon className="h-4 w-4" strokeWidth={3} />}
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
