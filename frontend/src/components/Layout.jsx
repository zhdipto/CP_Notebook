import { useAuth } from '../context/AuthContext';
import AppShell from './AppShell';
import PublicShell from './PublicShell';

// Picks the chrome for the whole app. Resolving `checking` here — instead of
// per-route — means we never paint the public header and then swap it for the
// dashboard once the silent refresh lands.
export default function Layout({ children }) {
  const { status } = useAuth();

  if (status === 'checking') {
    return (
      <div className="bh-dotgrid flex h-dvh items-center justify-center bg-canvas">
        <p className="border-2 border-ink bg-surface px-4 py-3 text-sm font-bold uppercase tracking-wide shadow-hard-sm">
          Loading...
        </p>
      </div>
    );
  }

  if (status === 'authenticated') return <AppShell>{children}</AppShell>;
  return <PublicShell>{children}</PublicShell>;
}
