import { useState, useEffect } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Restore session from localStorage
    try {
      const stored = localStorage.getItem('ll_admin_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Optional: expire after 8 hours
        if (Date.now() - parsed.loginAt < 8 * 60 * 60 * 1000) {
          setSession(parsed);
        } else {
          localStorage.removeItem('ll_admin_session');
        }
      }
    } catch {
      localStorage.removeItem('ll_admin_session');
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!session) {
    return <AdminLogin onLogin={setSession} />;
  }

  return <AdminDashboard session={session} onLogout={() => setSession(null)} />;
}
