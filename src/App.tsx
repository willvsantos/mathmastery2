import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, BarChart2, Trophy, User, Bell, Flashlight, ChevronLeft, Calendar, Settings, Target, LogOut, Shield, Edit3
} from 'lucide-react';
import { Screen, Operation, UserStats, Question } from './types';
import { OPERATION_CONFIG, INITIAL_STATS } from './constants';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { ExerciseView } from './components/ExerciseView';
import { AwardsView } from './components/AwardsView';
import { generateExerciseSet } from './utils/math';

// --- Subcomponents ---

const CircularProgress = ({ value, max }: { value: number; max: number }) => {
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const safeMax = max > 0 ? max : 1;
  const offset = circumference - (Math.min(value, max) / safeMax) * circumference;

  return (
    <div className="relative size-48">
      <svg className="w-full h-full transform -rotate-90">
        <circle className="text-slate-800" cx="96" cy="96" fill="transparent" r={radius} stroke="currentColor" strokeWidth="12" />
        <circle
          className="text-primary transition-all duration-1000" cx="96" cy="96" fill="transparent" r={radius} stroke="currentColor"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" strokeWidth="12"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{value}/{max}</span>
        <span className="text-xs text-primary font-semibold tracking-widest uppercase">Meta</span>
      </div>
    </div>
  );
};

const OperationCard = ({
  type, resolved, onStart
}: { type: Operation; resolved: number; onStart: (op: Operation, count: number) => void; key?: React.Key }) => {
  const [count, setCount] = useState(50);
  const config = OPERATION_CONFIG[type];
  const Icon = config.icon;

  return (
    <div className="glass-card p-5 rounded-xl flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Icon className="size-6 text-primary" />
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Resoluções</p>
          <p className="text-lg font-bold text-white">{resolved}</p>
        </div>
      </div>
      <div>
        <h4 className="text-white font-semibold">{config.label}</h4>
        <div className="mt-3 flex items-center gap-2">
          <label className="text-xs text-slate-400">Qtd.</label>
          <input
            className="w-full bg-slate-800/50 border-none rounded-lg text-sm text-white focus:ring-1 focus:ring-primary p-2 outline-none"
            type="number"
            min={50} max={200}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>
      </div>
      <button
        onClick={() => onStart(type, count)}
        className="w-full py-2 bg-neon-green/20 hover:bg-neon-green text-neon-green hover:text-white transition-all rounded-lg font-bold text-sm uppercase tracking-wider border border-neon-green/30"
      >
        Iniciar
      </button>
    </div>
  );
};

// --- Main Views ---

const Dashboard = ({ stats, userEmail, profile, onStartExercise }: any) => {
  const goalRemaining = Math.max(0, profile?.daily_goal - stats.dailyProgress);
  const displayName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : userEmail;
  const initial = profile?.first_name ? profile.first_name.charAt(0) : userEmail?.charAt(0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      <header className="flex items-center justify-between p-6 sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full border-2 border-primary/50 overflow-hidden bg-slate-800 flex items-center justify-center text-primary font-bold text-xl uppercase">
            {initial}
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Bem-vindo</p>
            <h1 className="text-xl font-bold text-white tracking-tight break-all max-w-[200px] truncate">{displayName}</h1>
          </div>
        </div>
      </header>

      <main className="px-6 pb-28 space-y-8 max-w-2xl mx-auto">
        <section className="flex flex-col items-center justify-center py-6 glass-card rounded-xl">
          <h2 className="text-slate-300 font-medium mb-6">Progresso Diário</h2>
          <CircularProgress value={stats.dailyProgress} max={profile?.daily_goal || 50} />
          <p className="mt-6 text-slate-400 text-sm italic">
            {goalRemaining > 0 ? `"Faltam ${goalRemaining} exercícios para sua meta!"` : '"Meta diária atingida! Parabéns!"'}
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="size-2 bg-primary rounded-full"></span>
            Operações Fundamentais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(OPERATION_CONFIG) as Operation[]).map((op) => (
              <OperationCard key={op} type={op} resolved={stats.resolved[op] || 0} onStart={onStartExercise} />
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
};

const StatsView = ({ stats }: { stats: UserStats }) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <header className="sticky top-0 z-20 bg-background-dark/80 backdrop-blur-md border-b border-primary/10 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-white">Estatísticas Totais</h1>
      </header>
      <main className="px-6 space-y-4 pb-28">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Desempenho por Operação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(OPERATION_CONFIG) as Operation[]).map((op) => {
            const config = OPERATION_CONFIG[op];
            const Icon = config.icon;
            const total = (stats.hits[op] || 0) + (stats.errors[op] || 0);
            const precision = total > 0 ? Math.round(((stats.hits[op] || 0) / total) * 100) : 0;
            return (
              <div key={op} className="bg-primary/5 border border-primary/10 p-5 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/20 rounded-lg text-primary"><Icon className="size-5" /></div>
                  <h4 className="font-bold text-lg text-white">{config.label}</h4>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400">Acertos</span>
                    <span className="text-xl font-bold text-neon-green">{stats.hits[op] || 0}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400">Erros</span>
                    <span className="text-xl font-bold text-red-400">{stats.errors[op] || 0}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400">Precisão</span>
                    <span className="text-xl font-bold text-primary">{precision}%</span>
                  </div>
                </div>
                <div className="mt-4 h-1.5 w-full bg-primary/10 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-neon-green transition-all duration-1000" style={{ width: `${precision}%` }}></div>
                </div>

                {/* Historico de Erros Específico Desta Operação */}
                {stats.recentErrors && stats.recentErrors.filter(e => e.operation === op).length > 0 && (
                  <div className="pt-4 border-t border-primary/10">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Últimas Contas Erradas</h5>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 stylish-scrollbar">
                      {stats.recentErrors.filter(e => e.operation === op).map((error) => {
                        return (
                          <div key={error.id} className="bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg flex items-center justify-between">
                            <div>
                              <div className="text-white font-bold tracking-wider text-sm">
                                {error.num1} {error.operation === 'addition' ? '+' : error.operation === 'subtraction' ? '-' : error.operation === 'multiplication' ? 'x' : '÷'} {error.num2}
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-3">
                              <div className="text-center">
                                <div className="text-[9px] text-slate-500 uppercase">Sua Resp.</div>
                                <div className="text-red-400 font-bold text-sm line-through leading-none mt-0.5">{error.user_answer !== null ? error.user_answer : '-'}</div>
                              </div>
                              <div className="w-px h-6 bg-slate-700"></div>
                              <div className="text-center">
                                <div className="text-[9px] text-slate-500 uppercase">Correto</div>
                                <div className="text-neon-green font-bold text-base leading-none mt-0.5">{error.correct_answer}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>


      </main>
    </motion.div>
  );
};

const ProfileView = ({ userEmail, profile, onSignOut, fetchProfile }: any) => {
  const [goal, setGoal] = useState<number>(profile?.daily_goal || 50);
  const [firstName, setFirstName] = useState<string>(profile?.first_name || '');
  const [lastName, setLastName] = useState<string>(profile?.last_name || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      if (profile.daily_goal) setGoal(profile.daily_goal);
      if (profile.first_name) setFirstName(profile.first_name);
      if (profile.last_name) setLastName(profile.last_name);
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('profiles').update({
      daily_goal: goal,
      first_name: firstName,
      last_name: lastName
    }).eq('id', profile.id);
    await fetchProfile();
    setSaving(false);
  };

  const displayName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : userEmail;
  const initial = profile?.first_name ? profile.first_name.charAt(0) : userEmail?.charAt(0);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
      <header className="flex items-center justify-between p-6 pt-8">
        <h1 className="text-xl font-bold tracking-tight text-white">Perfil</h1>
      </header>
      <main className="px-6 pb-28">
        <div className="flex flex-col items-center mt-4">
          <div className="size-32 rounded-full p-1 bg-gradient-to-tr from-primary to-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <div className="size-full rounded-full border-4 border-background-dark bg-slate-800 flex items-center justify-center text-5xl font-bold text-primary uppercase">
              {initial}
            </div>
          </div>
          <div className="text-center mt-6">
            <h2 className="text-xl font-bold text-white max-w-sm truncate">{displayName}</h2>
          </div>
        </div>

        <div className="mt-12 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 ml-1">Configurações Gerais</h3>
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-4">
              <div className="size-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Target className="size-5" /></div>
              <div>
                <p className="text-sm font-semibold text-white">Meta Diária</p>
                <p className="text-xs text-slate-400">{profile?.daily_goal || 50} questões por dia</p>
              </div>
            </div>
          </div>
          <div onClick={onSignOut} className="cursor-pointer flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-red-500/40 transition-colors">
            <div className="flex items-center gap-4">
              <div className="size-11 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500"><LogOut className="size-5" /></div>
              <div>
                <p className="text-sm font-semibold text-red-500">Sair da Conta</p>
                <p className="text-xs text-slate-500">Desconectar deste dispositivo</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 backdrop-blur-sm relative overflow-hidden">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Edit3 className="size-5 text-primary" />Editar Perfil</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">Nome</label>
                <input
                  className="w-full bg-slate-900 border border-primary/20 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none"
                  type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">Sobrenome</label>
                <input
                  className="w-full bg-slate-900 border border-primary/20 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none"
                  type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Seu sobrenome"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Meta diária (questões)</label>
              <input
                className="w-full bg-slate-900 border border-primary/20 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none"
                type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} min={50} max={1000}
              />
            </div>
            <button onClick={handleSave} disabled={saving} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-primary/20 mt-2">
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

// --- App Root ---

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [profile, setProfile] = useState<any>(null);

  const [activeOperation, setActiveOperation] = useState<Operation | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (data) setProfile(data);
  };

  const fetchStats = async () => {
    if (!session?.user?.id) return;
    const { data, error } = await supabase.from('exercises')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error || !data) return;

    const newStats: UserStats = {
      resolved: { addition: 0, subtraction: 0, multiplication: 0, division: 0 },
      hits: { addition: 0, subtraction: 0, multiplication: 0, division: 0 },
      errors: { addition: 0, subtraction: 0, multiplication: 0, division: 0 },
      dailyGoal: profile?.daily_goal || 50,
      dailyProgress: 0,
      recentErrors: [],
    };

    const today = new Date().toISOString().split('T')[0];

    data.forEach((ex: any) => {
      const op = ex.operation as Operation;
      if (!newStats.resolved[op]) newStats.resolved[op] = 0;
      if (!newStats.hits[op]) newStats.hits[op] = 0;
      if (!newStats.errors[op]) newStats.errors[op] = 0;

      newStats.resolved[op]++;
      if (ex.is_correct) {
        newStats.hits[op]++;
      } else {
        newStats.errors[op]++;
        // Store max 15 recent errors
        if (newStats.recentErrors.length < 15) {
          newStats.recentErrors.push(ex);
        }
      }

      // Check if it was done today
      const exDate = ex.created_at.split('T')[0];
      if (exDate === today) {
        newStats.dailyProgress++;
      }
    });

    setStats(newStats);
  };

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
      fetchStats();
    }
  }, [session, currentScreen]); // Refresh stats when returning to home

  const handleStartExercise = async (op: Operation, count: number) => {
    if (!session?.user?.id) return;
    // Generate questions matching the 80/20 rule and count bounds
    const safeCount = Math.max(50, Math.min(200, count));
    const qs = await generateExerciseSet(session.user.id, op, safeCount);
    setActiveQuestions(qs);
    setActiveOperation(op);
    setCurrentScreen('exercise');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="min-h-screen bg-background-dark flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!session) {
    return <Auth onAuthSuccess={() => setCurrentScreen('home')} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <Dashboard stats={stats} profile={profile} userEmail={session.user.email} onStartExercise={handleStartExercise} />;
      case 'stats': return <StatsView stats={stats} />;
      case 'awards': return <AwardsView stats={stats} />;
      case 'profile': return <ProfileView profile={profile} userEmail={session.user.email} onSignOut={handleSignOut} fetchProfile={fetchProfile} />;
      case 'exercise':
        return activeOperation && activeQuestions.length > 0 ? (
          <ExerciseView operation={activeOperation} questions={activeQuestions} userId={session.user.id} onExit={() => { setActiveOperation(null); setActiveQuestions([]); setCurrentScreen('home'); }} />
        ) : null;
      default: return <Dashboard stats={stats} profile={profile} userEmail={session.user.email} onStartExercise={handleStartExercise} />;
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 pb-28">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>

      {currentScreen !== 'exercise' && (
        <nav className="fixed bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-primary/20 rounded-2xl flex items-center justify-around p-3 shadow-2xl shadow-primary/20">
            <button onClick={() => setCurrentScreen('home')} className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === 'home' ? 'text-primary' : 'text-slate-400'}`}>
              <Home className={`size-6 ${currentScreen === 'home' ? 'fill-primary' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Início</span>
            </button>
            <button onClick={() => setCurrentScreen('stats')} className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === 'stats' ? 'text-primary' : 'text-slate-400'}`}>
              <BarChart2 className={`size-6 ${currentScreen === 'stats' ? 'fill-primary' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Status</span>
            </button>
            <button onClick={() => setCurrentScreen('awards')} className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === 'awards' ? 'text-primary' : 'text-slate-400'}`}>
              <Trophy className={`size-6 ${currentScreen === 'awards' ? 'fill-primary' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Prêmios</span>
            </button>
            <button onClick={() => setCurrentScreen('profile')} className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === 'profile' ? 'text-primary' : 'text-slate-400'}`}>
              <User className={`size-6 ${currentScreen === 'profile' ? 'fill-primary' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Perfil</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
