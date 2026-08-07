import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useSnippets } from '../context/SnippetsContext';

// Shown at /snippets, before a row is selected — the notepad's resting state.
export default function SnippetsEmpty() {
  const { count, loading } = useSnippets();

  return (
    <div className="bh-dotgrid flex flex-1 items-center justify-center p-6">
      <div className="bh-card flex max-w-sm flex-col items-center gap-3 p-8 text-center">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-5 w-5 rounded-full border-2 border-ink bg-bh-red" />
          <span className="h-5 w-5 border-2 border-ink bg-bh-blue" />
          <span
            className="h-5 w-5 bg-bh-yellow"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
        </span>
        <p className="text-lg font-black uppercase tracking-tight">
          {!loading && count === 0 ? 'Your notebook is empty' : 'Nothing selected'}
        </p>
        <p className="text-sm font-medium opacity-70">
          {!loading && count === 0
            ? 'Create your first snippet to get started.'
            : 'Pick a snippet from the list, or start a new one.'}
        </p>
        <Link to="/snippets/new" className="bh-btn bh-btn-red">
          <Plus className="h-4 w-4" strokeWidth={3} />
          New Snippet
        </Link>
      </div>
    </div>
  );
}
