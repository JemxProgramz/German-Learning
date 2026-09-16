import React from 'react';
import { Card } from '../components/Card';
import { useProgress } from '../store/ProgressContext';
import { Calendar, Target, Clock, Flame, Award, TrendingUp, CheckCircle2, Zap } from 'lucide-react';
import { Topic } from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;

function dateStringForOffset(offset: number): string {
  return new Date(Date.now() + offset * DAY_MS).toISOString().split('T')[0];
}

export function ProgressView() {
  const { progress } = useProgress();

  const totalQuestions = progress.questionsAnswered;
  const accuracy = totalQuestions > 0 ? Math.round((progress.correctAnswers / totalQuestions) * 100) : 0;
  
  // Calculate completed lessons
  const lessonKeys = [1, 2, 3, 4, 5, 6, 7, 8];
  const completedLessons = lessonKeys.filter(l => (progress.lessonProgress[l] || 0) >= 100).length;
  const courseCompletion = Math.round((completedLessons / lessonKeys.length) * 100);

  // Calculate mock test stats
  const mockScores = progress.mockTestResults.map(m => m.score);
  const latestMockScore = mockScores.length > 0 ? mockScores[0] : 0;
  const bestMockScore = mockScores.length > 0 ? Math.max(...mockScores) : 0;
  const avgMockScore = mockScores.length > 0 ? Math.round(mockScores.reduce((a, b) => a + b, 0) / mockScores.length) : 0;

  // Heatmap generation based on actual study dates
  const weeks = Array.from({ length: 12 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => i);
  const studiedDates = new Set(progress.studyDates || []);

  // Skill list configuration
  const skillList: { label: string; key: Topic }[] = [
    { label: 'Wortschatz', key: 'vocabulary' },
    { label: 'Artikel', key: 'artikel' },
    { label: 'Grammatik', key: 'grammatik' },
    { label: 'Satzbildung', key: 'satzbildung' },
    { label: 'Hören', key: 'hören' },
    { label: 'Lesen', key: 'lesen' },
    { label: 'Schreiben', key: 'schreiben' },
    { label: 'Sprechen', key: 'sprechen' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">Progress</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Track your learning journey, skill levels, and exam readiness.</p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="p-3.5 sm:p-5 flex flex-col justify-center bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/80">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 sm:mb-2 flex items-center gap-1.5"><CheckCircle2 size={14}/> Course</div>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{courseCompletion}%</div>
        </Card>
        <Card className="p-3.5 sm:p-5 flex flex-col justify-center bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/80">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 sm:mb-2 flex items-center gap-1.5"><Clock size={14}/> Time</div>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{Math.floor(progress.totalStudyTimeMinutes / 60)}h {progress.totalStudyTimeMinutes % 60}m</div>
        </Card>
        <Card className="p-3.5 sm:p-5 flex flex-col justify-center bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/80">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 sm:mb-2 flex items-center gap-1.5"><Flame size={14} className="text-orange-500"/> Streak</div>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{progress.currentStreak} <span className="text-xs sm:text-sm font-normal text-neutral-400">days</span></div>
        </Card>
        <Card className="p-3.5 sm:p-5 flex flex-col justify-center bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/80">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 sm:mb-2 flex items-center gap-1.5"><Award size={14}/> Longest</div>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{progress.longestStreak || progress.currentStreak} <span className="text-xs sm:text-sm font-normal text-neutral-400">days</span></div>
        </Card>
        <Card className="p-3.5 sm:p-5 flex flex-col justify-center bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/80 col-span-2 sm:col-span-1">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 sm:mb-2 flex items-center gap-1.5"><Target size={14}/> Accuracy</div>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{accuracy}%</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Lesson Progress */}
        <Card className="p-4 sm:p-6 md:p-8">
          <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-neutral-900 dark:text-neutral-100">Tangram Aktuell 1 (A1) Lessons</h2>
          <div className="space-y-4 sm:space-y-5">
            {lessonKeys.map((lesson) => {
              const p = progress.lessonProgress[lesson] || 0;
              return (
                <div key={lesson} className="group">
                  <div className="flex justify-between items-center text-sm mb-1.5">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 transition-colors">
                      Lektion {lesson}
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-400 font-mono text-xs">
                      {p === 100 ? 'Completed ✓' : `${p}%`}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all ${p === 100 ? 'bg-green-500' : 'bg-primary-500'}`} 
                      style={{ width: `${p}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-8">
          {/* Skill Progress */}
          <Card className="p-6 md:p-8">
            <h2 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100">Skill Breakdown</h2>
            <div className="space-y-5">
              {skillList.map((skill) => {
                const stat = progress.skillProgress[skill.key] || { answered: 0, correct: 0 };
                const pct = stat.answered > 0 ? Math.round((stat.correct / stat.answered) * 100) : 0;
                return (
                  <div key={skill.key} className="group">
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 transition-colors">
                        {skill.label}
                      </span>
                      <span className="text-neutral-500 dark:text-neutral-400 font-mono text-xs">
                        {stat.answered > 0 ? `${pct}% (${stat.correct}/${stat.answered})` : 'Not practiced'}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary-500 h-full transition-all" 
                        style={{ width: `${stat.answered > 0 ? pct : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Mock Test Progress */}
          <Card className="p-6 md:p-8">
            <h2 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
              Exam Simulation (Goethe-Zertifikat A1)
              <TrendingUp size={18} className="text-primary-500" />
            </h2>
            {progress.mockTestResults.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-end gap-2 h-28 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                  {progress.mockTestResults.slice(0, 8).reverse().map((test, i) => (
                    <div 
                      key={test.id || i} 
                      className="flex-1 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 rounded-t-sm relative group cursor-pointer transition-colors" 
                      style={{ height: `${Math.max(10, test.score)}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono font-medium text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {test.score}%
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Latest</div>
                    <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{latestMockScore}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Best</div>
                    <div className="text-xl font-bold text-primary-600 dark:text-primary-400">{bestMockScore}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Average</div>
                    <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{avgMockScore}%</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-400 text-sm">
                No mock tests completed yet. Take the Goethe A1 Mock Exam to gauge your score!
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Activity Heatmap */}
      <Card className="p-6 md:p-8 overflow-hidden">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
          <Calendar size={20} /> Study Activity Heatmap
        </h2>
        <div className="flex overflow-x-auto pb-4 scroll-smooth">
          <div className="flex gap-1.5 mx-auto">
            {weeks.map((week) => (
              <div key={week} className="flex flex-col gap-1.5">
                {days.map((day) => {
                  const offset = (week - 11) * 7 + day - 6;
                  const date = dateStringForOffset(offset);
                  const isStudied = studiedDates.has(date);
                  let bgClass = 'bg-neutral-100 dark:bg-neutral-800/50';
                  if (isStudied) {
                    bgClass = 'bg-primary-600 dark:bg-primary-500';
                  }
                  
                  return (
                    <div 
                      key={`${week}-${day}`} 
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] ${bgClass} hover:ring-2 hover:ring-neutral-400 dark:hover:ring-neutral-500 transition-all cursor-pointer`}
                      title={date}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end items-center gap-2 text-xs text-neutral-500 font-medium mt-4">
          <span>Less active</span>
          <div className="w-3.5 h-3.5 rounded-[3px] bg-neutral-100 dark:bg-neutral-800/50" />
          <div className="w-3.5 h-3.5 rounded-[3px] bg-primary-300 dark:bg-primary-800" />
          <div className="w-3.5 h-3.5 rounded-[3px] bg-primary-500 dark:bg-primary-600" />
          <div className="w-3.5 h-3.5 rounded-[3px] bg-primary-700 dark:bg-primary-500" />
          <span>More active</span>
        </div>
      </Card>
    </div>
  );
}
