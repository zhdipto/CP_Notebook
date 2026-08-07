// The Bauhaus brand mark: three primary-colored primitives — circle, square,
// triangle — the constructivist signature of the whole system.
export default function GeoLogo() {
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
