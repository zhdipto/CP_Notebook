import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { loginRequest } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginRequest(username, password);
      login(data.access, data.refresh);
      navigate('/snippets');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="bh-card relative">
        {/* color-blocked header */}
        <div className="border-b-4 border-ink bg-bh-blue px-6 py-6">
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">CP Notebook</p>
          <h1 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter text-white">
            Log&nbsp;In
          </h1>
        </div>

        <div className="p-6">
          {error && (
            <p className="mb-4 border-2 border-ink bg-bh-red px-3 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-hard-sm">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-username" className="bh-label">Username</label>
              <input
                id="login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bh-input"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="bh-label">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bh-input"
              />
            </div>
            <button type="submit" disabled={loading} className="bh-btn bh-btn-red w-full">
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <ArrowRight className="h-4 w-4" strokeWidth={3} />}
            </button>
          </form>

          <p className="mt-5 text-sm font-medium">
            No account?{' '}
            <Link to="/register" className="font-bold uppercase tracking-wide text-bh-blue underline decoration-2 underline-offset-2">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
