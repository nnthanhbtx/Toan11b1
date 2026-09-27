import React from 'react';
import { X, Trophy } from 'lucide-react';

interface ScoreLadderProps {
  currentQIndex: number;
  onQuitGame: () => void;
  isAnswerLocked: boolean;
}

export const PRIZE_LADDER_LABELS = [
  '200.000',
  '400.000',
  '600.000',
  '1.000.000',
  '2.000.000',   // Mốc 5
  '3.000.000',
  '6.000.000',
  '10.000.000',
  '14.000.000',
  '22.000.000',  // Mốc 10
  '30.000.000',
  '40.000.000',
  '60.000.000',
  '85.000.000',
  '150.000.000'  // Mốc 15
];

export const ScoreLadderList: React.FC<{ currentQIndex: number }> = ({ currentQIndex }) => {
  return (
    <div className="space-y-1 flex flex-col-reverse">
      {PRIZE_LADDER_LABELS.map((prize, idx) => {
        const isCurrent = idx === currentQIndex;
        const isPassed = idx < currentQIndex;
        const isSafeHaven = (idx + 1) % 5 === 0;

        let rowClass = 'flex items-center justify-between px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ';
        let numColor = 'text-slate-400';
        let prizeColor = 'text-slate-300';

        if (isCurrent) {
          rowClass += 'bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 font-black shadow-[0_0_15px_rgba(234,179,8,0.5)] scale-[1.02]';
          numColor = 'text-slate-950 font-black';
          prizeColor = 'text-slate-950 font-black';
        } else if (isPassed) {
          rowClass += 'bg-blue-900/30 text-emerald-400';
          numColor = 'text-emerald-400';
          prizeColor = 'text-emerald-300';
        } else if (isSafeHaven) {
          rowClass += 'bg-white/10 text-white font-bold border border-white/20';
          numColor = 'text-yellow-300 font-bold';
          prizeColor = 'text-white font-bold';
        } else {
          rowClass += 'text-slate-400 hover:text-slate-200';
        }

        return (
          <div key={idx} id={`ladder-item-${idx + 1}`} className={rowClass}>
            <span className={`w-6 ${numColor}`}>
              {idx + 1}
            </span>
            <span className="flex-1 border-b border-dotted border-slate-700/60 mx-2" />
            <span className={prizeColor}>{prize}</span>
          </div>
        );
      })}
    </div>
  );
};

export const ScoreLadder: React.FC<ScoreLadderProps> = ({
  currentQIndex,
  onQuitGame,
  isAnswerLocked,
}) => {
  return (
    <aside className="hidden lg:flex flex-col justify-between w-72 bg-slate-950/80 backdrop-blur-md border-l border-blue-500/20 p-5 select-none shrink-0">
      <div>
        <div className="text-center pb-3 mb-3 border-b border-blue-500/30">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
            Thang Tiền Thưởng (VNĐ)
          </span>
        </div>

        <ScoreLadderList currentQIndex={currentQIndex} />
      </div>

      <div className="mt-4 pt-4 border-t border-blue-500/20">
        <button
          type="button"
          id="btn-quit-game"
          disabled={isAnswerLocked}
          onClick={onQuitGame}
          className="w-full py-2.5 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-100 border border-red-500/40 rounded-xl text-xs font-bold tracking-wider uppercase transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Dừng cuộc chơi
        </button>
      </div>
    </aside>
  );
};

export const MobileLadderModal: React.FC<{
  currentQIndex: number;
  onClose: () => void;
  onQuitGame: () => void;
  isAnswerLocked: boolean;
}> = ({ currentQIndex, onClose, onQuitGame, isAnswerLocked }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-yellow-500/40 rounded-3xl shadow-2xl w-full max-w-sm max-h-[90dvh] flex flex-col overflow-hidden text-white">
        <div className="px-5 py-3.5 border-b border-blue-500/30 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="text-base font-bold text-yellow-300">Thang Tiền Thưởng (VNĐ)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <ScoreLadderList currentQIndex={currentQIndex} />
        </div>

        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex gap-2">
          <button
            type="button"
            disabled={isAnswerLocked}
            onClick={() => {
              onClose();
              onQuitGame();
            }}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold uppercase transition-colors"
          >
            Dừng cuộc chơi
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
