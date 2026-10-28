import { useState, useEffect } from 'react';
import { TrendingUp, Menu, X } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const NAV_LINKS = [
  { label: 'Trang chủ', href: '#hero' },
  { label: 'Gói dịch vụ', href: '#pricing' },
  { label: 'So sánh', href: '#comparison' },
  { label: 'Tính phí', href: '#calculator' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const { openModal } = useOrder();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-inner">
            {/* Logo */}
            <a
              href="#hero"
              className="navbar-logo"
              onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}
            >
              <div className="logo-icon">
                <TrendingUp size={20} strokeWidth={2.5} />
              </div>
              <span>
                Local <span className="logo-text-lift">Lift</span>
              </span>
            </a>

            {/* Desktop links */}
            <div className="navbar-links">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="navbar-cta">
              <button className="btn btn-primary btn-sm" onClick={() => openModal('Khởi Sắc')}>
                Đăng ký ngay
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              className="navbar-mobile-toggle"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X size={22} />
              ) : (
                <>
                  <span />
                  <span />
                  <span />
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 68,
            left: 0,
            right: 0,
            background: 'white',
            zIndex: 999,
            padding: '16px 24px 24px',
            borderBottom: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: 'var(--text-body)',
                display: 'block',
              }}
            >
              {link.label}
            </a>
          ))}
          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: 12 }}
            onClick={() => { openModal('Khởi Sắc'); setMobileOpen(false); }}
          >
            Đăng ký ngay
          </button>
        </div>
      )}
    </>
  );
}
