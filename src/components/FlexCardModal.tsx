import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import type { Habit, UserProfile } from '../types';
import { HabitHeatmap } from './HabitHeatmap';
import { X, Download, Share2, Sparkles, Flame, Check, Palette } from 'lucide-react';

interface FlexCardModalProps {
  habit: Habit;
  profile: UserProfile;
  onClose: () => void;
}

type CardTheme = 'cyber' | 'obsidian' | 'gold';

export const FlexCardModal: React.FC<FlexCardModalProps> = ({ habit, profile, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<CardTheme>('cyber');

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `streakclash-${habit.id}-${habit.currentStreak}-days.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareStory = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'streak-flex.png', { type: 'image/png' });
        await navigator.share({
          title: `Mening ${habit.currentStreak} kunlik zanjirim!`,
          text: `StreakClash orqali ${habit.title} odatini ${habit.currentStreak} kundan beri qoldirmayapman!`,
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

  const handleCopyText = () => {
    const text = `🔥 StreakClash: ${habit.title} bo'yicha ${habit.currentStreak} kundan beri uzluksiz zanjir yig'yapman! Sen ham menga duel tashlashga jur'at etasanmi? Yuklab olish: https://streakclash.app/@${profile.username}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Theme styling definitions
  const themeStyles = {
    cyber: {
      bg: 'radial-gradient(circle at 50% 10%, #1e1338 0%, #0d0f17 65%, #08090d 100%)',
      border: `1.5px solid ${habit.color}55`,
      shadow: `0 10px 40px ${habit.color}22`,
      accent: habit.color,
      badgeBg: 'bg-slate-900/80',
    },
    obsidian: {
      bg: 'linear-gradient(180deg, #181920 0%, #0c0d12 100%)',
      border: '1.5px solid #2e303f',
      shadow: '0 10px 30px rgba(0,0,0,0.8)',
      accent: '#f1f5f9',
      badgeBg: 'bg-black/60',
    },
    gold: {
      bg: 'radial-gradient(circle at 50% 15%, #2a1f0a 0%, #120e05 60%, #080602 100%)',
      border: '1.5px solid rgba(245, 158, 11, 0.5)',
      shadow: '0 10px 40px rgba(245, 158, 11, 0.25)',
      accent: '#f59e0b',
      badgeBg: 'bg-amber-950/60',
    },
  };

  const currentStyle = themeStyles[theme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#12141c] border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-slate-100">Flex & Story Kartochkasi</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Chooser */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Palette className="w-3.5 h-3.5" />
            <span>Mavzu:</span>
          </div>
          <div className="flex gap-1.5">
            {[
              { id: 'cyber', label: 'Neon Cyber' },
              { id: 'obsidian', label: 'Obsidian Dark' },
              { id: 'gold', label: 'Gold VIP' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as CardTheme)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition ${
                  theme === t.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Story Card Preview (Instagram Story 9:16 aesthetic) */}
        <div className="p-4 overflow-y-auto flex justify-center bg-[#090a0f]">
          <div
            ref={cardRef}
            className="w-full max-w-[340px] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden text-white transition-all duration-300"
            style={{
              background: currentStyle.bg,
              border: currentStyle.border,
              boxShadow: currentStyle.shadow,
            }}
          >
            {/* Ambient Background Glow */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ backgroundColor: currentStyle.accent }}
            />

            {/* Header: User Profile */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover"
                />
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    {profile.name}
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold">
                      PRO
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">@{profile.username}</div>
                </div>
              </div>
              <div
                className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{ backgroundColor: `${currentStyle.accent}22`, color: currentStyle.accent }}
              >
                {habit.category}
              </div>
            </div>

            {/* Center: Big Streak Hero */}
            <div className="my-6 text-center relative z-10">
              <div
                className={`inline-flex items-center justify-center gap-2 mb-2 px-3 py-1 rounded-full border border-slate-700/60 ${currentStyle.badgeBg}`}
              >
                <Flame className="w-5 h-5 text-orange-400 animate-bounce" />
                <span className="text-xs font-bold text-orange-300 tracking-wider">UNBROKEN STREAK</span>
              </div>
              <div
                className="text-6xl font-black tracking-tight"
                style={{
                  color: currentStyle.accent,
                  textShadow: `0 0 30px ${currentStyle.accent}88`,
                }}
              >
                {habit.currentStreak}
              </div>
              <div className="text-sm uppercase tracking-widest text-slate-300 font-semibold mt-1">
                KUN KETMA-KET
              </div>
              <div className="text-base font-bold text-white mt-3">{habit.title}</div>
            </div>

            {/* Heatmap Grid in Card */}
            <div className="bg-black/40 border border-slate-800/80 p-3 rounded-xl mb-6 relative z-10">
              <div className="flex justify-between items-center text-[11px] text-slate-400 mb-2">
                <span>So'nggi 11 hafta faolligi</span>
                <span className="font-semibold text-white">{habit.totalCompletions} jami</span>
              </div>
              <HabitHeatmap completedDates={habit.completedDates} color={currentStyle.accent} daysCount={77} />
            </div>

            {/* Footer / Branding Watermark (VIRAL ENGINE) */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 relative z-10">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-purple-600 flex items-center justify-center text-white font-black text-[10px]">
                  SC
                </div>
                <span className="font-bold text-white tracking-wide">StreakClash</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                clash.app/@{profile.username}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#12141c] flex flex-col gap-2.5">
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition shadow-lg shadow-purple-600/30"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Rasm saqlanmoqda...' : 'Rasm qilib saqlash (PNG)'}
            </button>
            <button
              onClick={handleShareStory}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition border border-slate-700"
            >
              <Share2 className="w-4 h-4" />
              Story'ga
            </button>
          </div>

          <button
            onClick={handleCopyText}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs transition border border-slate-800"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Havola va duel taklifi nusxalandi!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Telegram / Tarmoqlar uchun matnni nusxalash</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
