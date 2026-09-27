export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  solution: string;
  tikz?: string;
}

export type GameState = 'intro' | 'playing' | 'gameover' | 'victory' | 'review';

export interface LifelinesState {
  fiftyFifty: boolean;
  askAudience: boolean;
  callFriend: boolean;
}

export type ActiveModal = 'none' | 'audience' | 'friend' | 'solution' | 'quitConfirm' | 'leaderboard' | 'mobileLadder' | 'sheetsConfig';

export interface ScoreRecord {
  id: string;
  name: string;
  className: string;
  score: number;
  prize: number;
  timeSpent: number;
  setName: string;
  date: string;
  status?: string;
  grade?: string;
}

export interface UserAnswerHistory {
  questionId: number;
  questionText: string;
  options: string[];
  userAnswerIndex: number | null;
  correctAnswerIndex: number;
  isCorrect: boolean;
  solution: string;
  tikz?: string;
}
