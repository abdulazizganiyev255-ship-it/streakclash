import React, { useState } from 'react';
import type { Duel, Habit, UserProfile } from '../types';
import { Swords, X, Trophy, Plus, Flame, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DuelModalProps {
  duels: Duel[];
  habits: Habit[];
  profile: UserProfile;
  onClose: () => void;
  onAddDuel: (newDuel: Duel) => void;
}

export const DuelModal: React.FC<DuelModalProps> = ({
  duels,
  habits,
  profile,
  onClose,
  onAddDuel,
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState(habits[0]?.id || '');
  const [rivalName, setRivalName] = useState('');
  const [targetDays, setTargetDays] = useState('21');

  const handleCreateDuel = (e: React.FormEvent) => {
    e.preventDefault();
    const habit = habits.find((h) => h.id === selectedHabitId) || habits[0];
    if (!habit || !rivalName.trim()) return;

    const newDuel: Duel = {
      id: `duel_${Date.now()}`,
      title: `${targetDays} Kunlik ${habit.title} Clashi`,
      habitTitle: habit.title,
      challenger: {
        name: `${profile.name} (Siz)`,
        avatar: profile.avatar,
        streak: habit.currentStreak,
        completedToday: false,
      },
      rival: {
        name: rivalName.trim(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        streak: 0,
        completedToday: false,
      },
      targetDays: parseInt(targetDays, 10) || 21,
      currentDay: 1,
      status: 'active',
    };

    onAddDuel(newDuel);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    setShowCreate(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#12141c] border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold text-slate-100">1v1 Do'stlar Bilan Duel</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {!showCreate ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono">
                  Faol Duellar ({duels.length})
                </span>
                <button
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition shadow-md shadow-red-600/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Yangi Duel Ochish
                </button>
              </div>

              {duels.map((duel) => {
                const progressPct = Math.min(100, Math.round((duel.currentDay / duel.targetDays) * 100));
                return (
                  <div
                    key={duel.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-white text-sm">{duel.title}</h4>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Trophy className="w-3 h-3 text-amber-400" />
                          <span>{duel.habitTitle}</span>
                        </div>
                      </div>
                      <div className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-semibold text-red-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {duel.currentDay}/{duel.targetDays} kun
                      </div>
                    </div>

                    {/* Side-by-side Fighters */}
                    <div className="grid grid-cols-2 gap-3 py-3 px-2 rounded-lg bg-black/40 border border-slate-800/80 mb-3">
                      {/* Challenger (You) */}
                      <div className="flex items-center gap-2.5">
                        <img
                          src={duel.challenger.avatar}
                          alt={duel.challenger.name}
                          className="w-9 h-9 rounded-full object-cover border border-purple-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-white truncate max-w-[100px]">
                            {duel.challenger.name}
                          </div>
                          <div className="text-[11px] text-purple-400 font-mono flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            {duel.challenger.streak} kun
                          </div>
                        </div>
                      </div>

                      {/* Rival */}
                      <div className="flex items-center gap-2.5 justify-end text-right">
                        <div>
                          <div className="text-xs font-bold text-white truncate max-w-[100px]">
                            {duel.rival.name}
                          </div>
                          <div className="text-[11px] text-orange-400 font-mono flex items-center gap-1 justify-end">
                            <Flame className="w-3 h-3" />
                            {duel.rival.streak} kun
                          </div>
                        </div>
                        <img
                          src={duel.rival.avatar}
                          alt={duel.rival.name}
                          className="w-9 h-9 rounded-full object-cover border border-orange-500"
                        />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                        <span>Marafon borishi</span>
                        <span className="font-semibold text-slate-300">{progressPct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-red-500 transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <form onSubmit={handleCreateDuel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Qaysi odat bo'yicha duel qilasiz?
                </label>
                <select
                  value={selectedHabitId}
                  onChange={(e) => setSelectedHabitId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                >
                  {habits.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.title} (Joriy streak: {h.currentStreak} kun)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Raqib do'stingizning ismi yoki @username
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Sardor Rahim yoki @sardor_clash"
                  value={rivalName}
                  onChange={(e) => setRivalName(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Davomiyligi (kun)
                </label>
                <select
                  value={targetDays}
                  onChange={(e) => setTargetDays(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                >
                  <option value="7">7 kun (Tezkor Clash)</option>
                  <option value="14">14 kun</option>
                  <option value="21">21 kun (Odat shakllanishi)</option>
                  <option value="30">30 kun (Haqiqiy sinov)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition shadow-lg shadow-red-600/30"
                >
                  Duelni Boshlash! ⚔️
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
