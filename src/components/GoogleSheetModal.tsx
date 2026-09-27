import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Database, Send, HelpCircle, AlertCircle } from 'lucide-react';
import {
  getGoogleSheetsUrl,
  setGoogleSheetsUrl,
  saveScoreToGoogleSheet,
  GOOGLE_APPS_SCRIPT_CODE
} from '../utils/googleSheets';

interface GoogleSheetModalProps {
  onClose: () => void;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({ onClose }) => {
  const [url, setUrl] = useState(getGoogleSheetsUrl());
  const [copied, setCopied] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    setGoogleSheetsUrl(url);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleTestConnection = async () => {
    if (!url.trim()) return;
    setTestStatus('testing');
    setGoogleSheetsUrl(url);

    const testRecord = {
      id: 'test_' + Date.now(),
      name: 'Kiểm tra kết nối',
      className: 'GV Demo',
      score: 15,
      prize: 150000000,
      timeSpent: 120,
      setName: 'Thử nghiệm hệ thống',
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'Gửi thử nghiệm thành công',
      grade: '10.0',
    };

    const success = await saveScoreToGoogleSheet(testRecord);
    if (success) {
      setTestStatus('success');
    } else {
      setTestStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 text-white">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92dvh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-emerald-300">
                Đồng Bộ Tự Động Với Google Sheet
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Kết nối Google Apps Script để lưu toàn bộ kết quả thi khi app chạy trên Vercel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Status banner */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs sm:text-sm ${
            url.trim()
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
          }`}>
            {url.trim() ? (
              <>
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 block mb-0.5">Hệ thống đã sẵn sàng kết nối Google Sheet!</strong>
                  Mỗi khi thí sinh hoàn thành bài thi (trả lời sai, dừng cuộc chơi hoặc chiến thắng), toàn bộ thông tin sẽ được tự động gửi về Google Sheet của thầy/cô.
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block mb-0.5">Chưa cài đặt URL Web App Google Sheet</strong>
                  Thầy/Cô chỉ cần copy đoạn code bên dưới, dán vào Apps Script của Google Sheet và dán link Web App vào ô cấu hình.
                </div>
              </>
            )}
          </div>

          {/* Input field */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">
              Đường dẫn Web App (URL Google Apps Script kết thúc bằng /exec):
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-xs sm:text-sm font-mono"
              />
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shrink-0"
              >
                {saveSuccess ? 'Đã lưu ✓' : 'Lưu URL'}
              </button>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={!url.trim() || testStatus === 'testing'}
                className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{testStatus === 'testing' ? 'Đang gửi...' : 'Gửi thử'}</span>
              </button>
            </div>
            {testStatus === 'success' && (
              <p className="text-xs text-emerald-400 font-medium">
                ✓ Đã gửi thử nghiệm thành công! Vui lòng mở Google Sheet để kiểm tra hàng dữ liệu mới.
              </p>
            )}
            {testStatus === 'error' && (
              <p className="text-xs text-rose-400 font-medium">
                ✕ Không thể gửi được dữ liệu. Hãy kiểm tra lại quyền truy cập ("Anyone / Bất kỳ ai") của Apps Script.
              </p>
            )}
          </div>

          {/* Vercel Environment Variable Tip */}
          <div className="bg-slate-950/60 p-3 sm:p-4 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="text-slate-300 font-bold flex items-center gap-1.5">
              <span>🚀 Mẹo khi đưa lên Vercel:</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Thầy/Cô có thể vào <strong>Settings</strong> &gt; <strong>Environment Variables</strong> trên Vercel và thêm biến:
            </p>
            <div className="bg-slate-900 px-3 py-1.5 rounded-lg font-mono text-[11px] text-yellow-300 select-all border border-slate-800">
              VITE_GOOGLE_SHEETS_URL = {url.trim() || 'https://script.google.com/macros/s/.../exec'}
            </div>
            <p className="text-slate-400 text-[11px]">
              Khi đó mọi học sinh truy cập trang web trên Vercel đều sẽ tự động lưu dữ liệu mà không cần cấu hình thêm!
            </p>
          </div>

          {/* Step-by-step instructions */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2.5 text-xs sm:text-sm">
            <h3 className="font-bold text-yellow-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> 3 Bước Thiết Lập Google Apps Script Nhanh Chóng:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
              <li>
                Mở <strong>Google Sheet</strong> của thầy/cô (hoặc tạo file mới), vào menu <strong className="text-white">Tiện ích mở rộng (Extensions)</strong> &gt; chọn <strong className="text-white">Apps Script</strong>.
              </li>
              <li>
                Xóa toàn bộ nội dung mẫu trong file <strong className="text-white">Mã.gs</strong>, bấm nút <strong className="text-emerald-400">Sao chép mã Apps Script</strong> bên dưới và dán toàn bộ vào. Bấm <strong>Lưu (Ctrl + S)</strong>.
              </li>
              <li>
                Bấm nút <strong className="text-white">Triển khai (Deploy)</strong> ở góc trên bên phải &gt; chọn <strong className="text-white">Tùy chọn triển khai mới (New deployment)</strong>:
                <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 text-slate-300 text-xs">
                  <li>Loại: Bấm biểu tượng bánh răng chọn <strong className="text-yellow-300">Ứng dụng web (Web app)</strong></li>
                  <li>Thực thi dưới dạng (Execute as): <strong className="text-yellow-300">Tôi (Me)</strong></li>
                  <li>Ai có quyền truy cập (Who has access): Chọn <strong className="text-yellow-300">Bất kỳ ai (Anyone)</strong> <em>(Bước này bắt buộc để Vercel gửi được dữ liệu)</em></li>
                  <li>Bấm <strong>Triển khai</strong> &gt; Cấp quyền truy cập cho tài khoản Google của thầy &gt; Sao chép đường link <strong>Web app URL</strong> (kết thúc bằng <code className="text-yellow-300">/exec</code>) và dán vào ô bên trên!</li>
                </ul>
              </li>
            </ol>
          </div>

          {/* Script Code Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Mã nguồn Apps Script (Mã.gs):
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép vào bộ nhớ tạm!' : 'Sao chép mã Apps Script'}</span>
              </button>
            </div>

            <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] sm:text-xs text-emerald-300/90 font-mono overflow-x-auto max-h-56 leading-relaxed select-all">
              {GOOGLE_APPS_SCRIPT_CODE}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            Hỗ trợ bởi GV Mr Thanh btx
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
