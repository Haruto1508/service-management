import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderContext = createContext(null);

/**
 * Global context for managing order registration data, navigation and toasts.
 */
export function OrderProvider({ children }) {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('Khởi Sắc');
  const [customConfig, setCustomConfig] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const goToRegister = useCallback((plan = 'Khởi Sắc', config = null) => {
    setSelectedPlan(plan);
    setCustomConfig(config);
    const params = new URLSearchParams();
    if (plan) params.set('plan', plan);
    navigate(`/register?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  // Backward compatibility alias for openModal
  const openModal = goToRegister;

  return (
    <OrderContext.Provider
      value={{
        selectedPlan,
        setSelectedPlan,
        customConfig,
        setCustomConfig,
        goToRegister,
        openModal,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return ctx;
}
