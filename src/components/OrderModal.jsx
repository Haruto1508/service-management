import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { submitOrder } from '../utils/googleSheets';

const PLANS = ['Khởi Sắc', 'Lan Tỏa', 'Toàn Diện'];

const EMPTY_FORM = {
  tenCoSo: '',
  nguoiDaiDien: '',
  soDienThoai: '',
  email: '',
  diaChi: '',
  moTa: '',
};

function Toast({ toast, onRemove }) {
  return (
    <div className={`toast toast-${toast.type}`}>
      {toast.type === 'success' ? (
        <CheckCircle2 size={18} />
      ) : (
        <AlertCircle size={18} />
      )}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default function OrderModal() {
  const { isModalOpen, selectedPlan, closeModal, toasts, addToast, removeToast } = useOrder();
  const [form, setForm] = useState(EMPTY_FORM);
  const [plan, setPlan] = useState(selectedPlan || PLANS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedPlan) setPlan(selectedPlan);
  }, [selectedPlan]);

  useEffect(() => {
    if (isModalOpen) setForm(EMPTY_FORM);
  }, [isModalOpen]);

  const validate = () => {
    const errs = {};
    if (!form.tenCoSo.trim()) errs.tenCoSo = 'Vui lòng nhập tên cơ sở';
    if (!form.nguoiDaiDien.trim()) errs.nguoiDaiDien = 'Vui lòng nhập người đại diện';
    if (!form.soDienThoai.trim()) errs.soDienThoai = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{9,11}$/.test(form.soDienThoai.replace(/[\s-]/g, ''))) {
      errs.soDienThoai = 'Số điện thoại không hợp lệ';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Email không hợp lệ';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await submitOrder({
        ...form,
        goiDangKy: plan,
        timestamp: new Date().toISOString(),
      });
      addToast('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong 24 giờ.', 'success');
      closeModal();
    } catch (err) {
      addToast(
        err.message || 'Gửi đăng ký thất bại. Vui lòng thử lại hoặc liên hệ trực tiếp.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-header">
              <div>
                <h2 className="modal-title" id="modal-title">Đăng Ký Dịch Vụ</h2>
                <div className="modal-subtitle">Điền thông tin để được tư vấn và kích hoạt gói dịch vụ</div>
              </div>
              <button className="modal-close" onClick={closeModal} aria-label="Đóng">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                {/* Tên cơ sở */}
                <div className="form-group">
                  <label className="form-label" htmlFor="tenCoSo">
                    Tên cơ sở <span className="required">*</span>
                  </label>
                  <input
                    id="tenCoSo"
                    name="tenCoSo"
                    type="text"
                    className="form-input"
                    placeholder="VD: Quán Cà Phê Ánh Sáng"
                    value={form.tenCoSo}
                    onChange={handleChange}
                    autoFocus
                  />
                  {errors.tenCoSo && (
                    <span style={{ fontSize: '0.78rem', color: '#EF4444' }}>{errors.tenCoSo}</span>
                  )}
                </div>

                {/* Người đại diện */}
                <div className="form-group">
                  <label className="form-label" htmlFor="nguoiDaiDien">
                    Người đại diện <span className="required">*</span>
                  </label>
                  <input
                    id="nguoiDaiDien"
                    name="nguoiDaiDien"
                    type="text"
                    className="form-input"
                    placeholder="Họ và tên"
                    value={form.nguoiDaiDien}
                    onChange={handleChange}
                  />
                  {errors.nguoiDaiDien && (
                    <span style={{ fontSize: '0.78rem', color: '#EF4444' }}>{errors.nguoiDaiDien}</span>
                  )}
                </div>

                {/* SĐT */}
                <div className="form-group">
                  <label className="form-label" htmlFor="soDienThoai">
                    Số điện thoại <span className="required">*</span>
                  </label>
                  <input
                    id="soDienThoai"
                    name="soDienThoai"
                    type="tel"
                    className="form-input"
                    placeholder="0901 234 567"
                    value={form.soDienThoai}
                    onChange={handleChange}
                  />
                  {errors.soDienThoai && (
                    <span style={{ fontSize: '0.78rem', color: '#EF4444' }}>{errors.soDienThoai}</span>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <span style={{ fontSize: '0.78rem', color: '#EF4444' }}>{errors.email}</span>
                  )}
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="form-group">
                <label className="form-label" htmlFor="diaChi">Địa chỉ cơ sở</label>
                <input
                  id="diaChi"
                  name="diaChi"
                  type="text"
                  className="form-input"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  value={form.diaChi}
                  onChange={handleChange}
                />
              </div>

              {/* Gói đã chọn */}
              <div className="form-group">
                <label className="form-label" htmlFor="goiDangKy">Gói đã chọn</label>
                <select
                  id="goiDangKy"
                  className="form-select readonly"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  readOnly
                >
                  {PLANS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Mô tả */}
              <div className="form-group">
                <label className="form-label" htmlFor="moTa">Mô tả ngắn về cơ sở</label>
                <textarea
                  id="moTa"
                  name="moTa"
                  className="form-textarea"
                  placeholder="Mô tả ngắn về lĩnh vực kinh doanh, quy mô, mục tiêu bạn muốn đạt được..."
                  value={form.moTa}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  style={{ flex: '0 0 auto' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={submitting}
                >
                  {submitting ? (
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
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi Đăng Ký'
                  )}
                </button>
              </div>

              <p className="modal-note">
                Bằng cách gửi form này, bạn đồng ý để Local Lift liên hệ tư vấn về dịch vụ.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
