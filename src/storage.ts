import type { Habit, UserProfile, Duel, LeaderboardEntry } from './types';

export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateStr(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate the last N days (for GitHub style heatmap)
export function getLastNDays(n: number = 77): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(formatDateStr(d));
  }
  return dates;
}

// Calculate streak given completedDates
export function calculateStreak(completedDates: string[]): { current: number; best: number } {
  if (!completedDates || completedDates.length === 0) return { current: 0, best: 0 };
  
  const sorted = Array.from(new Set(completedDates)).sort().reverse();
  const today = getTodayDateStr();
  
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = formatDateStr(yesterdayDate);

  let currentStreak = 0;
  let checkDate = new Date();

  if (sorted.includes(today)) {
    checkDate = new Date();
  } else if (sorted.includes(yesterday)) {
    checkDate = yesterdayDate;
  } else {
    return { current: 0, best: Math.max(1, sorted.length) };
  }

  while (true) {
    const dStr = formatDateStr(checkDate);
    if (sorted.includes(dStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { current: currentStreak, best: Math.max(currentStreak, sorted.length) };
}

const STORAGE_KEYS = {
  HABITS: 'streakclash_habits',
  PROFILE: 'streakclash_profile',
  DUELS: 'streakclash_duels',
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_me',
  name: 'Azizbek (Founder)',
  username: 'aziz_creator',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  isPro: false,
  streakFreezes: 3,
  xp: 1450,
  level: 5,
};

function generateSeedDates(ratio: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 40; i >= 1; i--) {
    if (Math.random() < ratio) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(formatDateStr(d));
    }
  }
  const y = new Date(today);
  y.setDate(y.getDate() - 1);
  dates.push(formatDateStr(y));
  return Array.from(new Set(dates));
}

const DEFAULT_HABITS: Habit[] = [
  {
    id: 'h_1',
    title: 'Kitob o\'qish (25 daqiqa)',
    description: 'Biznes va shaxsiy rivojlanish kitoblari',
    category: 'learning',
    color: '#8b5cf6', // Electric Purple
    icon: 'BookOpen',
    createdAt: '2026-09-01',
    completedDates: generateSeedDates(0.85),
    currentStreak: 19,
    bestStreak: 24,
    totalCompletions: 34,
  },
  {
    id: 'h_2',
    title: 'Gym & Ertalabki Workout',
    description: 'Kuch mashqlari va 3km yugurish',
    category: 'fitness',
    color: '#10b981', // Neon Emerald
    icon: 'Dumbbell',
    createdAt: '2026-09-10',
    completedDates: generateSeedDates(0.75),
    currentStreak: 14,
    bestStreak: 18,
    totalCompletions: 28,
  },
  {
    id: 'h_3',
    title: 'Deep Work (Kod yozish & App)',
    description: 'Chalg\'imasdan 2 soat mahsulot ustida ishlash',
    category: 'business',
    color: '#06b6d4', // Cyber Cyan
    icon: 'Code',
    createdAt: '2026-09-15',
    completedDates: generateSeedDates(0.9),
    currentStreak: 21,
    bestStreak: 21,
    totalCompletions: 32,
  },
];

const DEFAULT_DUELS: Duel[] = [
  {
    id: 'duel_1',
    title: '30 Kunlik Gym Duellasi',
    habitTitle: 'Gym & Ertalabki Workout',
    challenger: {
      name: 'Azizbek (Siz)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      streak: 14,
      completedToday: false,
    },
    rival: {
      name: 'Sardor Rahim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      streak: 15,
      completedToday: true,
    },
    targetDays: 30,
    currentDay: 19,
    status: 'active',
  },
  {
    id: 'duel_2',
    title: 'Kitob Marafon Clash',
    habitTitle: 'Kitob o\'qish (25 daqiqa)',
    challenger: {
      name: 'Azizbek (Siz)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      streak: 19,
      completedToday: false,
    },
    rival: {
      name: 'Malika Karimova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      streak: 17,
      completedToday: false,
    },
    targetDays: 21,
    currentDay: 19,
    status: 'active',
  },
];

export const storage = {
  getHabits(): Habit[] {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(DEFAULT_HABITS));
      return DEFAULT_HABITS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_HABITS;
    }
  },

  saveHabits(habits: Habit[]) {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  },

  getProfile(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getDuels(): Duel[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DUELS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DUELS, JSON.stringify(DEFAULT_DUELS));
      return DEFAULT_DUELS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_DUELS;
    }
  },

  saveDuels(duels: Duel[]) {
    localStorage.setItem(STORAGE_KEYS.DUELS, JSON.stringify(duels));
  },

  toggleHabitToday(habitId: string): { habit: Habit; completed: boolean; currentStreak: number } {
    return this.toggleHabitDate(habitId, getTodayDateStr());
  },

  toggleHabitDate(habitId: string, dateStr: string): { habit: Habit; completed: boolean; currentStreak: number } {
    const habits = this.getHabits();
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) throw new Error('Habit topilmadi');

    const index = habit.completedDates.indexOf(dateStr);
    let completed = false;

    if (index > -1) {
      habit.completedDates.splice(index, 1);
      habit.totalCompletions = Math.max(0, habit.totalCompletions - 1);
      completed = false;
    } else {
      habit.completedDates.push(dateStr);
      habit.totalCompletions += 1;
      completed = true;
    }

    const { current, best } = calculateStreak(habit.completedDates);
    habit.currentStreak = current;
    habit.bestStreak = Math.max(habit.bestStreak, best);

    this.saveHabits(habits);

    const profile = this.getProfile();
    if (completed) {
      profile.xp += 50;
      profile.level = Math.floor(profile.xp / 300) + 1;
    }
    this.saveProfile(profile);

    return { habit, completed, currentStreak: habit.currentStreak };
  },

  deleteHabit(habitId: string): Habit[] {
    const habits = this.getHabits().filter((h) => h.id !== habitId);
    this.saveHabits(habits);
    return habits;
  },

  updateHabit(updatedHabit: Habit): Habit[] {
    const habits = this.getHabits().map((h) => (h.id === updatedHabit.id ? updatedHabit : h));
    this.saveHabits(habits);
    return habits;
  },

  toggleArchiveHabit(habitId: string): Habit[] {
    const habits = this.getHabits().map((h) => {
      if (h.id === habitId) {
        return { ...h, isArchived: !h.isArchived };
      }
      return h;
    });
    this.saveHabits(habits);
    return habits;
  },

  useStreakFreeze(): boolean {
    const profile = this.getProfile();
    if (profile.streakFreezes > 0) {
      profile.streakFreezes -= 1;
      this.saveProfile(profile);
      return true;
    }
    return false;
  },

  getLeaderboard(): LeaderboardEntry[] {
    const habits = this.getHabits();
    const today = getTodayDateStr();
    const totalCurrentStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
    const completedToday = habits.some((h) => h.completedDates.includes(today));
    const profile = this.getProfile();

    const mockOthers: LeaderboardEntry[] = [
      {
        rank: 1,
        name: 'Jasur Bek',
        username: 'jasur_flow',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        streak: 48,
        xp: 3420,
        isPro: true,
        isCurrentUser: false,
        completedToday: true,
      },
      {
        rank: 2,
        name: 'Dildora Alimova',
        username: 'dili_fit',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        streak: 32,
        xp: 2890,
        isPro: true,
        isCurrentUser: false,
        completedToday: true,
      },
      {
        rank: 3,
        name: profile.name,
        username: profile.username,
        avatar: profile.avatar,
        streak: totalCurrentStreak,
        xp: profile.xp,
        isPro: profile.isPro,
        isCurrentUser: true,
        completedToday,
      },
      {
        rank: 4,
        name: 'Sardor Rahim',
        username: 'sardor_clash',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        streak: 15,
        xp: 1340,
        isPro: false,
        isCurrentUser: false,
        completedToday: true,
      },
      {
        rank: 5,
        name: 'Malika Karimova',
        username: 'malika_k',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        streak: 14,
        xp: 1210,
        isPro: false,
        isCurrentUser: false,
        completedToday: false,
      },
      {
        rank: 6,
        name: 'Timur T.',
        username: 'tim_builder',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        streak: 9,
        xp: 880,
        isPro: false,
        isCurrentUser: false,
        completedToday: false,
      },
    ];

    return mockOthers.sort((a, b) => b.streak - a.streak).map((item, idx) => ({ ...item, rank: idx + 1 }));
  },

  // Automated Smart Insights Engine (Fast, Rule-based & Behavioral Psychology)
  getAutomatedSmartInsights(): { category: string; type: 'success' | 'warning' | 'tip' | 'duel'; title: string; text: string }[] {
    const habits = this.getHabits();
    const duels = this.getDuels();
    const today = new Date();
    const isWeekend = today.getDay() === 0 || today.getDay() === 6; // Sunday or Saturday

    const maxStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
    const topHabit = habits.find((h) => h.currentStreak === maxStreak);
    const insights: { category: string; type: 'success' | 'warning' | 'tip' | 'duel'; title: string; text: string }[] = [];

    // 1. Streak Milestone Insight
    if (topHabit && topHabit.currentStreak >= 21) {
      insights.push({
        category: 'Neyron Shakllanishi (21+ kun)',
        type: 'success',
        title: `🏆 ${topHabit.title}: Avtopilot Darajasi!`,
        text: `Siz ${topHabit.currentStreak} kundan beri ushbu odatni uzmadingiz. Neyrobiologiyaga ko'ra, 21 kundan keyin odat miyada doimiy neyron zanjiriga aylanadi. Endi buni to'xtatish — davom ettirishdan ko'ra qiyinroq!`,
      });
    } else if (topHabit && topHabit.currentStreak >= 7) {
      insights.push({
        category: 'Dofamin To\'lqini (7+ kun)',
        type: 'success',
        title: `🔥 1 Haftalik Dovon Oshildi!`,
        text: `${topHabit.title} bo'yicha 7 kunlik barqarorlikka erishdingiz. Eng qiyin sinov — dastlabki 7 kun edi, siz buni uddaladingiz!`,
      });
    } else {
      insights.push({
        category: 'Boshlang\'ich Qadam',
        type: 'tip',
        title: '🌱 2 Daqiqalik Oltin Qoida',
        text: 'Odat shakllantirishda hajm emas, uzluksizlik muhim. Agar charchagan bo\'lsangiz ham, atigi 2 daqiqa bo\'lsa ham bajaring — zanjir uzilmasin!',
      });
    }

    // 2. Weekend Risk Warning
    if (isWeekend) {
      insights.push({
        category: 'Dam Olish Kuni Xavfi',
        type: 'warning',
        title: '⚠️ Dam Olish Kuni Sindromi',
        text: 'Statistikaga ko\'ra, odamlarning 62% i shanba va yakshanba kunlari kundalik tartib buzilgani sabab zanjirini boy berishadi. Odatlaringizni ertalabki nonushtadan oldin bajarib oling!',
      });
    } else {
      insights.push({
        category: 'Vaqtni Bog\'lash (Habit Stacking)',
        type: 'tip',
        title: '⚡ Odatni Odatga Bog\'lash Usuli',
        text: 'Yangi odatni allaqachon mavjud odat ketidan bajaring. Masalan: "Ertalabki kofeni ichgach, darhol 15 sahifa kitob o\'qiyman".',
      });
    }

    // 3. Duel Status Insight
    const activeDuel = duels.find((d) => d.status === 'active');
    if (activeDuel) {
      const diff = activeDuel.rival.streak - activeDuel.challenger.streak;
      if (diff > 0) {
        insights.push({
          category: 'Duel Ogohlantirishi',
          type: 'duel',
          title: `⚔️ ${activeDuel.rival.name} sizdan ${diff} kunga oldinda!`,
          text: `Bugungi odatni belgilab, oradagi farqni kamaytiring. Mag'lubiyatga yo'l qo'ymang!`,
        });
      } else {
        insights.push({
          category: 'Duelda Yetakchisiz',
          type: 'duel',
          title: `👑 ${activeDuel.rival.name}ga qarshi ustunlik sizda!`,
          text: `Siz ${activeDuel.challenger.streak} kun bilan oldinda boryapsiz. Zanjirni boy bermang va g'alabani qo'ldan chiqarmang!`,
        });
      }
    }

    // 4. Flex Tip
    insights.push({
      category: "Ijtimoiy Mas'uliyat",
      type: 'tip',
      title: '📸 Maqtanishning Psixologik Kuchi',
      text: "Natijangizni Instagram Story yoki Telegram kanalga Flex Card qilib ulashganingizda, miyangiz jamoatchilik oldida mas'uliyat his qiladi va ertaga odatni tashlab ketishingiz ehtimoli 3 karra kamayadi!",
    });

    return insights;
  },
};
