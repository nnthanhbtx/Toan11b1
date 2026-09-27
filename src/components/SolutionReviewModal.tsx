import React, { useState } from 'react';
import { X, CheckCircle, XCircle, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import Latex from 'react-latex-next';
import { UserAnswerHistory } from '../types';
import { TikzComponent } from './TikzComponent';

interface SolutionReviewModalProps {
  history: UserAnswerHistory[];
  onClose: () => void;
  isGameEndedOnWrong?: boolean;
}

export const SolutionReviewModal: React.FC<SolutionReviewModalProps> = ({
  history,
  onClose,
  isGameEndedOnWrong = false,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (history.length === 0) {
    return null;
  }

  const currentItem = history[selectedIdx];
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4">
      <div className="bg-slate-900 border-2 border-yellow-500/40 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92dvh] flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-blue-500/30 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            <h2 className="text-base sm:text-xl font-bold text-yellow-300">
              Lời Giải Chi Tiết & Ôn Tập
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Warning if game ended on wrong answer */}
        {isGameEndedOnWrong && (
          <div className="bg-rose-950/90 border-b border-rose-500/40 px-4 py-2 text-center text-xs sm:text-sm text-rose-200 font-medium shrink-0">
            ⚠️ Theo luật chương trình Ai Là Triệu Phú: khi trả lời sai, cuộc chơi đã kết thúc. Bạn có thể xem giải thích trước khi đến trang tổng kết tiền thưởng.
          </div>
        )}

        {/* Question Selector Tabs */}
        <div className="px-3 py-2 sm:px-6 sm:py-3 bg-slate-950/40 border-b border-slate-800 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none shrink-0">
          {history.map((item, idx) => {
            const isCurrent = idx === selectedIdx;
            const isCorrect = item.isCorrect;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-yellow-400 text-slate-950 shadow-md ring-2 ring-yellow-300'
                    : isCorrect
                    ? 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-900'
                    : item.userAnswerIndex !== null
                    ? 'bg-rose-900/60 text-rose-300 hover:bg-rose-900'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <span>Câu {idx + 1}</span>
                {isCorrect ? (
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                ) : item.userAnswerIndex !== null ? (
                  <XCircle className="w-3 h-3 text-rose-400" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Question & Solution Content Area */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6">
          {/* Question Text */}
          <div className="bg-blue-950/50 border border-blue-500/30 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl">
            <div className="text-[11px] sm:text-xs font-bold text-yellow-400 uppercase tracking-wider mb-1.5 sm:mb-2">
              Câu hỏi {selectedIdx + 1}:
            </div>
            <div className="text-sm sm:text-lg text-slate-100 font-medium leading-relaxed overflow-x-auto">
              <Latex>{currentItem.questionText}</Latex>
            </div>
            {currentItem.tikz && <TikzComponent code={currentItem.tikz} />}
          </div>

          {/* Options Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {currentItem.options.map((opt, optIdx) => {
              const isCorrectOpt = optIdx === currentItem.correctAnswerIndex;
              const isSelectedOpt = optIdx === currentItem.userAnswerIndex;

              let cardBg = 'bg-slate-800/60 border-slate-700 text-slate-300';
              let badge = null;

              if (isCorrectOpt) {
                cardBg = 'bg-emerald-950/80 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500';
                badge = (
                  <span className="text-[10px] sm:text-[11px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded ml-auto shrink-0">
                    Đáp án đúng
                  </span>
                );
              } else if (isSelectedOpt) {
                cardBg = 'bg-rose-950/80 border-rose-500 text-rose-100 ring-1 ring-rose-500';
                badge = (
                  <span className="text-[10px] sm:text-[11px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded ml-auto shrink-0">
                    Bạn chọn
                  </span>
                );
              }

              return (
                <div
                  key={optIdx}
                  className={`p-2.5 sm:p-3.5 rounded-xl border flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium ${cardBg}`}
                >
                  <span className="font-bold text-yellow-400 shrink-0">{optionLetters[optIdx]}:</span>
                  <span className="flex-1 overflow-x-auto"><Latex>{opt}</Latex></span>
                  {badge}
                </div>
              );
            })}
          </div>

          {/* Detailed Solution Box */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-850 border border-yellow-500/30 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl">
            <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm sm:text-base mb-2 sm:mb-3">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Phương pháp giải chi tiết:</span>
            </div>
            <div className="text-slate-200 text-xs sm:text-base leading-relaxed space-y-2 bg-slate-950/50 p-3 sm:p-4 rounded-xl border border-slate-800 overflow-x-auto">
              <Latex>{currentItem.solution}</Latex>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-3.5 py-2.5 sm:px-6 sm:py-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            disabled={selectedIdx === 0}
            onClick={() => setSelectedIdx(prev => Math.max(0, prev - 1))}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Câu trước
          </button>

          {isGameEndedOnWrong ? (
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer animate-pulse"
            >
              Xem kết quả & Tiền thưởng
            </button>
          ) : (
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
              {selectedIdx + 1} / {history.length}
            </span>
          )}

          <button
            type="button"
            disabled={selectedIdx === history.length - 1}
            onClick={() => setSelectedIdx(prev => Math.min(history.length - 1, prev + 1))}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            Câu tiếp <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
