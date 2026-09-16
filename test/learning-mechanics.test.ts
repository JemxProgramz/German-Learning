import test from 'node:test';
import assert from 'node:assert';
import { calculateNextSRS, isItemDue, prioritizeItemsBySRS } from '../src/utils/srs';
import { evaluateStreak, applyDailyActivity, hasStudiedToday } from '../src/utils/streak';
import { isUnitUnlocked, isLessonUnlocked, getUnitProgress, CURRICULUM_UNITS } from '../src/utils/units';
import { UserProgress } from '../src/types';
import { KURSBUCH_VOCABULARY } from '../src/data/kursbuchVocabulary';

test('SRS: Initial correct review sets 1-day interval and default ease factor', () => {
  const result = calculateNextSRS(undefined, 'good', '2026-09-14');
  assert.strictEqual(result.consecutiveCorrect, 1);
  assert.strictEqual(result.interval, 1);
  assert.strictEqual(result.dueDate, '2026-09-15');
  assert.strictEqual(result.easeFactor, 2.5);
  assert.strictEqual(result.mistakesCount, 0);
});

test('SRS: Second consecutive correct review advances interval to 3 days', () => {
  const first = calculateNextSRS(undefined, 'good', '2026-09-14');
  const second = calculateNextSRS(first, 'good', '2026-09-15');
  assert.strictEqual(second.consecutiveCorrect, 2);
  assert.strictEqual(second.interval, 3);
  assert.strictEqual(second.dueDate, '2026-09-18');
});

test('SRS: Third consecutive correct review multiplies by ease factor', () => {
  const first = calculateNextSRS(undefined, 'good', '2026-09-14');
  const second = calculateNextSRS(first, 'good', '2026-09-15');
  const third = calculateNextSRS(second, 'good', '2026-09-18');
  assert.strictEqual(third.consecutiveCorrect, 3);
  // interval = Math.round(3 * 2.5) = 8
  assert.strictEqual(third.interval, 8);
  assert.strictEqual(third.dueDate, '2026-09-26');
});

test('SRS: Failed review ("again") resets interval and consecutive correct, and lowers ease factor', () => {
  const first = calculateNextSRS(undefined, 'good', '2026-09-14');
  const second = calculateNextSRS(first, 'good', '2026-09-15');
  const failed = calculateNextSRS(second, 'again', '2026-09-18');
  assert.strictEqual(failed.consecutiveCorrect, 0);
  assert.strictEqual(failed.interval, 1);
  assert.strictEqual(failed.dueDate, '2026-09-19');
  assert.strictEqual(failed.mistakesCount, 1);
  assert.strictEqual(failed.easeFactor, 2.3);
});

test('SRS: isItemDue returns true for today and overdue dates', () => {
  const itemDueToday = {
    interval: 1,
    easeFactor: 2.5,
    dueDate: '2026-09-14',
    consecutiveCorrect: 1,
    mistakesCount: 0
  };
  const itemOverdue = {
    interval: 1,
    easeFactor: 2.5,
    dueDate: '2026-09-12',
    consecutiveCorrect: 1,
    mistakesCount: 0
  };
  const itemFuture = {
    interval: 3,
    easeFactor: 2.5,
    dueDate: '2026-09-17',
    consecutiveCorrect: 2,
    mistakesCount: 0
  };

  assert.strictEqual(isItemDue(itemDueToday, '2026-09-14'), true);
  assert.strictEqual(isItemDue(itemOverdue, '2026-09-14'), true);
  assert.strictEqual(isItemDue(itemFuture, '2026-09-14'), false);
});

test('SRS: prioritizeItemsBySRS surfaces due items first, then new items, then upcoming', () => {
  const items = [
    { id: 'word-future' },
    { id: 'word-new' },
    { id: 'word-overdue' },
    { id: 'word-due-today' }
  ];

  const srsMap = {
    'word-future': {
      interval: 4,
      easeFactor: 2.5,
      dueDate: '2026-09-20',
      consecutiveCorrect: 2,
      mistakesCount: 0
    },
    'word-overdue': {
      interval: 1,
      easeFactor: 2.5,
      dueDate: '2026-09-10', // 4 days overdue
      consecutiveCorrect: 1,
      mistakesCount: 0
    },
    'word-due-today': {
      interval: 1,
      easeFactor: 2.5,
      dueDate: '2026-09-14', // due today
      consecutiveCorrect: 1,
      mistakesCount: 0
    }
  };

  const prioritized = prioritizeItemsBySRS(items, srsMap, '2026-09-14');
  assert.strictEqual(prioritized.dueCount, 2);
  assert.strictEqual(prioritized.newCount, 1);
  assert.strictEqual(prioritized.learningCount, 1);
  assert.strictEqual(prioritized.sorted[0].id, 'word-overdue');
  assert.strictEqual(prioritized.sorted[1].id, 'word-due-today');
  assert.strictEqual(prioritized.sorted[2].id, 'word-new');
  assert.strictEqual(prioritized.sorted[3].id, 'word-future');
});

test('Streak: First study activity starts streak at 1', () => {
  const baseProgress: UserProgress = {
    currentStreak: 0,
    longestStreak: 0,
    totalStudyDays: 0,
    lastStudyDate: null,
    studyDates: [],
    totalStudyTimeMinutes: 0,
    dailyGoalMinutes: 30,
    questionsAnswered: 0,
    correctAnswers: 0,
    lessonProgress: {},
    skillProgress: {} as any,
    vocabularyStatus: {},
    sessions: [],
    mockTestResults: [],
    mistakes: [],
    xp: 0,
    hearts: 5,
    lastHeartRegenTime: null
  };

  const { updated } = applyDailyActivity(baseProgress, '2026-09-14');
  assert.strictEqual(updated.currentStreak, 1);
  assert.strictEqual(updated.longestStreak, 1);
  assert.strictEqual(updated.lastStudyDate, '2026-09-14');
  assert.strictEqual(hasStudiedToday(updated, '2026-09-14'), true);
});

test('Streak: Studying on consecutive day increments streak', () => {
  const day1Progress: UserProgress = {
    currentStreak: 1,
    longestStreak: 1,
    totalStudyDays: 1,
    lastStudyDate: '2026-09-13',
    studyDates: ['2026-09-13'],
    totalStudyTimeMinutes: 10,
    dailyGoalMinutes: 30,
    questionsAnswered: 5,
    correctAnswers: 5,
    lessonProgress: {},
    skillProgress: {} as any,
    vocabularyStatus: {},
    sessions: [],
    mockTestResults: [],
    mistakes: [],
    xp: 20,
    hearts: 5,
    lastHeartRegenTime: null
  };

  const { updated } = applyDailyActivity(day1Progress, '2026-09-14');
  assert.strictEqual(updated.currentStreak, 2);
  assert.strictEqual(updated.longestStreak, 2);
  assert.strictEqual(updated.lastStudyDate, '2026-09-14');
});

test('Streak: Multiple study sessions on the same day do not double-increment streak', () => {
  const studiedToday: UserProgress = {
    currentStreak: 3,
    longestStreak: 5,
    totalStudyDays: 10,
    lastStudyDate: '2026-09-14',
    studyDates: ['2026-09-14'],
    totalStudyTimeMinutes: 15,
    dailyGoalMinutes: 30,
    questionsAnswered: 10,
    correctAnswers: 8,
    lessonProgress: {},
    skillProgress: {} as any,
    vocabularyStatus: {},
    sessions: [],
    mockTestResults: [],
    mistakes: [],
    xp: 50,
    hearts: 5,
    lastHeartRegenTime: null
  };

  const { updated, isNewDayStreak } = applyDailyActivity(studiedToday, '2026-09-14');
  assert.strictEqual(isNewDayStreak, false);
  assert.strictEqual(updated.currentStreak, 3);
  assert.strictEqual(updated.longestStreak, 5);
});

test('Streak: Missing a day resets streak to 0 in evaluation and 1 on next study', () => {
  const progressFromTwoDaysAgo: UserProgress = {
    currentStreak: 4,
    longestStreak: 7,
    totalStudyDays: 10,
    lastStudyDate: '2026-09-12', // missed Sep 13!
    studyDates: ['2026-09-12'],
    totalStudyTimeMinutes: 30,
    dailyGoalMinutes: 30,
    questionsAnswered: 20,
    correctAnswers: 18,
    lessonProgress: {},
    skillProgress: {} as any,
    vocabularyStatus: {},
    sessions: [],
    mockTestResults: [],
    mistakes: [],
    xp: 100,
    hearts: 5,
    lastHeartRegenTime: null
  };

  // Evaluation before studying on Sep 14:
  const evalStatus = evaluateStreak(progressFromTwoDaysAgo, '2026-09-14');
  assert.strictEqual(evalStatus.currentStreak, 0);
  assert.strictEqual(evalStatus.longestStreak, 7);
  assert.strictEqual(evalStatus.streakLost, true);
  assert.strictEqual(evalStatus.isStudiedToday, false);

  // Now user completes a study session today on Sep 14:
  const { updated } = applyDailyActivity(progressFromTwoDaysAgo, '2026-09-14');
  assert.strictEqual(updated.currentStreak, 1);
  assert.strictEqual(updated.longestStreak, 7); // longest streak is preserved!
});

test('Units: Unit 1 is unlocked by default, Unit 2 is locked until Unit 1 is completed', () => {
  assert.strictEqual(isUnitUnlocked(1, {}), true);
  assert.strictEqual(isUnitUnlocked(2, {}), false);

  // Complete all 5 lessons of Unit 1
  const completedUnit1 = {
    1: 100,
    2: 100,
    3: 100,
    4: 100,
    5: 100
  };
  assert.strictEqual(isUnitUnlocked(2, completedUnit1), true);
  assert.strictEqual(isUnitUnlocked(3, completedUnit1), false);
});

test('Units: Lessons unlock sequentially within unlocked unit', () => {
  // Lesson 1 is unlocked
  assert.strictEqual(isLessonUnlocked(1, {}), true);
  // Lesson 2 is locked because Lesson 1 is 0%
  assert.strictEqual(isLessonUnlocked(2, {}), false);

  // When Lesson 1 is 100%, Lesson 2 unlocks
  assert.strictEqual(isLessonUnlocked(2, { 1: 100 }), true);
  assert.strictEqual(isLessonUnlocked(3, { 1: 100 }), false);
});

test('Units: getUnitProgress calculates completion percentage accurately', () => {
  const unit1 = CURRICULUM_UNITS[0];
  const progressPartial = { 1: 100, 2: 100 };
  const res = getUnitProgress(unit1, progressPartial);
  assert.strictEqual(res.completedCount, 2);
  assert.strictEqual(res.totalCount, 5);
  assert.strictEqual(res.percentage, 40);
  assert.strictEqual(res.isCompleted, false);
});

test('Kursbuch vocabulary covers lessons 1-8 and every requested word type', () => {
  assert.deepStrictEqual(new Set(KURSBUCH_VOCABULARY.map(word => word.lesson)), new Set([1, 2, 3, 4, 5, 6, 7, 8]));
  assert.deepStrictEqual(new Set(KURSBUCH_VOCABULARY.map(word => word.wordType)), new Set(['noun', 'verb', 'adjective', 'other', 'expression']));
});
