import React, { useState } from 'react';
import type { Habit, HabitCategory } from '../types';
import { X, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NewHabitModalProps {
  onClose: () => void;
  onAddHabit: (newHabit: Habit) => void;
  currentCount: number;
  isPro: boolean;
  onShowPaywall: () => void;
}

const NEON_COLORS = [
  { name: 'Neon Emerald', hex: '#10b981' },
  { name: 'Electric Purple', hex: '#8b5cf6' },
  { name: 'Cyber Cyan', hex: '#06b6d4' },
  { name: 'Sunset Amber', hex: '#f59e0b' },
  { name: 'Hot Pink', hex: '#ec4899' },
  { name: 'Blaze Red', hex: '#ef4444' },
];

export const NewHabitModal: React.FC<NewHabitModalProps> = ({
  onClose,
  onAddHabit,
  currentCount,
  isPro,
  onShowPaywall,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('discipline');
  const [selectedColor, setSelectedColor] = useState(NEON_COLORS[0].hex);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (!isPro && currentCount >= 3) {
      onShowPaywall();
      return;
    }

    const newHabit: Habit = {
      id: `h_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      color: selectedColor,
      icon: 'CheckSquare',
      createdAt: new Date().toISOString().split('T')[0],
      completedDates: [],
      currentStreak: 0,
      bestStreak: 0,
      totalCompletions: 0,
    };

    onAddHabit(newHabit);
    confetti({ particleCount: 50, spread: 50 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#12141c] border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-slate-100">Yangi Odat Qo'shish</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Odat nomi
            </label>
            <input
              type="text"
              placeholder="Masalan: Kitob o'qish (20 daqiqa)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tavsifi (ixtiyoriy)
            </label>
            <input
              type="text"
              placeholder="Masalan: Har kuni ertalab 10 sahifa"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Kategoriya
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as HabitCategory)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="fitness">Sport & Salomatlik</option>
              <option value="learning">Ta'lim & Kitob</option>
              <option value="business">Biznes & Ish</option>
              <option value="mind">Ong & Xotirjamlik</option>
              <option value="discipline">Intizom</option>
            </select>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Heatmap Katakchasi Rangi (Neon)
            </label>
            <div className="flex gap-2.5 items-center">
              {NEON_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setSelectedColor(c.hex)}
                  style={{
                    backgroundColor: c.hex,
                    boxShadow: selectedColor === c.hex ? `0 0 12px ${c.hex}` : 'none',
                  }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    selectedColor === c.hex ? 'scale-125 ring-2 ring-white' : 'hover:scale-110 opacity-70'
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Odatni Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
