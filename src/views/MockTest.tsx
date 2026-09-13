import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useProgress } from '../store/ProgressContext';
import { Clock, Play, FileText } from 'lucide-react';

export function MockTestView() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const { addMockTestResult } = useProgress();

  const handleFinish = () => {
    const finalScore = Math.floor(Math.random() * 20) + 75; // Mock random score 75-95
    setScore(finalScore);
    addMockTestResult({
      testId: 'mock_test_1',
      score: finalScore,
      totalQuestions: 40,
      timeUsedMinutes: 28,
      sectionScores: {
        'Wortschatz': { correct: 8, total: 10 },
        'Grammatik': { correct: 12, total: 15 },
        'Lesen': { correct: 4, total: 5 },
        'Hören': { correct: 4, total: 5 }
      }
    });
    setFinished(true);
  };

  if (finished) {
    return (
      <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto mt-4 md:mt-8">
        <header className="text-center mb-10">
          <h1 className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">Mock Exam Complete</h1>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
             {score >= 90 ? 'Sehr gut.' : score >= 80 ? 'Gut.' : score >= 60 ? 'Ausreichend.' : 'Nicht bestanden.'}
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <Card className="text-center p-8 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-900 border-t-4 border-t-primary-500">
              <div className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">Final Score</div>
              <div className="text-7xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">{score}%</div>
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700">
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Time Used</div>
                <div className="font-semibold text-xl text-neutral-900 dark:text-neutral-100">28:14</div>
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-8 space-y-6">
            <Card className="p-6 md:p-8">
              <h3 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100">Score Breakdown</h3>
              <div className="space-y-4">
                {[
                  { name: 'Wortschatz', correct: 8, total: 10, pct: 80 },
                  { name: 'Grammatik', correct: 12, total: 15, pct: 80 },
                  { name: 'Lesen', correct: 4, total: 5, pct: 80 },
                  { name: 'Hören', correct: 4, total: 5, pct: 80 }
                ].map((s, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">{s.name}</span>
                      <span className="text-neutral-500 dark:text-neutral-400 font-mono text-xs">{s.correct}/{s.total}</span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-primary-500 h-full transition-all" style={{ width: `${s.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30">
                <div className="text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider mb-3">Strong Areas</div>
                <ul className="space-y-2 text-green-900 dark:text-green-300 font-medium">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/> Wortschatz</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/> Lesen</li>
                </ul>
              </Card>
              <Card className="bg-orange-50/50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30">
                <div className="text-sm font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wider mb-3">Needs Practice</div>
                <ul className="space-y-2 text-orange-900 dark:text-orange-300 font-medium">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"/> Hören</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"/> Akkusativ</li>
                </ul>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="flex-1" onClick={() => { setStarted(false); setFinished(false); }}>
                Practice Weak Areas
              </Button>
              <Button variant="outline" size="lg" className="flex-1" onClick={() => { setStarted(false); setFinished(false); }}>
                Review Answers
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (started) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in">
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm sticky top-4 z-10">
            <div className="font-bold text-lg text-neutral-900 dark:text-neutral-100">A1 MOCK EXAM</div>
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-mono font-bold bg-red-50 dark:bg-red-900/30 px-4 py-1.5 rounded-lg border border-red-100 dark:border-red-900/50">
              <Clock size={18} /> 44:59
            </div>
          </div>

          <Card className="p-8 md:p-12">
            <div className="flex justify-between items-center mb-8">
              <div className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Teil 1 – Wortschatz</div>
              <div className="text-sm font-medium text-neutral-500">Question 1 / 40</div>
            </div>
            
            <h2 className="text-3xl font-bold mb-10 text-neutral-900 dark:text-neutral-100 leading-tight">Was ist das Gegenteil (opposite) von "groß"?</h2>
            
            <div className="space-y-4 mb-12">
              {['schön', 'klein', 'gut', 'schlecht'].map((opt, i) => (
                <button key={opt} className="w-full flex items-center gap-4 text-left px-6 py-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 font-medium text-lg text-neutral-900 dark:text-neutral-100 transition-all group">
                  <div className="w-8 h-8 rounded-full border-2 border-neutral-300 dark:border-neutral-600 flex items-center justify-center text-sm group-hover:border-primary-500 text-neutral-400 group-hover:text-primary-600">{['A','B','C','D'][i]}</div>
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800">
               <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">← Previous</Button>
               <Button variant="ghost" className="w-full sm:w-auto text-neutral-500">Mark for review</Button>
               <Button onClick={handleFinish} size="lg" className="w-full sm:w-auto px-8">Next →</Button>
            </div>
          </Card>
        </div>
        
        {/* Desktop Navigator */}
        <div className="hidden lg:block w-80 shrink-0">
          <Card className="sticky top-4 p-6 max-h-[calc(100vh-2rem)] overflow-y-auto scroll-smooth">
             <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-6">Question Navigator</h3>
             
             <div className="space-y-6">
               <div>
                 <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Wortschatz</div>
                 <div className="grid grid-cols-5 gap-2">
                   {Array.from({length: 10}).map((_, i) => (
                     <button key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium border ${i === 0 ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-primary-300'}`}>
                       {i + 1}
                     </button>
                   ))}
                 </div>
               </div>
               
               <div>
                 <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Grammatik</div>
                 <div className="grid grid-cols-5 gap-2">
                   {Array.from({length: 15}).map((_, i) => (
                     <button key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-primary-300">
                       {i + 11}
                     </button>
                   ))}
                 </div>
               </div>
             </div>
             
             <Button onClick={handleFinish} variant="danger" fullWidth className="mt-8">
               End Exam Early
             </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in max-w-2xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Mock Examination</h1>
        <p className="text-neutral-500">Full A1 exam simulation under timed conditions.</p>
      </header>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={32} className="text-neutral-400" />
          <div>
            <h2 className="text-xl font-bold">MOCK TEST 01</h2>
            <p className="text-neutral-500 text-sm">Tangram aktuell 1 (Lektion 1-8)</p>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-md p-6 mb-8 border border-neutral-100 dark:border-neutral-700">
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Structure (45 Minutes)</h3>
          <ul className="space-y-3 text-neutral-700 dark:text-neutral-300">
            <li className="flex justify-between"><span>Teil 1 – Wortschatz</span> <span className="font-medium">10 questions</span></li>
            <li className="flex justify-between"><span>Teil 2 – Grammatik</span> <span className="font-medium">15 questions</span></li>
            <li className="flex justify-between"><span>Teil 3 – Lesen</span> <span className="font-medium">5 questions</span></li>
            <li className="flex justify-between"><span>Teil 4 – Hören</span> <span className="font-medium">5 questions</span></li>
          </ul>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 p-4 rounded-md mb-8 text-sm font-medium border border-yellow-100 dark:border-yellow-900/50">
          Exam mode will hide all translations and explanations until the end.
        </div>

        <Button size="lg" fullWidth onClick={() => setStarted(true)} className="gap-2">
          <Play size={18} /> Start Test Now
        </Button>
      </Card>
    </div>
  );
}
