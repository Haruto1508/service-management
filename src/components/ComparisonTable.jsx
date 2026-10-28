import { Check, X } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const CheckIcon = () => <Check size={18} className="check-icon" strokeWidth={2.5} />;
const XIcon = () => <X size={18} className="x-icon" strokeWidth={2.5} />;
const Val = ({ v }) => <span className="text-value">{v}</span>;

const ROWS = [
  // ── Website ──
  { category: true, label: 'Website & Hiện diện Trực tuyến' },
  { label: 'Thiết kế website responsive', khoiSac: <Val v="5 trang" />, lanToa: <Val v="Không giới hạn" />, toanDien: <Val v="Không giới hạn" /> },
  { label: 'Chuẩn SEO kỹ thuật', khoiSac: <CheckIcon />, lanToa: <CheckIcon />, toanDien: <CheckIcon /> },
  { label: 'Tên miền .com miễn phí', khoiSac: <CheckIcon />, lanToa: <CheckIcon />, toanDien: <CheckIcon /> },
  { label: 'SSL & Hosting', khoiSac: <CheckIcon />, lanToa: <CheckIcon />, toanDien: <CheckIcon /> },
  { label: 'Tích hợp Google Maps', khoiSac: <CheckIcon />, lanToa: <CheckIcon />, toanDien: <CheckIcon /> },
  { label: 'Ứng dụng đặt lịch (PWA)', khoiSac: <XIcon />, lanToa: <XIcon />, toanDien: <CheckIcon /> },

  // ── Social ──
  { category: true, label: 'Mạng Xã Hội & Nội Dung' },
  { label: 'Quản lý Fanpage Facebook', khoiSac: <CheckIcon />, lanToa: <CheckIcon />, toanDien: <CheckIcon /> },
  { label: 'Quản lý TikTok', khoiSac: <XIcon />, lanToa: <CheckIcon />, toanDien: <CheckIcon /> },
  { label: 'Quản lý Instagram', khoiSac: <XIcon />, lanToa: <XIcon />, toanDien: <CheckIcon /> },
  { label: 'Số bài đăng/tháng', khoiSac: <Val v="10 bài" />, lanToa: <Val v="20 bài" />, toanDien: <Val v="40 bài" /> },
  { label: 'Thiết kế đồ họa theo yêu cầu', khoiSac: <Val v="5 ảnh/tháng" />, lanToa: <Val v="15 ảnh/tháng" />, toanDien: <Val v="Không giới hạn" /> },

  // ── Ads ──
  { category: true, label: 'Quảng Cáo & Tiếp Thị' },
  { label: 'Chạy quảng cáo Facebook', khoiSac: <XIcon />, lanToa: <CheckIcon />, toanDien: <CheckIcon /> },
  { label: 'Quảng cáo Google Ads', khoiSac: <XIcon />, lanToa: <XIcon />, toanDien: <CheckIcon /> },
  { label: 'Quảng cáo TikTok Ads', khoiSac: <XIcon />, lanToa: <XIcon />, toanDien: <CheckIcon /> },
  { label: 'Email marketing', khoiSac: <XIcon />, lanToa: <CheckIcon />, toanDien: <CheckIcon /> },

  // ── Tools ──
  { category: true, label: 'Công Cụ & Tự Động Hóa' },
  { label: 'Hệ thống đặt lịch online', khoiSac: <XIcon />, lanToa: <CheckIcon />, toanDien: <CheckIcon /> },
  { label: 'Chatbot tư vấn tự động', khoiSac: <XIcon />, lanToa: <CheckIcon />, toanDien: <CheckIcon /> },
  { label: 'CRM quản lý khách hàng', khoiSac: <XIcon />, lanToa: <XIcon />, toanDien: <CheckIcon /> },
  { label: 'Phân tích dữ liệu nâng cao', khoiSac: <XIcon />, lanToa: <XIcon />, toanDien: <CheckIcon /> },

  // ── Support ──
  { category: true, label: 'Hỗ Trợ & Đào Tạo' },
  { label: 'Hỗ trợ khách hàng', khoiSac: <Val v="Email & Chat" />, lanToa: <Val v="Ưu tiên 24/7" />, toanDien: <Val v="Hotline riêng" /> },
  { label: 'Account manager chuyên trách', khoiSac: <XIcon />, lanToa: <XIcon />, toanDien: <CheckIcon /> },
  { label: 'Đào tạo nhân sự trực tiếp', khoiSac: <XIcon />, lanToa: <XIcon />, toanDien: <CheckIcon /> },
  { label: 'Báo cáo hiệu suất', khoiSac: <Val v="Hàng tháng" />, lanToa: <Val v="Hàng tuần" />, toanDien: <Val v="Thời gian thực" /> },
];

export default function ComparisonTable() {
  const { openModal } = useOrder();

  return (
    <section id="comparison" className="comparison section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-label">So Sánh Chi Tiết</span>
          <h2 className="section-title">Tất Cả Tính Năng Trong Một Bảng</h2>
          <p className="section-subtitle">
            So sánh trực quan để chọn đúng gói dịch vụ phù hợp nhất với nhu cầu của bạn.
          </p>
        </div>

        <div className="comparison-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th style={{ width: '36%' }}>Tính năng</th>
                <th>Khởi Sắc<br /><span style={{ fontSize: '0.82rem', fontWeight: 600, opacity: 0.75 }}>₫3,000,000</span></th>
                <th className="featured-col">Lan Tỏa<br /><span style={{ fontSize: '0.82rem', fontWeight: 600, opacity: 0.85 }}>₫5,000,000</span></th>
                <th>Toàn Diện<br /><span style={{ fontSize: '0.82rem', fontWeight: 600, opacity: 0.75 }}>₫7,000,000</span></th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) =>
                row.category ? (
                  <tr key={i} className="category-row">
                    <td colSpan={4}>{row.label}</td>
                  </tr>
                ) : (
                  <tr key={i}>
                    <td>{row.label}</td>
                    <td>{row.khoiSac}</td>
                    <td className="featured-td">{row.lanToa}</td>
                    <td>{row.toanDien}</td>
                  </tr>
                )
              )}
              <tr>
                <td style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Đăng ký</td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => openModal('Khởi Sắc')}>
                    Đăng Ký
                  </button>
                </td>
                <td className="featured-td">
                  <button className="btn btn-primary btn-sm" onClick={() => openModal('Lan Tỏa')}>
                    Đăng Ký
                  </button>
                </td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => openModal('Toàn Diện')}>
                    Đăng Ký
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
