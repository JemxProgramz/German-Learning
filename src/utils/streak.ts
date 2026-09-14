import { UserProgress } from '../types';
import { getTodayDateString, daysBetween } from './srs';

export interface StreakEvaluation {
  currentStreak: number;
  longestStreak: number;
  isStudiedToday: boolean;
  streakLost: boolean;
}

/**
 * Checks if a user has completed a qualifying activity today.
 */
export function hasStudiedToday(progress: Pick<UserProgress, 'lastStudyDate' | 'studyDates'>, todayStr: string = getTodayDateString()): boolean {
  if (progress.lastStudyDate === todayStr) return true;
  if (progress.studyDates && progress.studyDates.includes(todayStr)) return true;
  return false;
}

/**
 * Evaluates streak status based on current date without necessarily incrementing it.
 * If more than 1 day has elapsed since lastStudyDate, the streak has lapsed and should reset to 0.
 */
export function evaluateStreak(
  progress: Pick<UserProgress, 'lastStudyDate' | 'currentStreak' | 'longestStreak' | 'studyDates'>,
  todayStr: string = getTodayDateString()
): StreakEvaluation {
  const lastDate = progress.lastStudyDate;
  const currentStreak = progress.currentStreak || 0;
  const longestStreak = progress.longestStreak || 0;

  if (!lastDate) {
    return {
      currentStreak: 0,
      longestStreak,
      isStudiedToday: false,
      streakLost: false
    };
  }

  const diff = daysBetween(lastDate, todayStr);

  if (diff === 0) {
    // Studied today already
    return {
      currentStreak,
      longestStreak,
      isStudiedToday: true,
      streakLost: false
    };
  } else if (diff === 1) {
    // Studied yesterday, streak is active but waiting for today's activity
    return {
      currentStreak,
      longestStreak,
      isStudiedToday: false,
      streakLost: false
    };
  } else {
    // Diff > 1: Missed at least one full day. Streak resets to 0.
    return {
      currentStreak: 0,
      longestStreak,
      isStudiedToday: false,
      streakLost: currentStreak > 0
    };
  }
}

/**
 * Records daily activity and advances the streak.
 * Must be called when user completes a qualifying activity (lesson, quiz, review).
 */
export function applyDailyActivity(
  progress: UserProgress,
  todayStr: string = getTodayDateString()
): { updated: UserProgress; isNewDayStreak: boolean } {
  const newProgress = { ...progress };
  const lastDate = newProgress.lastStudyDate;
  let isNewDayStreak = false;

  if (lastDate === todayStr) {
    // Already counted for today
    return { updated: newProgress, isNewDayStreak: false };
  }

  newProgress.totalStudyDays = (newProgress.totalStudyDays || 0) + 1;
  const currentDates = newProgress.studyDates || [];
  if (!currentDates.includes(todayStr)) {
    newProgress.studyDates = [...currentDates, todayStr];
  }

  if (!lastDate) {
    // First study session ever
    newProgress.currentStreak = 1;
    isNewDayStreak = true;
  } else {
    const diff = daysBetween(lastDate, todayStr);
    if (diff === 1) {
      // Studied yesterday -> extend streak!
      newProgress.currentStreak = (newProgress.currentStreak || 0) + 1;
      isNewDayStreak = true;
    } else {
      // Missed one or more days -> reset to 1 on today's completion
      newProgress.currentStreak = 1;
      isNewDayStreak = true;
    }
  }

  if ((newProgress.currentStreak || 0) > (newProgress.longestStreak || 0)) {
    newProgress.longestStreak = newProgress.currentStreak;
  }

  newProgress.lastStudyDate = todayStr;

  return { updated: newProgress, isNewDayStreak };
}
