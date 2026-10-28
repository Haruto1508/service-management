import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  PhoneCall, 
  HelpCircle, 
  Clock, 
  FileCheck, 
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { submitOrder } from '../utils/googleSheets';
import Footer from '../components/Footer';

const PLANS_DATA = {
  'Khởi Sắc': {
    name: 'Khởi Sắc',
    badge: 'Khởi Đầu',
    price: '3.000.000',
    marketPrice: '5.000.000',
    supportPercent: '40%',
    color: '#3B82F6',
    description: 'Phù hợp cho hộ kinh doanh cần làm lại bộ nhận diện, bao bì tem nhãn và hình ảnh sản phẩm chuẩn mực.',
    highlights: [
      'Thiết kế hoặc chuẩn hóa Logo thương hiệu',
      'Thiết kế file in ấn bao bì & tem nhãn',
      'Phối cảnh mockup 3D sản phẩm thực tế',
      'Bàn giao 100% file gốc chất lượng cao'
    ]
  },
  'Lan Tỏa': {
    name: 'Lan Tỏa',
    badge: 'Bán Chạy Nhất',
    price: '5.000.000',
    marketPrice: '8.000.000',
    supportPercent: '38%',
    color: '#F97316',
    description: 'Dành cho cơ sở có sản phẩm chất lượng nhưng chưa ai biết trên mạng xã hội, cần bùng nổ nhận diện.',
    highlights: [
      'Bao gồm toàn bộ quyền lợi gói Khởi Sắc',
      'Chụp ảnh concept studio (10 ảnh chuyên nghiệp)',
      'Sản xuất 2 video short-form TikTok/Reels xu hướng',
      'Thiết lập & tối ưu hóa Fanpage + Kênh TikTok',
      'Hỗ trợ vận hành kênh trong 2 tuần đầu'
    ]
  },
  'Toàn Diện': {
    name: 'Toàn Diện',
    badge: 'VIP Best Value',
    price: '7.000.000',
    marketPrice: '15.000.000',
    supportPercent: '53%',
    color: '#8B5CF6',
    description: 'Gói giải pháp toàn diện từ A-Z giúp hộ kinh doanh lột xác hình ảnh, phủ sóng mạng xã hội và đột phá doanh thu.',
    highlights: [
      'Bộ nhận diện cao cấp + Hệ thống poster quảng bá',
      'Chụp 15 ảnh sản phẩm phong cách cinematic',
      'Sản xuất 3 video ngắn triệu view + Brand Story',
      'Kết nối 1-2 KOC/Reviewer địa phương trải nghiệm',
      'Vận hành social 1 tháng + Đào tạo tự vận hành 1-1'
    ]
  }
};

const EMPTY_FORM = {
  tenCoSo: '',
  nguoiDaiDien: '',
  soDienThoai: '',
  email: '',
  diaChi: '',
  moTa: '',
};

export default function RegisterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedPlan, setSelectedPlan, customConfig, addToast } = useOrder();
  const navigate = useNavigate();

  // Get plan from URL or Context
  const planQuery = searchParams.get('plan') || selectedPlan || 'Lan Tỏa';
  const initialPlan = PLANS_DATA[planQuery] ? planQuery : 'Lan Tỏa';

  const [currentPlan, setCurrentPlan] = useState(initialPlan);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  // Sync plan parameter with state
  useEffect(() => {
    if (planQuery && PLANS_DATA[planQuery] && planQuery !== currentPlan) {
      setCurrentPlan(planQuery);
      setSelectedPlan(planQuery);
    }
  }, [planQuery]);

  // Pre-fill note if customConfig from calculator was passed
  useEffect(() => {
    if (customConfig?.note && !form.moTa) {
      setForm(prev => ({
        ...prev,
        moTa: customConfig.note
      }));
    }
  }, [customConfig]);

  const handlePlanChange = (planName) => {
    setCurrentPlan(planName);
    setSelectedPlan(planName);
    setSearchParams({ plan: planName });
  };

  const validate = () => {
    const errs = {};
    if (!form.tenCoSo.trim()) errs.tenCoSo = 'Vui lòng nhập tên cơ sở / hộ kinh doanh';
    if (!form.nguoiDaiDien.trim()) errs.nguoiDaiDien = 'Vui lòng nhập họ tên người đại diện';
    if (!form.soDienThoai.trim()) {
      errs.soDienThoai = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{9,11}$/.test(form.soDienThoai.replace(/[\s-]/g, ''))) {
      errs.soDienThoai = 'Số điện thoại không hợp lệ (9 - 11 chữ số)';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Email không đúng định dạng';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    const orderPayload = {
      ...form,
      goiDangKy: currentPlan,
      timestamp: new Date().toISOString(),
    };

    try {
      await submitOrder(orderPayload);
      addToast('Đăng ký gói ' + currentPlan + ' thành công! Đội ngũ Local Lift sẽ liên hệ trong 24h.', 'success');
      setSubmittedData({
        ...orderPayload,
        submittedAt: new Date().toLocaleString('vi-VN')
      });
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (err) {
      addToast(err.message || 'Gửi đăng ký không thành công. Vui lòng thử lại!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const planInfo = PLANS_DATA[currentPlan];

  return (
    <div className="register-page-wrapper">
      {/* Top Header */}
      <header className="register-header">
        <div className="container">
          <div className="register-header-inner">
            <Link to="/" className="navbar-logo">
              <div className="logo-icon">
                <TrendingUp size={20} strokeWidth={2.5} />
              </div>
              <span>
                Local <span className="logo-text-lift">Lift</span>
              </span>
            </Link>

            <div className="register-header-nav">
              <Link to="/" className="btn-back-home">
                <ArrowLeft size={17} />
                <span>Quay lại trang chủ</span>
              </Link>
              <div className="support-badge">
                <PhoneCall size={15} />
                <span>Hotline: <strong>0901.234.567</strong></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="register-hero">
        <div className="container">
          <div className="register-hero-content">
            <div className="inline-badge">
              <Sparkles size={14} />
              <span>Chương Trình Đồng Hành Chuyển Đổi Số Địa Phương</span>
            </div>
            <h1>Đăng Ký Tư Vấn & Triển Khai Gói Dịch Vụ</h1>
            <p>
              Điền thông tin cơ sở của bạn để nhận tư vấn 1-1 và suất tài trợ kinh phí từ chương trình Local Lift
            </p>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <main className="container register-main-container">
        {submittedData ? (
          /* Success Screen */
          <div className="register-success-card">
            <div className="success-icon-wrap">
              <CheckCircle2 size={56} color="#10B981" />
            </div>
            <h2>Đăng Ký Thành Công!</h2>
            <p className="success-subtitle">
              Cảm ơn quý cơ sở <strong>{submittedData.tenCoSo}</strong> đã tin tưởng đăng ký đồng hành cùng <strong>Local Lift</strong>.
            </p>

            <div className="success-summary-box">
              <div className="summary-row">
                <span className="summary-label">Gói đã đăng ký:</span>
                <span className="summary-val highlight">Gói {submittedData.goiDangKy}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Người đại diện:</span>
                <span className="summary-val">{submittedData.nguoiDaiDien}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Số điện thoại:</span>
                <span className="summary-val">{submittedData.soDienThoai}</span>
              </div>
              {submittedData.email && (
                <div className="summary-row">
                  <span className="summary-label">Email:</span>
                  <span className="summary-val">{submittedData.email}</span>
                </div>
              )}
              {submittedData.diaChi && (
                <div className="summary-row">
                  <span className="summary-label">Địa chỉ:</span>
                  <span className="summary-val">{submittedData.diaChi}</span>
                </div>
              )}
              <div className="summary-row">
                <span className="summary-label">Thời gian gửi:</span>
                <span className="summary-val">{submittedData.submittedAt}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Trạng thái:</span>
                <span className="badge-pending">Đã lưu hệ thống — Chờ chuyên viên gọi</span>
              </div>
            </div>

            <div className="next-steps-card">
              <h4>Quy trình tiếp theo:</h4>
              <ol>
                <li>Chuyên viên Local Lift sẽ liên hệ qua số điện thoại <strong>{submittedData.soDienThoai}</strong> trong 24 giờ.</li>
                <li>Khảo sát sơ bộ hiện trạng hình ảnh, bao bì & kênh mạng xã hội của cơ sở.</li>
                <li>Lên kế hoạch triển khai chi tiết và tiến hành thực hiện.</li>
              </ol>
            </div>

            <div className="success-actions">
              <Link to="/" className="btn btn-primary btn-lg">
                Quay về Trang Chủ
              </Link>
              <button 
                type="button" 
                className="btn btn-secondary btn-lg"
                onClick={() => {
                  setSubmittedData(null);
                  setForm(EMPTY_FORM);
                }}
              >
                Đăng ký thêm cơ sở khác
              </button>
            </div>
          </div>
        ) : (
          /* Form & Plan Comparison Grid */
          <div className="register-layout-grid">
            {/* Left Column: Plan Information */}
            <div className="register-sidebar">
              {/* Plan Switcher Tabs */}
              <div className="plan-selector-box">
                <h3 className="sidebar-title">
                  <Award size={18} />
                  1. Chọn Gói Dịch Vụ
                </h3>
                <div className="plan-tab-buttons">
                  {Object.keys(PLANS_DATA).map((pKey) => {
                    const p = PLANS_DATA[pKey];
                    const isActive = currentPlan === pKey;
                    return (
                      <button
                        key={pKey}
                        type="button"
                        className={`plan-tab-btn ${isActive ? 'active' : ''}`}
                        onClick={() => handlePlanChange(pKey)}
                      >
                        <div className="tab-top">
                          <span className="tab-badge">{p.badge}</span>
                          <span className="tab-name">{p.name}</span>
                        </div>
                        <div className="tab-price">
                          <strong>{p.price}</strong> VNĐ
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Plan Details Card */}
              <div className="selected-plan-card">
                <div className="plan-card-header">
                  <div>
                    <span className="plan-tag" style={{ background: planInfo.color }}>
                      {planInfo.badge}
                    </span>
                    <h3 className="plan-card-title">Gói {planInfo.name}</h3>
                  </div>
                  <div className="plan-card-pricing">
                    <div className="current-price">{planInfo.price} <small>VNĐ</small></div>
                    <div className="market-price">
                      <del>{planInfo.marketPrice} VNĐ</del>
                      <span className="discount-tag">Hỗ trợ {planInfo.supportPercent}</span>
                    </div>
                  </div>
                </div>

                <p className="plan-desc">{planInfo.description}</p>

                <div className="plan-features-list">
                  <h4 className="features-title">Hạng mục triển khai chính:</h4>
                  <ul>
                    {planInfo.highlights.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={16} className="feature-check" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {customConfig?.addonNames && (
                  <div className="calculator-addon-alert">
                    <Zap size={16} color="#F97316" />
                    <div>
                      <strong>Đã kèm tùy chọn thêm:</strong> {customConfig.addonNames}
                    </div>
                  </div>
                )}
              </div>

              {/* Trust & Guarantee Box */}
              <div className="trust-box">
                <h4 className="trust-title">
                  <ShieldCheck size={18} color="#10B981" />
                  Cam Kết Từ Local Lift
                </h4>
                <ul className="trust-list">
                  <li>
                    <FileCheck size={16} />
                    <span>Hợp đồng rõ ràng, không phát sinh bất kỳ phụ phí ẩn</span>
                  </li>
                  <li>
                    <Clock size={16} />
                    <span>Bàn giao đúng tiến độ cam kết (từ 7 - 14 ngày làm việc)</span>
                  </li>
                  <li>
                    <Zap size={16} />
                    <span>Bàn giao 100% file gốc thiết kế và quyền quản trị kênh</span>
                  </li>
                </ul>
              </div>

              {/* Direct Support Contact */}
              <div className="direct-contact-card">
                <HelpCircle size={24} color="#F97316" />
                <div>
                  <strong>Bạn phân vân chưa biết chọn gói nào?</strong>
                  <p>Hãy liên hệ hotline để được tư vấn viên phân tích giải pháp phù hợp nhất với ngành nghề của bạn.</p>
                  <a href="tel:0901234567" className="phone-link">
                    📞 0901 234 567 (Zalo/Hotline)
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Registration Form */}
            <div className="register-form-container">
              <div className="form-card">
                <div className="form-card-header">
                  <h2>2. Thông Tin Đăng Ký</h2>
                  <p>Vui lòng điền thông tin bên dưới để chuyên viên chuẩn bị tài liệu tư vấn riêng cho cơ sở của bạn.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Tên cơ sở & Người đại diện */}
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="tenCoSo">
                        Tên cơ sở / Hộ kinh doanh <span className="required">*</span>
                      </label>
                      <input
                        id="tenCoSo"
                        name="tenCoSo"
                        type="text"
                        className={`form-input ${errors.tenCoSo ? 'input-error' : ''}`}
                        placeholder="VD: Cà Phê Mộc Châu, Tiệm Bánh Hoa Sen..."
                        value={form.tenCoSo}
                        onChange={handleChange}
                      />
                      {errors.tenCoSo && <span className="error-text">{errors.tenCoSo}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="nguoiDaiDien">
                        Người đại diện / Chủ cơ sở <span className="required">*</span>
                      </label>
                      <input
                        id="nguoiDaiDien"
                        name="nguoiDaiDien"
                        type="text"
                        className={`form-input ${errors.nguoiDaiDien ? 'input-error' : ''}`}
                        placeholder="Họ và tên của bạn"
                        value={form.nguoiDaiDien}
                        onChange={handleChange}
                      />
                      {errors.nguoiDaiDien && <span className="error-text">{errors.nguoiDaiDien}</span>}
                    </div>
                  </div>

                  {/* SĐT & Email */}
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="soDienThoai">
                        Số điện thoại (Zalo) <span className="required">*</span>
                      </label>
                      <input
                        id="soDienThoai"
                        name="soDienThoai"
                        type="tel"
                        className={`form-input ${errors.soDienThoai ? 'input-error' : ''}`}
                        placeholder="0901 234 567"
                        value={form.soDienThoai}
                        onChange={handleChange}
                      />
                      {errors.soDienThoai && <span className="error-text">{errors.soDienThoai}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="email">
                        Địa chỉ Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className={`form-input ${errors.email ? 'input-error' : ''}`}
                        placeholder="email@example.com"
                        value={form.email}
                        onChange={handleChange}
                      />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                  </div>

                  {/* Địa chỉ cơ sở */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="diaChi">
                      Địa chỉ cơ sở / Địa phương hoạt động
                    </label>
                    <input
                      id="diaChi"
                      name="diaChi"
                      type="text"
                      className="form-input"
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      value={form.diaChi}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Gói đăng ký */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="goiDangKy">
                      Gói dịch vụ đã chọn
                    </label>
                    <select
                      id="goiDangKy"
                      className="form-select"
                      value={currentPlan}
                      onChange={(e) => handlePlanChange(e.target.value)}
                    >
                      {Object.keys(PLANS_DATA).map((pKey) => (
                        <option key={pKey} value={pKey}>
                          Gói {pKey} — {PLANS_DATA[pKey].price} VNĐ (Hỗ trợ {PLANS_DATA[pKey].supportPercent})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mô tả / Nhu cầu */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="moTa">
                      Mô tả ngắn về sản phẩm & nhu cầu của bạn
                    </label>
                    <textarea
                      id="moTa"
                      name="moTa"
                      className="form-textarea"
                      rows={4}
                      placeholder="VD: Chúng tôi chuyên sản xuất mật ong hoa cà phê Đắk Lắk, hiện bao bì cũ chưa bắt mắt và chưa có kênh TikTok để bán hàng..."
                      value={form.moTa}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="form-submit-row">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg btn-full submit-order-btn"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner" />
                          <span>Đang gửi thông tin lên hệ thống...</span>
                        </>
                      ) : (
                        <>
                          <Zap size={20} />
                          <span>Hoàn Tất Đăng Ký Gói {currentPlan}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="form-footer-note">
                    <ShieldCheck size={16} color="#10B981" />
                    <span>
                      Thông tin của bạn được bảo mật tuyệt đối và chỉ dùng để liên hệ tư vấn chuyển đổi số.
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

