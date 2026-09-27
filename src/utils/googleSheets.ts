import { ScoreRecord } from '../types';

const STORAGE_KEY = 'btx_google_sheets_url';

// Default endpoint from environment variable if configured
export const getGoogleSheetsUrl = (): string => {
  const customUrl = localStorage.getItem(STORAGE_KEY);
  if (customUrl && customUrl.trim()) {
    return customUrl.trim();
  }
  return ((import.meta as any).env?.VITE_GOOGLE_SHEETS_URL as string) || '';
};

export const setGoogleSheetsUrl = (url: string): void => {
  if (url && url.trim()) {
    localStorage.setItem(STORAGE_KEY, url.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export interface SheetSubmissionPayload {
  timestamp: string;
  name: string;
  className: string;
  setName: string;
  score: number;
  grade: string;
  prize: number;
  timeSpent: number;
  timeFormatted: string;
  status: string;
}

export const formatTimeDisplay = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

/**
 * Sends a player's score to Google Sheet via Google Apps Script Web App.
 * Uses text/plain to avoid CORS preflight (OPTIONS) issues with Google Apps Script.
 */
export const saveScoreToGoogleSheet = async (record: ScoreRecord): Promise<boolean> => {
  const endpoint = getGoogleSheetsUrl();
  if (!endpoint) {
    console.log('[GoogleSheet] Chưa cấu hình URL Google Apps Script. Bỏ qua đồng bộ Sheet.');
    return false;
  }

  const payload: SheetSubmissionPayload = {
    timestamp: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    name: record.name,
    className: record.className,
    setName: record.setName,
    score: record.score,
    grade: record.grade || (record.score / 1.5).toFixed(1),
    prize: record.prize,
    timeSpent: record.timeSpent,
    timeFormatted: formatTimeDisplay(record.timeSpent),
    status: record.status || (record.score === 15 ? 'Chiến thắng 15/15' : 'Hoàn thành'),
  };

  try {
    // Mode 'no-cors' allows browser to send the POST request to Google Apps Script
    // without getting blocked by CORS redirects from Google Cloud Run/Google Drive.
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    console.log('[GoogleSheet] Đã gửi dữ liệu thí sinh thành công tới Google Sheet.');
    return true;
  } catch (error) {
    console.error('[GoogleSheet] Lỗi khi gửi dữ liệu lên Google Sheet:', error);
    return false;
  }
};

/**
 * Fetch leaderboard directly from Google Sheet if script supports doGet
 */
export const fetchScoresFromGoogleSheet = async (): Promise<ScoreRecord[] | null> => {
  const endpoint = getGoogleSheetsUrl();
  if (!endpoint) return null;

  try {
    const url = endpoint.includes('?') ? `${endpoint}&action=get` : `${endpoint}?action=get`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Google Apps Script Source Code to paste into Script Editor (Mã.gs)
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ====================================================================
 * AI LÀ TRIỆU PHÚ TOÁN 11 - GOOGLE APPS SCRIPT WEB APP
 * Tác giả: GV Mr Thanh btx
 * Mục đích: Tự động ghi nhận kết quả thi của học sinh vào Google Sheet
 * ====================================================================
 */

var SHEET_NAME = "KetQuaThi";

// 1. Nhận dữ liệu POST từ ứng dụng web (Vercel, Cloud Run,...)
function doPost(e) {
  try {
    var sheet = getOrCreateSheet();
    var data = JSON.parse(e.postData.contents);

    // Chuẩn bị dữ liệu từng cột
    var timestamp = data.timestamp || new Date().toLocaleString("vi-VN");
    var name = data.name || "";
    var className = data.className || "";
    var setName = data.setName || "";
    var score = data.score !== undefined ? data.score : 0;
    var grade = data.grade || (score / 1.5).toFixed(1);
    var prize = data.prize !== undefined ? data.prize : 0;
    var timeFormatted = data.timeFormatted || "";
    var status = data.status || "";

    // Thêm hàng mới vào bảng tính
    sheet.appendRow([
      timestamp,
      name,
      className,
      setName,
      score + "/15",
      Number(grade),
      prize,
      timeFormatted,
      status
    ]);

    // Định dạng tiền tệ cho cột Tiền thưởng (Cột G - cột 7)
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 7).setNumberFormat("#,##0 \\"đ\\"");
    sheet.getRange(lastRow, 6).setNumberFormat("0.0");

    // Canh giữa các cột thông tin cần thiết
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 3).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 5).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 6).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 8).setHorizontalAlignment("center");

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Đã lưu kết quả thành công!" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. Cho phép ứng dụng đọc dữ liệu bảng vàng qua GET
function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }

    var records = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var scoreVal = parseInt(String(row[4]).split("/")[0]) || 0;
      records.push({
        id: "sheet_" + i,
        date: String(row[0]),
        name: String(row[1]),
        className: String(row[2]),
        setName: String(row[3]),
        score: scoreVal,
        grade: String(row[5]),
        prize: Number(row[6]) || 0,
        timeSpent: 0,
        timeFormatted: String(row[7]),
        status: String(row[8])
      });
    }

    return ContentService.createTextOutput(
      JSON.stringify(records)
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify([])
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// 3. Tự động khởi tạo Sheet với tiêu đề đẹp mắt nếu chưa có
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);

    // Tiêu đề các cột
    var headers = [
      "Thời gian nộp bài",
      "Họ và tên thí sinh",
      "Lớp",
      "Bộ đề thi",
      "Số câu đúng",
      "Điểm số (thang 10)",
      "Tiền thưởng (VNĐ)",
      "Thời gian thi",
      "Trạng thái kết thúc"
    ];

    sheet.appendRow(headers);

    // Định dạng dòng tiêu đề
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#1e3a8a"); // Xanh đậm sang trọng
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(11);
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 38);

    // Cố định dòng tiêu đề
    sheet.setFrozenRows(1);

    // Điều chỉnh độ rộng cột tối ưu
    sheet.setColumnWidth(1, 160); // Thời gian
    sheet.setColumnWidth(2, 190); // Tên
    sheet.setColumnWidth(3, 90);  // Lớp
    sheet.setColumnWidth(4, 170); // Bộ đề
    sheet.setColumnWidth(5, 110); // Câu đúng
    sheet.setColumnWidth(6, 120); // Điểm
    sheet.setColumnWidth(7, 150); // Tiền thưởng
    sheet.setColumnWidth(8, 120); // Thời gian thi
    sheet.setColumnWidth(9, 210); // Trạng thái
  }

  return sheet;
}

// Hàm chạy thử nghiệm trực tiếp trên Apps Script
function setupSheet() {
  var sheet = getOrCreateSheet();
  Logger.log("Khởi tạo bảng tính thành công: " + sheet.getName());
}
`;
