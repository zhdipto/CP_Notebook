import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SnippetEditor from './components/SnippetEditor';
import SnippetsEmpty from './components/SnippetsEmpty';
import Profile from './components/Profile';
import Landing from './components/Landing';

// Layout already blocks rendering until `status` resolves, so by the time any
// route renders it is only ever 'authenticated' or 'anonymous'.
function RequireAuth({ children }) {
  const { status } = useAuth();
  if (status === 'anonymous') return <Navigate to="/login" replace />;
  return children;
}

// A logged-in user hitting "/" belongs in their notebook, not on marketing copy.
function RootRoute() {
  const { status } = useAuth();
  if (status === 'authenticated') return <Navigate to="/snippets" replace />;
  return <Landing />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      {/* The list itself lives in the sidebar (see SnippetsSidebar), so these
          routes only decide what fills the detail pane. */}
      <Route
        path="/snippets"
        element={
          <RequireAuth>
            <SnippetsEmpty />
          </RequireAuth>
        }
      />
      <Route
        path="/snippets/new"
        element={
          <RequireAuth>
            <SnippetEditor />
          </RequireAuth>
        }
      />
      <Route
        path="/snippets/:id"
        element={
          <RequireAuth>
            <SnippetEditor />
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
      {/* "/" resolves correctly for both auth states, unlike a fixed target. */}
      <Route path="*" element={<Navigate to="/" replace />} />
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
