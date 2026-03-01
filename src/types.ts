export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface UserStats {
  resolved: Record<Operation, number>;
  hits: Record<Operation, number>;
  errors: Record<Operation, number>;
  dailyGoal: number;
  dailyProgress: number;
}

export interface Question {
  id: string;
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}

export type Screen = 'home' | 'stats' | 'profile' | 'exercise' | 'awards';
