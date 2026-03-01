import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Delete } from 'lucide-react';
import { Operation, Question } from '../types';
import { OPERATION_CONFIG } from '../constants';
import { supabase } from '../lib/supabase';

interface ExerciseViewProps {
    operation: Operation;
    questions: Question[];
    onExit: () => void;
    userId: string;
}

export const ExerciseView = ({ operation, questions, onExit, userId }: ExerciseViewProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const currentQ = questions[currentIndex];
    const config = OPERATION_CONFIG[operation];

    // Starts the timer
    useEffect(() => {
        setTimeLeft(60);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentIndex]);

    const saveToDatabase = async (userAns: number | null, isCorrect: boolean, timeSpent: number) => {
        try {
            await supabase.from('exercises').insert({
                user_id: userId,
                operation: currentQ.operation,
                num1: currentQ.num1,
                num2: currentQ.num2,
                correct_answer: currentQ.answer,
                user_answer: userAns,
                is_correct: isCorrect,
                time_spent_seconds: timeSpent
            });
        } catch (err) {
            console.error('Save error', err);
        }
    };

    const handleTimeout = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        if (timerRef.current) clearInterval(timerRef.current);

        // Timeout means incorrect
        await saveToDatabase(null, false, 60);
        goToNext();
    };

    const handleSubmit = async () => {
        if (isSubmitting || answer === '') return;
        setIsSubmitting(true);
        if (timerRef.current) clearInterval(timerRef.current);

        const userNum = parseInt(answer, 10);
        const isCorrect = userNum === currentQ.answer;
        const timeSpent = 60 - timeLeft;

        await saveToDatabase(userNum, isCorrect, timeSpent);
        goToNext();
    };

    const goToNext = () => {
        setAnswer('');
        setIsSubmitting(false);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onExit();
        }
    };

    const handleNumClick = (num: string) => {
        setAnswer(prev => prev + num);
    };

    const handleClear = () => setAnswer('');
    const handleBackspace = () => setAnswer(prev => prev.slice(0, -1));

    if (!currentQ) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] bg-background-dark flex flex-col"
        >
            <header className="flex items-center justify-between p-4 bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
                <button onClick={onExit} className="p-2 rounded-full hover:bg-primary/10 text-slate-300">
                    <ArrowLeft className="size-6" />
                </button>
                <h2 className="text-sm font-bold tracking-wider uppercase text-slate-400">
                    Questão {currentIndex + 1} de {questions.length}
                </h2>
                <div className="w-10"></div>
            </header>

            <div className="px-6 py-4 bg-background-dark">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary/60">Tempo Restante</span>
                    <span className={`text-sm font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-neon-cyan'}`}>
                        {timeLeft}s
                    </span>
                </div>
                <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-red-500' : 'bg-neon-cyan'}`}
                        style={{ width: `${(timeLeft / 60) * 100}%` }}
                    ></div>
                </div>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <config.icon className="size-96" />
                </div>

                <div className="text-center space-y-8 z-10 w-full">
                    <div className="flex items-center justify-center gap-4 text-6xl md:text-7xl font-bold tracking-tighter text-white">
                        <span>{currentQ.num1}</span>
                        <span className="text-primary/70">{currentQ.operation === 'addition' ? '+' : currentQ.operation === 'subtraction' ? '-' : currentQ.operation === 'multiplication' ? 'x' : '÷'}</span>
                        <span>{currentQ.num2}</span>
                        <span className="text-primary/70">=</span>
                    </div>

                    <div className="relative max-w-[200px] mx-auto">
                        <input
                            className="w-full text-center text-5xl font-bold bg-transparent border-b-4 border-primary/40 focus:border-primary outline-none py-2 text-primary placeholder-slate-700 transition-colors"
                            placeholder="?"
                            readOnly
                            value={answer}
                        />
                    </div>
                </div>
            </main>

            <div className="bg-slate-900/60 backdrop-blur-xl rounded-t-3xl border-t border-primary/20 px-6 pt-6 pb-14 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                        <button
                            key={num}
                            onClick={() => handleNumClick(num)}
                            className="h-16 flex items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700 hover:bg-primary/20 hover:border-primary/40 text-2xl font-bold text-white transition-all active:scale-95 shadow-sm"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={handleClear}
                        className="h-16 flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-xl font-bold text-red-500 active:scale-95 transition-all"
                    >
                        C
                    </button>
                    <button
                        onClick={() => handleNumClick('0')}
                        className="h-16 flex items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700 hover:bg-primary/20 hover:border-primary/40 text-2xl font-bold text-white transition-all active:scale-95 shadow-sm"
                    >
                        0
                    </button>
                    <button
                        onClick={handleBackspace}
                        className="h-16 flex items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700 hover:bg-primary/20 hover:border-primary/40 text-white active:scale-95 transition-all shadow-sm"
                    >
                        <Delete className="size-6" />
                    </button>
                </div>

                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleSubmit}
                        disabled={answer === '' || isSubmitting}
                        className="w-full py-4 bg-neon-green hover:bg-green-400 text-slate-900 font-extrabold text-xl rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale shadow-[0_0_20px_rgba(57,255,20,0.3)] uppercase tracking-wider"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
