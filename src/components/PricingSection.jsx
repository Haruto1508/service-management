import { Check, Star } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const PLANS = [
  {
    id: 'khoiSac',
    tier: 'Gói Cơ Bản',
    name: 'Khởi Sắc',
    price: '3,000,000',
    priceNum: 3000000,
    desc: 'Lý tưởng cho cơ sở mới bắt đầu hành trình số hóa, muốn xây dựng diện mạo trực tuyến cơ bản.',
    features: [
      'Website chuẩn SEO 5 trang',
      'Fanpage Facebook chuyên nghiệp',
      '10 bài đăng/tháng',
      'Thiết kế logo & bộ nhận diện cơ bản',
      'Tích hợp Google Maps',
      'Báo cáo hiệu suất hàng tháng',
      'Hỗ trợ qua email & chat',
    ],
    featured: false,
  },
  {
    id: 'lanToa',
    tier: 'Gói Phổ Biến',
    name: 'Lan Tỏa',
    price: '5,000,000',
    priceNum: 5000000,
    desc: 'Giải pháp toàn diện cho cơ sở đang phát triển, tập trung vào tăng trưởng và tương tác khách hàng.',
    features: [
      'Tất cả tính năng Khởi Sắc',
      'Website không giới hạn trang',
      'Quản lý Fanpage & TikTok',
      '20 bài đăng/tháng',
      'Hệ thống đặt lịch online',
      'Chatbot tư vấn tự động',
      'Quảng cáo Facebook cơ bản',
      'Hỗ trợ ưu tiên 24/7',
    ],
    featured: true,
  },
  {
    id: 'toanDien',
    tier: 'Gói Cao Cấp',
    name: 'Toàn Diện',
    price: '7,000,000',
    priceNum: 7000000,
    desc: 'Bộ giải pháp đỉnh cao cho chuỗi cơ sở hoặc doanh nghiệp muốn thống lĩnh thị trường địa phương.',
    features: [
      'Tất cả tính năng Lan Tỏa',
      'Ứng dụng đặt lịch riêng (PWA)',
      '40 bài đăng/tháng',
      'Quảng cáo đa nền tảng',
      'CRM quản lý khách hàng',
      'Phân tích dữ liệu nâng cao',
      'Đào tạo nhân sự trực tiếp',
      'Account manager chuyên trách',
    ],
    featured: false,
  },
];

export default function PricingSection() {
  const { openModal } = useOrder();

  return (
    <section id="pricing" className="pricing section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Bảng Giá Dịch Vụ</span>
          <h2 className="section-title">Chọn Gói Phù Hợp Với Bạn</h2>
          <p className="section-subtitle">
            Ba gói dịch vụ linh hoạt, thiết kế riêng cho từng giai đoạn phát triển của cơ sở bạn.
          </p>
        </div>

        <div className="pricing-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card${plan.featured ? ' featured' : ''}`}
            >
              {plan.featured && (
                <div className="pricing-badge">
                  <Star size={12} fill="currentColor" style={{ display: 'inline', marginRight: 4 }} />
                  Bán Chạy Nhất
                </div>
              )}

              <div className="pricing-tier">{plan.tier}</div>
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-desc">{plan.desc}</div>

              <div className="pricing-price">
                <div className="price-amount">
                  <span className="currency">₫</span>
                  {plan.price}
                </div>
                <div className="price-period">mỗi tháng đầu tiên</div>
              </div>

              <div className="pricing-divider" />

              <ul className="pricing-features">
                {plan.features.map((feat) => (
                  <li key={feat} className="pricing-feature">
                    <span className={`feature-check${plan.featured ? ' featured-check' : ''}`}>
                      <Check size={11} strokeWidth={3} />
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                className={`btn btn-full${plan.featured ? ' btn-primary' : ' btn-secondary'}`}
                onClick={() => openModal(plan.name)}
              >
                {plan.featured ? '🚀 Đăng Ký Ngay' : 'Đăng Ký'}
              </button>
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: 32,
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
          }}
        >
          💡 Giá trên là mức ưu đãi tháng đầu. Liên hệ để được tư vấn gói dịch vụ dài hạn.
        </p>
      </div>
    </section>
  );
}
