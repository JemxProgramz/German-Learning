import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useProgress } from '../store/ProgressContext';
import { 
  Clock, 
  Play, 
  Pause, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Flag, 
  RotateCcw,
  Eye,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Grid3X3,
  X
} from 'lucide-react';
import { MOCK_EXAM_QUESTIONS, MockQuestion } from '../data/mockTestData';
import { speakGerman } from '../utils/speech';

export function MockTestView() {
  // Test lifecycle states
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  // Configuration options (Setup step)
  const [timedMode, setTimedMode] = useState(false); // Default to off as specified
  const [durationMinutes, setDurationMinutes] = useState(45); // Sensible Goethe A1 default (~1.3 min/q)

  // Question navigation & answers
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [mobileGridOpen, setMobileGridOpen] = useState(false);

  // Real-time tracking
  const [timeRemaining, setTimeRemaining] = useState(45 * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Timestamp references to prevent drift
  const endTimeRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseStartTimeRef = useRef<number | null>(null);
  const totalPausedTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<number | null>(null);
  const elapsedIntervalRef = useRef<number | null>(null);

  const { addMockTestResult } = useProgress();

  // Clean format MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(Math.max(0, totalSec) / 60);
    const secs = Math.max(0, totalSec) % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Timer interval with timestamp calculation
  useEffect(() => {
    if (!started || finished || isPaused) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
      return;
    }

    // Elapsed timer (tracking total time spent)
    elapsedIntervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current - totalPausedTimeRef.current) / 1000);
      setElapsedSeconds(Math.max(0, elapsed));
    }, 1000);

    // Countdown interval (timestamp based)
    if (timedMode && endTimeRef.current) {
      const checkCountdown = () => {
        const now = Date.now();
        const diffMs = endTimeRef.current! - now;
        const remainingSec = Math.max(0, Math.ceil(diffMs / 1000));
        setTimeRemaining(remainingSec);

        if (diffMs <= 0) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
          triggerFinish(true);
        }
      };

      checkCountdown();
      timerIntervalRef.current = window.setInterval(checkCountdown, 250);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
    };
  }, [started, finished, isPaused, timedMode]);

  // Start Exam
  const handleStartExam = () => {
    const now = Date.now();
    startTimeRef.current = now;
    totalPausedTimeRef.current = 0;
    pauseStartTimeRef.current = null;

    if (timedMode) {
      const totalSec = durationMinutes * 60;
      endTimeRef.current = now + totalSec * 1000;
      setTimeRemaining(totalSec);
    } else {
      endTimeRef.current = null;
    }

    setElapsedSeconds(0);
    setUserAnswers({});
    setMarkedForReview({});
    setCurrentIdx(0);
    setTimeExpired(false);
    setIsPaused(false);
    setReviewMode(false);
    setFinished(false);
    setStarted(true);
  };

  // Pause / Resume
  const togglePause = () => {
    if (isPaused) {
      // Resume
      if (pauseStartTimeRef.current) {
        const pauseDuration = Date.now() - pauseStartTimeRef.current;
        totalPausedTimeRef.current += pauseDuration;
        if (endTimeRef.current) {
          endTimeRef.current += pauseDuration;
        }
      }
      pauseStartTimeRef.current = null;
      setIsPaused(false);
    } else {
      // Pause
      pauseStartTimeRef.current = Date.now();
      setIsPaused(true);
    }
  };

  // End Exam / Submit
  const triggerFinish = (isTimeout: boolean = false) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);

    let totalCorrect = 0;
    const sectionScores: Record<string, { correct: number; total: number }> = {
      'Wortschatz': { correct: 0, total: 0 },
      'Grammatik': { correct: 0, total: 0 },
      'Lesen': { correct: 0, total: 0 },
      'Hören': { correct: 0, total: 0 }
    };

    MOCK_EXAM_QUESTIONS.forEach(q => {
      sectionScores[q.section].total += 1;
      if (userAnswers[q.id] === q.correctAnswer) {
        sectionScores[q.section].correct += 1;
        totalCorrect += 1;
      }
    });

    const finalScore = Math.round((totalCorrect / MOCK_EXAM_QUESTIONS.length) * 100);
    const totalTimeUsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    setScore(finalScore);
    setTimeExpired(isTimeout);

    addMockTestResult({
      testId: 'mock_test_1',
      score: finalScore,
      totalQuestions: MOCK_EXAM_QUESTIONS.length,
      timeUsedMinutes: totalTimeUsedMinutes,
      sectionScores
    });

    setFinished(true);
    setStarted(false);
  };

  // Urgency computation & color classes
  const totalDurationSec = durationMinutes * 60;
  const ratio = totalDurationSec > 0 ? timeRemaining / totalDurationSec : 1;
  const isCritical = timedMode && (ratio <= 0.10 || timeRemaining <= 60);
  const isWarning = timedMode && !isCritical && ratio <= 0.20;

  let timerColorClass = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  let timerIconClass = 'text-emerald-600 dark:text-emerald-400';
  let urgencyText: string | null = null;

  if (isCritical) {
    timerColorClass = 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-900/60 animate-pulse';
    timerIconClass = 'text-rose-600 dark:text-rose-400';
    urgencyText = timeRemaining <= 60 ? 'Final Minute!' : 'Urgent: <10% Left';
  } else if (isWarning) {
    timerColorClass = 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700';
    timerIconClass = 'text-amber-600 dark:text-amber-400';
    urgencyText = '< 20% Time Left';
  }

  // Answer selection
  const currentQuestion: MockQuestion = MOCK_EXAM_QUESTIONS[currentIdx];
  const selectOption = (opt: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: opt }));
  };

  const toggleReviewFlag = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  // Section score calculations for results screen
  const sectionBreakdown = useMemo(() => {
    const sections: Record<string, { correct: number; total: number }> = {
      'Wortschatz': { correct: 0, total: 0 },
      'Grammatik': { correct: 0, total: 0 },
      'Lesen': { correct: 0, total: 0 },
      'Hören': { correct: 0, total: 0 }
    };
    MOCK_EXAM_QUESTIONS.forEach(q => {
      sections[q.section].total += 1;
      if (userAnswers[q.id] === q.correctAnswer) {
        sections[q.section].correct += 1;
      }
    });
    return Object.entries(sections).map(([name, stat]) => ({
      name,
      correct: stat.correct,
      total: stat.total,
      pct: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0
    }));
  }, [userAnswers]);

  // =========================================================
  // VIEW 1: FINISHED / RESULTS
  // =========================================================
  if (finished) {
    return (
      <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto mt-4 md:mt-8">
        <header className="text-center mb-8">
          <h1 className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">
            Mock Exam Complete
          </h1>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {score >= 90 ? 'Sehr gut! (Outstanding)' : score >= 80 ? 'Gut! (Passed with Merit)' : score >= 60 ? 'Ausreichend (Passed)' : 'Nicht bestanden (Needs Practice)'}
          </h2>
        </header>

        {/* Distinct Time Expired vs Normal Complete Alert */}
        {timeExpired ? (
          <div className="bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 rounded-xl p-5 flex items-start gap-4 text-rose-900 dark:text-rose-200">
            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-base flex items-center gap-2">
                <span>Zeit abgelaufen! (Time Expired)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900/60 font-semibold">
                  Auto-Submitted
                </span>
              </div>
              <p className="text-sm text-rose-800/90 dark:text-rose-300/90 mt-1">
                The countdown timer hit zero. Your exam was automatically graded based on the answers given before the time limit expired.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3 text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-sm">Exam Successfully Completed</div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                You manually submitted all answers before time ran out.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <Card className="text-center p-8 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-900 border-t-4 border-t-primary-500">
              <div className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">Final Score</div>
              <div className="text-7xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">{score}%</div>
              
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700 space-y-2">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Time Used</div>
                <div className="font-mono font-bold text-2xl text-neutral-900 dark:text-neutral-100">
                  {formatTime(elapsedSeconds)}
                </div>
                <div className="text-xs text-neutral-500">
                  {timedMode ? `Allocated: ${durationMinutes}:00` : 'Untimed Practice Mode'}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 flex justify-between">
                <span>Total Questions:</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">{MOCK_EXAM_QUESTIONS.length}</span>
              </div>
              <div className="text-xs text-neutral-500 flex justify-between mt-1">
                <span>Questions Answered:</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  {Object.keys(userAnswers).length} / {MOCK_EXAM_QUESTIONS.length}
                </span>
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-8 space-y-6">
            <Card className="p-6 md:p-8">
              <h3 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100">Section Score Breakdown</h3>
              <div className="space-y-4">
                {sectionBreakdown.map((s, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">{s.name}</span>
                      <span className="text-neutral-500 dark:text-neutral-400 font-mono text-xs">
                        {s.correct}/{s.total} ({s.pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          s.pct >= 80 ? 'bg-emerald-500' : s.pct >= 60 ? 'bg-primary-500' : 'bg-amber-500'
                        }`} 
                        style={{ width: `${s.pct}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30">
                <div className="text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider mb-3">Strong Areas</div>
                <ul className="space-y-2 text-green-900 dark:text-green-300 font-medium text-sm">
                  {sectionBreakdown.filter(s => s.pct >= 70).length > 0 ? (
                    sectionBreakdown.filter(s => s.pct >= 70).map(s => (
                      <li key={s.name} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"/> {s.name} ({s.pct}%)
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-neutral-500 italic">Focus on fundamentals across sections</li>
                  )}
                </ul>
              </Card>

              <Card className="bg-orange-50/50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30">
                <div className="text-sm font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wider mb-3">Needs Practice</div>
                <ul className="space-y-2 text-orange-900 dark:text-orange-300 font-medium text-sm">
                  {sectionBreakdown.filter(s => s.pct < 70).length > 0 ? (
                    sectionBreakdown.filter(s => s.pct < 70).map(s => (
                      <li key={s.name} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"/> {s.name} ({s.pct}%)
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-neutral-500 italic">Great balance across all areas!</li>
                  )}
                </ul>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                variant={reviewMode ? 'primary' : 'outline'} 
                size="lg" 
                className="flex-1 gap-2" 
                onClick={() => setReviewMode(!reviewMode)}
              >
                <Eye size={18} /> {reviewMode ? 'Hide Detailed Answers' : 'Review All Answers'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 gap-2" 
                onClick={() => { setStarted(false); setFinished(false); }}
              >
                <RotateCcw size={18} /> Retake / Configure Exam
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed Question Review Accordion */}
        {reviewMode && (
          <div className="mt-8 space-y-4 animate-in fade-in">
            <h3 className="font-bold text-xl text-neutral-900 dark:text-neutral-100">
              Answer Key & Explanations ({MOCK_EXAM_QUESTIONS.length} Questions)
            </h3>
            <div className="space-y-3">
              {MOCK_EXAM_QUESTIONS.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <Card key={q.id} className="p-5 border-l-4 border-l-transparent data-[status=correct]:border-l-emerald-500 data-[status=wrong]:border-l-rose-500" data-status={isCorrect ? 'correct' : 'wrong'}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          Q{idx + 1}
                        </span>
                        <span className="text-xs font-medium text-neutral-500">{q.section}</span>
                      </div>
                      {isCorrect ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={14} /> Correct
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                          <XCircle size={14} /> {userAns ? 'Incorrect' : 'Unanswered (0 pts)'}
                        </span>
                      )}
                    </div>
                    {q.context && (
                      <div className="text-xs bg-neutral-50 dark:bg-neutral-800 p-2.5 rounded-lg mb-2 text-neutral-600 dark:text-neutral-400 italic">
                        "{q.context}"
                      </div>
                    )}
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-2">{q.question}</p>
                    <div className="text-xs space-y-1">
                      <div>
                        <span className="text-neutral-500">Your answer: </span>
                        <span className={isCorrect ? 'font-bold text-emerald-600' : 'font-bold text-rose-600'}>
                          {userAns || '(None selected)'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div>
                          <span className="text-neutral-500">Correct answer: </span>
                          <span className="font-bold text-emerald-600">{q.correctAnswer}</span>
                        </div>
                      )}
                      <div className="text-neutral-500 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                        {q.explanation}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================
  // VIEW 2: ACTIVE EXAM IN PROGRESS
  // =========================================================
  if (started) {
    const isAnswered = (qId: string) => Boolean(userAnswers[qId]);
    const isFlagged = (qId: string) => Boolean(markedForReview[qId]);

    return (
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in">
        <div className="flex-1 space-y-6">
          {/* Prominent Sticky Header with Timer & Controls (Responsive Multi-Row on Mobile, Single-Row on Desktop) */}
          <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm sticky top-14 md:top-4 z-20 space-y-2 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
            {/* Top Row on Mobile: Exam Title & Quick Actions */}
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-neutral-900 dark:text-neutral-100 tracking-tight whitespace-nowrap">
                  A1 MOCK EXAM
                </span>
                <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                  Teil {currentQuestion.section === 'Wortschatz' ? '1' : currentQuestion.section === 'Grammatik' ? '2' : currentQuestion.section === 'Lesen' ? '3' : '4'}
                </span>
              </div>

              {/* Mobile-only Submit & Grid Trigger */}
              <div className="flex items-center gap-1.5 sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileGridOpen(true)}
                  className="text-xs h-8 px-2 gap-1 text-neutral-700 dark:text-neutral-300"
                  title="Open question grid"
                >
                  <Grid3X3 size={13} />
                  <span>{currentIdx + 1}/35</span>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => triggerFinish(false)}
                  className="text-xs h-8 px-2.5 whitespace-nowrap"
                >
                  Submit
                </Button>
              </div>
            </div>

            {/* Timer & Controls Display */}
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 pt-1 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
              {timedMode ? (
                <div className="flex items-center gap-2">
                  <div 
                    id="mock-exam-countdown"
                    className={`flex items-center gap-1.5 sm:gap-2 font-mono font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border text-xs sm:text-sm md:text-base transition-colors duration-500 ease-in-out ${timerColorClass}`}
                  >
                    <Clock size={15} className={`shrink-0 ${timerIconClass}`} />
                    <span>{formatTime(timeRemaining)}</span>
                    {urgencyText && (
                      <span className="text-[9px] sm:text-[10px] font-sans font-extrabold uppercase tracking-wider px-1 py-0.5 rounded bg-black/10 dark:bg-black/30 whitespace-nowrap">
                        {urgencyText}
                      </span>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePause}
                    className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 h-8 sm:h-9 px-2 sm:px-2.5"
                    title={isPaused ? 'Resume exam countdown' : 'Pause exam'}
                  >
                    {isPaused ? <Play size={13} className="sm:mr-1" /> : <Pause size={13} className="sm:mr-1" />}
                    <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-mono font-medium bg-neutral-100 dark:bg-neutral-800/80 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm">
                  <Clock size={14} className="text-neutral-500" />
                  <span>{formatTime(elapsedSeconds)}</span>
                  <span className="hidden sm:inline text-[11px] font-sans text-neutral-400 dark:text-neutral-500">(Untimed)</span>
                </div>
              )}

              {/* Desktop Submit Button */}
              <Button
                variant="danger"
                size="sm"
                onClick={() => triggerFinish(false)}
                className="hidden sm:inline-flex text-xs h-9 px-3 shrink-0"
              >
                Submit Exam
              </Button>
            </div>
          </div>

          {/* Paused Overlay */}
          {isPaused && (
            <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto">
                  <Pause size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">Exam Paused</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    The timer is frozen and questions are hidden to maintain exam integrity. Ready to continue?
                  </p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/80 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                  {timedMode ? `Remaining Time: ${formatTime(timeRemaining)}` : `Elapsed: ${formatTime(elapsedSeconds)}`}
                </div>
                <Button onClick={togglePause} size="lg" fullWidth className="gap-2">
                  <Play size={18} /> Resume Exam
                </Button>
              </Card>
            </div>
          )}

          {/* Active Question Card */}
          <Card className="p-4 sm:p-6 md:p-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider px-2.5 py-1 rounded bg-primary-50 dark:bg-primary-950/40">
                  {currentQuestion.section}
                </span>
                {isFlagged(currentQuestion.id) && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                    <Flag size={12} /> Flagged
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm font-medium text-neutral-500 font-mono">
                Question {currentIdx + 1} / {MOCK_EXAM_QUESTIONS.length}
              </div>
            </div>

            {/* Reading passage context */}
            {currentQuestion.context && (
              <div className="bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 p-4 sm:p-5 rounded-xl mb-6 text-sm md:text-base leading-relaxed text-neutral-800 dark:text-neutral-200 break-words">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Lesetext / Situation:</div>
                <p className="italic">{currentQuestion.context}</p>
              </div>
            )}

            {/* Audio Script player for Listening Section */}
            {currentQuestion.audioScript && (
              <div className="bg-primary-50/60 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800/60 p-4 sm:p-5 rounded-xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wider mb-1">
                    Hörtext (Audio Announcement)
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Listen to the simulated audio track to answer the question.
                  </p>
                </div>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => speakGerman(currentQuestion.audioScript!)}
                  className="gap-2 shrink-0 border-primary-300 text-primary-700 dark:text-primary-300 w-full sm:w-auto"
                >
                  <Volume2 size={16} /> Play Audio Track
                </Button>
              </div>
            )}
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-neutral-900 dark:text-neutral-100 leading-snug break-words">
              {currentQuestion.question}
            </h2>
            
            {/* Options */}
            <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
              {currentQuestion.options.map((opt, i) => {
                const isSelected = userAnswers[currentQuestion.id] === opt;
                return (
                  <button 
                    key={opt} 
                    onClick={() => selectOption(opt)}
                    className={`w-full flex items-center gap-3 sm:gap-4 text-left p-3.5 sm:px-5 sm:py-4 rounded-xl border-2 font-medium text-sm sm:text-base md:text-lg transition-all ${
                      isSelected 
                        ? 'border-primary-600 bg-primary-50/80 dark:bg-primary-950/40 text-primary-900 dark:text-primary-100 shadow-sm' 
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm shrink-0 transition-colors ${
                      isSelected 
                        ? 'border-primary-600 bg-primary-600 text-white font-bold' 
                        : 'border-neutral-300 dark:border-neutral-600 text-neutral-500'
                    }`}>
                      {['A','B','C','D'][i]}
                    </div>
                    <span className="break-words flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Bottom Controls */}
            <div className="grid grid-cols-2 sm:flex sm:justify-between items-center gap-2.5 sm:gap-4 pt-6 border-t border-neutral-100 dark:border-neutral-800">
               <Button 
                 variant="outline" 
                 size="lg" 
                 disabled={currentIdx === 0}
                 onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                 className="w-full sm:w-auto px-4 sm:px-6 gap-1"
               >
                 <ChevronLeft size={16} /> Previous
               </Button>

               <Button 
                 variant="ghost" 
                 onClick={toggleReviewFlag}
                 className={`col-span-2 sm:col-span-1 order-last sm:order-none w-full sm:w-auto text-xs sm:text-sm gap-1.5 ${
                   isFlagged(currentQuestion.id) ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-neutral-500'
                 }`}
               >
                 <Flag size={14} className={isFlagged(currentQuestion.id) ? 'fill-amber-500 text-amber-500' : ''} />
                 {isFlagged(currentQuestion.id) ? 'Flagged for Review' : 'Mark for Review'}
               </Button>

               {currentIdx < MOCK_EXAM_QUESTIONS.length - 1 ? (
                 <Button 
                   onClick={() => setCurrentIdx(prev => prev + 1)} 
                   size="lg" 
                   className="w-full sm:w-auto px-4 sm:px-6 gap-1"
                 >
                   Next <ChevronRight size={16} />
                 </Button>
               ) : (
                 <Button 
                   onClick={() => triggerFinish(false)} 
                   size="lg" 
                   className="w-full sm:w-auto px-4 sm:px-6 bg-emerald-600 hover:bg-emerald-700 text-white"
                 >
                   Finish & Score Exam
                 </Button>
               )}
            </div>
          </Card>
        </div>
        
        {/* Mobile Question Navigator Modal / Drawer */}
        {mobileGridOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-100">Question Navigator</h3>
                  <div className="text-xs text-neutral-500 font-mono">
                    {Object.keys(userAnswers).length}/{MOCK_EXAM_QUESTIONS.length} Answered
                  </div>
                </div>
                <button 
                  onClick={() => setMobileGridOpen(false)}
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  aria-label="Close question navigator"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-around text-xs text-neutral-500 py-2.5 px-4 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-primary-600 inline-block"/> Current
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"/> Answered
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block"/> Flagged
                </span>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                {(['Wortschatz', 'Grammatik', 'Lesen', 'Hören'] as const).map(sectionName => {
                  const sectionQuestions = MOCK_EXAM_QUESTIONS.filter(q => q.section === sectionName);
                  return (
                    <div key={sectionName}>
                      <div className="flex justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        <span>{sectionName}</span>
                        <span className="font-mono text-[10px]">
                          {sectionQuestions.filter(q => isAnswered(q.id)).length}/{sectionQuestions.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {sectionQuestions.map(q => {
                          const qNum = q.questionNumber;
                          const globalIdx = qNum - 1;
                          const isCurrent = globalIdx === currentIdx;
                          const answered = isAnswered(q.id);
                          const flagged = isFlagged(q.id);

                          let styleClass = 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300';
                          if (isCurrent) {
                            styleClass = 'bg-primary-600 text-white border-primary-600 font-bold shadow-sm';
                          } else if (flagged) {
                            styleClass = 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-800 dark:text-amber-200 font-semibold';
                          } else if (answered) {
                            styleClass = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium';
                          }

                          return (
                            <button 
                              key={q.id} 
                              onClick={() => {
                                setCurrentIdx(globalIdx);
                                setMobileGridOpen(false);
                              }}
                              className={`relative h-10 rounded-lg flex items-center justify-center text-xs font-mono border transition-all active:scale-95 ${styleClass}`}
                            >
                              {qNum}
                              {flagged && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
                <Button 
                  onClick={() => {
                    setMobileGridOpen(false);
                    triggerFinish(false);
                  }}
                  variant="danger" 
                  fullWidth
                  size="lg"
                >
                  Submit & Score Exam
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Navigator Sidebar */}
        <div className="hidden lg:block w-80 shrink-0">
          <Card className="sticky top-4 p-6 max-h-[calc(100vh-2rem)] overflow-y-auto scroll-smooth">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-neutral-900 dark:text-neutral-100">Question Navigator</h3>
               <span className="text-xs font-mono text-neutral-500">
                 {Object.keys(userAnswers).length}/{MOCK_EXAM_QUESTIONS.length} Answered
               </span>
             </div>

             {/* Legend */}
             <div className="flex items-center gap-3 text-[11px] text-neutral-500 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
               <span className="flex items-center gap-1">
                 <span className="w-2.5 h-2.5 rounded bg-primary-600 inline-block"/> Current
               </span>
               <span className="flex items-center gap-1">
                 <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"/> Answered
               </span>
               <span className="flex items-center gap-1">
                 <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block"/> Flagged
               </span>
             </div>
             
             <div className="space-y-6">
               {(['Wortschatz', 'Grammatik', 'Lesen', 'Hören'] as const).map(sectionName => {
                 const sectionQuestions = MOCK_EXAM_QUESTIONS.filter(q => q.section === sectionName);
                 return (
                   <div key={sectionName}>
                     <div className="flex justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2.5">
                       <span>{sectionName}</span>
                       <span className="font-mono text-[10px]">
                         {sectionQuestions.filter(q => isAnswered(q.id)).length}/{sectionQuestions.length}
                       </span>
                     </div>
                     <div className="grid grid-cols-5 gap-1.5">
                       {sectionQuestions.map(q => {
                         const qNum = q.questionNumber;
                         const globalIdx = qNum - 1;
                         const isCurrent = globalIdx === currentIdx;
                         const answered = isAnswered(q.id);
                         const flagged = isFlagged(q.id);

                         let styleClass = 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-primary-400';
                         if (isCurrent) {
                           styleClass = 'bg-primary-600 text-white border-primary-600 font-bold shadow-sm';
                         } else if (flagged) {
                           styleClass = 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-800 dark:text-amber-200 font-semibold';
                         } else if (answered) {
                           styleClass = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium';
                         }

                         return (
                           <button 
                             key={q.id} 
                             onClick={() => setCurrentIdx(globalIdx)}
                             className={`relative h-9 rounded-lg flex items-center justify-center text-xs font-mono border transition-all ${styleClass}`}
                           >
                             {qNum}
                             {flagged && (
                               <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                             )}
                           </button>
                         );
                       })}
                     </div>
                   </div>
                 );
               })}
             </div>
             
             <Button 
               onClick={() => triggerFinish(false)} 
               variant="danger" 
               fullWidth 
               className="mt-8 text-xs h-10"
             >
               End Exam Early & Grade
             </Button>
          </Card>
        </div>
      </div>
    );
  }

  // =========================================================
  // VIEW 3: SETUP / CONFIGURATION (DEFAULT SCREEN)
  // =========================================================
  return (
    <div className="space-y-6 animate-in fade-in max-w-2xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Mock Examination</h1>
        <p className="text-neutral-500">Full Goethe-Zertifikat A1 exam simulation under authentic conditions.</p>
      </header>

      <Card className="p-4 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={32} className="text-primary-600 dark:text-primary-400 shrink-0" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">GOETHE-ZERTIFIKAT A1 MOCK EXAM</h2>
            <p className="text-neutral-500 text-xs sm:text-sm">Standard Structure: Wortschatz, Grammatik, Lesen & Hören</p>
          </div>
        </div>

        {/* Structure Breakdown */}
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 mb-6 border border-neutral-100 dark:border-neutral-700">
          <h3 className="font-semibold mb-4 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Structure (35 Questions Total)
          </h3>
          <ul className="space-y-2.5 text-sm text-neutral-700 dark:text-neutral-300">
            <li className="flex justify-between">
              <span>Teil 1 – Wortschatz (Vocabulary)</span> 
              <span className="font-mono font-medium">10 questions</span>
            </li>
            <li className="flex justify-between">
              <span>Teil 2 – Grammatik (Articles, Cases, Verbs)</span> 
              <span className="font-mono font-medium">15 questions</span>
            </li>
            <li className="flex justify-between">
              <span>Teil 3 – Lesen (Signs, Notes & Messages)</span> 
              <span className="font-mono font-medium">5 questions</span>
            </li>
            <li className="flex justify-between">
              <span>Teil 4 – Hören (Spoken Announcements)</span> 
              <span className="font-mono font-medium">5 questions</span>
            </li>
          </ul>
        </div>

        {/* COUNTDOWN TIMER CONFIGURATION CARD */}
        <div className="bg-neutral-50/80 dark:bg-neutral-800/80 rounded-xl p-5 mb-6 border border-neutral-200/80 dark:border-neutral-700">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span>Timed Exam Mode (Countdown Timer)</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {timedMode 
                  ? 'Active: Real exam pressure. Test automatically submits when time expires.' 
                  : 'Disabled: Take as much time as you need. A calm elapsed counter will track your pace without pressure.'}
              </p>
            </div>
            
            {/* Interactive Toggle Switch */}
            <button
              type="button"
              role="switch"
              id="timer-mode-toggle"
              aria-checked={timedMode}
              onClick={() => setTimedMode(prev => !prev)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                timedMode ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  timedMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Duration Selector when timedMode is enabled */}
          {timedMode && (
            <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-700 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Test Duration
                </span>
                <span className="font-bold text-primary-600 dark:text-primary-400 font-mono">
                  {durationMinutes} Minutes (~{(durationMinutes / 35).toFixed(1)} min / question)
                </span>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { mins: 15, label: '15 min', desc: 'Sprint (~25s/q)' },
                  { mins: 30, label: '30 min', desc: 'Express (~51s/q)' },
                  { mins: 45, label: '45 min', desc: 'Standard Goethe' },
                  { mins: 60, label: '60 min', desc: 'Relaxed Pace' }
                ].map(p => (
                  <button
                    key={p.mins}
                    type="button"
                    onClick={() => setDurationMinutes(p.mins)}
                    className={`p-2.5 rounded-lg text-left border text-xs transition-all ${
                      durationMinutes === p.mins
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/50 text-primary-900 dark:text-primary-200 font-semibold ring-1 ring-primary-500'
                        : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                    }`}
                  >
                    <div className="font-bold text-sm">{p.label}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>

              {/* Custom Duration Slider */}
              <div className="flex items-center gap-3 pt-1">
                <Sliders size={14} className="text-neutral-400 shrink-0" />
                <span className="text-xs text-neutral-500 whitespace-nowrap">Custom:</span>
                <input
                  type="range"
                  min="5"
                  max="90"
                  step="5"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="flex-1 accent-primary-600 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold w-12 text-right text-neutral-800 dark:text-neutral-200">
                  {durationMinutes} min
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-amber-50/70 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 p-4 rounded-xl mb-8 text-xs font-medium border border-amber-200/60 dark:border-amber-900/50">
          Exam mode hides answers and explanations until submission. Once started, you can flag questions for review and jump between sections freely.
        </div>

        <Button size="lg" fullWidth onClick={handleStartExam} className="gap-2 h-12 text-base">
          <Play size={18} /> {timedMode ? `Start Timed Exam (${durationMinutes}m)` : 'Start Untimed Exam'}
        </Button>
      </Card>
    </div>
  );
}
