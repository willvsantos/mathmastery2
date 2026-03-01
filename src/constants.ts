import { Plus, Minus, X, Percent } from 'lucide-react';
import { Operation } from './types';

export const OPERATION_CONFIG: Record<Operation, { label: string; icon: any; color: string }> = {
  addition: { label: 'Adição', icon: Plus, color: 'text-primary' },
  subtraction: { label: 'Subtração', icon: Minus, color: 'text-primary' },
  multiplication: { label: 'Multiplicação', icon: X, color: 'text-primary' },
  division: { label: 'Divisão', icon: Percent, color: 'text-primary' },
};

export const INITIAL_STATS = {
  resolved: { addition: 1200, subtraction: 850, multiplication: 2100, division: 420 },
  hits: { addition: 15, subtraction: 24, multiplication: 8, division: 12 },
  errors: { addition: 2, subtraction: 1, multiplication: 4, division: 3 },
  dailyGoal: 50,
  dailyProgress: 35,
};
