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
  importProgress: (data: string) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...defaultProgress, ...JSON.parse(stored) };
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

  const importProgress = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      setProgress({ ...defaultProgress, ...parsed });
    } catch (e) {
      alert("Invalid backup file.");
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
      importProgress
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
