import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SnippetList from './components/SnippetList';
import SnippetForm from './components/SnippetForm';

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

function AppRoutes() {
  return (
    <Routes>
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
