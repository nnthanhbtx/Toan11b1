import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  HelpCircle,
  Phone,
  Users,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Lightbulb,
  Trophy,
  Star,
  Medal,
  Award,
  Volume2,
  VolumeX,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Latex from 'react-latex-next';
import { questionSets } from './data';
import { Question, GameState, LifelinesState, ActiveModal, ScoreRecord, UserAnswerHistory } from './types';
import { audio } from './utils/audio';
import { TikzComponent } from './components/TikzComponent';
import { LifelinesBar } from './components/LifelinesBar';
import { ScoreLadder, MobileLadderModal, PRIZE_LADDER_LABELS } from './components/ScoreLadder';
import { SolutionReviewModal } from './components/SolutionReviewModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { saveScoreToGoogleSheet, fetchScoresFromGoogleSheet, getGoogleSheetsUrl } from './utils/googleSheets';

// Prize values in VNĐ
const PRIZE_AMOUNTS = [
  200000, 400000, 600000, 1000000, 2000000,
  3000000, 6000000, 10000000, 14000000, 22000000,
  30000000, 40000000, 60000000, 85000000, 150000000
];

const SET_NAMES = ['Bộ Đề 1 (Cơ Bản)', 'Bộ Đề 2 (Mở Rộng)', 'Bộ Đề 3 (Nâng Cao)', 'Bộ Đề 4 (Tổng Hợp)', 'Ngẫu Nhiên (60 Câu)'];

export default function App() {
  // Navigation & User Info
  const [gameState, setGameState] = useState<GameState>('intro');
  const [playerName, setPlayerName] = useState('');
  const [playerClass, setPlayerClass] = useState('');
  const [selectedSetIndex, setSelectedSetIndex] = useState<number>(0);
  const [isSheetSynced, setIsSheetSynced] = useState<boolean>(false);

  // Active Questions for current game
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Answer State
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [showResultStatus, setShowResultStatus] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isQuitGame, setIsQuitGame] = useState(false);

  // Lifelines
  const [lifelines, setLifelines] = useState<LifelinesState>({
    fiftyFifty: true,
    askAudience: true,
    callFriend: true,
  });
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);

  // Modals
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [audienceData, setAudienceData] = useState<number[]>([0, 0, 0, 0]);
  const [friendMessage, setFriendMessage] = useState('');

  // Audio mute state
  const [isMuted, setIsMuted] = useState(false);

  // Timer & Auto-advance
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);

  // User Answer History for full review
  const [history, setHistory] = useState<UserAnswerHistory[]>([]);

  // High Scores in localStorage
  const [leaderboard, setLeaderboard] = useState<ScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem('btx_millionaire_scores');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Safe current question getter
  const currentQ = activeQuestions[currentQIndex] || questionSets[0][0];

  // Fetch live Google Sheet leaderboard on mount if configured
  useEffect(() => {
    fetchScoresFromGoogleSheet().then(remoteRecords => {
      if (remoteRecords && remoteRecords.length > 0) {
        setLeaderboard(prev => {
          const existingKeys = new Set(prev.map(r => `${r.name}_${r.date}_${r.score}`));
          const uniqueRemote = remoteRecords.filter(
            r => !existingKeys.has(`${r.name}_${r.date}_${r.score}`)
          );
          const combined = [...prev, ...uniqueRemote].slice(0, 50);
          try {
            localStorage.setItem('btx_millionaire_scores', JSON.stringify(combined));
          } catch {
            // Ignore
          }
          return combined;
        });
      }
    });
  }, []);

  // Global Timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Clean up auto-advance timers on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    };
  }, []);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleMute = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  // Start new game
  const startGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !playerClass.trim()) return;

    let chosenQuestions: Question[] = [];
    if (selectedSetIndex === 4) {
      // Randomly pick 15 from all 60 questions
      const allQ = questionSets.flat();
      const shuffled = [...allQ].sort(() => Math.random() - 0.5);
      chosenQuestions = shuffled.slice(0, 15).map((q, idx) => ({ ...q, id: idx + 1 }));
    } else {
      chosenQuestions = [...questionSets[selectedSetIndex]];
    }

    setActiveQuestions(chosenQuestions);
    setCurrentQIndex(0);
    setTimeElapsed(0);
    setIsQuitGame(false);
    setIsSheetSynced(false);
    setLifelines({ fiftyFifty: true, askAudience: true, callFriend: true });
    setHistory([]);
    resetQuestionState();

    audio.playWin();
    setGameState('playing');
  };

  const resetQuestionState = () => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    setSelectedAnswer(null);
    setIsAnswerLocked(false);
    setShowResultStatus('none');
    setHiddenOptions([]);
    setActiveModal('none');
  };

  // Answer selection handler
  const handleSelectAnswer = (index: number) => {
    if (isAnswerLocked || hiddenOptions.includes(index)) return;

    audio.playSelect();
    setSelectedAnswer(index);
    setIsAnswerLocked(true);

    const isCorrect = index === currentQ.correctAnswerIndex;

    // Record this answer into history
    const historyItem: UserAnswerHistory = {
      questionId: currentQIndex + 1,
      questionText: currentQ.question,
      options: currentQ.options,
      userAnswerIndex: index,
      correctAnswerIndex: currentQ.correctAnswerIndex,
      isCorrect,
      solution: currentQ.solution,
      tikz: currentQ.tikz,
    };

    setHistory(prev => {
      const filtered = prev.filter(h => h.questionId !== historyItem.questionId);
      return [...filtered, historyItem];
    });

    // Dramatic 2 seconds delay
    setTimeout(() => {
      if (isCorrect) {
        audio.playCorrect();
        setShowResultStatus('correct');

        // Automatically prepare advance or victory
        autoAdvanceTimeoutRef.current = window.setTimeout(() => {
          if (currentQIndex === 14) {
            handleEndGame(true, false);
          } else {
            setCurrentQIndex(prev => prev + 1);
            resetQuestionState();
          }
        }, 3500);
      } else {
        audio.playWrong();
        setShowResultStatus('wrong');

        // Strictly enforce rules of Ai Là Triệu Phú: game ends on wrong answer!
        autoAdvanceTimeoutRef.current = window.setTimeout(() => {
          handleEndGame(false, false);
        }, 4000);
      }
    }, 2000);
  };

  // Open solution modal safely without auto-advance interrupting the player
  const handleOpenSolutionModal = () => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    setActiveModal('solution');
  };

  // Manual next question button if player doesn't want to wait
  const handleManualNext = () => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    // CRITICAL: Strictly enforce Ai Là Triệu Phú rules - never advance on wrong answer!
    if (showResultStatus === 'wrong') {
      handleEndGame(false, false);
      return;
    }
    if (currentQIndex === 14) {
      handleEndGame(true, false);
    } else {
      setCurrentQIndex(prev => prev + 1);
      resetQuestionState();
    }
  };

  // Calculate prize based on rules
  const calculateFinalPrize = (isVictory: boolean, isQuit: boolean, qIdx: number) => {
    if (isVictory) return PRIZE_AMOUNTS[14]; // 150.000.000 đ
    if (isQuit) {
      return qIdx > 0 ? PRIZE_AMOUNTS[qIdx - 1] : 0;
    }
    // Wrong answer drops to last safe haven
    if (qIdx >= 10) return PRIZE_AMOUNTS[9]; // Mốc 10: 22.000.000 đ
    if (qIdx >= 5) return PRIZE_AMOUNTS[4];   // Mốc 5: 2.000.000 đ
    return 0;
  };

  // End Game (Victory, Game Over, or Quit)
  const handleEndGame = (isVictory: boolean, isQuit: boolean) => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    setIsQuitGame(isQuit);

    const finalScore = isVictory ? 15 : isQuit ? currentQIndex : currentQIndex;
    const finalPrize = calculateFinalPrize(isVictory, isQuit, currentQIndex);

    // Save to leaderboard
    const statusText = isVictory
      ? 'Chiến thắng 15/15'
      : isQuit
      ? `Dừng cuộc chơi an toàn ở câu ${currentQIndex + 1}`
      : `Trả lời sai ở câu ${currentQIndex + 1}`;

    const newRecord: ScoreRecord = {
      id: Date.now().toString(),
      name: playerName,
      className: playerClass,
      score: finalScore,
      prize: finalPrize,
      timeSpent: timeElapsed,
      setName: SET_NAMES[selectedSetIndex],
      date: new Date().toLocaleDateString('vi-VN'),
      status: statusText,
      grade: (finalScore / 1.5).toFixed(1),
    };

    const updated = [newRecord, ...leaderboard].slice(0, 50);
    setLeaderboard(updated);
    try {
      localStorage.setItem('btx_millionaire_scores', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    // Automatically send to Google Sheet in background (on Vercel, Cloud Run, etc.)
    saveScoreToGoogleSheet(newRecord).then(success => {
      if (success) {
        setIsSheetSynced(true);
      }
    });

    if (isVictory) {
      audio.playWin();
      setGameState('victory');
    } else {
      setGameState('gameover');
    }
  };

  // Lifeline 1: 50:50
  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || isAnswerLocked) return;
    audio.playLifeline();
    setLifelines(prev => ({ ...prev, fiftyFifty: false }));

    const wrongOptions = [0, 1, 2, 3].filter(i => i !== currentQ.correctAnswerIndex);
    wrongOptions.sort(() => Math.random() - 0.5);
    setHiddenOptions([wrongOptions[0], wrongOptions[1]]);
  };

  // Lifeline 2: Ask Audience
  const useAskAudience = () => {
    if (!lifelines.askAudience || isAnswerLocked) return;
    audio.playLifeline();
    setLifelines(prev => ({ ...prev, askAudience: false }));

    const data = [0, 0, 0, 0];
    let remaining = 100;

    // Correct answer gets 45% - 75%
    const correctShare = Math.floor(Math.random() * 30) + 45;
    data[currentQ.correctAnswerIndex] = correctShare;
    remaining -= correctShare;

    const visibleWrongs = [0, 1, 2, 3].filter(
      i => i !== currentQ.correctAnswerIndex && !hiddenOptions.includes(i)
    );

    visibleWrongs.forEach((idx, i) => {
      if (i === visibleWrongs.length - 1) {
        data[idx] = Math.max(0, remaining);
      } else {
        const share = Math.floor(Math.random() * (remaining * 0.7));
        data[idx] = share;
        remaining -= share;
      }
    });

    setAudienceData(data);
    setActiveModal('audience');
  };

  // Lifeline 3: Call Friend
  const useCallFriend = () => {
    if (!lifelines.callFriend || isAnswerLocked) return;
    audio.playLifeline();
    setLifelines(prev => ({ ...prev, callFriend: false }));

    const isSmart = Math.random() < 0.85; // 85% accuracy
    const visibleWrongs = [0, 1, 2, 3].filter(
      i => i !== currentQ.correctAnswerIndex && !hiddenOptions.includes(i)
    );

    const chosenIdx = isSmart || visibleWrongs.length === 0
      ? currentQ.correctAnswerIndex
      : visibleWrongs[Math.floor(Math.random() * visibleWrongs.length)];

    const optLabels = ['A', 'B', 'C', 'D'];
    const friendTips = [
      `Alo ${playerName} à! Mình vừa bấm máy tính và kiểm tra lại công thức, mình tin chắc đáp án đúng là ${optLabels[chosenIdx]}. Tự tin lên nhé!`,
      `Chào ${playerName}, câu này thầy Thanh vừa dạy tuần trước rồi! Đáp án chính xác là ${optLabels[chosenIdx]}. Chúc bạn đạt 150 triệu!`,
      `Chào bạn! Theo mình nhớ ở phần giá trị lượng giác thì đáp án đúng phải là ${optLabels[chosenIdx]}. Bạn kiểm tra lại nhé!`
    ];

    setFriendMessage(friendTips[Math.floor(Math.random() * friendTips.length)]);
    setActiveModal('friend');
  };

  const getFeedbackMessage = (score: number, isVictory: boolean) => {
    if (isVictory || score === 15) {
      return "🎉 XUẤT SẮC TUYỆT ĐỐI! Bạn chính là Vua Triệu Phú Toán Học BTX! Kiến thức Lượng giác của bạn cực kỳ vững vàng!";
    }
    if (score >= 10) {
      return "👏 RẤT ẤN TƯỢNG! Bạn đã vượt qua mốc số 10 và tiệm cận đỉnh cao Triệu Phú! Tiếp tục phát huy nhé!";
    }
    if (score >= 5) {
      return "👍 KHÁ TỐT! Bạn đã vượt qua mốc số 5 an toàn. Hãy ôn tập thêm các công thức rút gọn và lượng giác nâng cao nhé!";
    }
    return "💡 HÃY CỐ GẮNG THÊM! Hãy xem lại bảng công thức giá trị lượng giác và liên hệ GV Mr Thanh để được giải đáp chi tiết nhé!";
  };

  // ==========================================
  // VIEW: INTRO SCREEN
  // ==========================================
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-[#020024] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden text-white font-sans">
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(29,78,216,0.35)_0%,rgba(2,0,36,0.95)_100%)] z-0" />
        <div className="absolute -top-[15%] -left-[10%] w-[50%] h-[50%] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[50%] h-[50%] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/90 backdrop-blur-xl p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl z-10 border-2 border-yellow-500/40 w-full max-w-xl text-center relative"
        >
          {/* Logo & Header */}
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-b from-yellow-300 via-yellow-500 to-amber-600 rounded-full mx-auto flex items-center justify-center shadow-[0_0_35px_rgba(234,179,8,0.5)] mb-3 sm:mb-4 border-4 border-slate-900">
            <span className="text-2xl sm:text-4xl font-black text-slate-950">$</span>
          </div>

          <h1 className="text-xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 uppercase tracking-wider drop-shadow-md">
            Ai Là Triệu Phú
          </h1>
          <h2 className="text-sm sm:text-xl font-bold text-blue-200 uppercase tracking-widest mt-0.5 sm:mt-1">
            Toán Học 11 • Lượng Giác
          </h2>

          <div className="text-[11px] sm:text-sm font-semibold text-blue-300/80 my-2 sm:my-3 flex items-center justify-center gap-1.5">
            <span>Thiết kế bởi</span>
            <span className="text-white font-bold">GV Mr Thanh</span>
            <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/30">btx</span>
          </div>

          <p className="text-[11px] sm:text-sm text-slate-300 mb-4 sm:mb-6 bg-slate-800/60 py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl border border-blue-500/20">
            Chủ đề: <strong className="text-yellow-300">Giá trị lượng giác của một góc (Bài 1)</strong>
          </p>

          {/* Form */}
          <form onSubmit={startGame} className="space-y-3 sm:space-y-4 text-left">
            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
                Họ và tên thí sinh:
              </label>
              <input
                type="text"
                id="input-player-name"
                placeholder="Nhập họ và tên..."
                required
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800/80 border border-blue-400/30 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40 transition-all text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
                Lớp:
              </label>
              <input
                type="text"
                id="input-player-class"
                placeholder="VD: 11A1, 11A2..."
                required
                value={playerClass}
                onChange={e => setPlayerClass(e.target.value)}
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800/80 border border-blue-400/30 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40 transition-all text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
                Chọn bộ đề thi:
              </label>
              <select
                id="select-question-set"
                value={selectedSetIndex}
                onChange={e => setSelectedSetIndex(Number(e.target.value))}
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800/80 border border-blue-400/30 text-yellow-300 font-semibold focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40 transition-all text-sm sm:text-base cursor-pointer"
              >
                {SET_NAMES.map((name, idx) => (
                  <option key={idx} value={idx} className="bg-slate-900 text-white">
                    {name} ({idx === 4 ? 'Xáo trộn 60 câu' : '15 câu'})
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-start-game"
              className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-slate-950 font-black py-3 sm:py-4 px-6 rounded-xl shadow-[0_4px_0_0_#92400e] active:shadow-none active:translate-y-[4px] transition-all text-base sm:text-lg flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <Play className="fill-current w-4 h-4 sm:w-5 sm:h-5" /> Bắt đầu cuộc thi
            </button>
          </form>

          {/* Quick buttons - Vị trí duy nhất để kết nối Google Sheet */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-800 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <button
              type="button"
              id="btn-open-leaderboard"
              onClick={() => setActiveModal('leaderboard')}
              className="text-xs text-yellow-400 hover:text-yellow-300 font-bold flex items-center gap-1.5 hover:underline transition-all cursor-pointer"
            >
              <Trophy className="w-4 h-4" /> Bảng Vàng ({leaderboard.length})
            </button>
            <button
              type="button"
              id="btn-open-sheets-config"
              onClick={() => setActiveModal('sheetsConfig')}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-xs text-emerald-300 hover:text-emerald-200 font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Vị trí duy nhất để kết nối Google Sheet trên app"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Kết nối Google Sheet</span>
              {getGoogleSheetsUrl() ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="Đã kết nối" />
              ) : null}
            </button>
          </div>
        </motion.div>

        {/* Leaderboard Modal */}
        {activeModal === 'leaderboard' && (
          <LeaderboardModal
            records={leaderboard}
            onClose={() => setActiveModal('none')}
          />
        )}

        {/* Google Sheet Config Modal */}
        {activeModal === 'sheetsConfig' && (
          <GoogleSheetModal
            onClose={() => setActiveModal('none')}
          />
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW: GAMEOVER OR VICTORY SCREEN
  // ==========================================
  if (gameState === 'gameover' || gameState === 'victory') {
    const isVictory = gameState === 'victory';
    const finalScore = isVictory ? 15 : isQuitGame ? currentQIndex : currentQIndex;
    const finalPrize = calculateFinalPrize(isVictory, isQuitGame, currentQIndex);

    return (
      <div className="min-h-screen bg-[#020024] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden text-white font-sans">
        {/* Victory Fireworks / Confetti Simulation */}
        {isVictory && (
          <div className="absolute inset-0 pointer-events-none z-0 flex flex-wrap justify-center overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -50, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800), rotate: 0 }}
                animate={{ y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50, rotate: 720 }}
                transition={{ duration: 2.5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                className="w-3.5 h-3.5 absolute rounded-sm"
                style={{ backgroundColor: ['#ef4444', '#3b82f6', '#eab308', '#10b981', '#a855f7', '#ec4899'][i % 6] }}
              />
            ))}
          </div>
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(9,9,121,0.4)_0%,rgba(2,0,36,0.95)_100%)] z-0" />

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/90 backdrop-blur-xl p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl z-10 border-2 border-yellow-500/40 w-full max-w-2xl text-center relative"
        >
          <div className="mb-3 sm:mb-4 flex justify-center">
            {isVictory ? (
              <div className="relative">
                <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.7)]" />
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-200 absolute -top-2 -right-2 animate-bounce" />
              </div>
            ) : isQuitGame ? (
              <Award className="w-16 h-16 sm:w-20 sm:h-20 text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.5)]" />
            ) : (
              <Medal className="w-16 h-16 sm:w-20 sm:h-20 text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
            )}
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 mb-1.5 sm:mb-2 uppercase">
            {isVictory
              ? 'BẠN LÀ NHÀ TRIỆU PHÚ TOÁN BTX!'
              : isQuitGame
              ? 'BẠN ĐÃ DỪNG CUỘC CHƠI AN TOÀN!'
              : 'KẾT THÚC CUỘC CHƠI!'}
          </h1>

          <div className="text-sm sm:text-lg text-slate-200 mb-1 font-medium">
            Thí sinh: <span className="text-yellow-400 font-bold">{playerName}</span> • Lớp: <span className="text-yellow-400 font-bold">{playerClass}</span>
          </div>

          <div className="text-[11px] sm:text-xs font-semibold text-blue-300 mb-4 sm:mb-6">
            Thiết kế bởi GV Mr Thanh btx • {SET_NAMES[selectedSetIndex]}
          </div>

          {/* Stats Box */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-slate-800/80 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-blue-500/20">
              <div className="text-[10px] sm:text-xs text-blue-300 font-bold mb-0.5 sm:mb-1">Số câu đúng</div>
              <div className="text-lg sm:text-2xl md:text-3xl font-black text-white">{finalScore} / 15</div>
            </div>
            <div className="bg-slate-800/80 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-blue-500/20">
              <div className="text-[10px] sm:text-xs text-blue-300 font-bold mb-0.5 sm:mb-1">Tiền thưởng</div>
              <div className="text-sm sm:text-xl md:text-2xl font-black text-yellow-400">{formatMoney(finalPrize)}</div>
            </div>
            <div className="bg-slate-800/80 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-blue-500/20">
              <div className="text-[10px] sm:text-xs text-blue-300 font-bold mb-0.5 sm:mb-1">Thời gian</div>
              <div className="text-lg sm:text-2xl md:text-3xl font-black text-white">{formatTime(timeElapsed)}</div>
            </div>
          </div>

          {/* Rules outcome explanation */}
          <div className="mb-4 sm:mb-6 text-left">
            {isVictory ? (
              <div className="bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-start gap-2.5 sm:gap-3">
                <Trophy className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="text-yellow-300 font-bold block mb-0.5 uppercase tracking-wide">
                    🏆 Chinh phục đỉnh cao 15/15 câu hỏi!
                  </span>
                  Bạn đã xuất sắc vượt qua toàn bộ 15 câu hỏi của chương trình và giành giải thưởng cao nhất 150.000.000 VNĐ!
                </div>
              </div>
            ) : isQuitGame ? (
              <div className="bg-blue-950/70 border border-blue-500/40 text-blue-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-start gap-2.5 sm:gap-3">
                <Award className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="text-blue-300 font-bold block mb-0.5 uppercase tracking-wide">
                    🛡️ Dừng cuộc chơi an toàn
                  </span>
                  Theo luật chơi, bạn chủ động dừng cuộc chơi tại Câu {currentQIndex + 1} và bảo toàn mức tiền thưởng {formatMoney(finalPrize)} (mức thưởng của Câu {currentQIndex}).
                </div>
              </div>
            ) : (
              <div className="bg-rose-950/70 border border-rose-500/40 text-rose-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-start gap-2.5 sm:gap-3">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="text-rose-300 font-bold block mb-0.5 uppercase tracking-wide">
                    ⚠️ Dừng bước do trả lời sai ở Câu {currentQIndex + 1}
                  </span>
                  Theo đúng nguyên tắc của chương trình Ai Là Triệu Phú: khi trả lời sai, cuộc chơi kết thúc ngay lập tức. Thí sinh nhận mức tiền thưởng tại mốc an toàn gần nhất:{' '}
                  <strong className="text-yellow-300 font-bold">{formatMoney(finalPrize)}</strong>{' '}
                  {currentQIndex < 5
                    ? '(Chưa vượt qua mốc an toàn số 5 - 2.000.000 đ)'
                    : currentQIndex < 10
                    ? '(Bảo toàn tại Mốc an toàn số 5)'
                    : '(Bảo toàn tại Mốc an toàn số 10)'}
                  .
                </div>
              </div>
            )}
          </div>

          {/* Teacher feedback */}
          <div className="bg-blue-950/60 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-blue-500/30 mb-3 sm:mb-4 text-left">
            <div className="text-[11px] sm:text-xs font-bold text-yellow-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Đánh giá kết quả:
            </div>
            <p className="text-xs sm:text-base text-slate-100 font-medium leading-relaxed">
              {getFeedbackMessage(finalScore, isVictory)}
            </p>
          </div>

          {/* Google Sheet Sync Indicator (Chỉ hiển thị thông báo đã tự động lưu) */}
          {isSheetSynced && (
            <div className="mb-4 flex items-center justify-center">
              <div className="text-emerald-400 font-semibold text-xs flex items-center gap-1.5 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/40 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Đã tự động lưu kết quả thi vào Google Sheet ✓</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
            {/* Review All Questions Button */}
            <button
              type="button"
              id="btn-review-questions"
              onClick={() => setActiveModal('solution')}
              className="py-3 sm:py-3.5 px-3.5 sm:px-5 bg-slate-800 hover:bg-slate-700 text-yellow-300 hover:text-yellow-200 border border-yellow-500/40 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> Xem lời giải
            </button>

            {/* View Leaderboard Button */}
            <button
              type="button"
              id="btn-gameover-leaderboard"
              onClick={() => setActiveModal('leaderboard')}
              className="py-3 sm:py-3.5 px-3.5 sm:px-5 bg-blue-900/70 hover:bg-blue-800 text-yellow-300 hover:text-yellow-200 border border-blue-400/40 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" /> Bảng vàng ({leaderboard.length})
            </button>

            {/* Play Again */}
            <button
              type="button"
              id="btn-play-again"
              onClick={() => {
                setGameState('intro');
                setActiveModal('none');
              }}
              className="py-3 sm:py-3.5 px-4 sm:px-6 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_0_0_#92400e] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" /> Chơi lại
            </button>
          </div>
        </motion.div>

        {/* Detailed Solution Review Modal */}
        {activeModal === 'solution' && (
          <SolutionReviewModal
            history={
              history.length > 0
                ? history
                : activeQuestions.map((q, idx) => ({
                    questionId: idx + 1,
                    questionText: q.question,
                    options: q.options,
                    userAnswerIndex: null,
                    correctAnswerIndex: q.correctAnswerIndex,
                    isCorrect: false,
                    solution: q.solution,
                    tikz: q.tikz,
                  }))
            }
            onClose={() => setActiveModal('none')}
          />
        )}

        {/* Leaderboard Modal on GameOver Screen */}
        {activeModal === 'leaderboard' && (
          <LeaderboardModal
            records={leaderboard}
            onClose={() => setActiveModal('none')}
          />
        )}

        {/* Google Sheet Modal on GameOver Screen */}
        {activeModal === 'sheetsConfig' && (
          <GoogleSheetModal
            onClose={() => setActiveModal('none')}
          />
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW: PLAYING GAMEPLAY SCREEN
  // ==========================================
  return (
    <div className="min-h-screen bg-[#020024] text-white font-sans overflow-hidden flex flex-col relative select-none">
      {/* Dynamic stage light beams */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(30,58,138,0.4)_0%,rgba(2,0,36,0.95)_100%)] z-0" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-yellow-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-2.5 sm:px-4 md:px-8 py-2.5 sm:py-3.5 flex justify-between items-center bg-slate-950/80 backdrop-blur-md border-b border-blue-500/20 shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-tr from-yellow-400 to-amber-600 rounded-full flex items-center justify-center border-2 border-white shadow-[0_0_15px_rgba(251,191,36,0.5)] shrink-0">
            <span className="text-slate-950 text-xs sm:text-base md:text-xl font-black italic">TP</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm md:text-lg font-extrabold bg-gradient-to-r from-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent truncate">
              AI LÀ TRIỆU PHÚ TOÁN 11
            </h1>
            <p className="text-[10px] sm:text-xs text-blue-300 font-medium truncate">
              <span className="text-yellow-400 font-bold">{playerName}</span> ({playerClass})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          {/* Timer Display */}
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase tracking-wider text-blue-300 font-bold block">
              Thời gian
            </span>
            <span className="text-sm md:text-xl font-mono font-bold text-yellow-400">
              {formatTime(timeElapsed)}
            </span>
          </div>

          {/* Lifelines Bar */}
          <LifelinesBar
            lifelines={lifelines}
            isAnswerLocked={isAnswerLocked}
            onUseFiftyFifty={useFiftyFifty}
            onUseAskAudience={useAskAudience}
            onUseCallFriend={useCallFriend}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        </div>
      </header>

      {/* Mobile Milestone Strip (Shown on smaller screens where side ladder is hidden) */}
      <div className="lg:hidden relative z-10 bg-slate-950/95 px-3 py-2 border-b border-blue-500/20 flex items-center justify-between text-xs shrink-0">
        <button
          type="button"
          onClick={() => setActiveModal('mobileLadder')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-yellow-300 font-bold border border-blue-400/40 text-[11px] sm:text-xs transition-colors active:scale-95"
          title="Bấm để xem toàn bộ thang tiền thưởng"
        >
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>Câu {currentQIndex + 1}/15:</span>
          <span className="text-white font-extrabold">{PRIZE_LADDER_LABELS[currentQIndex]} đ</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="text-slate-300 font-mono text-[11px] sm:hidden font-bold">
            ⏱ {formatTime(timeElapsed)}
          </div>
          <button
            type="button"
            disabled={isAnswerLocked}
            onClick={() => setActiveModal('quitConfirm')}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded bg-rose-950/50 border border-rose-500/30 disabled:opacity-40"
          >
            Dừng
          </button>
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="flex-1 relative z-10 flex w-full overflow-hidden">
        {/* Left Side: Question and Options */}
        <main className="flex-1 flex flex-col justify-between px-3 sm:px-6 md:px-12 py-3 sm:py-6 overflow-y-auto max-w-5xl mx-auto w-full">
          {/* Question Tag */}
          <div className="flex items-center justify-between w-full max-w-3xl mx-auto mb-2 shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-950/80 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-blue-400/30">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              <span className="text-yellow-400 text-[11px] sm:text-xs md:text-sm font-black tracking-wider uppercase">
                CÂU HỎI {String(currentQIndex + 1).padStart(2, '0')} / 15
              </span>
            </div>
            <div className="text-[11px] sm:text-xs md:text-sm font-black text-yellow-300 bg-yellow-500/10 px-2.5 sm:px-3 py-1 rounded-full border border-yellow-500/30">
              {PRIZE_LADDER_LABELS[currentQIndex]} VNĐ
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={`question-${currentQIndex}`}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-3xl mx-auto my-auto"
          >
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-2 border-blue-400/60 p-4 sm:p-7 md:p-8 text-center rounded-2xl sm:rounded-3xl shadow-[0_0_30px_rgba(30,58,138,0.5)] relative">
              <h2 className="text-base sm:text-xl md:text-2xl font-medium leading-relaxed drop-shadow-md text-slate-100 overflow-x-auto">
                <Latex>{currentQ.question}</Latex>
              </h2>
              {currentQ.tikz && <TikzComponent code={currentQ.tikz} />}
            </div>
          </motion.div>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-4 w-full max-w-3xl mx-auto my-auto pt-2 sm:pt-4">
            {currentQ.options.map((option, idx) => {
              const optionLetters = ['A', 'B', 'C', 'D'];
              const isHidden = hiddenOptions.includes(idx);
              const isSelected = selectedAnswer === idx;
              const isCorrectAnswer = currentQ.correctAnswerIndex === idx;

              let btnClass = 'w-full py-2.5 sm:py-3.5 px-3.5 sm:px-6 rounded-xl sm:rounded-2xl text-left transition-all text-sm sm:text-base md:text-lg flex items-center border font-medium relative min-h-[48px] active:scale-[0.98] ';
              let letterColor = 'text-yellow-400 font-bold';

              if (isHidden) {
                return (
                  <div key={idx} className="opacity-0 pointer-events-none py-2.5 px-3.5">
                    Hidden Option
                  </div>
                );
              }

              if (!isAnswerLocked) {
                btnClass += 'bg-slate-900/90 border-blue-400/40 hover:border-yellow-400 hover:bg-yellow-500 hover:text-slate-950 text-white cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(250,204,21,0.4)] group';
              } else if (isSelected && showResultStatus === 'none') {
                // Pending suspense result
                btnClass += 'bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 border-white font-bold shadow-[0_0_20px_rgba(234,179,8,0.6)] animate-pulse';
                letterColor = 'text-slate-950 font-black';
              } else if (showResultStatus !== 'none') {
                if (isCorrectAnswer) {
                  // Revealed correct
                  btnClass += 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border-white font-bold shadow-[0_0_25px_rgba(16,185,129,0.7)] animate-pulse';
                  letterColor = 'text-yellow-300 font-black';
                } else if (isSelected && showResultStatus === 'wrong') {
                  // Wrong selection
                  btnClass += 'bg-gradient-to-r from-rose-600 to-red-600 text-white border-white font-bold shadow-[0_0_20px_rgba(239,68,68,0.7)]';
                  letterColor = 'text-white font-black';
                } else {
                  btnClass += 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-40';
                  letterColor = 'text-slate-600';
                }
              }

              return (
                <button
                  key={idx}
                  id={`btn-option-${optionLetters[idx].toLowerCase()}`}
                  type="button"
                  disabled={isAnswerLocked || isHidden}
                  onClick={() => handleSelectAnswer(idx)}
                  onMouseEnter={() => !isAnswerLocked && audio.playHover()}
                  className={btnClass}
                >
                  <span className={`mr-2.5 sm:mr-3.5 text-sm sm:text-base md:text-lg shrink-0 ${letterColor}`}>
                    {optionLetters[idx]}:
                  </span>
                  <span className="flex-1 font-medium overflow-x-auto">
                    <Latex>{option}</Latex>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Action / Solution Bar */}
          <div className="min-h-[48px] flex items-center justify-between w-full max-w-3xl mx-auto pt-2 sm:pt-4 shrink-0">
            <AnimatePresence>
              {showResultStatus === 'wrong' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="w-full bg-rose-950/90 border-2 border-rose-500/70 rounded-2xl p-3 sm:p-4 shadow-[0_0_25px_rgba(239,68,68,0.4)] flex flex-col sm:flex-row items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 text-left w-full sm:w-auto">
                    <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400 shrink-0 animate-pulse" />
                    <div>
                      <div className="text-xs sm:text-sm font-black text-rose-200 uppercase tracking-wide">
                        RẤT TIẾC, CÂU TRẢ LỜI CHƯA ĐÚNG!
                      </div>
                      <div className="text-[11px] sm:text-xs text-rose-300">
                        Theo luật chương trình, khi trả lời sai <strong className="text-white underline">cuộc chơi kết thúc</strong>. Đáp án đúng là <strong className="text-emerald-300 font-black">{['A', 'B', 'C', 'D'][currentQ.correctAnswerIndex]}</strong>.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                    <button
                      type="button"
                      id="btn-view-quick-solution"
                      onClick={handleOpenSolutionModal}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 text-yellow-300 hover:text-yellow-200 rounded-xl border border-yellow-500/40 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                      <span>Xem lời giải</span>
                    </button>

                    <button
                      type="button"
                      id="btn-game-over-summary"
                      onClick={() => handleEndGame(false, false)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl font-black text-xs sm:text-sm shadow-[0_0_15px_rgba(239,68,68,0.5)] cursor-pointer transition-all active:scale-95 animate-pulse"
                    >
                      <span>Kết thúc cuộc chơi</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : showResultStatus === 'correct' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="w-full bg-emerald-950/80 border-2 border-emerald-500/60 rounded-2xl p-3 sm:p-4 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex flex-col sm:flex-row items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 text-left w-full sm:w-auto">
                    <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs sm:text-sm font-black text-emerald-200 uppercase tracking-wide">
                        CHÍNH XÁC TUYỆT ĐỐI!
                      </div>
                      <div className="text-[11px] sm:text-xs text-emerald-300">
                        Bạn đã chinh phục Câu {currentQIndex + 1} ({PRIZE_LADDER_LABELS[currentQIndex]} VNĐ).
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                    <button
                      type="button"
                      id="btn-view-quick-solution"
                      onClick={handleOpenSolutionModal}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 text-yellow-300 hover:text-yellow-200 rounded-xl border border-yellow-500/40 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                      <span>Xem lời giải</span>
                    </button>

                    <button
                      type="button"
                      id="btn-manual-next-question"
                      onClick={handleManualNext}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 rounded-xl font-black text-xs sm:text-sm shadow-[0_0_15px_rgba(234,179,8,0.4)] cursor-pointer transition-all active:scale-95"
                    >
                      <span>{currentQIndex === 14 ? 'Chiến thắng! Xem tổng kết' : 'Câu tiếp theo'}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </main>

        {/* Right Side: Score Ladder Component */}
        <ScoreLadder
          currentQIndex={currentQIndex}
          onQuitGame={() => setActiveModal('quitConfirm')}
          isAnswerLocked={isAnswerLocked}
        />
      </div>

      {/* ========================================== */}
      {/* MODALS OVERLAY */}
      {/* ========================================== */}
      <AnimatePresence>
        {/* Modal: Ask Audience */}
        {activeModal === 'audience' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border-2 border-yellow-500/40 rounded-3xl shadow-2xl p-6 w-full max-w-md text-white relative"
            >
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2.5 text-yellow-400 font-bold text-lg mb-6">
                <Users className="w-6 h-6" />
                <span>Ý Kiến Khán Giả Trong Trường Quay</span>
              </div>

              <div className="flex h-52 items-end justify-center gap-5 border-b border-slate-700 pb-3">
                {['A', 'B', 'C', 'D'].map((label, idx) => (
                  <div key={label} className="flex flex-col items-center w-14 group">
                    <span className="text-xs font-bold text-white mb-2">
                      {audienceData[idx]}%
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-yellow-400 rounded-t-lg transition-all duration-1000 shadow-md"
                      style={{ height: `${Math.max(8, audienceData[idx] * 1.8)}px` }}
                    />
                    <span className="mt-2.5 font-bold text-yellow-400 text-sm">{label}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-400 text-center mt-4">
                Khán giả đã bình chọn dựa trên các phương án đang hiển thị.
              </p>

              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-full mt-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Tiếp tục thi
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Modal: Call Friend */}
        {activeModal === 'friend' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border-2 border-yellow-500/40 rounded-3xl shadow-2xl p-6 w-full max-w-md text-white relative"
            >
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2.5 text-yellow-400 font-bold text-lg mb-4">
                <Phone className="w-6 h-6" />
                <span>Gọi Điện Thoại Cho Người Thân</span>
              </div>

              <div className="bg-slate-800/90 p-4 rounded-2xl border border-blue-500/30 italic text-slate-100 text-sm leading-relaxed mb-5 shadow-inner">
                "{friendMessage}"
              </div>

              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Đã hiểu, tiếp tục
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Modal: Quit Game Confirmation */}
        {activeModal === 'quitConfirm' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border-2 border-rose-500/40 rounded-3xl shadow-2xl p-6 w-full max-w-md text-white text-center"
            >
              <ShieldAlert className="w-14 h-14 mx-auto text-yellow-400 mb-3" />
              <h3 className="text-xl font-bold text-slate-100 mb-2">
                Xác Nhận Dừng Cuộc Chơi?
              </h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Nếu dừng tại câu số {currentQIndex + 1}, bạn sẽ bảo toàn số tiền thưởng{' '}
                <strong className="text-yellow-400 font-bold">
                  {formatMoney(currentQIndex > 0 ? PRIZE_AMOUNTS[currentQIndex - 1] : 0)}
                </strong>
                . Bạn có chắc chắn muốn dừng lại không?
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Thi tiếp
                </button>
                <button
                  type="button"
                  onClick={() => handleEndGame(false, true)}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-md"
                >
                  Dừng cuộc chơi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal: Quick Question Solution during game */}
        {activeModal === 'solution' && (
          <SolutionReviewModal
            history={[
              {
                questionId: currentQIndex + 1,
                questionText: currentQ.question,
                options: currentQ.options,
                userAnswerIndex: selectedAnswer,
                correctAnswerIndex: currentQ.correctAnswerIndex,
                isCorrect: selectedAnswer === currentQ.correctAnswerIndex,
                solution: currentQ.solution,
                tikz: currentQ.tikz,
              }
            ]}
            isGameEndedOnWrong={showResultStatus === 'wrong'}
            onClose={() => {
              setActiveModal('none');
              if (showResultStatus === 'wrong') {
                handleEndGame(false, false);
              }
            }}
          />
        )}

        {/* Modal: Mobile Score Ladder */}
        {activeModal === 'mobileLadder' && (
          <MobileLadderModal
            currentQIndex={currentQIndex}
            onClose={() => setActiveModal('none')}
            onQuitGame={() => setActiveModal('quitConfirm')}
            isAnswerLocked={isAnswerLocked}
          />
        )}

        {/* Modal: Google Sheet Configuration */}
        {activeModal === 'sheetsConfig' && (
          <GoogleSheetModal onClose={() => setActiveModal('none')} />
        )}
      </AnimatePresence>
    </div>
  );
}
