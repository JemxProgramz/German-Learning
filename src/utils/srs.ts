import { SRSItem } from '../types';
export type { SRSItem };

export interface SRSRating {
  quality: 'again' | 'hard' | 'good' | 'easy';
}

/**
 * Returns today's date formatted as YYYY-MM-DD.
 */
export function getTodayDateString(referenceDate?: Date): string {
  const date = referenceDate || new Date();
  return date.toISOString().split('T')[0];
}

/**
 * Calculates the next due date by adding days to a base date.
 */
export function addDaysToDateString(baseDateStr: string, days: number): string {
  const [year, month, day] = baseDateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Difference in calendar days between two YYYY-MM-DD date strings (dateB - dateA).
 */
export function daysBetween(dateStrA: string, dateStrB: string): number {
  const [y1, m1, d1] = dateStrA.split('-').map(Number);
  const [y2, m2, d2] = dateStrB.split('-').map(Number);
  const utcA = Date.UTC(y1, m1 - 1, d1);
  const utcB = Date.UTC(y2, m2 - 1, d2);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((utcB - utcA) / msPerDay);
}

/**
 * SM-2 inspired Spaced Repetition calculation for vocabulary and quiz items.
 *
 * @param current Current SRS item or undefined if new
 * @param quality Feedback rating: 'again' (fail), 'hard' (pass with effort), 'good' (standard pass), 'easy' (effortless)
 * @param todayStr Current date in YYYY-MM-DD
 */
export function calculateNextSRS(
  current: SRSItem | undefined,
  quality: 'again' | 'hard' | 'good' | 'easy',
  todayStr: string = getTodayDateString()
): SRSItem {
  const existing = current || {
    interval: 1,
    easeFactor: 2.5,
    dueDate: todayStr,
    consecutiveCorrect: 0,
    mistakesCount: 0,
    lastReviewed: undefined
  };

  let interval = existing.interval;
  let easeFactor = existing.easeFactor || 2.5;
  let consecutiveCorrect = existing.consecutiveCorrect || 0;
  let mistakesCount = existing.mistakesCount || 0;

  if (quality === 'again') {
    // Failure: reset repetition count, interval to 1 day, reduce ease factor
    consecutiveCorrect = 0;
    interval = 1;
    mistakesCount += 1;
    easeFactor = Math.max(1.3, Number((easeFactor - 0.2).toFixed(2)));
  } else if (quality === 'hard') {
    consecutiveCorrect += 1;
    if (consecutiveCorrect === 1) {
      interval = 1;
    } else if (consecutiveCorrect === 2) {
      interval = 2;
    } else {
      interval = Math.max(1, Math.round(interval * 1.2));
    }
    easeFactor = Math.max(1.3, Number((easeFactor - 0.15).toFixed(2)));
  } else if (quality === 'good') {
    consecutiveCorrect += 1;
    if (consecutiveCorrect === 1) {
      interval = 1;
    } else if (consecutiveCorrect === 2) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  } else {
    // Easy: bonus interval and slight increase to ease factor
    consecutiveCorrect += 1;
    if (consecutiveCorrect === 1) {
      interval = 2;
    } else if (consecutiveCorrect === 2) {
      interval = 4;
    } else {
      interval = Math.round(interval * easeFactor * 1.3);
    }
    easeFactor = Math.min(3.0, Number((easeFactor + 0.15).toFixed(2)));
  }

  const dueDate = addDaysToDateString(todayStr, interval);

  return {
    interval,
    easeFactor,
    dueDate,
    consecutiveCorrect,
    mistakesCount,
    lastReviewed: todayStr
  };
}

/**
 * Checks whether an SRS item is currently due for review.
 */
export function isItemDue(item: SRSItem | undefined, todayStr: string = getTodayDateString()): boolean {
  if (!item) return false;
  // Due if date is today or earlier, or if it had mistakes and hasn't reached mastery
  if (item.dueDate <= todayStr) return true;
  if (item.mistakesCount > 0 && item.consecutiveCorrect === 0) return true;
  return false;
}

/**
 * Sorts and prioritizes a list of items (words or questions) using Spaced Repetition:
 * 1. Due items first (most overdue / lowest consecutive score first)
 * 2. New items (never reviewed yet)
 * 3. Future review items (ordered by earliest upcoming dueDate)
 */
export function prioritizeItemsBySRS<T extends { id: string }>(
  items: T[],
  srsMap: Record<string, SRSItem> = {},
  todayStr: string = getTodayDateString()
): {
  sorted: T[];
  dueCount: number;
  newCount: number;
  learningCount: number;
} {
  const dueItems: { item: T; overdueDays: number; consecutive: number }[] = [];
  const newItems: T[] = [];
  const upcomingItems: { item: T; daysUntilDue: number }[] = [];

  for (const item of items) {
    const srs = srsMap[item.id];
    if (!srs) {
      newItems.push(item);
    } else if (isItemDue(srs, todayStr)) {
      const overdue = daysBetween(srs.dueDate, todayStr);
      dueItems.push({ item, overdueDays: overdue, consecutive: srs.consecutiveCorrect });
    } else {
      const daysUntil = daysBetween(todayStr, srs.dueDate);
      upcomingItems.push({ item, daysUntilDue: daysUntil });
    }
  }

  // Sort due items: most overdue first, then by fewest consecutive correct
  dueItems.sort((a, b) => {
    if (b.overdueDays !== a.overdueDays) return b.overdueDays - a.overdueDays;
    return a.consecutive - b.consecutive;
  });

  // Sort upcoming items by closest due date
  upcomingItems.sort((a, b) => a.daysUntilDue - b.daysUntilDue);

  const sorted = [
    ...dueItems.map(d => d.item),
    ...newItems,
    ...upcomingItems.map(u => u.item)
  ];

  return {
    sorted,
    dueCount: dueItems.length,
    newCount: newItems.length,
    learningCount: upcomingItems.length
  };
}
