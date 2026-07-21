import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SnippetList from './components/SnippetList';
import SnippetForm from './components/SnippetForm';
import Profile from './components/Profile';
import Landing from './components/Landing';

function RequireAuth({ children }) {
  const { status } = useAuth();
  if (status === 'checking')
    return (
      <p className="border-2 border-ink bg-surface px-4 py-3 text-sm font-bold uppercase tracking-wide shadow-hard-sm">
        Loading...
      </p>
    );
  if (status === 'anonymous') return <Navigate to="/login" replace />;
  return children;
}

// Public landing page — but a logged-in user hitting "/" should land in
// their notebook, not on marketing copy.
function RootRoute() {
  const { status } = useAuth();
  if (status === 'checking') return null;
  if (status === 'authenticated') return <Navigate to="/snippets" replace />;
  return <Landing />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route
        path="/snippets"
        element={
          <RequireAuth>
            <SnippetList />
          </RequireAuth>
        }
      />
      <Route
        path="/snippets/new"
        element={
          <RequireAuth>
            <SnippetForm />
          </RequireAuth>
        }
      />
      <Route
        path="/snippets/:id/edit"
        element={
          <RequireAuth>
            <SnippetForm />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/snippets" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
