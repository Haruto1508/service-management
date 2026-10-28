import { TrendingUp, Zap, BarChart3, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function HeroSection() {
  const { openModal } = useOrder();

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
              <Star size={14} fill="currentColor" />
              Chương trình Chuyển đổi Số cho Doanh nghiệp Địa phương
            </div>

            <h1 className="hero-title">
              Nâng Tầm{' '}
              <span className="highlight">Thương Hiệu</span>
              <br />
              Địa Phương Của Bạn
            </h1>

            <p className="hero-desc">
              Local Lift giúp các cơ sở kinh doanh địa phương chuyển đổi số toàn diện —
              từ website, mạng xã hội đến quản lý đặt lịch — với chi phí hợp lý và
              đội ngũ hỗ trợ tận tâm.
            </p>

            <div className="hero-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => openModal('Khởi Sắc')}
              >
                <Zap size={18} />
                Đăng ký ngay hôm nay
              </button>
              <button
                className="btn btn-outline-white btn-lg"
                onClick={() => scrollToSection('#pricing')}
              >
                Xem gói dịch vụ
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">500+</span>
                <span className="hero-stat-label">Cơ sở đã tin dùng</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">98%</span>
                <span className="hero-stat-label">Hài lòng sau dùng thử</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">3×</span>
                <span className="hero-stat-label">Tăng trưởng trung bình</span>
              </div>
            </div>
          </div>

          {/* Right: Visual card */}
          <div className="hero-visual">
            <div className="hero-card-stack">
              {/* Floating badges */}
              <div className="hero-card-float hero-card-float-1">
                <div className="float-icon float-icon-green">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Đã kích hoạt!</div>
                  <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.55)' }}>
                    Website + Fanpage
                  </div>
                </div>
              </div>

              <div className="hero-card-float hero-card-float-2">
                <div className="float-icon float-icon-amber">
                  <BarChart3 size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>+247% lượt xem</div>
                  <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.55)' }}>
                    Trong 30 ngày đầu
                  </div>
                </div>
              </div>

              {/* Main card */}
              <div className="hero-card hero-card-main">
                <div className="hero-card-header">
                  <div className="hero-card-icon">
                    <TrendingUp size={22} color="white" />
                  </div>
                  <div>
                    <div className="hero-card-title">Gói Lan Tỏa</div>
                    <div className="hero-card-subtitle">Dành cho cơ sở đang phát triển</div>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: 'white',
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: '1rem', color: 'var(--amber)' }}>₫</span>
                  5,000,000
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
                  /tháng đầu tiên
                </div>

                <div className="hero-feature-list">
                  {[
                    'Website chuyên nghiệp',
                    'Quản lý Fanpage & TikTok',
                    '20 bài đăng/tháng',
                    'Hệ thống đặt lịch online',
                    'Hỗ trợ 24/7',
                  ].map((item) => (
                    <div className="hero-feature-item" key={item}>
                      <div className="hero-feature-check">
                        <CheckCircle2 size={12} color="#F97316" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
