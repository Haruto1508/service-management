import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

function ToastItem({ toast, onRemove }) {
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
        aria-label="Đóng"
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

export default function ToastContainer() {
  const { toasts, removeToast } = useOrder();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

