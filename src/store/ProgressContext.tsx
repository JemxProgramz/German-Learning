import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProgress, Mistake, StudySession, MockTestResult, Topic } from '../types';

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
  },
  vocabularyStatus: {},
  sessions: [],
  mockTestResults: [],
  mistakes: [],
  xp: 0,
  hearts: 5,
  lastHeartRegenTime: null,
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
      refillHearts
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
