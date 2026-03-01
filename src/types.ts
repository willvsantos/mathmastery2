export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface ExerciseRecord {
  id: string;
  operation: Operation;
  num1: number;
  num2: number;
  user_answer: number | null;
  correct_answer: number;
  created_at: string;
}

export interface UserStats {
  resolved: Record<Operation, number>;
  hits: Record<Operation, number>;
  errors: Record<Operation, number>;
  dailyGoal: number;
  dailyProgress: number;
  recentErrors: ExerciseRecord[];
}

export interface Question {
  id: string;
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}

export type Screen = 'home' | 'stats' | 'profile' | 'exercise' | 'awards';
