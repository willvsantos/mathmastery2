import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Auth = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            first_name: firstName,
                            last_name: lastName
                        }
                    }
                });
                if (error) throw error;
            }
            onAuthSuccess();
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro durante a autenticação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6"
        >
            <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-2xl border border-primary/20">
                <div className="text-center">
                    <div className="mx-auto size-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                        <span className="text-3xl font-extrabold text-primary">fx</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                        {isLogin ? 'Faça login para continuar seus exercícios' : 'Comece a melhorar sua matemática hoje'}
                    </p>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Nome</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className="w-full bg-slate-900 border border-primary/20 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                                    placeholder="Nome"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Sobrenome</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="w-full bg-slate-900 border border-primary/20 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                                    placeholder="Sobrenome"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-900 border border-primary/20 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-slate-900 border border-primary/20 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                                placeholder="••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-3.5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                {isLogin ? <LogIn className="size-5 group-hover:scale-110 transition-transform" /> : <UserPlus className="size-5 group-hover:scale-110 transition-transform" />}
                                {isLogin ? 'Entrar' : 'Cadastrar'}
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-slate-400 hover:text-primary transition-colors"
                    >
                        {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
