import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useProgress } from '../store/ProgressContext';
import { AlertCircle, Trash2 } from 'lucide-react';

export function MistakesView() {
  const { progress, removeMistake } = useProgress();
  const mistakes = progress.mistakes;

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto mt-4 md:mt-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">Mistakes Notebook</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Review your incorrect answers and learn from them.</p>
        </div>
        {mistakes.length > 0 && (
          <Button variant="primary" size="lg" className="shadow-sm">Practice All Mistakes</Button>
        )}
      </header>

      {mistakes.length === 0 ? (
        <Card className="p-16 text-center flex flex-col items-center justify-center border-dashed border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20">
          <AlertCircle size={48} className="text-neutral-300 dark:text-neutral-700 mb-6" />
          <h2 className="text-xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">No mistakes recorded!</h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md">Keep practicing. If you get a question wrong, it will appear here for you to review later.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {mistakes.map((mistake) => (
            <Card key={mistake.id} className="p-6 md:p-8 relative group">
              <button 
                onClick={() => removeMistake(mistake.questionId)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors"
                aria-label="Remove mistake"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">
                {mistake.topic}
              </div>
              <h3 className="font-bold text-xl mb-6 text-neutral-900 dark:text-neutral-100 pr-12">{mistake.questionText}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-xl">
                  <div className="text-xs text-red-500 dark:text-red-400 uppercase font-semibold tracking-wider mb-2">Your Answer</div>
                  <div className="text-red-900 dark:text-red-300 font-semibold text-lg line-through decoration-red-400/50">{mistake.userAnswer || '(No answer)'}</div>
                </div>
                <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 p-4 rounded-xl">
                  <div className="text-xs text-green-600 dark:text-green-500 uppercase font-semibold tracking-wider mb-2">Correct Answer</div>
                  <div className="text-green-900 dark:text-green-300 font-semibold text-lg">{mistake.correctAnswer}</div>
                </div>
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 p-4 rounded-xl flex gap-3">
                <div className="text-neutral-400 mt-0.5"><AlertCircle size={18}/></div>
                <div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-semibold tracking-wider mb-1">Explanation</div>
                  <div className="text-neutral-800 dark:text-neutral-200 leading-relaxed">{mistake.explanation}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
