import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useProgress } from '../store/ProgressContext';
import { 
  BookOpen, Headphones, PenLine, Mic, Star, Check, Lock, Map as MapIcon, 
  Flag, Sparkles, Trophy, Compass, 
  Zap, RefreshCw, X, Play, Award, AlertCircle
} from 'lucide-react';
import { Button } from '../components/Button';
import { CURRICULUM_UNITS, UnitLesson, Unit, isUnitUnlocked, isLessonUnlocked, getUnitProgress } from '../utils/units';
import { isItemDue, SRSItem } from '../utils/srs';
import { SessionSummary } from '../components/SessionSummary';

// Topic to icon mapper for curriculum lessons
const TOPIC_ICON_MAP: Record<string, React.ElementType> = {
  vocabulary: BookOpen,
  artikel: Sparkles,
  grammatik: PenLine,
  satzbildung: Compass,
  hören: Headphones,
  lesen: BookOpen,
  schreiben: PenLine,
  sprechen: Mic,
  quiz: Zap,
  mocktest: Trophy
};

export function LearningPathView({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const { progress, completeLesson } = useProgress();
  const pathContainerRef = useRef<HTMLDivElement>(null);

  // Selected lesson modal state
  const [selectedLesson, setSelectedLesson] = useState<{ lesson: UnitLesson; unit: Unit } | null>(null);
  // Review prompt modal state (Requirement 5: Review before new content)
  const [pendingTargetView, setPendingTargetView] = useState<string | null>(null);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  // Completion summary modal state
  const [completedLessonData, setCompletedLessonData] = useState<{ title: string; xp: number } | null>(null);

  // Calculate items due for spaced-repetition review
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const dueItemsCount = useMemo(() => {
    const srs = (progress.vocabularySRS || {}) as Record<string, SRSItem>;
    return Object.values(srs).filter(item => item && item.dueDate && isItemDue(item, todayStr)).length;
  }, [progress.vocabularySRS, todayStr]);

  // Find the overall active lesson id (first incomplete lesson in the unlocked sequence)
  const activeLessonId = useMemo(() => {
    for (const unit of CURRICULUM_UNITS) {
      if (!isUnitUnlocked(unit.id, progress.lessonProgress)) continue;
      for (const lesson of unit.lessons) {
        if ((progress.lessonProgress[lesson.id] || 0) < 100) {
          return lesson.id;
        }
      }
    }
    return 1;
  }, [progress.lessonProgress]);

  // Smooth scroll to the active lesson on initial mount
  useEffect(() => {
    const activeEl = document.getElementById(`lesson-node-${activeLessonId}`);
    if (activeEl && pathContainerRef.current) {
      setTimeout(() => {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  }, [activeLessonId]);

  // S-curve offset calculation for winding Duolingo path
  const getOffset = (index: number) => {
    return Math.sin(index * 0.8) * 55; // Max 55px left or right
  };

  // Safe navigation interceptor checking for due reviews before starting new content
  const handleStartLesson = (targetView: string) => {
    setSelectedLesson(null);
    if (dueItemsCount > 0) {
      setPendingTargetView(targetView);
      setShowReviewPrompt(true);
    } else {
      if (onNavigate) {
        onNavigate(targetView);
      }
    }
  };

  const handleConfirmStartAnyway = () => {
    setShowReviewPrompt(false);
    if (pendingTargetView && onNavigate) {
      onNavigate(pendingTargetView);
    }
    setPendingTargetView(null);
  };

  const handleGoToReviewFirst = () => {
    setShowReviewPrompt(false);
    setSelectedLesson(null);
    if (onNavigate) {
      onNavigate('vocabulary');
    }
  };

  const handleMarkLessonComplete = (lesson: UnitLesson) => {
    const xpReward = lesson.xpReward || (lesson.isCheckpoint ? 50 : 25);
    completeLesson(lesson.id, xpReward);
    setSelectedLesson(null);
    setCompletedLessonData({
      title: lesson.title,
      xp: xpReward
    });
  };

  return (
    <div className="max-w-2xl mx-auto pt-4 pb-32 px-4 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="mb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-xs font-bold tracking-wide uppercase">
          <Flag size={14} /> German A1 Curriculum
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
          Learning Path
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 font-medium">
          Master German step-by-step through interactive units and checkpoint exams.
        </p>
      </div>

      {/* Requirement 5: Review Alert Banner if items are due */}
      {dueItemsCount > 0 && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <RefreshCw size={20} className="animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <span>Spaced Repetition Review Due</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-amber-200 dark:bg-amber-900/70 text-amber-800 dark:text-amber-200 font-extrabold">
                  {dueItemsCount} {dueItemsCount === 1 ? 'word' : 'words'}
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Review your due vocabulary now to reinforce memory before unlocking more lessons.
              </p>
            </div>
          </div>
          <Button
            onClick={handleGoToReviewFirst}
            className="w-full sm:w-auto text-xs py-2 px-4 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white shrink-0"
          >
            Review Now
          </Button>
        </div>
      )}

      {/* Curriculum Units */}
      <div ref={pathContainerRef} className="space-y-16">
        {CURRICULUM_UNITS.map((unit) => {
          const isUnlocked = isUnitUnlocked(unit.id, progress.lessonProgress);
          const unitStats = getUnitProgress(unit, progress.lessonProgress);

          return (
            <div key={unit.id} className="relative">
              
              {/* Unit Header Card */}
              <div className={`p-5 rounded-3xl border shadow-sm transition-all mb-8 ${
                isUnlocked 
                  ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800' 
                  : 'bg-neutral-100/80 dark:bg-neutral-900/40 border-dashed border-neutral-300 dark:border-neutral-800 opacity-80'
              }`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isUnlocked
                          ? 'bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300'
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                      }`}>
                        Unit {unit.id}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        {unit.theme}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      {unit.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {unit.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    {isUnlocked ? (
                      <div>
                        <div className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
                          {unitStats.completedCount} / {unitStats.totalCount}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {unitStats.percentage}% done
                        </div>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-neutral-200 dark:bg-neutral-800 text-neutral-500 flex items-center justify-center">
                        <Lock size={18} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                {isUnlocked && (
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full mt-4 overflow-hidden">
                    <div 
                      className="bg-primary-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${unitStats.percentage}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Unit Path Nodes (if unlocked) */}
              {isUnlocked ? (
                <div className="relative flex flex-col items-center">
                  {unit.lessons.map((lesson, lessonIdx) => {
                    const isCompleted = (progress.lessonProgress[lesson.id] || 0) === 100;
                    const isCurrent = lesson.id === activeLessonId;
                    const isLessonAccessible = isLessonUnlocked(lesson.id, progress.lessonProgress);
                    
                    const offset = getOffset(lessonIdx);
                    const nextOffset = lessonIdx < unit.lessons.length - 1 ? getOffset(lessonIdx + 1) : offset;
                    
                    const LessonIcon = lesson.isCheckpoint ? Star : (TOPIC_ICON_MAP[lesson.topic] || BookOpen);

                    let bgClass = "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600";
                    let borderClass = "border-neutral-300 dark:border-neutral-700 border-b-neutral-400 dark:border-b-neutral-700";
                    let shadowClass = "";

                    if (isCompleted) {
                      bgClass = "bg-primary-600 text-white";
                      borderClass = "border-primary-700 border-b-primary-800";
                    } else if (isCurrent) {
                      bgClass = "bg-primary-500 text-white";
                      borderClass = "border-primary-600 border-b-primary-700";
                      shadowClass = "ring-4 ring-primary-500/30 animate-pulse";
                    }

                    return (
                      <div key={lesson.id} className="relative w-full flex justify-center py-5">
                        
                        {/* Connecting Line */}
                        {lessonIdx < unit.lessons.length - 1 && (
                          <svg className="absolute top-[50%] left-0 w-full h-full pointer-events-none" style={{ zIndex: 0, height: 'calc(100% + 40px)' }}>
                            <path 
                              d={`M calc(50% + ${offset}px) 28 C calc(50% + ${offset}px) 60, calc(50% + ${nextOffset}px) 25, calc(50% + ${nextOffset}px) 85`} 
                              fill="none" 
                              stroke={isCompleted ? "#c1293c" : "#e5e5e5"} 
                              strokeWidth="10" 
                              strokeLinecap="round" 
                              className="dark:stroke-neutral-800"
                            />
                          </svg>
                        )}

                        <div id={`lesson-node-${lesson.id}`} className="relative z-10" style={{ transform: `translateX(${offset}px)` }}>
                          {isCurrent && (
                            <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-800 px-3.5 py-1.5 rounded-xl font-bold text-xs text-primary-600 dark:text-primary-400 shadow-lg border border-neutral-200 dark:border-neutral-700 whitespace-nowrap animate-bounce z-20">
                              START
                              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-neutral-800 rotate-45 border-b border-r border-neutral-200 dark:border-neutral-700" />
                            </div>
                          )}

                          <button
                            onClick={() => {
                              if (isLessonAccessible) {
                                setSelectedLesson({ lesson, unit });
                              }
                            }}
                            title={`${lesson.title}${lesson.isCheckpoint ? ' (Checkpoint Exam)' : ''}${isCompleted ? ' - Completed' : isCurrent ? ' - Current' : !isLessonAccessible ? ' - Locked' : ''}`}
                            aria-label={`${lesson.title}${isCompleted ? ' Completed' : isCurrent ? ' Current' : !isLessonAccessible ? ' Locked' : ''}`}
                            disabled={!isLessonAccessible}
                            className={`relative ${lesson.isCheckpoint ? 'w-20 h-20' : 'w-16 h-16'} rounded-full flex items-center justify-center border-2 border-b-[6px] transition-all hover:scale-105 active:scale-95 active:border-b-2 active:translate-y-1 ${bgClass} ${borderClass} ${shadowClass}`}
                          >
                            <LessonIcon size={lesson.isCheckpoint ? 32 : 24} className={!isLessonAccessible ? "opacity-50" : ""} />

                            {isCompleted && (
                              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 rounded-full p-1 shadow-sm border-2 border-white dark:border-neutral-900">
                                <Check size={14} strokeWidth={4} />
                              </div>
                            )}

                            {!isLessonAccessible && (
                              <div className="absolute -bottom-1 -right-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 rounded-full p-1 shadow-sm border-2 border-white dark:border-neutral-900">
                                <Lock size={12} strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Unit Locked Card */
                <div className="p-8 rounded-3xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-200 dark:bg-neutral-800 text-neutral-400 mx-auto flex items-center justify-center">
                    <Lock size={24} />
                  </div>
                  <h3 className="font-bold text-neutral-700 dark:text-neutral-300">
                    Unit {unit.id} is Locked
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                    Complete all lessons in Unit {unit.id - 1} to unlock this unit.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lesson Details Modal */}
      {selectedLesson && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedLesson(null)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-5 animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                  Unit {selectedLesson.unit.id} • Lesson {selectedLesson.lesson.lessonNumber}
                </span>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {selectedLesson.lesson.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              {selectedLesson.lesson.description}
            </p>

            {/* Lesson Rewards & Status */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Zap size={18} className="fill-current" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    +{selectedLesson.lesson.xpReward || 25} XP
                  </div>
                  <div className="text-[11px] text-neutral-500">Reward</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Award size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {(progress.lessonProgress[selectedLesson.lesson.id] || 0) === 100 ? 'Completed' : 'In Progress'}
                  </div>
                  <div className="text-[11px] text-neutral-500">Status</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={() => handleStartLesson(selectedLesson.lesson.viewTarget)}
                className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-base shadow-md"
              >
                <Play size={18} className="fill-current" /> Start Practice
              </Button>

              {(progress.lessonProgress[selectedLesson.lesson.id] || 0) < 100 && (
                <Button
                  variant="outline"
                  onClick={() => handleMarkLessonComplete(selectedLesson.lesson)}
                  className="w-full py-3 rounded-2xl font-medium text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Mark as Finished (+{selectedLesson.lesson.xpReward || 25} XP)
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Requirement 5: Review Prompt Modal before Starting New Content */}
      {showReviewPrompt && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowReviewPrompt(false)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-5 animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Review Recommended First!
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                You have <span className="font-bold text-amber-600 dark:text-amber-400">{dueItemsCount} {dueItemsCount === 1 ? 'word' : 'words'}</span> due for spaced-repetition review. Reviewing before learning new material boosts retention by up to 80%.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Button
                onClick={handleGoToReviewFirst}
                className="w-full py-3.5 rounded-2xl font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> Review Due Words ({dueItemsCount})
              </Button>

              <button
                onClick={handleConfirmStartAnyway}
                className="w-full py-2.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
              >
                Continue to Lesson Anyway →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Complete Celebration Modal */}
      {completedLessonData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <SessionSummary
            title="Lesson Completed!"
            subtitle={`Bravo! You mastered "${completedLessonData.title}".`}
            xpEarned={completedLessonData.xp}
            correctAnswers={1}
            totalQuestions={1}
            accuracyPercentage={100}
            onContinue={() => setCompletedLessonData(null)}
          />
        </div>
      )}

    </div>
  );
}
