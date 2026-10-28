import { useState } from 'react';
import { Check, Calculator as CalcIcon } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const BASE_PLANS = [
  { id: 'khoiSac', name: 'Khởi Sắc', price: 3000000, marketPrice: 5500000 },
  { id: 'lanToa', name: 'Lan Tỏa', price: 5000000, marketPrice: 9000000 },
  { id: 'toanDien', name: 'Toàn Diện', price: 7000000, marketPrice: 13000000 },
];

const ADDONS = [
  { id: 'extraPost', name: 'Thêm 10 bài đăng/tháng', price: 500000, marketPrice: 900000 },
  { id: 'reels', name: 'Sản xuất Reels / TikTok (4 video)', price: 1200000, marketPrice: 2500000 },
  { id: 'ads', name: 'Ngân sách quảng cáo 3 triệu', price: 3000000, marketPrice: 3000000 },
  { id: 'chatbot', name: 'Chatbot AI nâng cao', price: 800000, marketPrice: 1500000 },
  { id: 'email', name: 'Email marketing 5.000 contact', price: 600000, marketPrice: 1200000 },
  { id: 'seo', name: 'SEO từ khóa địa phương', price: 1500000, marketPrice: 3000000 },
  { id: 'photo', name: 'Chụp ảnh sản phẩm (20 ảnh)', price: 1000000, marketPrice: 2000000 },
  { id: 'training', name: 'Đào tạo nhân sự (2 buổi)', price: 700000, marketPrice: 1400000 },
];

function fmtPrice(n) {
  return n.toLocaleString('vi-VN') + '₫';
}

export default function Calculator() {
  const { openModal } = useOrder();
  const [selectedPlan, setSelectedPlan] = useState('lanToa');
  const [selectedAddons, setSelectedAddons] = useState(new Set());

  const plan = BASE_PLANS.find((p) => p.id === selectedPlan);
  const chosenAddons = ADDONS.filter((a) => selectedAddons.has(a.id));

  const totalPrice = plan.price + chosenAddons.reduce((s, a) => s + a.price, 0);
  const totalMarket = plan.marketPrice + chosenAddons.reduce((s, a) => s + a.marketPrice, 0);
  const totalDiscount = totalMarket - totalPrice;

  const toggleAddon = (id) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRegister = () => {
    openModal(plan.name);
  };

  return (
    <section id="calculator" className="calculator section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-label calc-section-label">Công Cụ Tính Phí</span>
          <h2 className="section-title calc-section-title">Tùy Chỉnh Gói Theo Nhu Cầu</h2>
          <p className="section-subtitle calc-section-subtitle">
            Chọn gói nền và các dịch vụ bổ sung để xem báo giá ngay lập tức.
          </p>
        </div>

        <div className="calc-grid">
          {/* Config panel */}
          <div className="calc-config">
            {/* Plan selector */}
            <div>
              <div className="calc-group-title">1. Chọn gói nền</div>
              <div className="plan-selector">
                {BASE_PLANS.map((p) => (
                  <div
                    key={p.id}
                    className={`plan-option${selectedPlan === p.id ? ' selected' : ''}`}
                    onClick={() => setSelectedPlan(p.id)}
                  >
                    <div className="plan-option-name">{p.name}</div>
                    <div className="plan-option-price">{fmtPrice(p.price)}/tháng</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <div className="calc-group-title">2. Dịch vụ bổ sung (tùy chọn)</div>
              <div className="addons-grid">
                {ADDONS.map((addon) => {
                  const selected = selectedAddons.has(addon.id);
                  return (
                    <div
                      key={addon.id}
                      className={`addon-option${selected ? ' selected' : ''}`}
                      onClick={() => toggleAddon(addon.id)}
                    >
                      <div className="addon-checkbox">
                        {selected && <Check size={12} color="white" strokeWidth={3} />}
                      </div>
                      <div className="addon-info">
                        <div className="addon-name">{addon.name}</div>
                        <div className="addon-price">+{fmtPrice(addon.price)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary panel */}
          <div className="calc-summary">
            <div className="calc-summary-title">
              <CalcIcon size={18} style={{ display: 'inline', marginRight: 8, color: 'var(--amber)' }} />
              Tổng Kết Chi Phí
            </div>

            <div className="summary-rows">
              <div className="summary-row">
                <span className="summary-row-label">Gói nền:</span>
                <span className="summary-row-value">{plan.name}</span>
              </div>
              <div className="summary-row">
                <span className="summary-row-label">Giá gói:</span>
                <span className="summary-row-value">{fmtPrice(plan.price)}</span>
              </div>
            </div>

            {chosenAddons.length > 0 && (
              <>
                <div className="summary-divider" />
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
                  DỊCH VỤ BỔ SUNG
                </div>
                <div className="summary-rows">
                  {chosenAddons.map((a) => (
                    <div key={a.id} className="summary-row">
                      <span className="summary-row-addon">{a.name}</span>
                      <span className="summary-row-value" style={{ fontSize: '0.88rem' }}>
                        +{fmtPrice(a.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="summary-divider" />

            <div className="summary-market">
              <span>Giá thị trường:</span>
              <span className="summary-market-value">{fmtPrice(totalMarket)}</span>
            </div>
            <div className="summary-discount">
              <span>Tiết kiệm:</span>
              <span>-{fmtPrice(totalDiscount)} ({Math.round((totalDiscount / totalMarket) * 100)}%)</span>
            </div>

            <div className="summary-total">
              <div className="summary-total-label">TỔNG THANH TOÁN THÁNG ĐẦU</div>
              <div className="summary-total-amount">{fmtPrice(totalPrice)}</div>
            </div>

            <button className="btn btn-primary btn-full btn-lg" onClick={handleRegister}>
              Đăng Ký Gói Này
            </button>

            <p className="summary-note" style={{ marginTop: 16 }}>
              * Giá ưu đãi áp dụng cho tháng đầu tiên.<br />
              Liên hệ để được báo giá gói dài hạn tốt hơn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
