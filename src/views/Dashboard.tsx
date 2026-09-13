import React from 'react';
import { useProgress } from '../store/ProgressContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { Flame, Calendar, Clock, Target, PlayCircle } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { progress } = useProgress();

  const totalQuestions = progress.questionsAnswered;
  const accuracy = totalQuestions > 0 ? Math.round((progress.correctAnswers / totalQuestions) * 100) : 0;
  
  // Calculate today's progress based on sessions today
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = progress.sessions.filter(s => s.date.startsWith(todayStr));
  const todayMinutes = todaySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const dailyGoalProgress = (todayMinutes / progress.dailyGoalMinutes) * 100;

  // Weak areas (topics with lowest accuracy, min 5 questions)
  const topicStats = (Object.entries(progress.skillProgress) as [string, { answered: number; correct: number }][]).map(([topic, stats]) => ({
    topic,
    accuracy: stats.answered > 0 ? (stats.correct / stats.answered) * 100 : null,
    answered: stats.answered
  }));
  
  const weakAreas = topicStats
    .filter(t => t.accuracy !== null && t.answered >= 5)
    .sort((a, b) => (a.accuracy as number) - (b.accuracy as number))
    .slice(0, 3);

  // Latest Mock Test
  const latestMockTest = progress.mockTestResults.length > 0 ? progress.mockTestResults[0] : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-50">
          Guten Morgen 👋
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-medium">Bereit für Deutsch?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main Left Column */}
        <div className="md:col-span-8 space-y-8">
          
          {/* Daily Goal & Streak Card */}
          <Card className="flex flex-col md:flex-row items-center justify-between gap-6 border-primary-100 dark:border-primary-900/30 bg-gradient-to-br from-white to-primary-50/30 dark:from-neutral-900 dark:to-neutral-900/90 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-primary-50 dark:text-primary-900/20 opacity-50 transform rotate-12">
              <Flame size={120} />
            </div>
            
            <div className="flex-1 w-full z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary-100 dark:bg-primary-900/50 p-2 rounded-lg text-primary-600 dark:text-primary-400">
                  <Flame size={20} className="fill-current" />
                </div>
                <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{progress.currentStreak} Tage Streak</div>
              </div>
              <div className="mt-6 mb-2 flex justify-between text-sm font-medium">
                <span className="text-neutral-600 dark:text-neutral-400">Daily Goal</span>
                <span className="text-neutral-900 dark:text-neutral-100 font-bold">{todayMinutes} / {progress.dailyGoalMinutes} min</span>
              </div>
              <ProgressBar progress={dailyGoalProgress} height="md" className="mb-2" />
              <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                {todayMinutes >= progress.dailyGoalMinutes 
                  ? "✓ Goal completed!" 
                  : `${progress.dailyGoalMinutes - todayMinutes} minutes left`}
              </div>
            </div>
            
            <div className="w-full md:w-auto z-10 shrink-0">
              <Button onClick={() => onNavigate('vocabulary')} size="lg" className="w-full shadow-lg shadow-primary-900/20">
                Continue Learning
              </Button>
            </div>
          </Card>

          {/* Today's Plan */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Today's Plan</h2>
            <div className="space-y-3">
              {[
                { num: '01', title: 'Wortschatz', time: '10 min', meta: '15 words', action: 'vocabulary' },
                { num: '02', title: 'Grammatik', time: '8 min', meta: '10 questions', action: 'grammatik' },
                { num: '03', title: 'Hören', time: '7 min', meta: '1 exercise', action: 'horen' },
                { num: '04', title: 'Exam Practice', time: '5 min', meta: 'Mock test', action: 'mocktest' }
              ].map((plan) => (
                <div 
                  key={plan.num}
                  onClick={() => onNavigate(plan.action)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/80 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm cursor-pointer transition-all group"
                >
                  <div className="text-neutral-300 dark:text-neutral-700 font-mono font-bold text-lg">{plan.num}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{plan.title}</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">{plan.meta}</div>
                  </div>
                  <div className="text-sm font-medium text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md">
                    {plan.time}
                  </div>
                  <PlayCircle size={20} className="text-neutral-300 dark:text-neutral-600 group-hover:text-primary-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Course Progress */}
          <Card>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Tangram aktuell 1</h2>
                <div className="text-sm text-neutral-500">A1 · Lessons 1–8</div>
              </div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {accuracy}%
              </div>
            </div>
            
            <div className="flex justify-between items-end gap-1 sm:gap-2">
              {[
                { l: 'L1', p: 100 },
                { l: 'L2', p: 100 },
                { l: 'L3', p: 72 },
                { l: 'L4', p: 45 },
                { l: 'L5', p: 20 },
                { l: 'L6', p: 0 },
                { l: 'L7', p: 0 },
                { l: 'L8', p: 0 },
              ].map((lesson, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 gap-2 cursor-pointer group">
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-sm h-1.5 overflow-hidden">
                    <div className="bg-primary-500 h-full" style={{ width: `${lesson.p}%` }}></div>
                  </div>
                  <div className={`text-xs font-semibold ${lesson.p === 100 ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-500'} group-hover:text-primary-600`}>
                    {lesson.p === 100 ? '✓' : lesson.l}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-4 space-y-8">
          
          {/* Skill Overview */}
          <Card>
            <h2 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100">Skill Overview</h2>
            <div className="space-y-4">
              {(Object.entries(progress.skillProgress) as [string, { answered: number; correct: number }][]).map(([topic, stats]) => {
                const topicAccuracy = stats.answered > 0 ? (stats.correct / stats.answered) * 100 : 0;
                const isWeak = weakAreas.some(w => w.topic === topic);
                return (
                  <div key={topic} className="group">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className={`capitalize font-medium ${isWeak ? 'text-orange-600 dark:text-orange-400' : 'text-neutral-700 dark:text-neutral-300'}`}>{topic}</span>
                      <span className="text-neutral-500 dark:text-neutral-400 font-mono text-xs">{stats.answered > 0 ? `${Math.round(topicAccuracy)}%` : '--'}</span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div className={`${isWeak ? 'bg-orange-500' : 'bg-neutral-800 dark:bg-neutral-200'} h-full transition-all`} style={{ width: `${stats.answered > 0 ? topicAccuracy : 0}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Practice Area (Mistakes) */}
          <Card className="bg-neutral-900 dark:bg-neutral-800 text-white border-none">
            <h2 className="text-lg font-bold mb-2 text-white">Needs Practice</h2>
            {weakAreas.length > 0 ? (
              <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                You have {weakAreas.length} weak areas. Review your mistakes to improve your accuracy.
              </p>
            ) : (
              <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                You're doing great! Keep practicing to uncover areas for improvement.
              </p>
            )}
            <Button onClick={() => onNavigate('mistakes')} className="w-full bg-white text-neutral-900 hover:bg-neutral-100 border-none shadow-none">
              Review Mistakes
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
