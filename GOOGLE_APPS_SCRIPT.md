# Google Apps Script — Local Lift Backend

Deploy this script as a **Google Apps Script Web App** connected to a Google Sheet to power the order form submissions and admin dashboard.

## Setup Steps

1. Create a new Google Sheet with a sheet named **`Orders`**
2. Go to **Extensions → Apps Script**
3. Paste the code below and save
4. Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (so the website can POST without auth)
5. Copy the deployment URL and set it as `VITE_GOOGLE_SCRIPT_URL` in your `.env` file

---

## Apps Script Code

```javascript
// ====================================
// LOCAL LIFT — Google Apps Script
// ====================================

const SHEET_NAME = 'Orders';

// Column indices (1-based)
const COL = {
  TIMESTAMP:       1,
  TEN_CO_SO:       2,
  NGUOI_DAI_DIEN:  3,
  SO_DIEN_THOAI:   4,
  EMAIL:           5,
  DIA_CHI:         6,
  GOI_DANG_KY:     7,
  MO_TA:           8,
  TRANG_THAI:      9,
};

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Add header row
    sheet.appendRow([
      'Thời gian', 'Tên cơ sở', 'Người đại diện', 'Số điện thoại',
      'Email', 'Địa chỉ', 'Gói đăng ký', 'Mô tả', 'Trạng thái'
    ]);
    sheet.setFrozenRows(1);
    // Style header
    const header = sheet.getRange(1, 1, 1, 9);
    header.setBackground('#1E293B');
    header.setFontColor('#FFFFFF');
    header.setFontWeight('bold');
  }
  return sheet;
}

// ──────────────────────────────────────
// POST handler
// ──────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'updateStatus') {
      return handleUpdateStatus(data);
    }

    // Default: submitOrder
    return handleSubmitOrder(data);

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

function handleSubmitOrder(data) {
  const sheet = getSheet();
  const timestamp = data.timestamp || new Date().toISOString();

  sheet.appendRow([
    timestamp,
    data.tenCoSo        || '',
    data.nguoiDaiDien   || '',
    data.soDienThoai    || '',
    data.email          || '',
    data.diaChi         || '',
    data.goiDangKy      || '',
    data.moTa           || '',
    'Chờ xử lý',
  ]);

  // Optional: send notification email
  // MailApp.sendEmail('your@email.com', 'Đơn đăng ký mới - ' + data.tenCoSo, JSON.stringify(data, null, 2));

  return jsonResponse({ status: 'ok', message: 'Đăng ký thành công' });
}

function handleUpdateStatus(data) {
  const sheet = getSheet();
  const rowIndex = parseInt(data.rowIndex, 10);
  const status = data.status || 'Chờ xử lý';

  if (!rowIndex || rowIndex < 2) {
    return jsonResponse({ status: 'error', message: 'rowIndex không hợp lệ' });
  }

  sheet.getRange(rowIndex, COL.TRANG_THAI).setValue(status);
  return jsonResponse({ status: 'ok', message: 'Cập nhật trạng thái thành công' });
}

// ──────────────────────────────────────
// GET handler
// ──────────────────────────────────────
function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === 'getOrders') {
      return handleGetOrders();
    }

    return jsonResponse({ status: 'ok', message: 'Local Lift API is running' });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

function handleGetOrders() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return jsonResponse({ status: 'ok', data: [] });
  }

  const range = sheet.getRange(2, 1, lastRow - 1, 9);
  const values = range.getValues();

  const orders = values.map((row, idx) => ({
    rowIndex: idx + 2, // 1-based, header is row 1
    timestamp:      row[COL.TIMESTAMP - 1],
    tenCoSo:        row[COL.TEN_CO_SO - 1],
    nguoiDaiDien:   row[COL.NGUOI_DAI_DIEN - 1],
    soDienThoai:    row[COL.SO_DIEN_THOAI - 1],
    email:          row[COL.EMAIL - 1],
    diaChi:         row[COL.DIA_CHI - 1],
    goiDangKy:      row[COL.GOI_DANG_KY - 1],
    moTa:           row[COL.MO_TA - 1],
    trangThai:      row[COL.TRANG_THAI - 1] || 'Chờ xử lý',
  }));

  // Sort newest first
  orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return jsonResponse({ status: 'ok', data: orders });
}

// ──────────────────────────────────────
// Helper
// ──────────────────────────────────────
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## Notes

> [!IMPORTANT]
> After deploying, whenever you **update** the script code you must create a **New Deployment** (not "Manage deployments → edit") to get a fresh URL, or select the same deployment and hit **Deploy → Update deployment**.

> [!WARNING]
> Setting access to **"Anyone"** means the URL is publicly accessible. The script does not authenticate callers — protect it by keeping the URL secret. For production, consider adding a shared secret token check in `doPost` / `doGet`.

> [!TIP]
> To enable email notifications when a new order arrives, uncomment the `MailApp.sendEmail(...)` line and replace `'your@email.com'` with your address. Make sure to grant the **Gmail** permission when authorizing the script.

---

## Sheet Column Structure

| Column | Field |
|--------|-------|
| A | Thời gian (ISO timestamp) |
| B | Tên cơ sở |
| C | Người đại diện |
| D | Số điện thoại |
| E | Email |
| F | Địa chỉ |
| G | Gói đăng ký |
| H | Mô tả |
| I | Trạng thái |
