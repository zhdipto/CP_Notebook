import { Link } from 'react-router-dom';
import { Search, Star, Lock, Code2, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Lock,
    color: 'bg-bh-red',
    title: 'No account needed',
    body: 'No sign-up, no email, no password. Open it and start saving — your snippets stay on your browser.',
  },
  {
    icon: Search,
    color: 'bg-bh-blue',
    title: 'Search & filter',
    body: 'Find anything instantly by title, code content, or exact language match.',
  },
  {
    icon: Star,
    color: 'bg-bh-yellow',
    title: 'Star your favorites',
    body: 'Pin the snippets you reach for most so they never get buried.',
  },
  {
    icon: Code2,
    color: 'bg-bh-red',
    title: 'Any language',
    body: "Python, JS, SQL, shell — it's your notebook, organize it your way.",
  },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-4 border-ink bg-surface p-8 shadow-hard-lg sm:p-14">
        {/* decorative geometric composition, purely ornamental */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-bh-blue opacity-20 sm:h-56 sm:w-56"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 right-16 h-24 w-24 rotate-45 bg-bh-yellow opacity-20"
        />

        <p className="relative text-xs font-bold uppercase tracking-widest text-bh-red">
          A personal code bin
        </p>
        <h1 className="relative mt-2 text-5xl font-black uppercase leading-[0.85] tracking-tighter sm:text-7xl lg:text-8xl">
          Your Code.
          <br />
          Your Notebook.
        </h1>
        <p className="relative mt-6 max-w-xl text-lg font-medium leading-relaxed">
          CP Notebook is a private space to save, search, and star the code snippets you reuse
          every day. No account, no sign-up — it just opens.
        </p>

        <div className="relative mt-8 flex flex-wrap gap-4">
          <Link to="/snippets" className="bh-btn bh-btn-red">
            Open Your Notebook
            <ArrowRight className="h-4 w-4" strokeWidth={3} />
          </Link>
        </div>

        <p className="relative mt-4 max-w-xl text-xs font-bold uppercase tracking-widest opacity-60">
          Heads up: snippets are tied to this browser. Clearing site data or switching
          devices means starting fresh.
        </p>
      </section>

      {/* Features */}
      <section className="mt-12" aria-labelledby="features-heading">
        <h2 id="features-heading" className="mb-6 text-3xl font-black uppercase tracking-tighter sm:text-4xl">
          Built for how you actually code
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, color, title, body }, i) => (
            <article key={title} className="bh-card relative p-5">
              <span
                aria-hidden="true"
                className={`absolute right-3 top-3 h-4 w-4 border-2 border-ink ${color} ${
                  i % 3 === 1 ? 'rotate-45' : ''
                }`}
                style={i % 3 === 2 ? { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' } : undefined}
              />
              <span className={`inline-flex h-10 w-10 items-center justify-center border-2 border-ink ${color} text-black`}>
                <Icon className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <h3 className="mt-4 text-xl font-black uppercase tracking-tight">{title}</h3>
              <p className="mt-1 text-sm font-medium leading-relaxed opacity-80">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative mt-12 overflow-hidden border-4 border-ink bg-bh-blue p-8 text-center shadow-hard-lg sm:p-12">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-bh-yellow opacity-30"
        />
        <h2 className="relative text-3xl font-black uppercase leading-tight tracking-tighter text-white sm:text-5xl">
          Start your notebook today
        </h2>
        <Link to="/snippets" className="bh-btn bh-btn-yellow relative mt-6 inline-flex">
          Start writing — no sign-up
          <ArrowRight className="h-4 w-4" strokeWidth={3} />
        </Link>
      </section>
    </div>
  );
}
