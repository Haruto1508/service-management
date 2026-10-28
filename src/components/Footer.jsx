import { TrendingUp, Phone, Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: '1.4rem',
                fontWeight: 800,
                color: 'white',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #F97316, #F59E0B)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUp size={20} color="white" />
              </div>
              Local <span style={{ color: '#F97316', marginLeft: 4 }}>Lift</span>
            </div>

            <p className="footer-brand-desc">
              Đồng hành cùng các cơ sở kinh doanh địa phương trong hành trình chuyển đổi số.
              Chúng tôi tin rằng mỗi cơ sở, dù nhỏ hay lớn, đều xứng đáng có một thương hiệu mạnh mẽ.
            </p>

            <div>
              <div className="footer-contact-item">
                <Phone size={16} className="footer-contact-icon" />
                <span>0901 234 567</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={16} className="footer-contact-icon" />
                <span>hello@locallift.vn</span>
              </div>
              <div className="footer-contact-item">
                <MapPin size={16} className="footer-contact-icon" />
                <span>123 Đường Nguyễn Huệ, Q.1, TP.HCM</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="footer-col-title">Dịch Vụ</div>
            <div className="footer-links">
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('#pricing'); }}>Thiết kế Website</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('#pricing'); }}>Quản lý Mạng Xã Hội</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('#pricing'); }}>Chạy Quảng Cáo</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('#pricing'); }}>SEO Địa Phương</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('#pricing'); }}>Hệ Thống Đặt Lịch</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('#pricing'); }}>Đào Tạo Nhân Sự</a>
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="footer-col-title">Công Ty</div>
            <div className="footer-links">
              <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}>Về Local Lift</a>
              <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('#faq'); }}>FAQ</a>
              <a href="#comparison" onClick={(e) => { e.preventDefault(); scrollTo('#comparison'); }}>So Sánh Gói</a>
              <a href="#calculator" onClick={(e) => { e.preventDefault(); scrollTo('#calculator'); }}>Tính Phí Ngay</a>
              <a href="/admin">Trang Quản Trị</a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <div className="footer-col-title">Nhận Tin Tức Mới</div>
            <p className="footer-newsletter-desc">
              Đăng ký nhận bản tin về xu hướng digital marketing và ưu đãi độc quyền dành cho cơ sở địa phương.
            </p>
            {subscribed ? (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'rgba(34,197,94,0.15)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: 8,
                  color: '#4ADE80',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}
              >
                ✓ Cảm ơn! Bạn đã đăng ký thành công.
              </div>
            ) : (
              <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="footer-newsletter-input"
                  placeholder="email@cuaban.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="footer-newsletter-btn">
                  <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 Local Lift. All rights reserved. Được xây dựng với ❤️ tại Việt Nam.
          </div>
          <div className="footer-bottom-links">
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
