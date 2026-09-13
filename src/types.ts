export type Difficulty = 'A1' | 'A1+' | 'A2';

export type QuestionType = 
  | 'multiple-choice' 
  | 'fill-in-blank' 
  | 'matching' 
  | 'sentence-building'
  | 'true-false'
  | 'typing';

export type Topic = 
  | 'vocabulary' 
  | 'artikel' 
  | 'grammatik' 
  | 'satzbildung' 
  | 'hören' 
  | 'lesen' 
  | 'schreiben' 
  | 'sprechen';

export interface Question {
  id: string;
  lesson: number;
  topic: Topic;
  difficulty: Difficulty;
  questionType: QuestionType;
  question: string;
  options?: string[]; // For multiple choice / matching
  correctAnswer: string | string[]; // Can be multiple valid answers for typing
  explanation: string;
  englishMeaning?: string;
  source?: string;
  audioUrl?: string; // For Hören
}

export interface VocabularyWord {
  id: string;
  lesson: number;
  german: string;
  english: string;
  article?: 'der' | 'die' | 'das';
  plural?: string;
  example: string;
  exampleEnglish: string;
}

export interface GrammarTopic {
  id: string;
  lesson: number;
  title: string;
  explanation: string;
  examples: { german: string; english: string }[];
}

export interface StudySession {
  id: string;
  date: string; // ISO string
  durationMinutes: number;
  topics: Topic[];
  questionsAnswered: number;
  correctAnswers: number;
}

export interface MockTestResult {
  id: string;
  testId: string;
  date: string;
  score: number;
  totalQuestions: number;
  timeUsedMinutes: number;
  sectionScores: Record<string, { correct: number; total: number }>;
}

export interface Mistake {
  id: string;
  questionId: string;
  questionText: string;
  topic: Topic;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  timesCorrectSinceMistake: number;
}

export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
  lastStudyDate: string | null;
  studyDates: string[]; // ISO date strings (YYYY-MM-DD)
  totalStudyTimeMinutes: number;
  dailyGoalMinutes: number;
  
  questionsAnswered: number;
  correctAnswers: number;
  
  lessonProgress: Record<number, number>; // Lesson number -> % complete
  skillProgress: Record<Topic, { answered: number; correct: number }>;
  
  vocabularyStatus: Record<string, 'new' | 'learning' | 'review' | 'mastered'>;
  
  sessions: StudySession[];
  mockTestResults: MockTestResult[];
  mistakes: Mistake[];
}
