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
  XCircle,
  Inbox,
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

// Demo/fallback data shown when no script URL is configured
const DEMO_ORDERS = [
  {
    rowIndex: 2,
    tenCoSo: 'Quán Cà Phê Bình Minh',
    nguoiDaiDien: 'Trần Văn An',
    soDienThoai: '0901 234 567',
    email: 'binhminh@gmail.com',
    goiDangKy: 'Lan Tỏa',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    trangThai: 'Chờ xử lý',
  },
  {
    rowIndex: 3,
    tenCoSo: 'Tiệm Nail Ngọc Trinh',
    nguoiDaiDien: 'Nguyễn Ngọc Trinh',
    soDienThoai: '0912 345 678',
    email: 'ngoctrinh.nail@gmail.com',
    goiDangKy: 'Khởi Sắc',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    trangThai: 'Đang liên hệ',
  },
  {
    rowIndex: 4,
    tenCoSo: 'Nhà Hàng Lẩu Đỏ',
    nguoiDaiDien: 'Lê Quang Minh',
    soDienThoai: '0933 456 789',
    email: 'laudo.nha@gmail.com',
    goiDangKy: 'Toàn Diện',
    timestamp: new Date(Date.now() - 86400000 * 8).toISOString(),
    trangThai: 'Đã ký HĐ',
  },
  {
    rowIndex: 5,
    tenCoSo: 'Spa Hoa Sen',
    nguoiDaiDien: 'Phạm Thị Hoa',
    soDienThoai: '0944 567 890',
    email: 'spahoa.sen@gmail.com',
    goiDangKy: 'Lan Tỏa',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    trangThai: 'Chờ xử lý',
  },
];

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
      setOrders(data);
    } catch (err) {
      // Fall back to demo data if no URL configured
      if (err.message.includes('chưa được cấu hình')) {
        setOrders(DEMO_ORDERS);
        setError('⚠️ Chưa cấu hình VITE_GOOGLE_SCRIPT_URL — đang hiển thị dữ liệu mẫu.');
      } else {
        setError(err.message);
        setOrders(DEMO_ORDERS);
      }
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
    } catch {
      // Optimistic update for demo mode
      setOrders((prev) =>
        prev.map((o) =>
          o.rowIndex === order.rowIndex ? { ...o, trangThai: newStatus } : o
        )
      );
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
      o.soDienThoai?.includes(search);
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
            — Quản Trị
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
          <h1 className="admin-page-title">Danh Sách Đăng Ký</h1>
          <p className="admin-page-subtitle">
            Quản lý và cập nhật trạng thái các đơn đăng ký dịch vụ
          </p>
        </div>

        {/* Warning / Error */}
        {error && (
          <div
            style={{
              marginBottom: 20,
              padding: '12px 16px',
              background: '#FFFBEB',
              border: '1px solid #FEF3C7',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              color: '#92400E',
            }}
          >
            {error}
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
              Danh Sách Đơn ({filtered.length})
            </div>
            <div className="orders-filters">
              {/* Search */}
              <div className="search-input-wrapper">
                <Search size={15} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Tìm theo tên, SĐT..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Plan filter */}
              <select
                className="filter-select"
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
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
              >
                <option value="">Tất cả trạng thái</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>

              {/* Refresh */}
              <button
                className="admin-refresh-btn"
                onClick={() => loadOrders(true)}
                disabled={refreshing}
              >
                <RefreshCw size={15} className={refreshing ? 'spinning' : ''} />
                Làm mới
              </button>
            </div>
          </div>

          <div className="orders-table-wrapper">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner" />
                Đang tải dữ liệu...
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <XCircle size={28} />
                </div>
                <p className="empty-state-text">Không tìm thấy đơn đăng ký nào</p>
              </div>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên cơ sở</th>
                    <th>SĐT</th>
                    <th>Email</th>
                    <th>Gói</th>
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
                      <td>{order.soDienThoai || '—'}</td>
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
