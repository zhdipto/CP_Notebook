import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import SnippetEditor from './components/SnippetEditor';
import SnippetsEmpty from './components/SnippetsEmpty';
import Landing from './components/Landing';

// No accounts, so no AuthProvider and no route guards — every route is open and
// the backend scopes data by the browser's device token instead.
// LoginForm/RegisterForm/Profile and AuthContext are left in the tree unwired,
// as reference for the JWT design they replaced.
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/snippets" element={<SnippetsEmpty />} />
      <Route path="/snippets/new" element={<SnippetEditor />} />
      <Route path="/snippets/:id" element={<SnippetEditor />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}
