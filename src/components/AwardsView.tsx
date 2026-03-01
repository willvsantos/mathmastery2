import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Lock, ChevronLeft } from 'lucide-react';
import { UserStats } from '../types';
import { AWARDS } from '../constants/awards';

export const AwardsView = ({ stats }: { stats: UserStats }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <header className="sticky top-0 z-20 bg-background-dark/80 backdrop-blur-md border-b border-primary/10 px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Trophy className="size-6 text-yellow-400" />
                    Prêmios & Conquistas
                </h1>
            </header>
            <main className="px-6 space-y-6 pb-28">
                <p className="text-slate-400 text-sm">
                    Desbloqueie conquistas resolvendo exercícios e mantendo sua precisão alta.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {AWARDS.map((award) => {
                        const unlocked = award.checkUnlock(stats);
                        const Icon = award.icon;

                        return (
                            <div
                                key={award.id}
                                className={`relative overflow-hidden rounded-xl border p-5 transition-all ${unlocked
                                        ? 'bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                                        : 'bg-slate-900 border-slate-800 grayscale opacity-60'
                                    }`}
                            >
                                {!unlocked && (
                                    <div className="absolute top-3 right-3 text-slate-500">
                                        <Lock className="size-4" />
                                    </div>
                                )}
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-2xl flex items-center justify-center ${unlocked ? `bg-slate-800 ${award.color} shadow-lg shadow-black/50` : 'bg-slate-800 text-slate-600'
                                        }`}>
                                        <Icon className="size-8" />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-lg ${unlocked ? 'text-white' : 'text-slate-400'}`}>
                                            {award.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            {award.description}
                                        </p>
                                        {unlocked && (
                                            <span className="inline-block mt-3 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                                                Desbloqueado
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </motion.div>
    );
};
