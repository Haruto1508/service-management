const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

/**
 * Submit a new order to Google Sheets via Apps Script
 * @param {Object} orderData - The order form data
 * @returns {Promise<{success: boolean}>}
 */
export async function submitOrder(orderData) {
  if (!SCRIPT_URL) {
    throw new Error('VITE_GOOGLE_SCRIPT_URL chưa được cấu hình.');
  }

  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain', // Apps Script requires text/plain for no-cors
    },
    body: JSON.stringify({
      action: 'submitOrder',
      ...orderData,
    }),
  });

  if (!response.ok) {
    throw new Error(`Lỗi máy chủ: ${response.status}`);
  }

  const result = await response.json();

  if (result.status === 'error') {
    throw new Error(result.message || 'Gửi đăng ký thất bại.');
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
    throw new Error(`Lỗi máy chủ: ${response.status}`);
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

  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify({
      action: 'updateStatus',
      rowIndex,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error(`Lỗi máy chủ: ${response.status}`);
  }

  const result = await response.json();

  if (result.status === 'error') {
    throw new Error(result.message || 'Cập nhật trạng thái thất bại.');
  }

  return { success: true };
}
