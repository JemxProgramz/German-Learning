export type Difficulty = 'A1' | 'A1+' | 'A2' | 'B1';

export type QuestionType = 
  | 'multiple-choice' 
  | 'fill-in-blank' 
  | 'matching' 
  | 'sentence-building'
  | 'true-false'
  | 'typing'
  | 'translation-de-en'
  | 'translation-en-de';

export type Topic = 
  | 'vocabulary' 
  | 'artikel' 
  | 'grammatik' 
  | 'satzbildung' 
  | 'hören' 
  | 'lesen' 
  | 'schreiben' 
  | 'sprechen'
  | 'quiz';

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
  lesson?: number;
  german: string;
  english: string;
  article?: 'der' | 'die' | 'das';
  plural?: string;
  example: string;
  exampleEnglish: string;
  difficulty?: Difficulty;
  topic?: string;
  isCustom?: boolean;
}

export interface SRSItem {
  interval: number; // in days
  easeFactor: number; // e.g. 2.5
  dueDate: string; // ISO date string
  consecutiveCorrect: number;
  mistakesCount: number;
  lastReviewed?: string;
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

export interface ListeningExercise {
  id: string;
  type: 'transcription' | 'meaning' | 'dialogue-comprehension';
  level: Difficulty;
  topic: string;
  germanText: string;
  speakerRole?: string;
  question?: string;
  options?: string[];
  correctAnswer: string;
  englishTranslation: string;
  explanation: string;
}

export interface WritingPrompt {
  id: string;
  title: string;
  level: Difficulty;
  topic: string;
  prompt: string;
  promptEnglish: string;
  guidingPoints: string[];
  minWords: number;
  targetGrammar?: string;
}

export interface WritingCorrection {
  original: string;
  corrected: string;
  explanation: string;
  mistakeType: 'Noun Capitalization' | 'Word Order' | 'Verb Conjugation' | 'Case (Akk/Dat)' | 'Preposition' | 'Spelling' | 'Vocabulary';
}

export interface WritingFeedback {
  score: number; // 0 - 100
  cefrRating: Difficulty;
  summary: string;
  correctedText: string;
  corrections: WritingCorrection[];
  strengths: string[];
  mistakeCategories: string[];
}

export interface WritingSubmission {
  id: string;
  promptId: string;
  promptTitle: string;
  userText: string;
  date: string;
  feedback: WritingFeedback;
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
  vocabularySRS?: Record<string, SRSItem>;
  customVocabWords?: VocabularyWord[];
  
  sessions: StudySession[];
  mockTestResults: MockTestResult[];
  mistakes: Mistake[];
  
  // Duolingo-style additions
  xp: number;
  hearts: number;
  lastHeartRegenTime: string | null;

  // Cross-cutting modular progress
  writingSubmissions?: WritingSubmission[];
  writingMistakePatterns?: Record<string, number>;
  listeningStats?: {
    completed: number;
    correct: number;
    byType: Record<string, { answered: number; correct: number }>;
  };
  quizStats?: {
    completed: number;
    correct: number;
    endlessHighScore: number;
    byTopic: Record<string, { answered: number; correct: number }>;
  };
}

