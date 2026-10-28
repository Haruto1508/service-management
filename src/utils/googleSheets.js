const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

/**
 * Submit a new order to Google Sheets via Apps Script
 * Handles Google Apps Script 302 redirects and CORS gracefully.
 * @param {Object} orderData - The order form data
 * @returns {Promise<{success: boolean}>}
 */
export async function submitOrder(orderData) {
  if (!SCRIPT_URL) {
    throw new Error('VITE_GOOGLE_SCRIPT_URL chưa được cấu hình trên môi trường (Vercel/Local).');
  }

  const payload = JSON.stringify({
    action: 'submitOrder',
    ...orderData,
  });

  try {
    // 1. Thử gửi với mode cors thông thường (text/plain để không bị dính preflight OPTIONS)
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: payload,
    });

    if (response.ok) {
      const result = await response.json();
      if (result.status === 'error') {
        throw new Error(result.message || 'Gửi đăng ký thất bại.');
      }
      return { success: true };
    }
  } catch (err) {
    // Nếu gặp lỗi mạng / CORS do Google 302 redirect, thử fallback với mode: 'no-cors'
    console.warn('CORS/Redirect detected, submitting with mode: no-cors...', err);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: payload,
      });
      // Với no-cors, trình duyệt cho phép gửi dữ liệu tới Apps Script mà không chặn CORS
      return { success: true };
    } catch (fallbackErr) {
      console.error('Lỗi gửi đơn:', fallbackErr);
      throw new Error(
        'Không thể kết nối đến Google Sheets. Vui lòng kiểm tra lại quyền truy cập (Anyone) của Web App.'
      );
    }
  }

  return { success: true };
}

/**
 * Fetch all orders from Google Sheets
 * @returns {Promise<Array>} Array of order objects
 */
export async function fetchOrders() {
  if (!SCRIPT_URL) {
    throw new Error('VITE_GOOGLE_SCRIPT_URL chưa được cấu hình.');
  }

  const url = `${SCRIPT_URL}?action=getOrders`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Lỗi máy chủ (${response.status}): Hãy đảm bảo Apps Script được cấp quyền "Bất kỳ ai (Anyone)".`);
  }

  const result = await response.json();

  if (result.status === 'error') {
    throw new Error(result.message || 'Không thể tải danh sách đăng ký.');
  }

  return result.data || [];
}

/**
 * Update the status of an order row
 * @param {number} rowIndex - 1-based row index in the sheet
 * @param {string} status - New status value
 * @returns {Promise<{success: boolean}>}
 */
export async function updateOrderStatus(rowIndex, status) {
  if (!SCRIPT_URL) {
    throw new Error('VITE_GOOGLE_SCRIPT_URL chưa được cấu hình.');
  }

  const payload = JSON.stringify({
    action: 'updateStatus',
    rowIndex,
    status,
  });

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: payload,
    });

    if (response.ok) {
      const result = await response.json();
      if (result.status === 'error') {
        throw new Error(result.message || 'Cập nhật trạng thái thất bại.');
      }
      return { success: true };
    }
  } catch (err) {
    // Fallback no-cors
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: payload,
    });
    return { success: true };
  }

  return { success: true };
}
