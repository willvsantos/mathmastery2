import { Target, Plus, Minus, X, Percent, Trophy, Flashlight, Crown, Star, Medal, Zap, Flame, Award as AwardIcon } from 'lucide-react';
import { UserStats } from '../types';

export interface Award {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    checkUnlock: (stats: UserStats) => boolean;
}

// Helper to sum all resolved or hits
const total = (record: Record<string, number>) => Object.values(record).reduce((a, b) => a + b, 0);

export const AWARDS: Award[] = [
    // --- Exercícios Resolvidos (8 prêmios) ---
    { id: 'res_10', title: 'Primeiros Passos', description: 'Complete 10 exercícios no total.', icon: Target, color: 'text-blue-300', checkUnlock: (s) => total(s.resolved) >= 10 },
    { id: 'res_50', title: 'Pegando o Ritmo', description: 'Complete 50 exercícios no total.', icon: Target, color: 'text-blue-400', checkUnlock: (s) => total(s.resolved) >= 50 },
    { id: 'res_100', title: 'Estudante Focado', description: 'Complete 100 exercícios no total.', icon: Target, color: 'text-blue-500', checkUnlock: (s) => total(s.resolved) >= 100 },
    { id: 'res_250', title: 'Mente Ativa', description: 'Complete 250 exercícios no total.', icon: Target, color: 'text-blue-600', checkUnlock: (s) => total(s.resolved) >= 250 },
    { id: 'res_500', title: 'Maratonista', description: 'Complete 500 exercícios no total.', icon: Flame, color: 'text-orange-400', checkUnlock: (s) => total(s.resolved) >= 500 },
    { id: 'res_1000', title: 'Incansável', description: 'Complete 1.000 exercícios no total.', icon: Flame, color: 'text-orange-500', checkUnlock: (s) => total(s.resolved) >= 1000 },
    { id: 'res_2500', title: 'Máquina de Calcular', description: 'Complete 2.500 exercícios no total.', icon: Zap, color: 'text-yellow-400', checkUnlock: (s) => total(s.resolved) >= 2500 },
    { id: 'res_5000', title: 'Lenda da Matemática', description: 'Complete 5.000 exercícios no total.', icon: Zap, color: 'text-yellow-500', checkUnlock: (s) => total(s.resolved) >= 5000 },

    // --- Acertos Totais (8 prêmios) ---
    { id: 'hit_10', title: 'Bom Começo', description: 'Some 10 acertos no total.', icon: Star, color: 'text-emerald-300', checkUnlock: (s) => total(s.hits) >= 10 },
    { id: 'hit_50', title: 'Mente Afiada', description: 'Some 50 acertos no total.', icon: Star, color: 'text-emerald-400', checkUnlock: (s) => total(s.hits) >= 50 },
    { id: 'hit_100', title: 'Calculadora Humana', description: 'Some 100 acertos no total.', icon: Star, color: 'text-emerald-500', checkUnlock: (s) => total(s.hits) >= 100 },
    { id: 'hit_250', title: 'Gênio em Ascensão', description: 'Some 250 acertos no total.', icon: Medal, color: 'text-indigo-400', checkUnlock: (s) => total(s.hits) >= 250 },
    { id: 'hit_500', title: 'Mestre da Lógica', description: 'Some 500 acertos no total.', icon: Medal, color: 'text-indigo-500', checkUnlock: (s) => total(s.hits) >= 500 },
    { id: 'hit_1000', title: 'Cérebro de Ouro', description: 'Some 1.000 acertos no total.', icon: Trophy, color: 'text-yellow-400', checkUnlock: (s) => total(s.hits) >= 1000 },
    { id: 'hit_2500', title: 'Sábio dos Números', description: 'Some 2.500 acertos no total.', icon: Trophy, color: 'text-yellow-500', checkUnlock: (s) => total(s.hits) >= 2500 },
    { id: 'hit_5000', title: 'Deusd Matemática', description: 'Some 5.000 acertos no total.', icon: Crown, color: 'text-yellow-300', checkUnlock: (s) => total(s.hits) >= 5000 },

    // --- Domínio: Adição (6 prêmios) ---
    { id: 'add_10', title: 'Somador Iniciante', description: 'Acerte 10 questões de adição.', icon: Plus, color: 'text-neon-green', checkUnlock: (s) => s.hits.addition >= 10 },
    { id: 'add_50', title: 'Somador Experiente', description: 'Acerte 50 questões de adição.', icon: Plus, color: 'text-neon-green', checkUnlock: (s) => s.hits.addition >= 50 },
    { id: 'add_100', title: 'Amigo da Soma', description: 'Acerte 100 questões de adição.', icon: Plus, color: 'text-neon-green', checkUnlock: (s) => s.hits.addition >= 100 },
    { id: 'add_250', title: 'Mestre da Adição', description: 'Acerte 250 questões de adição.', icon: Plus, color: 'text-neon-green', checkUnlock: (s) => s.hits.addition >= 250 },
    { id: 'add_500', title: 'Grão-Mestre da Soma', description: 'Acerte 500 questões de adição.', icon: Plus, color: 'text-neon-green', checkUnlock: (s) => s.hits.addition >= 500 },
    { id: 'add_1000', title: 'O Rei da Adição', description: 'Acerte 1.000 questões de adição.', icon: AwardIcon, color: 'text-neon-green', checkUnlock: (s) => s.hits.addition >= 1000 },

    // --- Domínio: Subtração (6 prêmios) ---
    { id: 'sub_10', title: 'Subtrator Iniciante', description: 'Acerte 10 questões de subtração.', icon: Minus, color: 'text-amber-400', checkUnlock: (s) => s.hits.subtraction >= 10 },
    { id: 'sub_50', title: 'Subtrator Experiente', description: 'Acerte 50 questões de subtração.', icon: Minus, color: 'text-amber-400', checkUnlock: (s) => s.hits.subtraction >= 50 },
    { id: 'sub_100', title: 'Foco na Diferença', description: 'Acerte 100 questões de subtração.', icon: Minus, color: 'text-amber-400', checkUnlock: (s) => s.hits.subtraction >= 100 },
    { id: 'sub_250', title: 'Mestre da Subtração', description: 'Acerte 250 questões de subtração.', icon: Minus, color: 'text-amber-400', checkUnlock: (s) => s.hits.subtraction >= 250 },
    { id: 'sub_500', title: 'Grão-Mestre Subtrator', description: 'Acerte 500 questões de subtração.', icon: Minus, color: 'text-amber-400', checkUnlock: (s) => s.hits.subtraction >= 500 },
    { id: 'sub_1000', title: 'O Rei da Subtração', description: 'Acerte 1.000 questões de subtração.', icon: AwardIcon, color: 'text-amber-400', checkUnlock: (s) => s.hits.subtraction >= 1000 },

    // --- Domínio: Multiplicação (6 prêmios) ---
    { id: 'mul_10', title: 'Multiplicador', description: 'Acerte 10 questões de multiplicação.', icon: X, color: 'text-purple-400', checkUnlock: (s) => s.hits.multiplication >= 10 },
    { id: 'mul_50', title: 'Tabuada Decorada', description: 'Acerte 50 questões de multiplicação.', icon: X, color: 'text-purple-400', checkUnlock: (s) => s.hits.multiplication >= 50 },
    { id: 'mul_100', title: 'Rápido no Produto', description: 'Acerte 100 questões de multiplicação.', icon: X, color: 'text-purple-400', checkUnlock: (s) => s.hits.multiplication >= 100 },
    { id: 'mul_250', title: 'Mestre da Multiplicação', description: 'Acerte 250 questões de multiplicação.', icon: X, color: 'text-purple-400', checkUnlock: (s) => s.hits.multiplication >= 250 },
    { id: 'mul_500', title: 'Grão-Mestre do Produto', description: 'Acerte 500 questões de multiplicação.', icon: X, color: 'text-purple-400', checkUnlock: (s) => s.hits.multiplication >= 500 },
    { id: 'mul_1000', title: 'O Rei da Multiplicação', description: 'Acerte 1.000 questões de multiplicação.', icon: AwardIcon, color: 'text-purple-400', checkUnlock: (s) => s.hits.multiplication >= 1000 },

    // --- Domínio: Divisão (6 prêmios) ---
    { id: 'div_10', title: 'Divisor Iniciante', description: 'Acerte 10 questões de divisão.', icon: Percent, color: 'text-pink-400', checkUnlock: (s) => s.hits.division >= 10 },
    { id: 'div_50', title: 'Divisor Experiente', description: 'Acerte 50 questões de divisão.', icon: Percent, color: 'text-pink-400', checkUnlock: (s) => s.hits.division >= 50 },
    { id: 'div_100', title: 'Fracionando', description: 'Acerte 100 questões de divisão.', icon: Percent, color: 'text-pink-400', checkUnlock: (s) => s.hits.division >= 100 },
    { id: 'div_250', title: 'Mestre da Divisão', description: 'Acerte 250 questões de divisão.', icon: Percent, color: 'text-pink-400', checkUnlock: (s) => s.hits.division >= 250 },
    { id: 'div_500', title: 'Grão-Mestre Divisor', description: 'Acerte 500 questões de divisão.', icon: Percent, color: 'text-pink-400', checkUnlock: (s) => s.hits.division >= 500 },
    { id: 'div_1000', title: 'O Rei da Divisão', description: 'Acerte 1.000 questões de divisão.', icon: AwardIcon, color: 'text-pink-400', checkUnlock: (s) => s.hits.division >= 1000 }
];
