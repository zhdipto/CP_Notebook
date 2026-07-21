import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { registerRequest, loginRequest } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
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
      await registerRequest(username, email, password, firstName, lastName);
      // Registration returns no tokens (Phase 3), so log in right after.
      const tokens = await loginRequest(username, password);
      login(tokens.access, tokens.refresh);
      navigate('/snippets');
    } catch (err) {
      const data = err.response?.data;
      const message = data ? Object.values(data).flat().join(' ') : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="bh-card relative">
        <div className="border-b-4 border-ink bg-bh-red px-6 py-6">
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">CP Notebook</p>
          <h1 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter text-white">
            Create
            <br />
            Account
          </h1>
        </div>

        <div className="p-6">
          {error && (
            <p className="mb-4 border-2 border-ink bg-bh-red px-3 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-hard-sm">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-first-name" className="bh-label">First name</label>
                <input
                  id="reg-first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bh-input"
                />
              </div>
              <div>
                <label htmlFor="reg-last-name" className="bh-label">Last name</label>
                <input
                  id="reg-last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bh-input"
                />
              </div>
            </div>
            <div>
              <label htmlFor="reg-username" className="bh-label">Username</label>
              <input
                id="reg-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bh-input"
              />
            </div>
            <div>
              <label htmlFor="reg-email" className="bh-label">Email</label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bh-input"
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="bh-label">Password</label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bh-input"
              />
            </div>
            <button type="submit" disabled={loading} className="bh-btn bh-btn-blue w-full">
              {loading ? 'Creating account...' : 'Create account'}
              {!loading && <ArrowRight className="h-4 w-4" strokeWidth={3} />}
            </button>
          </form>

          <p className="mt-5 text-sm font-medium">
            Already registered?{' '}
            <Link to="/login" className="font-bold uppercase tracking-wide text-bh-red underline decoration-2 underline-offset-2">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
