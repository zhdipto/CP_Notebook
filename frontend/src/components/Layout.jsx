import { useLocation } from 'react-router-dom';
import AppShell from './AppShell';
import PublicShell from './PublicShell';

// Picks the chrome for the whole app. This used to switch on auth status; with
// no accounts there is nothing to wait for, so it switches on the route: the
// notebook itself gets the sidebar shell, the marketing page does not.
export default function Layout({ children }) {
  const { pathname } = useLocation();
  const isNotebook = pathname.startsWith('/snippets');

  return isNotebook ? <AppShell>{children}</AppShell> : <PublicShell>{children}</PublicShell>;
}
