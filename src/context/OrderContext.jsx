import { createContext, useContext, useState, useCallback } from 'react';

const OrderContext = createContext(null);

/**
 * Global context for managing order modal state and toast notifications.
 */
export function OrderProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [toasts, setToasts] = useState([]);

  const openModal = useCallback((plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    document.body.style.overflow = '';
  }, []);

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

  return (
    <OrderContext.Provider
      value={{
        isModalOpen,
        selectedPlan,
        openModal,
        closeModal,
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
