import { useState } from 'react';
import { SnippetsProvider } from '../context/SnippetsContext';
import SnippetsSidebar from './SnippetsSidebar';
import Topbar from './Topbar';

// Master-detail shell: the sidebar holds the snippet list, the main pane holds
// the selected snippet. The viewport is pinned (h-dvh + overflow-hidden) so the
// list and the editor scroll independently instead of the whole page moving.
export default function AppShell({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <SnippetsProvider>
      <div className="flex h-dvh overflow-hidden bg-canvas">
        <SnippetsSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        {/* min-w-0 stops wide code from stretching the column; min-h-0 is what
            lets the nested editor/profile panes own their own scrolling. */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenDrawer={() => setDrawerOpen(true)} />
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        </div>
      </div>
    </SnippetsProvider>
  );
}
