import { useState } from 'react';
import { TrendingUp, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'locallift2026';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate small delay for UX
    await new Promise((r) => setTimeout(r, 500));

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const session = { username, loginAt: Date.now() };
      localStorage.setItem('ll_admin_session', JSON.stringify(session));
      onLogin(session);
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div className="admin-login-logo-icon">
            <TrendingUp size={22} />
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-dark)' }}>
            Local <span style={{ color: 'var(--primary)' }}>Lift</span>
          </span>
        </div>

        <h1 className="admin-login-title">Đăng Nhập Quản Trị</h1>
        <p className="admin-login-subtitle">Chỉ dành cho đội ngũ nội bộ Local Lift</p>

        {error && (
          <div className="admin-login-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
              autoFocus
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label" htmlFor="password">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                autoComplete="current-password"
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--slate)',
                  display: 'flex',
                  padding: 4,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block',
                  }}
                />
                Đang xác thực...
              </>
            ) : (
              <>
                <Lock size={16} />
                Đăng Nhập
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: 24,
            padding: 14,
            background: 'var(--bg-light)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          🔒 Hệ thống chỉ dành cho nhân viên được ủy quyền.<br />
          Mọi hoạt động đăng nhập đều được ghi lại.
        </div>

        <a
          href="/"
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: 16,
            fontSize: '0.85rem',
            color: 'var(--primary)',
            fontWeight: 500,
          }}
        >
          ← Quay về trang chủ
        </a>
      </div>
    </div>
  );
}
