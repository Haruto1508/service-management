import { TrendingUp, Zap, BarChart3, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function HeroSection() {
  const { goToRegister, openModal } = useOrder();

  const handleRegister = (planName = 'Lan Tỏa') => {
    if (goToRegister) {
      goToRegister(planName);
    } else {
      openModal(planName);
    }
  };

  const scrollToSection = (id) => {
    const el = document.querySelector(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-bg-overlay" />
      <div className="hero-grid-pattern" />

      <div className="container">
        <div className="hero-content">
          {/* Left: Text content */}
          <div className="hero-text">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>Chương trình đồng hành chuyển đổi số</span>
            </div>

            <h1 className="hero-title">
              Nâng Tầm{' '}
              <span className="highlight">Thương Hiệu</span>
              <br />
              Cơ Sở Địa Phương
            </h1>

            <p className="hero-desc">
              Chuẩn hóa hình ảnh, thiết kế bao bì chuyên nghiệp, phủ sóng thương hiệu
              trên mạng xã hội và đột phá doanh thu với chi phí ưu đãi đặc biệt từ Local Lift.
            </p>

            <div className="hero-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => handleRegister('Lan Tỏa')}
              >
                <Zap size={18} />
                Đăng ký ngay hôm nay
              </button>
              <button
                className="btn btn-outline-white btn-lg"
                onClick={() => scrollToSection('#pricing')}
              >
                Xem chi tiết gói dịch vụ
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">15+</span>
                <span className="hero-stat-label">Cơ sở đã tin dùng</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">53%</span>
                <span className="hero-stat-label">Hỗ trợ tối đa</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">3×</span>
                <span className="hero-stat-label">Tăng trưởng tiếp cận</span>
              </div>
            </div>
          </div>

          {/* Right: Visual card */}
          <div className="hero-visual">
            <div className="hero-card-stack">
              {/* Main card */}
              <div className="hero-card hero-card-main">
                <div className="hero-card-header">
                  <div className="hero-card-header-left">
                    <div className="hero-card-icon">
                      <TrendingUp size={24} color="white" />
                    </div>
                    <div>
                      <div className="hero-card-title">Gói Lan Tỏa</div>
                      <div className="hero-card-subtitle">Phù hợp cơ sở cần bứt phá trên MXH</div>
                    </div>
                  </div>
                  <span className="hero-card-badge-pill">Bán Chạy Nhất</span>
                </div>

                {/* Price Display */}
                <div className="hero-pricing-box">
                  <div className="hero-price-line">
                    <span className="hero-price-value">5.000.000</span>
                    <span className="hero-price-currency">VNĐ</span>
                  </div>
                  <div className="hero-price-sub">
                    <del className="hero-price-del">8.000.000 VNĐ</del>
                    <span className="hero-price-save">Quỹ hỗ trợ 38%</span>
                  </div>
                </div>

                <div className="hero-feature-list">
                  {[
                    'Chụp ảnh sản phẩm (10 ảnh concept)',
                    '2 Video Short-form xu hướng TikTok / Reels',
                    'Thiết lập & tối ưu Fanpage + TikTok',
                    'Vận hành nội dung & tương tác (2 tuần)',
                    'Báo cáo Reach/Engagement sau chiến dịch',
                  ].map((item) => (
                    <div className="hero-feature-item" key={item}>
                      <div className="hero-feature-check">
                        <CheckCircle2 size={14} color="#F97316" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-full hero-card-cta"
                  onClick={() => handleRegister('Lan Tỏa')}
                >
                  <Zap size={16} />
                  Đăng Ký Gói Lan Tỏa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
