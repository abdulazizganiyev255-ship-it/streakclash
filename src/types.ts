// StreakClash Domain Models

export type HabitCategory = 'fitness' | 'learning' | 'mind' | 'discipline' | 'business';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  color: string; // Neon hex code: #10b981, #8b5cf6, #06b6d4, #f59e0b, #ec4899
  icon: string; // lucide icon identifier
  createdAt: string;
  completedDates: string[]; // ['2026-10-18', '2026-10-19', ...]
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  isArchived?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isPro: boolean;
  streakFreezes: number;
  xp: number;
  level: number;
  proExpiresAt?: string;
}

export interface Duel {
  id: string;
  title: string;
  habitTitle: string;
  challenger: {
    name: string;
    avatar: string;
    streak: number;
    completedToday: boolean;
  };
  rival: {
    name: string;
    avatar: string;
    streak: number;
    completedToday: boolean;
  };
  targetDays: number;
  currentDay: number;
  status: 'active' | 'won' | 'lost';
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  username: string;
  avatar: string;
  streak: number;
  xp: number;
  isPro: boolean;
  isCurrentUser: boolean;
  completedToday: boolean;
}
