import React, { useState, useMemo } from 'react';
import { Question, Topic } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useProgress } from '../store/ProgressContext';
import { Play, RotateCcw, Heart, Zap, Volume2, CheckCircle2, Award, ArrowRight } from 'lucide-react';

interface QuizEngineProps {
  questions: Question[];
  topic: Topic;
  title: string;
  description: string;
  onFinish?: () => void;
}

const playSound = (type: 'success' | 'error') => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.22);
      gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {
    // Ignore audio context errors in restricted environments
  }
};

const speakGerman = (text: string) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

interface Token {
  id: string;
  text: string;
}

export function QuizEngine({ questions, topic, title, description, onFinish }: QuizEngineProps) {
  const [active, setActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<Token[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [shake, setShake] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [lastXpGained, setLastXpGained] = useState(0);

  const { progress, recordAnswer, addMistake, addStudySession, loseHeart, addHeart, refillHearts, addXP, completeLesson } = useProgress();

  const currentQuestion: Question | undefined = questions[currentIndex];

  // Tokenize words for sentence building questions
  const availableWordTokens: Token[] = useMemo(() => {
    if (!currentQuestion || currentQuestion.questionType !== 'sentence-building') return [];
    return currentQuestion.question
      .split('/')
      .map((w, idx) => ({ id: `token-${idx}-${w.trim()}`, text: w.trim() }));
  }, [currentQuestion]);

  const startQuiz = () => {
    setActive(true);
    setIsFinished(false);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setSelectedTokens([]);
    setIsSubmitted(false);
    setSessionScore({ correct: 0, total: 0 });
    setSessionStartTime(Date.now());
  };

  const submitAnswer = () => {
    if (!currentQuestion) return;

    const finalAnswer = currentQuestion.questionType === 'sentence-building'
      ? selectedTokens.map(t => t.text).join(' ').trim()
      : (selectedAnswer?.trim() || '');

    if (!finalAnswer) return;

    const normalize = (s: string) => s.toLowerCase().replace(/[.,!?'" ]/g, '');
    const isCorrect = currentQuestion.questionType === 'sentence-building'
      ? Array.isArray(currentQuestion.correctAnswer)
        ? currentQuestion.correctAnswer.some(ans => normalize(ans) === normalize(finalAnswer))
        : normalize(currentQuestion.correctAnswer) === normalize(finalAnswer)
      : Array.isArray(currentQuestion.correctAnswer)
        ? currentQuestion.correctAnswer.includes(finalAnswer)
        : currentQuestion.correctAnswer === finalAnswer;

    setIsSubmitted(true);
    recordAnswer(topic, isCorrect);

    setSessionScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (!isCorrect) {
      playSound('error');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      loseHeart();

      addMistake({
        questionId: currentQuestion.id,
        questionText: currentQuestion.question,
        topic,
        userAnswer: finalAnswer,
        correctAnswer: Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer[0] : currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation
      });
    } else {
      playSound('success');
    }
  };

  const handleFinish = (finalCorrect: number, finalTotal: number) => {
    const durationMinutes = Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000));
    const xpGained = finalCorrect * 10;
    setLastXpGained(xpGained);
    
    if (xpGained > 0) {
      addXP(xpGained);
    }

    if (questions.length > 0 && finalCorrect / questions.length >= 0.7) {
      completeLesson(questions[0].lesson);
    }

    addStudySession({
      durationMinutes,
      topics: [topic],
      questionsAnswered: finalTotal,
      correctAnswers: finalCorrect
    });

    setIsFinished(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setSelectedTokens([]);
      setIsSubmitted(false);
    } else {
      handleFinish(sessionScore.correct, sessionScore.total);
    }
  };

  // 1. Out of Hearts View
  if (active && progress.hearts <= 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 mt-8 animate-in fade-in">
        <Card className="p-8 md:p-12 text-center shadow-sm border-neutral-200/60 dark:border-neutral-800/80">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-red-500 fill-red-500 opacity-60" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">Out of Hearts!</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto">
            You need hearts to continue this lesson. Hearts regenerate automatically every hour, or you can refill them now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button 
              onClick={() => addHeart()} 
              size="lg" 
              className="gap-2 justify-center shadow-sm"
            >
              <Heart size={18} className="fill-current text-white" /> +1 Heart (Practice)
            </Button>
            <Button 
              onClick={() => refillHearts()} 
              variant="outline" 
              size="lg" 
              className="gap-2 justify-center"
            >
              Refill All Hearts
            </Button>
          </div>
          <div className="mt-6">
            <Button onClick={() => setActive(false)} variant="ghost" size="sm">
              Back to Overview
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 2. Quiz Finished Celebration Results View
  if (isFinished) {
    const accuracy = sessionScore.total > 0 ? Math.round((sessionScore.correct / sessionScore.total) * 100) : 0;
    const passed = sessionScore.total > 0 && accuracy >= 70;

    return (
      <div className="space-y-6 animate-in fade-in max-w-2xl mx-auto mt-4 md:mt-8">
        <Card className="p-8 md:p-12 text-center shadow-lg border-neutral-200/60 dark:border-neutral-800/80">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'}`}>
            {passed ? <Award size={44} /> : <CheckCircle2 size={44} />}
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">
            {passed ? 'Lesson Mastered!' : 'Practice Complete!'}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-8">
            {passed 
              ? `Great job! You passed with ${accuracy}% accuracy.` 
              : `You completed all questions with ${accuracy}% accuracy. Review mistakes to improve.`}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700/50">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Score</div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {sessionScore.correct} / {sessionScore.total}
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700/50">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">XP Earned</div>
              <div className="text-2xl font-bold text-yellow-500 flex items-center justify-center gap-1">
                <Zap size={20} className="fill-current" /> +{lastXpGained}
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700/50">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Hearts Left</div>
              <div className="text-2xl font-bold text-red-500 flex items-center justify-center gap-1">
                <Heart size={20} className="fill-current" /> {progress.hearts}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={startQuiz} 
              variant="outline" 
              size="lg" 
              className="gap-2 justify-center shadow-sm"
            >
              <RotateCcw size={18} /> Practice Again
            </Button>
            <Button 
              onClick={() => {
                setActive(false);
                setIsFinished(false);
                if (onFinish) onFinish();
              }} 
              size="lg" 
              className="gap-2 justify-center shadow-sm"
            >
              Continue <ArrowRight size={18} />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 3. Initial Ready Screen
  if (!active) {
    return (
      <div className="space-y-8 animate-in fade-in max-w-2xl mx-auto mt-4 md:mt-8">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-3 text-neutral-900 dark:text-neutral-100">{title}</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">{description}</p>
        </header>
        
        {sessionScore.total > 0 && (
          <Card className="bg-neutral-900 dark:bg-neutral-800 text-white border-none p-6 text-center shadow-lg">
            <h2 className="font-semibold text-xs uppercase tracking-wider mb-2 text-neutral-400">Previous Session Result</h2>
            <div className="text-4xl font-bold mb-3 tracking-tight">
              {sessionScore.correct} <span className="opacity-50 mx-1">/</span> {sessionScore.total} 
              <span className="text-xl font-normal text-neutral-400 ml-3">
                ({Math.round((sessionScore.correct / sessionScore.total) * 100)}%)
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full font-bold text-yellow-400 text-sm">
              <Zap size={16} className="fill-current" /> +{sessionScore.correct * 10} XP Earned
            </div>
          </Card>
        )}

        <Card className="max-w-md mx-auto text-center py-14 px-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-6">
            <Play size={24} className="ml-1" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">Ready to practice?</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">
            {questions.length > 0 ? `${questions.length} questions ready for practice.` : 'No questions currently available.'}
          </p>
          <Button 
            onClick={startQuiz} 
            disabled={questions.length === 0}
            size="lg" 
            className="w-full justify-center text-lg h-14"
          >
            Start Practice
          </Button>
        </Card>
      </div>
    );
  }

  // 4. Active Question View
  if (!currentQuestion) {
    return null;
  }

  const currentProgress = ((currentIndex) / questions.length) * 100;
  const unselectedTokens = availableWordTokens.filter(t => !selectedTokens.some(st => st.id === t.id));

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in mt-4 md:mt-8">
      {/* Top Status Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4 flex-1">
          <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="w-full max-w-[200px] bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
            <div className="bg-primary-500 h-full transition-all duration-300" style={{ width: `${currentProgress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-red-500 font-bold text-sm">
            <Heart size={18} className="fill-current" /> {progress.hearts}
          </div>
          <button 
            onClick={() => setActive(false)} 
            className="text-sm font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors ml-3 cursor-pointer"
          >
            Quit ✕
          </button>
        </div>
      </div>

      <Card 
        className={`p-6 md:p-10 shadow-sm border-neutral-200/60 dark:border-neutral-800/80 transition-transform ${shake ? 'shadow-red-500/20 shadow-xl' : ''}`} 
        style={{ animation: shake ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none' }}
      >
        {/* Audio / Listen Bar */}
        {(currentQuestion.audioUrl || currentQuestion.topic === 'hören') && (
          <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl flex items-center justify-between gap-4 border border-neutral-100 dark:border-neutral-700/50">
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                onClick={() => speakGerman(currentQuestion.question)}
                className="rounded-full w-12 h-12 p-0 flex items-center justify-center shrink-0 shadow-sm bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                aria-label="Listen to question"
              >
                <Volume2 size={20} className="text-primary-600 dark:text-primary-400" />
              </Button>
              <div className="text-sm text-neutral-600 dark:text-neutral-300 font-medium">
                Audio Prompt · Click to hear German speech
              </div>
            </div>
            <span className="text-xs text-neutral-400 font-medium font-mono">de-DE</span>
          </div>
        )}

        <div className="flex items-start justify-between gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
            {currentQuestion.question}
          </h2>
          <button 
            onClick={() => speakGerman(currentQuestion.question)}
            className="text-neutral-400 hover:text-primary-600 p-2 rounded-lg transition-colors shrink-0"
            title="Pronounce phrase"
          >
            <Volume2 size={20} />
          </button>
        </div>

        {/* Question Input / Choices */}
        <div className="space-y-3 mb-8">
          {currentQuestion.questionType === 'multiple-choice' || currentQuestion.questionType === 'true-false' ? (
            currentQuestion.options?.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              let btnClass = isSelected 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100 ring-1 ring-primary-500' 
                : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100';
              
              if (isSubmitted) {
                const isCorrectOption = Array.isArray(currentQuestion.correctAnswer) 
                  ? currentQuestion.correctAnswer.includes(option) 
                  : currentQuestion.correctAnswer === option;
                if (isCorrectOption) {
                  btnClass = 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 ring-1 ring-green-500';
                } else if (isSelected && !isCorrectOption) {
                  btnClass = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 ring-1 ring-red-500';
                } else {
                  btnClass = 'border-neutral-200 dark:border-neutral-800 opacity-40 text-neutral-900 dark:text-neutral-100';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl border-2 transition-all font-medium text-lg cursor-pointer ${btnClass}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected && !isSubmitted 
                      ? 'border-primary-500 bg-primary-500' 
                      : isSubmitted 
                        ? (Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.includes(option) : currentQuestion.correctAnswer === option) 
                          ? 'border-green-500 bg-green-500' 
                          : isSelected 
                            ? 'border-red-500 bg-red-500' 
                            : 'border-neutral-300 dark:border-neutral-600' 
                        : 'border-neutral-300 dark:border-neutral-600'
                  }`}>
                    {isSelected && !isSubmitted && <div className="w-2 h-2 rounded-full bg-white"/>}
                    {isSubmitted && (Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.includes(option) : currentQuestion.correctAnswer === option) && <div className="w-2 h-2 rounded-full bg-white"/>}
                    {isSubmitted && isSelected && !(Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.includes(option) : currentQuestion.correctAnswer === option) && <div className="w-2 h-0.5 rounded-full bg-white"/>}
                  </div>
                  <span>{option}</span>
                </button>
              );
            })

          ) : currentQuestion.questionType === 'sentence-building' ? (
            <div className="space-y-6">
              {/* Build Sentence Drop / Tap Zone */}
              <div className="min-h-[70px] p-4 flex flex-wrap gap-2 border-2 border-neutral-200 dark:border-neutral-700 items-center bg-neutral-50/70 dark:bg-neutral-900/50 rounded-xl">
                {selectedTokens.length === 0 && (
                  <span className="text-neutral-400 dark:text-neutral-500 font-medium select-none">
                    Tap the words below to build the German sentence...
                  </span>
                )}
                {selectedTokens.map((token, idx) => (
                  <button
                    key={token.id}
                    disabled={isSubmitted}
                    onClick={() => {
                      setSelectedTokens(prev => prev.filter((_, i) => i !== idx));
                    }}
                    className="px-4 py-2.5 bg-white dark:bg-neutral-800 border-2 border-primary-400 dark:border-primary-600 rounded-xl font-semibold shadow-sm hover:bg-neutral-50 active:scale-95 transition-all text-neutral-900 dark:text-neutral-100 cursor-pointer"
                  >
                    {token.text}
                  </button>
                ))}
              </div>
              
              {/* Word Bank */}
              <div>
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-1">
                  Word Bank
                </div>
                <div className="flex flex-wrap gap-2.5 p-2 bg-neutral-100/60 dark:bg-neutral-800/40 rounded-xl">
                  {unselectedTokens.map((token) => (
                    <button
                      key={token.id}
                      disabled={isSubmitted}
                      onClick={() => {
                        setSelectedTokens(prev => [...prev, token]);
                      }}
                      className="px-4 py-2.5 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl font-semibold shadow-sm hover:border-primary-400 hover:text-primary-600 active:scale-95 transition-all text-neutral-800 dark:text-neutral-200 cursor-pointer"
                    >
                      {token.text}
                    </button>
                  ))}
                  {unselectedTokens.length === 0 && (
                    <span className="text-xs text-neutral-400 italic py-2 px-1">All words placed.</span>
                  )}
                </div>
              </div>

              {/* Solution Feedback for Sentence Building */}
              {isSubmitted && (
                <div className={`p-4 rounded-xl font-medium border-2 ${
                  (() => {
                    const finalAnswer = selectedTokens.map(t => t.text).join(' ').trim();
                    const normalize = (s: string) => s.toLowerCase().replace(/[.,!?'" ]/g, '');
                    const isCorrect = Array.isArray(currentQuestion.correctAnswer)
                      ? currentQuestion.correctAnswer.some(ans => normalize(ans) === normalize(finalAnswer))
                      : normalize(currentQuestion.correctAnswer) === normalize(finalAnswer);
                    return isCorrect ? 'bg-green-50 border-green-500 text-green-900 dark:bg-green-950/40 dark:text-green-200' : 'bg-red-50 border-red-500 text-red-900 dark:bg-red-950/40 dark:text-red-200';
                  })()
                }`}>
                  <div className="text-xs opacity-75 uppercase tracking-wider mb-1 font-bold">Your sentence</div>
                  <div className="text-lg">{selectedTokens.map(t => t.text).join(' ')}</div>
                  {/* Show Correct Answer if wrong */}
                  {!(() => {
                    const finalAnswer = selectedTokens.map(t => t.text).join(' ').trim();
                    const normalize = (s: string) => s.toLowerCase().replace(/[.,!?'" ]/g, '');
                    return Array.isArray(currentQuestion.correctAnswer)
                      ? currentQuestion.correctAnswer.some(ans => normalize(ans) === normalize(finalAnswer))
                      : normalize(currentQuestion.correctAnswer) === normalize(finalAnswer);
                  })() && (
                    <div className="mt-3 pt-3 border-t border-current">
                      <div className="text-xs opacity-75 uppercase tracking-wider mb-1 font-bold">Correct solution</div>
                      <div className="font-bold text-lg">{Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer[0] : currentQuestion.correctAnswer}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <input
                type="text"
                disabled={isSubmitted}
                value={selectedAnswer || ''}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder="Type your German answer here..."
                className={`w-full px-5 py-4 rounded-xl border-2 focus:outline-none text-xl font-medium bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors
                  ${isSubmitted 
                    ? (Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.includes(selectedAnswer?.trim() || '') : currentQuestion.correctAnswer === selectedAnswer?.trim())
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100'
                    : 'border-neutral-200 dark:border-neutral-700 focus:border-primary-500 dark:focus:border-primary-500 hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && selectedAnswer && !isSubmitted) submitAnswer();
                }}
              />
            </div>
          )}
        </div>

        {/* Explanation Box */}
        {isSubmitted && (
          <div className="bg-neutral-50/90 dark:bg-neutral-800/60 p-5 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 animate-in slide-in-from-top-4 mb-8 flex gap-4">
            <div className="mt-0.5 text-primary-500 shrink-0"><RotateCcw size={20}/></div>
            <div className="flex-1">
              <h3 className="font-bold mb-1 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Explanation</h3>
              <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">{currentQuestion.explanation}</p>
              {currentQuestion.englishMeaning && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 italic mt-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60">
                  Translation: "{currentQuestion.englishMeaning}"
                </p>
              )}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex justify-end pt-4 border-t border-neutral-100 dark:border-neutral-800">
          {!isSubmitted ? (
            <Button 
              size="lg" 
              onClick={submitAnswer} 
              disabled={currentQuestion.questionType === 'sentence-building' ? selectedTokens.length === 0 : !selectedAnswer} 
              className="min-w-[140px] shadow-sm"
            >
              Check Answer
            </Button>
          ) : (
            <Button 
              size="lg" 
              onClick={nextQuestion} 
              className="min-w-[140px] shadow-sm"
            >
              {currentIndex < questions.length - 1 ? 'Next Question →' : 'Finish Session'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
