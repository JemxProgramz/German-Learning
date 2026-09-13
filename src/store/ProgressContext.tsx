import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProgress, Mistake, StudySession, MockTestResult, Topic, VocabularyWord, WritingSubmission } from '../types';

const STORAGE_KEY = 'german_a1_progress';

const defaultProgress: UserProgress = {
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
  skillProgress: {
    vocabulary: { answered: 0, correct: 0 },
    artikel: { answered: 0, correct: 0 },
    grammatik: { answered: 0, correct: 0 },
    satzbildung: { answered: 0, correct: 0 },
    hören: { answered: 0, correct: 0 },
    lesen: { answered: 0, correct: 0 },
    schreiben: { answered: 0, correct: 0 },
    sprechen: { answered: 0, correct: 0 },
    quiz: { answered: 0, correct: 0 },
  },
  vocabularyStatus: {},
  vocabularySRS: {},
  customVocabWords: [],
  sessions: [],
  mockTestResults: [],
  mistakes: [],
  xp: 0,
  hearts: 5,
  lastHeartRegenTime: null,
  writingSubmissions: [],
  writingMistakePatterns: {},
  listeningStats: {
    completed: 0,
    correct: 0,
    byType: {}
  },
  quizStats: {
    completed: 0,
    correct: 0,
    endlessHighScore: 0,
    byTopic: {}
  }
};

interface ProgressContextType {
  progress: UserProgress;
  addStudySession: (session: Omit<StudySession, 'id' | 'date'>) => void;
  recordAnswer: (topic: Topic, isCorrect: boolean) => void;
  addMistake: (mistake: Omit<Mistake, 'id' | 'timesCorrectSinceMistake'>) => void;
  removeMistake: (questionId: string) => void;
  updateDailyGoal: (minutes: number) => void;
  addMockTestResult: (result: Omit<MockTestResult, 'id' | 'date'>) => void;
  updateVocabularyStatus: (wordId: string, status: 'new' | 'learning' | 'review' | 'mastered') => void;
  resetProgress: () => void;
  importProgress: (data: string) => boolean;
  loseHeart: () => void;
  addHeart: () => void;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: number) => void;
  refillHearts: () => void;
  addCustomVocabWords: (words: VocabularyWord[]) => void;
  recordVocabSRSReview: (wordId: string, quality: 'again' | 'hard' | 'good' | 'easy') => void;
  recordWritingSubmission: (submission: WritingSubmission) => void;
  recordQuizResult: (topic: string, correct: number, total: number, isEndless?: boolean) => void;
  recordListeningResult: (exerciseId: string, exerciseType: string, isCorrect: boolean) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: UserProgress = { ...defaultProgress, ...JSON.parse(stored) };
        // Offline heart regeneration calculation (1 heart per hour)
        if (parsed.hearts < 5 && parsed.lastHeartRegenTime) {
          const lastRegen = new Date(parsed.lastHeartRegenTime).getTime();
          const now = Date.now();
          const diffMs = Math.max(0, now - lastRegen);
          const oneHourMs = 60 * 60 * 1000;
          const heartsToAdd = Math.floor(diffMs / oneHourMs);
          if (heartsToAdd > 0) {
            parsed.hearts = Math.min(5, parsed.hearts + heartsToAdd);
            if (parsed.hearts >= 5) {
              parsed.lastHeartRegenTime = null;
            } else {
              parsed.lastHeartRegenTime = new Date(lastRegen + heartsToAdd * oneHourMs).toISOString();
            }
          }
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse stored progress', e);
        return defaultProgress;
      }
    }
    return defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Periodic check for heart regeneration every minute while app is open
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev.hearts >= 5 || !prev.lastHeartRegenTime) return prev;
        const lastRegen = new Date(prev.lastHeartRegenTime).getTime();
        const now = Date.now();
        const diffMs = Math.max(0, now - lastRegen);
        const oneHourMs = 60 * 60 * 1000;
        const heartsToAdd = Math.floor(diffMs / oneHourMs);
        if (heartsToAdd > 0) {
          const newHearts = Math.min(5, prev.hearts + heartsToAdd);
          return {
            ...prev,
            hearts: newHearts,
            lastHeartRegenTime: newHearts >= 5 ? null : new Date(lastRegen + heartsToAdd * oneHourMs).toISOString()
          };
        }
        return prev;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateStreak = (currentProgress: UserProgress, todayStr: string): UserProgress => {
    const newProgress = { ...currentProgress };
    
    if (newProgress.lastStudyDate !== todayStr) {
      newProgress.totalStudyDays += 1;
      
      if (!newProgress.studyDates.includes(todayStr)) {
        newProgress.studyDates.push(todayStr);
      }

      if (newProgress.lastStudyDate) {
        const lastDate = new Date(newProgress.lastStudyDate);
        const today = new Date(todayStr);
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
          newProgress.currentStreak += 1;
        } else if (diffDays > 1) {
          newProgress.currentStreak = 1;
        }
      } else {
        newProgress.currentStreak = 1;
      }

      if (newProgress.currentStreak > newProgress.longestStreak) {
        newProgress.longestStreak = newProgress.currentStreak;
      }
      
      newProgress.lastStudyDate = todayStr;
    }
    return newProgress;
  };

  const addStudySession = (sessionData: Omit<StudySession, 'id' | 'date'>) => {
    setProgress(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      let newProgress = updateStreak(prev, todayStr);
      
      const newSession: StudySession = {
        ...sessionData,
        id: crypto.randomUUID(),
        date: new Date().toISOString()
      };
      
      newProgress.sessions = [newSession, ...newProgress.sessions];
      newProgress.totalStudyTimeMinutes += sessionData.durationMinutes;
      
      return newProgress;
    });
  };

  const recordAnswer = (topic: Topic, isCorrect: boolean) => {
    setProgress(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      let newProgress = updateStreak(prev, todayStr);

      newProgress.questionsAnswered += 1;
      if (isCorrect) newProgress.correctAnswers += 1;

      if (!newProgress.skillProgress[topic]) {
        newProgress.skillProgress[topic] = { answered: 0, correct: 0 };
      }
      
      newProgress.skillProgress[topic].answered += 1;
      if (isCorrect) {
        newProgress.skillProgress[topic].correct += 1;
      }

      return newProgress;
    });
  };

  const addMistake = (mistakeData: Omit<Mistake, 'id' | 'timesCorrectSinceMistake'>) => {
    setProgress(prev => {
      const existingIdx = prev.mistakes.findIndex(m => m.questionId === mistakeData.questionId);
      if (existingIdx >= 0) {
        const newMistakes = [...prev.mistakes];
        newMistakes[existingIdx].timesCorrectSinceMistake = 0;
        return { ...prev, mistakes: newMistakes };
      }
      
      const newMistake: Mistake = {
        ...mistakeData,
        id: crypto.randomUUID(),
        timesCorrectSinceMistake: 0
      };
      return { ...prev, mistakes: [newMistake, ...prev.mistakes] };
    });
  };

  const removeMistake = (questionId: string) => {
    setProgress(prev => ({
      ...prev,
      mistakes: prev.mistakes.filter(m => m.questionId !== questionId)
    }));
  };

  const updateDailyGoal = (minutes: number) => {
    setProgress(prev => ({ ...prev, dailyGoalMinutes: minutes }));
  };

  const addMockTestResult = (resultData: Omit<MockTestResult, 'id' | 'date'>) => {
    setProgress(prev => {
      const newResult: MockTestResult = {
        ...resultData,
        id: crypto.randomUUID(),
        date: new Date().toISOString()
      };
      return { ...prev, mockTestResults: [newResult, ...prev.mockTestResults] };
    });
  };

  const updateVocabularyStatus = (wordId: string, status: 'new' | 'learning' | 'review' | 'mastered') => {
    setProgress(prev => ({
      ...prev,
      vocabularyStatus: { ...prev.vocabularyStatus, [wordId]: status }
    }));
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY);
  };


  const loseHeart = () => {
    setProgress(prev => {
      if (prev.hearts <= 0) return prev;
      const newHearts = prev.hearts - 1;
      return {
        ...prev,
        hearts: newHearts,
        lastHeartRegenTime: newHearts < 5 && !prev.lastHeartRegenTime ? new Date().toISOString() : prev.lastHeartRegenTime
      };
    });
  };

  const addXP = (amount: number) => {
    setProgress(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      let newProgress = updateStreak(prev, todayStr);
      newProgress.xp = (newProgress.xp || 0) + amount;
      return newProgress;
    });
  };

  const completeLesson = (lessonId: number) => {
    setProgress(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      let newProgress = updateStreak(prev, todayStr);
      newProgress.lessonProgress = {
        ...newProgress.lessonProgress,
        [lessonId]: 100
      };
      return newProgress;
    });
  };

  const addHeart = () => {
    setProgress(prev => {
      if (prev.hearts >= 5) return prev;
      const newHearts = Math.min(5, prev.hearts + 1);
      return {
        ...prev,
        hearts: newHearts,
        lastHeartRegenTime: newHearts >= 5 ? null : prev.lastHeartRegenTime
      };
    });
  };

  const refillHearts = () => {
    setProgress(prev => ({
      ...prev,
      hearts: 5,
      lastHeartRegenTime: null
    }));
  };

  const addCustomVocabWords = (newWords: VocabularyWord[]) => {
    setProgress(prev => {
      const existing = prev.customVocabWords || [];
      const existingIds = new Set(existing.map(w => w.id));
      const filtered = newWords.filter(w => !existingIds.has(w.id));
      return {
        ...prev,
        customVocabWords: [...filtered, ...existing]
      };
    });
  };

  const recordVocabSRSReview = (wordId: string, quality: 'again' | 'hard' | 'good' | 'easy') => {
    setProgress(prev => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const srsMap = prev.vocabularySRS ? { ...prev.vocabularySRS } : {};
      const current = srsMap[wordId] || {
        interval: 1,
        easeFactor: 2.5,
        dueDate: todayStr,
        consecutiveCorrect: 0,
        mistakesCount: 0
      };

      let interval = current.interval;
      let easeFactor = current.easeFactor;
      let consecutiveCorrect = current.consecutiveCorrect;
      let mistakesCount = current.mistakesCount;

      if (quality === 'again') {
        consecutiveCorrect = 0;
        interval = 1;
        mistakesCount += 1;
        easeFactor = Math.max(1.3, easeFactor - 0.2);
      } else if (quality === 'hard') {
        consecutiveCorrect += 1;
        interval = Math.max(1, Math.round(interval * 1.2));
        easeFactor = Math.max(1.3, easeFactor - 0.15);
      } else if (quality === 'good') {
        consecutiveCorrect += 1;
        interval = consecutiveCorrect === 1 ? 1 : consecutiveCorrect === 2 ? 3 : Math.round(interval * easeFactor);
      } else { // easy
        consecutiveCorrect += 1;
        interval = consecutiveCorrect === 1 ? 2 : consecutiveCorrect === 2 ? 4 : Math.round(interval * easeFactor * 1.3);
        easeFactor = Math.min(3.0, easeFactor + 0.15);
      }

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + interval);
      const dueDate = nextDate.toISOString().split('T')[0];

      srsMap[wordId] = {
        interval,
        easeFactor,
        dueDate,
        consecutiveCorrect,
        mistakesCount,
        lastReviewed: todayStr
      };

      // Also update vocabularyStatus
      const newStatus = { ...prev.vocabularyStatus };
      if (quality === 'again') {
        newStatus[wordId] = 'learning';
      } else if (consecutiveCorrect >= 4) {
        newStatus[wordId] = 'mastered';
      } else {
        newStatus[wordId] = 'review';
      }

      let updated = updateStreak(prev, todayStr);
      return {
        ...updated,
        vocabularySRS: srsMap,
        vocabularyStatus: newStatus
      };
    });
  };

  const recordWritingSubmission = (submission: WritingSubmission) => {
    setProgress(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      const patterns = { ...(prev.writingMistakePatterns || {}) };
      submission.feedback.mistakeCategories.forEach(cat => {
        patterns[cat] = (patterns[cat] || 0) + 1;
      });

      let updated = updateStreak(prev, todayStr);
      return {
        ...updated,
        writingSubmissions: [submission, ...(prev.writingSubmissions || [])],
        writingMistakePatterns: patterns
      };
    });
  };

  const recordQuizResult = (topic: string, correct: number, total: number, isEndless: boolean = false) => {
    setProgress(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      const currentStats = prev.quizStats || { completed: 0, correct: 0, endlessHighScore: 0, byTopic: {} };
      const byTopic = { ...currentStats.byTopic };
      const currentTopic = byTopic[topic] || { answered: 0, correct: 0 };
      byTopic[topic] = {
        answered: currentTopic.answered + total,
        correct: currentTopic.correct + correct
      };

      const endlessHighScore = isEndless ? Math.max(currentStats.endlessHighScore || 0, correct) : (currentStats.endlessHighScore || 0);

      let updated = updateStreak(prev, todayStr);
      return {
        ...updated,
        quizStats: {
          completed: currentStats.completed + total,
          correct: currentStats.correct + correct,
          endlessHighScore,
          byTopic
        }
      };
    });
  };

  const recordListeningResult = (exerciseId: string, exerciseType: string, isCorrect: boolean) => {
    setProgress(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      const currentStats = prev.listeningStats || { completed: 0, correct: 0, byType: {} };
      const byType = { ...currentStats.byType };
      const typeData = byType[exerciseType] || { answered: 0, correct: 0 };
      byType[exerciseType] = {
        answered: typeData.answered + 1,
        correct: typeData.correct + (isCorrect ? 1 : 0)
      };

      let updated = updateStreak(prev, todayStr);
      return {
        ...updated,
        listeningStats: {
          completed: currentStats.completed + 1,
          correct: currentStats.correct + (isCorrect ? 1 : 0),
          byType
        }
      };
    });
  };

  const importProgress = (data: string): boolean => {
    try {
      const parsed = JSON.parse(data);
      if (!parsed || typeof parsed !== 'object') return false;
      setProgress({ ...defaultProgress, ...parsed });
      return true;
    } catch (e) {
      console.error("Invalid backup file", e);
      return false;
    }
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      addStudySession,
      recordAnswer,
      addMistake,
      removeMistake,
      updateDailyGoal,
      addMockTestResult,
      updateVocabularyStatus,
      resetProgress,
      importProgress,
      loseHeart,
      addHeart,
      addXP,
      completeLesson,
      refillHearts,
      addCustomVocabWords,
      recordVocabSRSReview,
      recordWritingSubmission,
      recordQuizResult,
      recordListeningResult
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
};
