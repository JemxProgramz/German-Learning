import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Question, Topic, Difficulty } from '../types';
import { QUESTIONS, VOCABULARY } from '../data/content';
import { ORIGINAL_VOCAB_BANK, generateQuizFromVocab } from '../data/vocabBank';
import { useProgress } from '../store/ProgressContext';
import { speakGerman } from '../utils/speech';
import { 
  CheckCircle2, 
  XCircle, 
  Zap, 
  RotateCcw, 
  Volume2, 
  Flame, 
  Award, 
  Infinity as InfinityIcon, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  Heart
} from 'lucide-react';

const playChime = (type: 'success' | 'error') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch {
    // Ignore audio context errors
  }
};

interface Token {
  id: string;
  text: string;
}

export function QuizView() {
  const { 
    progress, 
    recordAnswer, 
    addMistake, 
    loseHeart, 
    addXP, 
    recordQuizResult, 
    refillHearts 
  } = useProgress();

  // Mode & configuration
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [isEndlessMode, setIsEndlessMode] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<Difficulty | 'all'>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);

  // Active quiz state
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typingAnswer, setTypingAnswer] = useState('');
  const [selectedTokens, setSelectedTokens] = useState<Token[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // Pool of all vocabulary for dynamic question synthesis
  const allVocab = useMemo(() => {
    const list = [...ORIGINAL_VOCAB_BANK, ...VOCABULARY];
    if (progress.customVocabWords) {
      list.unshift(...progress.customVocabWords);
    }
    return list;
  }, [progress.customVocabWords]);

  // Generate dynamic questions based on current config
  const buildQuizDeck = (count: number, endless: boolean): Question[] => {
    // 1. Static base questions that match criteria
    let staticPool = QUESTIONS.filter(q => {
      if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;
      if (selectedLevel !== 'all' && q.difficulty !== selectedLevel) return false;
      return true;
    });

    // 2. Synthesize dynamic vocabulary & translation questions
    const dynamicPool = generateQuizFromVocab(allVocab, endless ? 40 : count * 2, {
      topic: selectedTopic,
      level: selectedLevel
    });

    // Combine and shuffle
    const combined = [...staticPool, ...dynamicPool].sort(() => Math.random() - 0.5);
    return endless ? combined : combined.slice(0, count);
  };

  const startQuiz = (count: number, endless: boolean = false) => {
    if (progress.hearts <= 0) {
      refillHearts();
    }
    const deck = buildQuizDeck(count, endless);
    if (deck.length === 0) return;

    setCurrentQuestions(deck);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setTypingAnswer('');
    setSelectedTokens([]);
    setIsSubmitted(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setCurrentStreak(0);
    setIsEndlessMode(endless);
    setIsQuizFinished(false);
    setActiveQuiz(true);
  };

  const currentQ = currentQuestions[currentIndex];

  // Tokenize words for sentence-building questions
  const availableTokens: Token[] = useMemo(() => {
    if (!currentQ || currentQ.questionType !== 'sentence-building') return [];
    return currentQ.question
      .split('/')
      .map((w, idx) => ({ id: `token-${idx}-${w.trim()}`, text: w.trim() }));
  }, [currentQ]);

  // Clean answer checking helper
  const checkAnswer = (): boolean => {
    if (!currentQ) return false;

    if (currentQ.questionType === 'multiple-choice' || currentQ.questionType === 'true-false') {
      return selectedAnswer?.trim().toLowerCase() === (currentQ.correctAnswer as string).trim().toLowerCase();
    }

    if (currentQ.questionType === 'sentence-building') {
      const built = selectedTokens.map(t => t.text).join(' ').trim().toLowerCase();
      const target = (currentQ.correctAnswer as string).replace(/[.,!?]/g, '').trim().toLowerCase();
      const builtClean = built.replace(/[.,!?]/g, '');
      return builtClean === target;
    }

    // typing, fill-in-blank, translation
    const userVal = typingAnswer.trim().toLowerCase().replace(/[.,!?]/g, '');
    if (Array.isArray(currentQ.correctAnswer)) {
      return currentQ.correctAnswer.some(ans => ans.trim().toLowerCase().replace(/[.,!?]/g, '') === userVal);
    }
    const targetVal = currentQ.correctAnswer.trim().toLowerCase().replace(/[.,!?]/g, '');
    return userVal === targetVal;
  };

  const handleSubmit = () => {
    if (!currentQ || isSubmitted) return;

    const correct = checkAnswer();
    setIsCorrect(correct);
    setIsSubmitted(true);

    const userText = currentQ.questionType === 'multiple-choice' || currentQ.questionType === 'true-false'
      ? (selectedAnswer || '')
      : currentQ.questionType === 'sentence-building'
      ? selectedTokens.map(t => t.text).join(' ')
      : typingAnswer;

    if (correct) {
      playChime('success');
      setCorrectCount(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);
      addXP(10);
      recordAnswer(currentQ.topic, true);
    } else {
      playChime('error');
      setCurrentStreak(0);
      loseHeart();
      recordAnswer(currentQ.topic, false);
      addMistake({
        questionId: currentQ.id,
        questionText: currentQ.question,
        topic: currentQ.topic,
        userAnswer: userText || 'No answer',
        correctAnswer: Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer[0] : currentQ.correctAnswer,
        explanation: currentQ.explanation
      });
    }
  };

  const handleNext = () => {
    // If endless mode, keep generating questions if we reach near the end
    if (isEndlessMode) {
      if (progress.hearts <= 0) {
        finishQuiz();
        return;
      }
      if (currentIndex + 1 >= currentQuestions.length) {
        const more = buildQuizDeck(20, true);
        setCurrentQuestions(prev => [...prev, ...more]);
      }
      setCurrentIndex(prev => prev + 1);
      resetQuestionState();
      return;
    }

    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      finishQuiz();
    }
  };

  const resetQuestionState = () => {
    setSelectedAnswer(null);
    setTypingAnswer('');
    setSelectedTokens([]);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const finishQuiz = () => {
    const totalAnswered = currentIndex + 1;
    recordQuizResult(selectedTopic, correctCount, totalAnswered, isEndlessMode);
    setIsQuizFinished(true);
  };

  // Weakness suggestion calculation
  const weakTopics = useMemo(() => {
    const byTopic = progress.quizStats?.byTopic || {};
    const topics = Object.entries(byTopic).map(([t, stats]) => {
      const s = stats as { answered: number; correct: number };
      const accuracy = s.answered > 0 ? (s.correct / s.answered) * 100 : 100;
      return { topic: t, accuracy, answered: s.answered };
    });
    return topics.filter(t => t.accuracy < 75 && t.answered >= 3);
  }, [progress.quizStats]);

  // Finished view
  if (isQuizFinished) {
    const total = currentIndex + 1;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    return (
      <div className="max-w-md mx-auto py-12 text-center animate-in fade-in space-y-6">
        <Card className="p-8 border border-neutral-200 dark:border-neutral-800">
          <Award className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {isEndlessMode ? 'Endless Run Completed!' : 'Quiz Complete!'}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            {isEndlessMode ? `You answered ${correctCount} questions correctly!` : `You scored ${correctCount} out of ${total} (${pct}%)`}
          </p>

          <div className="grid grid-cols-2 gap-3 my-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <div className="text-xs text-neutral-500">Correct Answers</div>
              <div className="text-2xl font-bold text-emerald-600">{correctCount}</div>
            </div>
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <div className="text-xs text-neutral-500">XP Earned</div>
              <div className="text-2xl font-bold text-primary-600">+{correctCount * 10}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={() => startQuiz(questionCount, isEndlessMode)} className="w-full justify-center">
              Play Again
            </Button>
            <Button onClick={() => setActiveQuiz(false)} variant="outline" className="w-full justify-center">
              Back to Quiz Hub
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Active Quiz View
  if (activeQuiz && currentQ) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in py-4">
        {/* Top bar: progress, streak, hearts */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              {isEndlessMode ? `Question ${currentIndex + 1}` : `${currentIndex + 1} / ${currentQuestions.length}`}
            </span>
            {currentStreak > 1 && (
              <span className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full">
                <Flame className="w-3.5 h-3.5 fill-current" /> {currentStreak} streak!
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-red-500 font-bold text-sm">
              <Heart className="w-4 h-4 fill-current" />
              <span>{progress.hearts}</span>
            </div>
            <button
              onClick={() => finishQuiz()}
              className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 px-2 py-1 rounded"
            >
              Quit ✕
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {!isEndlessMode && (
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>
        )}

        {/* Question Card */}
        <Card className="p-6 md:p-8 border border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300">
              {currentQ.questionType.replace('-', ' ')}
            </span>
            <button
              onClick={() => speakGerman(currentQ.question)}
              aria-label="Listen to question"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
            {currentQ.question}
          </h2>

          {currentQ.englishMeaning && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Meaning: {currentQ.englishMeaning}
            </p>
          )}

          {/* Interactive Input by Question Type */}
          <div className="pt-2">
            {/* Multiple Choice & True/False */}
            {(currentQ.questionType === 'multiple-choice' || currentQ.questionType === 'true-false') && currentQ.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswer === option;
                  let btnClass = 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400';
                  
                  if (isSubmitted) {
                    if (option === currentQ.correctAnswer) {
                      btnClass = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                    } else if (isSelected) {
                      btnClass = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-700 dark:text-rose-300';
                    }
                  } else if (isSelected) {
                    btnClass = 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-medium';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSubmitted}
                      onClick={() => setSelectedAnswer(option)}
                      className={`p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${btnClass}`}
                    >
                      <span>{option}</span>
                      {isSubmitted && option === currentQ.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      {isSubmitted && isSelected && option !== currentQ.correctAnswer && (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Sentence Building Tokenizer */}
            {currentQ.questionType === 'sentence-building' && (
              <div className="space-y-4">
                {/* Assembled sentence area */}
                <div className="min-h-[56px] p-3 rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 flex flex-wrap gap-2 items-center">
                  {selectedTokens.length === 0 ? (
                    <span className="text-xs text-neutral-400">Click words below in the correct order...</span>
                  ) : (
                    selectedTokens.map(token => (
                      <button
                        key={token.id}
                        disabled={isSubmitted}
                        onClick={() => setSelectedTokens(prev => prev.filter(t => t.id !== token.id))}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-medium shadow-sm hover:bg-neutral-100"
                      >
                        {token.text}
                      </button>
                    ))
                  )}
                </div>

                {/* Available tokens pool */}
                <div className="flex flex-wrap gap-2">
                  {availableTokens.map(token => {
                    const isUsed = selectedTokens.some(t => t.id === token.id);
                    return (
                      <button
                        key={token.id}
                        disabled={isUsed || isSubmitted}
                        onClick={() => setSelectedTokens(prev => [...prev, token])}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          isUsed
                            ? 'opacity-30 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                            : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        {token.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Typing & Fill-in-the-blank */}
            {(currentQ.questionType === 'fill-in-blank' || currentQ.questionType === 'typing' || currentQ.questionType === 'translation-de-en' || currentQ.questionType === 'translation-en-de') && (
              <div className="space-y-2">
                <input
                  type="text"
                  disabled={isSubmitted}
                  value={typingAnswer}
                  onChange={(e) => setTypingAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isSubmitted && typingAnswer.trim()) {
                      handleSubmit();
                    }
                  }}
                  placeholder="Type your German / English answer here..."
                  className="w-full p-3.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                />
              </div>
            )}
          </div>

          {/* Explanation Banner (on submit) */}
          {isSubmitted && (
            <div className={`p-4 rounded-xl border animate-in fade-in ${
              isCorrect 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                <span>{isCorrect ? 'Richtig! (Correct!)' : 'Nicht ganz richtig (Not quite)'}</span>
              </div>
              {!isCorrect && (
                <div className="text-xs font-semibold mb-1">
                  Correct answer: {Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer[0] : currentQ.correctAnswer}
                </div>
              )}
              <p className="text-xs leading-relaxed opacity-90">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {!isSubmitted ? (
              <Button
                onClick={handleSubmit}
                disabled={
                  (currentQ.questionType === 'multiple-choice' || currentQ.questionType === 'true-false')
                    ? !selectedAnswer
                    : currentQ.questionType === 'sentence-building'
                    ? selectedTokens.length === 0
                    : !typingAnswer.trim()
                }
                className="px-6 py-2.5 justify-center shadow-sm"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="px-6 py-2.5 justify-center flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Default Hub View
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-12">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary-600" />
          Quiz & Interactive Training
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Dynamic quizzes spanning multiple question formats with instant feedback and endless mode.
        </p>
      </div>

      {/* Weakness Follow-up Suggestion Banner if applicable */}
      {weakTopics.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Targeted Practice Recommendation
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-300">
                You have an accuracy of {Math.round(weakTopics[0].accuracy)}% in {weakTopics[0].topic}. Focus here to build mastery!
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setSelectedTopic(weakTopics[0].topic);
              startQuiz(10, false);
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white flex-shrink-0"
          >
            Practice {weakTopics[0].topic}
          </Button>
        </div>
      )}

      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Targeted Quiz */}
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
              Structured Practice
            </span>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Targeted Session
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Custom-tailored 10-25 question test covering multiple-choice, fill-in-the-blank, translations, and sentence order.
            </p>

            {/* Filter controls */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-neutral-500 block mb-1">CEFR Level</label>
                <div className="flex gap-1.5">
                  {(['all', 'A1', 'A2', 'B1'] as const).map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg border ${
                        selectedLevel === lvl 
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900' 
                          : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {lvl === 'all' ? 'All' : lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-500 block mb-1">Topic</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  aria-label="Select quiz topic"
                  className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                >
                  <option value="all">Mixed (All Topics)</option>
                  <option value="vocabulary">Vocabulary & Translations</option>
                  <option value="artikel">Articles (der, die, das)</option>
                  <option value="grammatik">Grammar & Conjugation</option>
                  <option value="satzbildung">Sentence Building</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => startQuiz(10, false)} className="flex-1 justify-center">
              Start 10 Questions
            </Button>
            <Button onClick={() => startQuiz(25, false)} variant="secondary" className="flex-1 justify-center">
              Start 25 Questions
            </Button>
          </div>
        </Card>

        {/* Card 2: Endless Mode */}
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 flex items-center gap-1 w-fit">
              <InfinityIcon className="w-3.5 h-3.5" /> Endless Mode
            </span>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Unlimited Challenge
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Test your endurance! Questions will continuously generate until you run out of hearts. Compete against your personal high score.
            </p>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Endless High Score</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100 text-base">
                  {progress.quizStats?.endlessHighScore || 0} correct
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Total Quiz Answers</span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {progress.quizStats?.completed || 0}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => startQuiz(50, true)}
            className="w-full justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          >
            Launch Endless Mode
          </Button>
        </Card>
      </div>
    </div>
  );
}
