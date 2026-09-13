import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useProgress } from '../store/ProgressContext';
import { AlertCircle, Trash2, RotateCcw, CheckCircle2, XCircle, ArrowRight, Volume2, Sparkles, BookOpen } from 'lucide-react';
import { speakGerman } from '../utils/speech';

interface MistakesViewProps {
  onNavigate?: (view: string) => void;
}

export function MistakesView({ onNavigate }: MistakesViewProps) {
  const { progress, removeMistake, addXP, recordAnswer } = useProgress();
  const mistakes = progress.mistakes;

  // Practice Mode state
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAttempt, setUserAttempt] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [resolvedCount, setResolvedCount] = useState(0);

  const startPractice = () => {
    if (mistakes.length === 0) return;
    setCurrentIndex(0);
    setUserAttempt('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setResolvedCount(0);
    setPracticeMode(true);
  };

  const currentMistake = mistakes[currentIndex];

  const handleCheckAttempt = () => {
    if (!currentMistake || !userAttempt.trim() || isSubmitted) return;

    const cleanInput = userAttempt.trim().toLowerCase().replace(/[.,!?;:()"-]/g, '');
    const cleanTarget = currentMistake.correctAnswer.trim().toLowerCase().replace(/[.,!?;:()"-]/g, '');
    const correct = cleanInput === cleanTarget;

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      setResolvedCount(prev => prev + 1);
      addXP(10);
      recordAnswer(currentMistake.topic, true);
    } else {
      recordAnswer(currentMistake.topic, false);
    }
  };

  const handleNextInPractice = () => {
    if (currentIndex + 1 < mistakes.length) {
      setCurrentIndex(prev => prev + 1);
      setUserAttempt('');
      setIsSubmitted(false);
      setIsCorrect(false);
    } else {
      // Completed all mistakes in notebook
      setPracticeMode(false);
    }
  };

  // Practice Mode UI
  if (practiceMode && currentMistake) {
    return (
      <div className="space-y-6 animate-in fade-in max-w-2xl mx-auto mt-4 md:mt-8">
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span className="font-semibold">
            Mistake {currentIndex + 1} of {mistakes.length}
          </span>
          <button
            onClick={() => setPracticeMode(false)}
            className="text-xs px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Exit Practice ✕
          </button>
        </div>

        <Card className="p-6 sm:p-8 space-y-6 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
              Topic: {currentMistake.topic}
            </span>
            <button
              onClick={() => speakGerman(currentMistake.questionText)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Listen to question"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {currentMistake.questionText}
            </h2>
            <p className="text-xs text-neutral-400">
              Your previous incorrect answer was:{' '}
              <span className="text-rose-500 line-through font-medium">
                {currentMistake.userAnswer || '(no answer)'}
              </span>
            </p>
          </div>

          {/* Attempt input */}
          <div className="space-y-3">
            <input
              type="text"
              value={userAttempt}
              onChange={(e) => setUserAttempt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isSubmitted && userAttempt.trim()) {
                  handleCheckAttempt();
                }
              }}
              disabled={isSubmitted}
              placeholder="Type the correct German answer here..."
              className="w-full p-3.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />

            {!isSubmitted ? (
              <Button
                onClick={handleCheckAttempt}
                disabled={!userAttempt.trim()}
                className="w-full justify-center"
              >
                Check Answer
              </Button>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <div
                  className={`p-4 rounded-xl border text-sm space-y-2 ${
                    isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Richtig! Well done! (+10 XP)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600" />
                        <span>Nicht ganz richtig</span>
                      </>
                    )}
                  </div>

                  <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 text-xs">
                    <span className="font-semibold">Correct Answer: </span>
                    <span className="font-bold text-sm text-emerald-700 dark:text-emerald-300">
                      {currentMistake.correctAnswer}
                    </span>
                  </div>

                  {currentMistake.explanation && (
                    <div className="text-xs text-neutral-600 dark:text-neutral-300 pt-1">
                      {currentMistake.explanation}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {isCorrect && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        removeMistake(currentMistake.questionId);
                        handleNextInPractice();
                      }}
                      className="flex-1 justify-center text-xs text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                    >
                      Remove from Notebook ✓
                    </Button>
                  )}

                  <Button
                    onClick={handleNextInPractice}
                    className="flex-1 justify-center flex items-center gap-2"
                  >
                    <span>{currentIndex + 1 < mistakes.length ? 'Next Mistake' : 'Finish Practice'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Regular Mistakes Notebook View
  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto mt-4 md:mt-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">Mistakes Notebook</h1>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">Review your incorrect answers and practice them until mastered.</p>
        </div>
        {mistakes.length > 0 && (
          <Button 
            onClick={startPractice} 
            variant="primary" 
            size="lg" 
            className="w-full sm:w-auto shadow-sm flex items-center gap-2"
          >
            <RotateCcw size={18} />
            <span>Practice All Mistakes ({mistakes.length})</span>
          </Button>
        )}
      </header>

      {mistakes.length === 0 ? (
        <Card className="p-8 sm:p-16 text-center flex flex-col items-center justify-center border-dashed border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20">
          <AlertCircle size={48} className="text-neutral-300 dark:text-neutral-700 mb-6" />
          <h2 className="text-xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">No mistakes recorded!</h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md text-sm sm:text-base mb-6">
            Keep practicing. If you get a question wrong during quizzes or mock tests, it will appear here for you to review later.
          </p>
          {onNavigate && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={() => onNavigate('quiz')} variant="primary" size="sm" className="gap-2">
                <Sparkles size={16} /> Take a Quiz
              </Button>
              <Button onClick={() => onNavigate('vocabulary')} variant="outline" size="sm" className="gap-2">
                <BookOpen size={16} /> Practice Vocabulary
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {mistakes.map((mistake) => (
            <Card key={mistake.id} className="p-4 sm:p-6 md:p-8 relative group">
              <button 
                onClick={() => removeMistake(mistake.questionId)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors"
                aria-label="Remove mistake from notebook"
                title="Remove mistake"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
                  {mistake.topic}
                </span>
                <button
                  onClick={() => speakGerman(mistake.questionText)}
                  className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
                  aria-label="Pronounce German question"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-neutral-900 dark:text-neutral-100 pr-10 break-words">{mistake.questionText}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-3.5 sm:p-4 rounded-xl">
                  <div className="text-xs text-red-500 dark:text-red-400 uppercase font-semibold tracking-wider mb-1.5 sm:mb-2">Your Answer</div>
                  <div className="text-red-900 dark:text-red-300 font-semibold text-base sm:text-lg line-through decoration-red-400/50 break-words">{mistake.userAnswer || '(No answer)'}</div>
                </div>
                <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 p-3.5 sm:p-4 rounded-xl">
                  <div className="text-xs text-green-600 dark:text-green-500 uppercase font-semibold tracking-wider mb-1.5 sm:mb-2 flex items-center justify-between">
                    <span>Correct Answer</span>
                    <button
                      onClick={() => speakGerman(mistake.correctAnswer)}
                      className="text-green-700 dark:text-green-400 hover:opacity-80"
                      aria-label="Pronounce correct answer"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-green-900 dark:text-green-300 font-semibold text-base sm:text-lg break-words">{mistake.correctAnswer}</div>
                </div>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 p-3.5 sm:p-4 rounded-xl flex gap-3">
                <div className="text-neutral-400 mt-0.5 shrink-0"><AlertCircle size={18}/></div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-semibold tracking-wider mb-1">Explanation</div>
                  <div className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm sm:text-base break-words">{mistake.explanation}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

