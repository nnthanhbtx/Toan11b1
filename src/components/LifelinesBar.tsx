import React from 'react';
import { Users, Phone, Volume2, VolumeX } from 'lucide-react';
import { LifelinesState } from '../types';
import { audio } from '../utils/audio';

interface LifelinesBarProps {
  lifelines: LifelinesState;
  isAnswerLocked: boolean;
  onUseFiftyFifty: () => void;
  onUseAskAudience: () => void;
  onUseCallFriend: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const LifelinesBar: React.FC<LifelinesBarProps> = ({
  lifelines,
  isAnswerLocked,
  onUseFiftyFifty,
  onUseAskAudience,
  onUseCallFriend,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 shrink-0">
      {/* 50:50 Lifeline */}
      <button
        type="button"
        id="btn-lifeline-5050"
        title="Trợ giúp 50:50 (Loại bỏ 2 phương án sai)"
        disabled={!lifelines.fiftyFifty || isAnswerLocked}
        onClick={onUseFiftyFifty}
        onMouseEnter={() => lifelines.fiftyFifty && !isAnswerLocked && audio.playHover()}
        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center font-black text-[10px] sm:text-xs md:text-sm transition-all shadow-md active:scale-95 shrink-0 ${
          lifelines.fiftyFifty && !isAnswerLocked
            ? 'border-yellow-400 bg-blue-950/90 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900 cursor-pointer shadow-[0_0_12px_rgba(250,204,21,0.35)]'
            : 'border-slate-700 bg-slate-800/80 text-slate-500 opacity-40 cursor-not-allowed relative'
        }`}
      >
        {!lifelines.fiftyFifty && (
          <div className="absolute w-full h-[2px] bg-red-500 rotate-45 pointer-events-none" />
        )}
        50:50
      </button>

      {/* Ask Audience Lifeline */}
      <button
        type="button"
        id="btn-lifeline-audience"
        title="Hỏi ý kiến khán giả trong trường quay"
        disabled={!lifelines.askAudience || isAnswerLocked}
        onClick={onUseAskAudience}
        onMouseEnter={() => lifelines.askAudience && !isAnswerLocked && audio.playHover()}
        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0 ${
          lifelines.askAudience && !isAnswerLocked
            ? 'border-yellow-400 bg-blue-950/90 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900 cursor-pointer shadow-[0_0_12px_rgba(250,204,21,0.35)]'
            : 'border-slate-700 bg-slate-800/80 text-slate-500 opacity-40 cursor-not-allowed relative'
        }`}
      >
        {!lifelines.askAudience && (
          <div className="absolute w-full h-[2px] bg-red-500 rotate-45 pointer-events-none" />
        )}
        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
      </button>

      {/* Call Friend Lifeline */}
      <button
        type="button"
        id="btn-lifeline-friend"
        title="Gọi điện thoại cho người thân"
        disabled={!lifelines.callFriend || isAnswerLocked}
        onClick={onUseCallFriend}
        onMouseEnter={() => lifelines.callFriend && !isAnswerLocked && audio.playHover()}
        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0 ${
          lifelines.callFriend && !isAnswerLocked
            ? 'border-yellow-400 bg-blue-950/90 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900 cursor-pointer shadow-[0_0_12px_rgba(250,204,21,0.35)]'
            : 'border-slate-700 bg-slate-800/80 text-slate-500 opacity-40 cursor-not-allowed relative'
        }`}
      >
        {!lifelines.callFriend && (
          <div className="absolute w-full h-[2px] bg-red-500 rotate-45 pointer-events-none" />
        )}
        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
      </button>

      {/* Sound Toggle Button */}
      <button
        type="button"
        id="btn-sound-toggle"
        title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        onClick={onToggleMute}
        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-400/40 bg-blue-950/60 text-blue-300 hover:text-white hover:border-blue-300 flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0"
      >
        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-400" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-300" />
        )}
      </button>
    </div>
  );
};
