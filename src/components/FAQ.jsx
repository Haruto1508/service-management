import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Local Lift phù hợp với những loại hình kinh doanh nào?',
    a: 'Local Lift được thiết kế cho mọi loại hình cơ sở kinh doanh địa phương: nhà hàng, quán cà phê, salon tóc, spa, phòng khám, cửa hàng thời trang, siêu thị mini, v.v. Bất kỳ cơ sở nào muốn xây dựng hiện diện số và tăng trưởng khách hàng đều có thể sử dụng.',
  },
  {
    q: 'Tôi có cần kiến thức kỹ thuật để sử dụng dịch vụ không?',
    a: 'Hoàn toàn không! Đội ngũ của chúng tôi sẽ xử lý toàn bộ phần kỹ thuật. Bạn chỉ cần cung cấp thông tin về cơ sở và phản hồi nội dung. Chúng tôi cũng đào tạo nhân viên của bạn sử dụng các công cụ cơ bản (áp dụng với gói Toàn Diện).',
  },
  {
    q: 'Thời gian triển khai ban đầu mất bao lâu?',
    a: 'Gói Khởi Sắc: 7-10 ngày làm việc. Gói Lan Tỏa: 10-14 ngày. Gói Toàn Diện: 14-21 ngày. Thời gian có thể thay đổi tùy theo mức độ phức tạp và tốc độ phản hồi thông tin của khách hàng.',
  },
  {
    q: 'Tôi có thể nâng cấp hoặc hủy gói không?',
    a: 'Bạn có thể nâng cấp gói bất kỳ lúc nào và chỉ thanh toán phần chênh lệch. Về hủy dịch vụ, chúng tôi áp dụng hợp đồng theo tháng — bạn có thể hủy trước 30 ngày so với chu kỳ tiếp theo mà không phát sinh phí phạt.',
  },
  {
    q: 'Chi phí quảng cáo có được tính trong gói không?',
    a: 'Phí dịch vụ của chúng tôi bao gồm chi phí quản lý và sáng tạo nội dung quảng cáo. Ngân sách thực chạy quảng cáo trên Facebook/Google/TikTok là chi phí riêng, tùy theo kế hoạch của bạn. Chúng tôi tư vấn ngân sách tối ưu cho từng cơ sở.',
  },
  {
    q: 'Có hỗ trợ tôi nếu tôi đã có website hoặc fanpage rồi không?',
    a: 'Có! Chúng tôi có thể tiếp quản và tối ưu hóa website hoặc fanpage hiện có của bạn. Đội ngũ sẽ đánh giá miễn phí tình trạng hiện tại và đề xuất phương án phù hợp nhất.',
  },
  {
    q: 'Nội dung đăng mạng xã hội có được duyệt trước khi đăng không?',
    a: 'Chắc chắn rồi! Toàn bộ nội dung sẽ được gửi cho bạn duyệt qua nhóm Zalo/Messenger trước khi đăng tải. Bạn có quyền yêu cầu chỉnh sửa không giới hạn số lần trong vòng 24 giờ kể từ khi nhận nội dung.',
  },
  {
    q: 'Local Lift có bảo mật thông tin cơ sở kinh doanh của tôi không?',
    a: 'Tuyệt đối. Chúng tôi ký cam kết bảo mật thông tin (NDA) với mỗi khách hàng. Dữ liệu của bạn không bao giờ được chia sẻ với bên thứ ba. Toàn bộ mật khẩu tài khoản được bảo quản theo tiêu chuẩn bảo mật cao nhất.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section id="faq" className="faq section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Câu Hỏi Thường Gặp</span>
          <h2 className="section-title">Giải Đáp Mọi Thắc Mắc</h2>
          <p className="section-subtitle">
            Không tìm thấy câu trả lời bạn cần? Liên hệ ngay với đội ngũ tư vấn của chúng tôi.
          </p>
        </div>

        <div className="faq-list">
          {FAQS.map((item, i) => (
            <div key={i} className={`faq-item${openIndex === i ? ' open' : ''}`}>
              <button className="faq-question" onClick={() => toggle(i)}>
                <span className="faq-question-text">{item.q}</span>
                <span className="faq-icon">
                  <ChevronDown size={16} />
                </span>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-inner">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
