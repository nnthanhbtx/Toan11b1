import React from 'react';
import { X, Trophy, Medal, Database } from 'lucide-react';
import { ScoreRecord } from '../types';

interface LeaderboardModalProps {
  records: ScoreRecord[];
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  records,
  onClose,
}) => {
  const sortedRecords = [...records].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.prize !== a.prize) return b.prize - a.prize;
    return a.timeSpent - b.timeSpent;
  });

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4">
      <div className="bg-slate-900 border-2 border-yellow-500/40 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90dvh] flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-blue-500/30 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            <h2 className="text-base sm:text-xl font-bold text-yellow-300">
              Bảng Vàng Triệu Phú Toán BTX
            </h2>
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
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6">
          {sortedRecords.length === 0 ? (
            <div className="text-center py-10 sm:py-12 text-slate-400">
              <Medal className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 text-slate-600" />
              <p className="text-sm sm:text-base font-medium">Chưa có lượt thi nào được lưu.</p>
              <p className="text-xs text-slate-500 mt-1">Hãy thi ngay để ghi danh vào bảng vàng!</p>
            </div>
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {sortedRecords.map((rec, index) => {
                let rankBadge = null;
                if (index === 0) {
                  rankBadge = <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-yellow-400 text-slate-950 font-black flex items-center justify-center text-[11px] sm:text-xs shadow-md shrink-0">1</span>;
                } else if (index === 1) {
                  rankBadge = <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-300 text-slate-950 font-black flex items-center justify-center text-[11px] sm:text-xs shadow-md shrink-0">2</span>;
                } else if (index === 2) {
                  rankBadge = <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-700 text-white font-black flex items-center justify-center text-[11px] sm:text-xs shadow-md shrink-0">3</span>;
                } else {
                  rankBadge = <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-[11px] sm:text-xs shrink-0">{index + 1}</span>;
                }

                return (
                  <div
                    key={rec.id || index}
                    className="bg-slate-800/80 border border-slate-700/60 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between gap-3 hover:border-yellow-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      {rankBadge}
                      <div className="min-w-0">
                        <div className="font-bold text-slate-100 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm truncate">
                          <span className="truncate">{rec.name}</span>
                          <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/40 shrink-0">
                            {rec.className}
                          </span>
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 flex gap-1.5 sm:gap-3 truncate">
                          <span className="truncate">{rec.setName}</span>
                          <span>•</span>
                          <span>{rec.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-black text-yellow-400 text-xs sm:text-base">
                        {formatMoney(rec.prize)}
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-300 mt-0.5">
                        {rec.score}/15 • {formatTime(rec.timeSpent)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
