import { useState } from 'react';
import { Star } from 'lucide-react';
import { toggleFavorite } from '../api/snippets';

export default function FavoriteButton({ snippetId, initialFavorited }) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    const previous = favorited;
    setFavorited(!previous); // optimistic update
    try {
      const data = await toggleFavorite(snippetId);
      setFavorited(data.status === 'added to favorites');
    } catch {
      setFavorited(previous); // roll back on failure
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      aria-pressed={favorited}
      aria-label={favorited ? 'Unstar snippet' : 'Star snippet'}
      title={favorited ? 'Starred' : 'Star'}
      className={`bh-btn px-2.5 ${favorited ? 'bh-btn-yellow' : 'bh-btn-outline'}`}
    >
      <Star className="h-4 w-4" strokeWidth={3} fill={favorited ? 'currentColor' : 'none'} />
    </button>
  );
}
