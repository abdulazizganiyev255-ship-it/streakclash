import { useState, useEffect } from 'react';
import {
  Flame,
  Swords,
  Trophy,
  Crown,
  Plus,
  Share2,
  CheckCircle2,
  Circle,
  Shield,
  Lightbulb,
  Bell,
  Trash2,
  Calendar,
  AlertTriangle,
  Award,
  Sparkles,
  Zap,
  Archive,
  ArchiveRestore,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Habit, UserProfile, Duel, LeaderboardEntry } from './types';
import { storage, getTodayDateStr } from './storage';
import { sounds } from './sound';
import { HabitHeatmap } from './components/HabitHeatmap';
import { FlexCardModal } from './components/FlexCardModal';
import { DuelModal } from './components/DuelModal';
import { PaywallModal } from './components/PaywallModal';
import { NewHabitModal } from './components/NewHabitModal';

export function App() {
  const [profile, setProfile] = useState<UserProfile>(() => storage.getProfile());
  const [habits, setHabits] = useState<Habit[]>(() => storage.getHabits());
  const [duels, setDuels] = useState<Duel[]>(() => storage.getDuels());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => storage.getLeaderboard());
  const [activeTab, setActiveTab] = useState<'habits' | 'duels' | 'leaderboard' | 'insights'>('habits');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showArchived, setShowArchived] = useState<boolean>(false);

  // Modals
  const [selectedFlexHabit, setSelectedFlexHabit] = useState<Habit | null>(null);
  const [showDuelModal, setShowDuelModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showNewHabit, setShowNewHabit] = useState(false);

  // Peer-Pressure Banner
  const [pushAlert, setPushAlert] = useState<string | null>(
    "🔥 Sardor bugun 15 kunlik zanjirini yangiladi! Sizdan 1 qadam oldinda."
  );

  const today = getTodayDateStr();
  const automatedInsights = storage.getAutomatedSmartInsights();

  // Progress metrics for today (only active habits)
  const activeHabitsList = habits.filter((h) => !h.isArchived);
  const completedTodayCount = activeHabitsList.filter((h) => h.completedDates.includes(today)).length;
  const progressPercent = activeHabitsList.length > 0 ? Math.round((completedTodayCount / activeHabitsList.length) * 100) : 0;
  const archivedCount = habits.filter((h) => h.isArchived).length;

  useEffect(() => {
    setLeaderboard(storage.getLeaderboard());
  }, [habits, profile]);

  const handleToggleToday = (habitId: string) => {
    const { habit, completed, currentStreak } = storage.toggleHabitToday(habitId);
    setHabits(storage.getHabits());
    setProfile(storage.getProfile());

    if (completed) {
      if (currentStreak === 7 || currentStreak === 14 || currentStreak === 21 || currentStreak === 30) {
        sounds.playMilestone();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.7 } });
      } else {
        sounds.playCheckin();
        confetti({ particleCount: 45, spread: 50, origin: { y: 0.8 } });
      }
      setPushAlert(`🔥 Barakalla! "${habit.title}" bajarildi. Zanjiringiz: ${currentStreak} kun!`);
    }
  };

  const handleTogglePastDate = (habitId: string, dateStr: string) => {
    storage.toggleHabitDate(habitId, dateStr);
    sounds.playCheckin();
    setHabits(storage.getHabits());
    setProfile(storage.getProfile());
  };

  const handleDeleteHabit = (habitId: string) => {
    if (confirm("Haqiqatan ham bu odatni o'chirmoqchimisiz? Tarix butunlay o'chadi.")) {
      const updated = storage.deleteHabit(habitId);
      setHabits(updated);
    }
  };

  const handleToggleArchive = (habitId: string) => {
    const updated = storage.toggleArchiveHabit(habitId);
    setHabits(updated);
  };

  const handleUseStreakFreeze = () => {
    if (profile.streakFreezes > 0) {
      storage.useStreakFreeze();
      setProfile(storage.getProfile());
      sounds.playMilestone();
      alert("🛡️ Streak Freeze muvaffaqiyatli ishlatildi! Bugungi zanjiringiz uzilishdan saqlab qolindi.");
    } else {
      setShowPaywall(true);
    }
  };

  const handleAddHabit = (newHabit: Habit) => {
    const updated = [...habits, newHabit];
    storage.saveHabits(updated);
    setHabits(updated);
  };

  const handleAddDuel = (newDuel: Duel) => {
    const updated = [newDuel, ...duels];
    storage.saveDuels(updated);
    setDuels(updated);
  };

  const handleUpgradeSuccess = () => {
    const updated: UserProfile = {
      ...profile,
      isPro: true,
      streakFreezes: profile.streakFreezes + 5,
    };
    storage.saveProfile(updated);
    setProfile(updated);
  };

  // Filtered habits
  const filteredHabits = habits.filter((h) => {
    const matchesCategory = categoryFilter === 'all' || h.category === categoryFilter;
    const matchesArchive = showArchived ? h.isArchived : !h.isArchived;
    return matchesCategory && matchesArchive;
  });

  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 flex flex-col max-w-xl mx-auto px-4 pb-36 relative selection:bg-purple-600 selection:text-white">
      {/* Ambient Radial Lights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10 float-slow" />
      <div className="fixed top-1/3 -left-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Smart Peer-Pressure Banner */}
      {pushAlert && (
        <div className="mt-3 py-2 px-3.5 rounded-xl glass-panel border-purple-500/30 flex items-center justify-between text-xs text-purple-200 animate-in slide-in-from-top duration-300 shadow-lg shadow-purple-950/40">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
            <span className="font-medium text-[12px]">{pushAlert}</span>
          </div>
          <button
            onClick={() => setPushAlert(null)}
            className="text-purple-400 hover:text-white text-xs ml-2 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <header className="pt-5 pb-3 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-lg shadow-purple-600/30">
              <div className="w-full h-full bg-[#090b10] rounded-[14px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400 flame-pulse" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black tracking-tight text-white m-0">StreakClash</h1>
              {profile.isPro && (
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full font-mono shadow">
                  PRO
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 font-medium">
              <span className="text-purple-300 font-mono font-bold">Lvl {profile.level}</span>
              <span className="text-white/20">•</span>
              <span className="text-slate-300 font-mono">{profile.xp} XP</span>
              <span className="text-white/20">•</span>
              <button
                onClick={handleUseStreakFreeze}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-cyan-950/50 text-cyan-400 hover:text-cyan-300 border border-cyan-500/20 text-[10px] font-mono transition"
                title="Streak Freeze ishlatish"
              >
                <Shield className="w-2.5 h-2.5" />
                {profile.streakFreezes} Freeze
              </button>
            </div>
          </div>
        </div>

        {/* Upgrade / Pro Pill */}
        <div>
          {profile.isPro ? (
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              VIP Crown
            </div>
          ) : (
            <button
              onClick={() => setShowPaywall(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition flex items-center gap-1.5 active:scale-95 border border-white/10"
            >
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              PRO ga O'tish
            </button>
          )}
        </div>
      </header>

      {/* Main Tab 1: Habits & Discrete Grid */}
      {activeTab === 'habits' && (
        <div className="space-y-4 pt-3">
          {/* Daily Discipline Hero Card */}
          <div className="glass-panel rounded-2xl p-4.5 border-purple-500/20 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
                  Bugungi Intizom
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {completedTodayCount} / {activeHabitsList.length} odat bajarildi
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-black font-mono text-purple-400">{progressPercent}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-900 border border-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(168,85,247,0.7)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 mt-3 pt-2.5 border-t border-white/[0.05] overflow-x-auto scrollbar-none">
              {[
                { id: 'all', label: 'Barchasi' },
                { id: 'fitness', label: 'Sport' },
                { id: 'learning', label: 'Ta\'lim' },
                { id: 'business', label: 'Biznes' },
                { id: 'discipline', label: 'Intizom' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                    categoryFilter === c.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section Header with Archive & Add Controls */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider m-0">
                {showArchived ? 'Arxivlangan Odatlar' : 'Faol Odatlar & Heatmap'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Archive */}
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  showArchived
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:text-white'
                }`}
                title={showArchived ? 'Faol odatlarni ko\'rish' : 'Arxivlangan odatlarni ko\'rish'}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Arxiv ({archivedCount})</span>
              </button>

              {!showArchived && (
                <button
                  onClick={() => {
                    if (!profile.isPro && habits.length >= 3) {
                      setShowPaywall(true);
                    } else {
                      setShowNewHabit(true);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition shadow-lg shadow-purple-600/25 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Yangi Odat
                </button>
              )}
            </div>
          </div>

          {/* Habit Cards */}
          <div className="space-y-3.5">
            {filteredHabits.length === 0 ? (
              <div className="p-8 text-center glass-panel rounded-2xl border-white/[0.05]">
                <p className="text-xs text-slate-400">
                  {showArchived
                    ? 'Arxivlangan odatlar mavjud emas.'
                    : 'Qidiruv bo\'yicha odat topilmadi yoki hali odat qo\'shilmagan.'}
                </p>
              </div>
            ) : (
              filteredHabits.map((habit) => {
                const isCompletedToday = habit.completedDates.includes(today);

                return (
                  <div
                    key={habit.id}
                    className="glass-panel rounded-2xl p-4.5 border-white/[0.06] hover:border-white/15 transition-all duration-300 relative overflow-hidden group"
                  >
                    {/* Neon Accent */}
                    <div
                      className="absolute top-0 left-0 w-1.5 h-full opacity-90 transition-all duration-300 group-hover:w-2"
                      style={{
                        backgroundColor: habit.color,
                        boxShadow: `0 0 15px ${habit.color}`,
                      }}
                    />

                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-3.5 pl-2">
                      <div className="flex items-center gap-3.5">
                        {/* Check-In Button */}
                        <button
                          onClick={() => handleToggleToday(habit.id)}
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90 ${
                            isCompletedToday
                              ? 'shadow-xl'
                              : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 border border-white/[0.08]'
                          }`}
                          style={{
                            backgroundColor: isCompletedToday ? habit.color : undefined,
                            boxShadow: isCompletedToday
                              ? `0 0 20px ${habit.color}99, inset 0 1px 0 rgba(255,255,255,0.4)`
                              : undefined,
                            color: isCompletedToday ? '#ffffff' : undefined,
                          }}
                          title={isCompletedToday ? 'Bekor qilish' : 'Bugun bajarildi deb belgilash'}
                        >
                          {isCompletedToday ? (
                            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                          ) : (
                            <Circle className="w-6 h-6 stroke-[1.5]" />
                          )}
                        </button>

                        <div>
                          <h3 className="text-[15px] font-bold text-white m-0 tracking-tight flex items-center gap-2">
                            {habit.title}
                            {habit.isArchived && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Arxiv
                              </span>
                            )}
                          </h3>
                          {habit.description && (
                            <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                              {habit.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <div className="text-right pr-1">
                          <div
                            className="flex items-center gap-1 text-[15px] font-black font-mono justify-end"
                            style={{ color: habit.color }}
                          >
                            <Flame className="w-4 h-4 fill-current flame-pulse" />
                            <span>{habit.currentStreak}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                            kun streak
                          </div>
                        </div>

                        {/* Flex Story Button */}
                        <button
                          onClick={() => setSelectedFlexHabit(habit)}
                          className="p-2 rounded-xl bg-white/[0.04] hover:bg-purple-600/20 text-purple-400 hover:text-purple-300 border border-white/[0.08] hover:border-purple-500/40 transition active:scale-90 shadow-sm"
                          title="Instagram Story yoki Telegram'ga maqtanish"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>

                        {/* Archive Toggle */}
                        <button
                          onClick={() => handleToggleArchive(habit.id)}
                          className="p-2 rounded-xl bg-white/[0.03] hover:bg-amber-950/40 text-slate-500 hover:text-amber-400 transition"
                          title={habit.isArchived ? 'Arxivdan chiqarish' : 'Arxivlash'}
                        >
                          {habit.isArchived ? (
                            <ArchiveRestore className="w-3.5 h-3.5" />
                          ) : (
                            <Archive className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="p-2 rounded-xl bg-white/[0.02] hover:bg-red-950/40 text-slate-600 hover:text-red-400 transition border border-transparent hover:border-red-500/20"
                          title="Odatni o'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Discrete Heatmap Grid */}
                    <div className="pl-2 pt-2.5 border-t border-white/[0.04]">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mb-2 font-mono">
                        <span>11 HAFTA TARIXI (Katakchani bosing)</span>
                        <span className="text-slate-400 font-semibold">{habit.totalCompletions} marta bajarilgan</span>
                      </div>
                      <HabitHeatmap
                        completedDates={habit.completedDates}
                        color={habit.color}
                        daysCount={77}
                        interactive={true}
                        onToggleDate={(dStr) => handleTogglePastDate(habit.id, dStr)}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Main Tab 2: 1v1 Duels */}
      {activeTab === 'duels' && (
        <div className="space-y-4 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white m-0">1v1 Do'stona Duellar</h2>
              <p className="text-xs text-slate-400">Do'stlarga challenge tashlang va kim uzoqroq streak ushlab turishini bilib oling</p>
            </div>
            <button
              onClick={() => setShowDuelModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition shadow-lg shadow-red-600/30 active:scale-95"
            >
              <Swords className="w-3.5 h-3.5" />
              Duel Boshlash
            </button>
          </div>

          <div className="space-y-3">
            {duels.map((duel) => {
              const progressPct = Math.min(100, Math.round((duel.currentDay / duel.targetDays) * 100));
              return (
                <div
                  key={duel.id}
                  className="glass-panel rounded-2xl p-4.5 border-white/[0.06] hover:border-red-500/30 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm m-0">{duel.title}</h4>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                        <Trophy className="w-3 h-3 text-amber-400" />
                        <span>{duel.habitTitle}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold font-mono px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                      {duel.currentDay}/{duel.targetDays} kun
                    </span>
                  </div>

                  {/* Dual Battle Card */}
                  <div className="grid grid-cols-2 gap-3 py-3 px-3.5 rounded-xl bg-black/40 border border-white/[0.05] mb-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={duel.challenger.avatar}
                        alt=""
                        className="w-9 h-9 rounded-full border-2 border-purple-500 object-cover shadow-sm"
                      />
                      <div>
                        <div className="text-xs font-bold text-white truncate max-w-[90px]">
                          {duel.challenger.name}
                        </div>
                        <div className="text-[11px] text-purple-400 font-mono font-bold">
                          🔥 {duel.challenger.streak} kun
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 justify-end text-right">
                      <div>
                        <div className="text-xs font-bold text-white truncate max-w-[90px]">
                          {duel.rival.name}
                        </div>
                        <div className="text-[11px] text-orange-400 font-mono font-bold">
                          🔥 {duel.rival.streak} kun
                        </div>
                      </div>
                      <img
                        src={duel.rival.avatar}
                        alt=""
                        className="w-9 h-9 rounded-full border-2 border-orange-500 object-cover shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-900 border border-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-red-500 transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Tab 3: Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4 pt-3">
          <div>
            <h2 className="text-sm font-bold text-white m-0">Do'stlar va Global Reyting</h2>
            <p className="text-xs text-slate-400">Kim eng uzoq streak va doimiy intizomga ega?</p>
          </div>

          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <div
                key={entry.username}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  entry.isCurrentUser
                    ? 'glass-panel border-purple-500/50 shadow-lg shadow-purple-900/30'
                    : 'glass-panel border-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 text-center font-black font-mono text-sm ${
                      entry.rank === 1
                        ? 'text-amber-400'
                        : entry.rank === 2
                        ? 'text-slate-300'
                        : entry.rank === 3
                        ? 'text-amber-600'
                        : 'text-slate-500'
                    }`}
                  >
                    #{entry.rank}
                  </div>

                  <img
                    src={entry.avatar}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover border border-white/10 shadow-sm"
                  />

                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      {entry.name}
                      {entry.isPro && (
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      {entry.isCurrentUser && (
                        <span className="text-[10px] text-purple-400 font-mono">(Siz)</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">@{entry.username}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-orange-400 font-mono flex items-center gap-1 justify-end">
                    <Flame className="w-4 h-4 fill-current flame-pulse" />
                    <span>{entry.streak}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">{entry.xp} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Tab 4: Automated Smart Insights */}
      {activeTab === 'insights' && (
        <div className="space-y-4 pt-3">
          <div className="glass-panel rounded-2xl p-4.5 border-purple-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Avtomatlashtirilgan Aqlli Tavsiyalar</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Neyrobiologiya va xulq-atvor psixologiyasi qoidalari asosida sizning hozirgi zanjirlaringiz tahlili:
            </p>
          </div>

          <div className="space-y-3">
            {automatedInsights.map((insight, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-xl p-4 border-white/[0.06] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                    {insight.category}
                  </span>
                  {insight.type === 'warning' && (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  {insight.type === 'success' && (
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {insight.type === 'duel' && (
                    <Swords className="w-3.5 h-3.5 text-red-400" />
                  )}
                  {insight.type === 'tip' && (
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </div>
                <h4 className="font-bold text-white text-sm m-0">{insight.title}</h4>
                <p className="text-slate-300 leading-relaxed m-0">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Dock */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-40">
        <nav className="glass-dock rounded-full p-2 flex items-center justify-around shadow-2xl">
          {[
            { id: 'habits', label: 'Odatlar', icon: Flame },
            { id: 'duels', label: 'Duellar', icon: Swords },
            { id: 'leaderboard', label: 'Reyting', icon: Trophy },
            { id: 'insights', label: 'Tavsiyalar', icon: Lightbulb },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all duration-300 relative ${
                  isActive
                    ? 'text-white scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full -z-10 shadow-lg shadow-purple-600/40" />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                <span className="text-[10px] font-bold mt-0.5 tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Modals */}
      {selectedFlexHabit && (
        <FlexCardModal
          habit={selectedFlexHabit}
          profile={profile}
          onClose={() => setSelectedFlexHabit(null)}
        />
      )}

      {showDuelModal && (
        <DuelModal
          duels={duels}
          habits={habits}
          profile={profile}
          onClose={() => setShowDuelModal(false)}
          onAddDuel={handleAddDuel}
        />
      )}

      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onUpgradeSuccess={handleUpgradeSuccess}
        />
      )}

      {showNewHabit && (
        <NewHabitModal
          onClose={() => setShowNewHabit(false)}
          onAddHabit={handleAddHabit}
          currentCount={habits.length}
          isPro={profile.isPro}
          onShowPaywall={() => {
            setShowNewHabit(false);
            setShowPaywall(true);
          }}
        />
      )}
    </div>
  );
}
