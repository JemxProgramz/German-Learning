import React from 'react';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { useProgress } from '../store/ProgressContext';
import { Calendar, Target, Clock, Flame, Award, TrendingUp, CheckCircle2 } from 'lucide-react';

export function ProgressView() {
  const { progress } = useProgress();

  const totalQuestions = progress.questionsAnswered;
  const accuracy = totalQuestions > 0 ? Math.round((progress.correctAnswers / totalQuestions) * 100) : 0;
  
  // Calculate mock test stats
  const mockScores = progress.mockTestResults.map(m => m.score);
  const latestMockScore = mockScores.length > 0 ? mockScores[0] : 0;
  const bestMockScore = mockScores.length > 0 ? Math.max(...mockScores) : 0;
  const avgMockScore = mockScores.length > 0 ? Math.round(mockScores.reduce((a,b)=>a+b, 0) / mockScores.length) : 0;

  // 12 weeks of data
  const weeks = Array.from({ length: 12 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => i);

  return (
    <div className="space-y-8 animate-in fade-in pb-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">Progress</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Track your learning journey and performance analytics.</p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-5 flex flex-col justify-center bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/80">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CheckCircle2 size={14}/> Course</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">72%</div>
        </Card>
        <Card className="p-5 flex flex-col justify-center bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/80">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Clock size={14}/> Time</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{Math.floor(progress.totalStudyTimeMinutes / 60)}h {progress.totalStudyTimeMinutes % 60}m</div>
        </Card>
        <Card className="p-5 flex flex-col justify-center bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/80">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Flame size={14} className="text-orange-500"/> Streak</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{progress.currentStreak} <span className="text-sm font-normal text-neutral-400">days</span></div>
        </Card>
        <Card className="p-5 flex flex-col justify-center bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/80">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Award size={14}/> Record</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">14 <span className="text-sm font-normal text-neutral-400">days</span></div>
        </Card>
        <Card className="p-5 flex flex-col justify-center bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/80">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Target size={14}/> Accuracy</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{accuracy}%</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lesson Progress */}
        <Card className="p-6 md:p-8">
          <h2 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100">Lesson Progress</h2>
          <div className="space-y-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((lesson) => {
               const val = Math.max(0, 100 - (lesson * 12) + (Math.random() * 10));
               const p = lesson === 1 && val < 50 ? 80 : Math.round(val);
               return (
                 <div key={lesson} className="group">
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 transition-colors">Lesson {lesson}</span>
                      <span className="text-neutral-500 dark:text-neutral-400 font-mono text-xs">{p}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary-500 h-full transition-all" style={{ width: `${p}%` }}></div>
                    </div>
                 </div>
               );
            })}
          </div>
        </Card>

        <div className="space-y-8">
          {/* Skill Progress */}
          <Card className="p-6 md:p-8">
            <h2 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100">Skill Progress</h2>
            <div className="space-y-5">
              {[
                { n: 'Wortschatz', p: 82 },
                { n: 'Artikel', p: 71 },
                { n: 'Grammatik', p: 74 },
                { n: 'Hören', p: 63 },
                { n: 'Lesen', p: 81 },
                { n: 'Schreiben', p: 52 },
                { n: 'Sprechen', p: 60 }
              ].map((skill) => (
                 <div key={skill.n} className="group">
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 transition-colors">{skill.n}</span>
                      <span className="text-neutral-500 dark:text-neutral-400 font-mono text-xs">{skill.p}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary-500 h-full transition-all" style={{ width: `${skill.p}%` }}></div>
                    </div>
                 </div>
              ))}
            </div>
          </Card>

          {/* Mock Test Progress */}
          <Card className="p-6 md:p-8">
            <h2 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
              Mock Tests
              <TrendingUp size={18} className="text-primary-500" />
            </h2>
            <div className="flex items-end gap-2 h-32 mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-2">
              {[72, 78, 84].map((score, i) => (
                <div key={i} className="flex-1 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 rounded-t-sm relative group cursor-pointer transition-colors" style={{ height: `${score}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono font-medium text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {score}%
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Latest</div>
                <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{latestMockScore || 84}%</div>
              </div>
              <div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Best</div>
                <div className="text-xl font-bold text-primary-600 dark:text-primary-400">{bestMockScore || 84}%</div>
              </div>
              <div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Average</div>
                <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{avgMockScore || 78}%</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Activity Heatmap */}
      <Card className="p-6 md:p-8 overflow-hidden">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
          <Calendar size={20} /> Study Activity
        </h2>
        <div className="flex overflow-x-auto pb-4 scroll-smooth">
          <div className="flex gap-1.5 mx-auto">
            {weeks.map((week) => (
              <div key={week} className="flex flex-col gap-1.5">
                {days.map((day) => {
                  const intensity = Math.random();
                  let bgClass = 'bg-neutral-100 dark:bg-neutral-800/50';
                  if (intensity > 0.8) bgClass = 'bg-primary-700 dark:bg-primary-500';
                  else if (intensity > 0.5) bgClass = 'bg-primary-500 dark:bg-primary-600';
                  else if (intensity > 0.2) bgClass = 'bg-primary-300 dark:bg-primary-800';
                  
                  return (
                    <div 
                      key={`${week}-${day}`} 
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] ${bgClass} hover:ring-2 hover:ring-neutral-400 dark:hover:ring-neutral-500 transition-all cursor-pointer`}
                      title="Study activity"
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end items-center gap-2 text-xs text-neutral-500 font-medium mt-4">
          <span>Less</span>
          <div className="w-3.5 h-3.5 rounded-[3px] bg-neutral-100 dark:bg-neutral-800/50"></div>
          <div className="w-3.5 h-3.5 rounded-[3px] bg-primary-300 dark:bg-primary-800"></div>
          <div className="w-3.5 h-3.5 rounded-[3px] bg-primary-500 dark:bg-primary-600"></div>
          <div className="w-3.5 h-3.5 rounded-[3px] bg-primary-700 dark:bg-primary-500"></div>
          <span>More</span>
        </div>
      </Card>
    </div>
  );
}
