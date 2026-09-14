import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Zap, Flame, Trophy, CheckCircle2, RotateCcw, ArrowRight, Star } from 'lucide-react';
import { useProgress } from '../store/ProgressContext';

export interface SessionSummaryProps {
  title?: string;
  subtitle?: string;
  xpEarned: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracyPercentage?: number;
  onContinue: () => void;
  onRetry?: () => void;
  onReviewMistakes?: () => void;
  hasMistakes?: boolean;
}

export function SessionSummary({
  title = "Session Complete!",
  subtitle = "Great effort! Consistency is the secret to German fluency.",
  xpEarned,
  correctAnswers,
  totalQuestions,
  accuracyPercentage,
  onContinue,
  onRetry,
  onReviewMistakes,
  hasMistakes = false
}: SessionSummaryProps) {
  const { progress, isStudiedToday } = useProgress();

  const accuracy = accuracyPercentage !== undefined 
    ? accuracyPercentage 
    : (totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100);

  const streak = progress.currentStreak || 1;

  return (
    <div className="max-w-md mx-auto py-6 px-4 animate-in fade-in zoom-in-95 duration-300">
      <Card className="p-6 md:p-8 text-center space-y-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-3xl relative overflow-hidden">
        
        {/* Background celebration glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 dark:from-amber-500 dark:to-yellow-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
          <Trophy size={40} className="text-amber-950/80 drop-shadow-sm" />
          <div className="absolute -top-1 -right-1 bg-primary-600 text-white p-1.5 rounded-full border-2 border-white dark:border-neutral-900">
            <Star size={14} className="fill-current" />
          </div>
        </div>

        {/* Titles */}
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
            {subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* XP Gained */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 mb-1">
              <Zap size={16} className="fill-current" />
              <span className="text-xs font-bold uppercase tracking-wider">XP</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-300">
              +{xpEarned}
            </span>
            <span className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">Earned</span>
          </div>

          {/* Accuracy */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 mb-1">
              <CheckCircle2 size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Accuracy</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {accuracy}%
            </span>
            <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
              {correctAnswers}/{totalQuestions}
            </span>
          </div>

          {/* Streak Status */}
          <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/70 dark:border-orange-900/40 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 mb-1">
              <Flame size={16} className="fill-current" />
              <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-orange-700 dark:text-orange-300">
              {streak}
            </span>
            <span className="text-[11px] text-orange-600/80 dark:text-orange-400/80 mt-0.5">
              {isStudiedToday ? "Active Day" : "Day Streak"}
            </span>
          </div>
        </div>

        {/* Streak Callout Banner */}
        <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <Flame size={22} className="fill-current animate-pulse" />
          </div>
          <div className="text-xs sm:text-sm">
            <div className="font-bold text-neutral-900 dark:text-neutral-100">
              {streak} Day Streak Kept Alive!
            </div>
            <div className="text-neutral-500 dark:text-neutral-400 text-xs">
              Daily practice recorded. Come back tomorrow to advance!
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Button
            onClick={onContinue}
            className="w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            Continue <ArrowRight size={18} />
          </Button>

          {hasMistakes && onReviewMistakes && (
            <Button
              variant="outline"
              onClick={onReviewMistakes}
              className="w-full py-3 rounded-2xl font-medium text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center gap-2"
            >
              Review Mistakes
            </Button>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw size={13} /> Practice Again
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
