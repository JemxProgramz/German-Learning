import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useProgress } from '../store/ProgressContext';
import { Mic, Square, Check, RotateCcw } from 'lucide-react';

export function SprechenView() {
  const [recording, setRecording] = useState(false);
  const [finished, setFinished] = useState(false);
  const { addStudySession, recordAnswer } = useProgress();

  const handleToggleRecord = () => {
    if (recording) {
      setRecording(false);
      setFinished(true);
      recordAnswer('sprechen', true);
      addStudySession({
        durationMinutes: 2,
        topics: ['sprechen'],
        questionsAnswered: 1,
        correctAnswers: 1
      });
    } else {
      setRecording(true);
      setFinished(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto mt-4 md:mt-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">Sprechen <span className="text-neutral-400 dark:text-neutral-500 font-normal">/ Speaking</span></h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">Practice speaking short German phrases.</p>
      </header>

      <Card className="p-4 sm:p-8 md:p-12 text-center shadow-sm border-neutral-200/60 dark:border-neutral-800/80 relative overflow-hidden">
        {recording && (
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
        )}
        
        <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-primary-100 dark:border-primary-900/30">
          Topic 1
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 leading-tight break-words">
          Stellen Sie sich vor.
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-6 sm:mb-10 text-base sm:text-lg">(Introduce yourself)</p>
        
        <div className="text-sm text-neutral-700 dark:text-neutral-300 mb-8 sm:mb-12 max-w-sm mx-auto text-left bg-neutral-50/50 dark:bg-neutral-800/50 p-4 sm:p-6 rounded-xl border border-neutral-100 dark:border-neutral-700/50">
          <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3 text-sm uppercase tracking-wider">Include:</div>
          <ul className="space-y-3 font-medium">
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>Name</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>Alter <span className="text-neutral-400 font-normal">(Age)</span></li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>Land <span className="text-neutral-400 font-normal">(Country)</span></li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>Wohnort <span className="text-neutral-400 font-normal">(City)</span></li>
          </ul>
        </div>

        {!finished ? (
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="relative">
              {recording && (
                <div className="absolute inset-0 bg-red-500/20 dark:bg-red-500/10 rounded-full animate-ping scale-150"></div>
              )}
              <button
                onClick={handleToggleRecord}
                className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white dark:text-neutral-900 transition-all shadow-lg ${
                  recording 
                    ? 'bg-red-500 hover:bg-red-600 text-white dark:text-white shadow-red-500/30' 
                    : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 shadow-primary-600/30'
                }`}
              >
                {recording ? <Square size={30} className="fill-current sm:w-9 sm:h-9" /> : <Mic size={30} className="sm:w-9 sm:h-9" />}
              </button>
            </div>
            <span className={`font-semibold text-base sm:text-lg ${recording ? 'text-red-500 dark:text-red-400 animate-pulse' : 'text-neutral-700 dark:text-neutral-300'}`}>
              {recording ? 'Recording in progress... Click to stop.' : 'Click the microphone to start speaking'}
            </span>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 animate-in zoom-in-95 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-500">
                <Check size={32} className="mt-1 sm:w-10 sm:h-10" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl sm:text-2xl mb-2 text-neutral-900 dark:text-neutral-100">Sehr gut!</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-base sm:text-lg">Speaking practice successfully recorded.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4">
               <Button onClick={() => setFinished(false)} size="lg" variant="outline" className="w-full sm:w-auto gap-2 px-8 shadow-sm">
                 <RotateCcw size={18} /> Try Again
               </Button>
               <Button size="lg" className="w-full sm:w-auto gap-2 px-8 shadow-sm">
                 Next Topic →
               </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
