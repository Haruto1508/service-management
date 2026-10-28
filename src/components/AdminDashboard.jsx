import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  LogOut,
  RefreshCw,
  Search,
  Users,
  Clock,
  Phone,
  CheckCircle2,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import { fetchOrders, updateOrderStatus } from '../utils/googleSheets';

const STATUS_OPTIONS = [
  { value: 'Chờ xử lý', label: 'Chờ xử lý' },
  { value: 'Đang liên hệ', label: 'Đang liên hệ' },
  { value: 'Đã ký HĐ', label: 'Đã ký HĐ' },
  { value: 'Từ chối', label: 'Từ chối' },
];

const PLAN_COLORS = {
  'Khởi Sắc': 'badge-khoiSac',
  'Lan Tỏa': 'badge-lanToa',
  'Toàn Diện': 'badge-toanDien',
};

function formatDate(isoStr) {
  if (!isoStr) return '—';
  try {
    return new Date(isoStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoStr;
  }
}

export default function AdminDashboard({ session, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [updatingRow, setUpdatingRow] = useState(null);

  const loadOrders = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const data = await fetchOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setOrders([]);
      setError(err.message || 'Không thể tải danh sách đơn đăng ký.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (order, newStatus) => {
    setUpdatingRow(order.rowIndex);
    try {
      await updateOrderStatus(order.rowIndex, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.rowIndex === order.rowIndex ? { ...o, trangThai: newStatus } : o
        )
      );
    } catch (err) {
      alert('Cập nhật trạng thái thất bại: ' + (err.message || 'Lỗi mạng'));
    } finally {
      setUpdatingRow(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ll_admin_session');
    onLogout();
  };

  // Stats
  const total = orders.length;
  const pending = orders.filter((o) => o.trangThai === 'Chờ xử lý').length;
  const inContact = orders.filter((o) => o.trangThai === 'Đang liên hệ').length;
  const signed = orders.filter((o) => o.trangThai === 'Đã ký HĐ').length;

  // Filter
  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.tenCoSo?.toLowerCase().includes(search.toLowerCase()) ||
      o.nguoiDaiDien?.toLowerCase().includes(search.toLowerCase()) ||
      o.soDienThoai?.includes(search) ||
      o.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || o.trangThai === filterStatus;
    const matchPlan = !filterPlan || o.goiDangKy === filterPlan;
    return matchSearch && matchStatus && matchPlan;
  });

  return (
    <div className="admin-dashboard">
      {/* Top Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-logo">
          <div
            style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #F97316, #F59E0B)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={18} color="white" />
          </div>
          Local <span style={{ color: 'var(--primary)', marginLeft: 4 }}>Lift</span>
          <span
            style={{
              marginLeft: 10,
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
            }}
          >
            — Quản Trị Hệ Thống
          </span>
        </div>

        <div className="admin-topbar-right">
          <div className="admin-user-badge">
            <Users size={14} />
            {session.username}
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={15} />
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Danh Sách Đơn Đăng Ký</h1>
            <p className="admin-page-subtitle">
              Quản lý và cập nhật tiến độ xử lý các đơn đăng ký dịch vụ từ khách hàng
            </p>
          </div>
          <button
            className="admin-refresh-btn"
            onClick={() => loadOrders(true)}
            disabled={refreshing || loading}
          >
            <RefreshCw size={15} className={refreshing ? 'spinning' : ''} />
            {refreshing ? 'Đang làm mới...' : 'Làm mới'}
          </button>
        </div>

        {/* Warning / Error */}
        {error && (
          <div
            style={{
              marginBottom: 20,
              padding: '12px 16px',
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.88rem',
              color: '#991B1B',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">
              <Inbox size={24} />
            </div>
            <div>
              <div className="stat-number">{total}</div>
              <div className="stat-label">Tổng đơn đăng ký</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-amber">
              <Clock size={24} />
            </div>
            <div>
              <div className="stat-number">{pending}</div>
              <div className="stat-label">Chờ xử lý</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-orange">
              <Phone size={24} />
            </div>
            <div>
              <div className="stat-number">{inContact}</div>
              <div className="stat-label">Đang liên hệ</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="stat-number">{signed}</div>
              <div className="stat-label">Đã ký hợp đồng</div>
            </div>
          </div>
        </div>

        {/* Orders Table Card */}
        <div className="orders-card">
          <div className="orders-card-header">
            <div className="orders-card-title">
              Danh Sách Đơn {orders.length > 0 && `(${filtered.length}/${orders.length})`}
            </div>
            <div className="orders-filters">
              {/* Search */}
              <div className="search-input-wrapper">
                <Search size={15} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Tìm tên cơ sở, SĐT, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={orders.length === 0}
                />
              </div>

              {/* Plan filter */}
              <select
                className="filter-select"
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                disabled={orders.length === 0}
              >
                <option value="">Tất cả gói</option>
                <option value="Khởi Sắc">Khởi Sắc</option>
                <option value="Lan Tỏa">Lan Tỏa</option>
                <option value="Toàn Diện">Toàn Diện</option>
              </select>

              {/* Status filter */}
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                disabled={orders.length === 0}
              >
                <option value="">Tất cả trạng thái</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="orders-table-wrapper">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner" />
                Đang tải dữ liệu từ Google Sheets...
              </div>
            ) : orders.length === 0 ? (
              /* Trường hợp cơ sở dữ liệu chưa có đơn hàng nào */
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Inbox size={32} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy)', marginBottom: 6 }}>
                  Chưa có đơn hàng nào
                </h3>
                <p className="empty-state-text" style={{ maxWidth: 440, margin: '0 auto', color: 'var(--text-muted)' }}>
                  Hiện tại hệ thống chưa ghi nhận đơn đăng ký nào. Khi có khách hàng gửi form trên website, đơn sẽ tự động xuất hiện tại đây.
                </p>
              </div>
            ) : filtered.length === 0 ? (
              /* Trường hợp có đơn nhưng lọc tìm kiếm không ra kết quả */
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Search size={30} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>
                  Không tìm thấy đơn đăng ký phù hợp
                </h3>
                <p className="empty-state-text" style={{ maxWidth: 400, margin: '0 auto 16px', color: 'var(--text-muted)' }}>
                  Không có đơn nào khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setSearch('');
                    setFilterStatus('');
                    setFilterPlan('');
                  }}
                >
                  Xóa bộ lọc tìm kiếm
                </button>
              </div>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên cơ sở / Người đại diện</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    <th>Gói đăng ký</th>
                    <th>Ngày đăng ký</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, idx) => (
                    <tr key={order.rowIndex ?? idx}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                        {idx + 1}
                      </td>
                      <td>
                        <div className="order-name">{order.tenCoSo || '—'}</div>
                        {order.nguoiDaiDien && (
                          <div className="order-email">{order.nguoiDaiDien}</div>
                        )}
                      </td>
                      <td>
                        <strong>{order.soDienThoai || '—'}</strong>
                      </td>
                      <td>
                        <span className="order-email">{order.email || '—'}</span>
                      </td>
                      <td>
                        <span className={`badge-package ${PLAN_COLORS[order.goiDangKy] || ''}`}>
                          {order.goiDangKy || '—'}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                        {formatDate(order.timestamp)}
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={order.trangThai || 'Chờ xử lý'}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          disabled={updatingRow === order.rowIndex}
                          style={{
                            opacity: updatingRow === order.rowIndex ? 0.6 : 1,
                          }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
