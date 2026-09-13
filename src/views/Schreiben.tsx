import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useProgress } from '../store/ProgressContext';
import { Send, CheckCircle } from 'lucide-react';

export function SchreibenView() {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { addStudySession, recordAnswer } = useProgress();

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleSubmit = () => {
    setSubmitted(true);
    recordAnswer('schreiben', true); // Generous marking for self-study prototype
    addStudySession({
      durationMinutes: 5,
      topics: ['schreiben'],
      questionsAnswered: 1,
      correctAnswers: 1
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto mt-4 md:mt-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">Schreiben <span className="text-neutral-400 dark:text-neutral-500 font-normal">/ Writing</span></h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">Practice short writing tasks for A1.</p>
      </header>

      <Card className="p-6 md:p-10 shadow-sm border-neutral-200/60 dark:border-neutral-800/80">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold font-mono text-sm">T1</div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Aufgabe (Task)</h2>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-xl border border-neutral-100 dark:border-neutral-700/50">
            <p className="text-neutral-800 dark:text-neutral-200 mb-3 font-medium text-lg leading-relaxed">
              Schreiben Sie 5–6 Sätze über sich (Name, Alter, Land, Wohnort, Sprachen, Hobbys).
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
              Write 5-6 sentences about yourself (Name, age, country, residence, languages, hobbies).
            </p>
          </div>
        </div>

        {!submitted ? (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                className="w-full h-56 p-5 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 focus:border-primary-500 dark:focus:border-primary-500 bg-white dark:bg-neutral-900 focus:ring-0 resize-none text-lg text-neutral-900 dark:text-neutral-100 transition-colors"
                placeholder="Ich heiße..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${wordCount >= 15 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                <span className={`text-sm font-semibold ${wordCount < 15 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                  {wordCount} / 15 words minimum
                </span>
              </div>
              <Button 
                onClick={handleSubmit} 
                disabled={wordCount < 15}
                size="lg"
                className="gap-2 px-6 shadow-sm"
              >
                <Send size={18} /> Submit Text
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in">
             <div className="bg-green-50/80 dark:bg-green-900/10 text-green-900 dark:text-green-200 p-6 rounded-xl flex items-start gap-4 border border-green-100 dark:border-green-900/30">
               <CheckCircle className="shrink-0 mt-0.5 text-green-600 dark:text-green-500" size={24} />
               <div>
                 <h3 className="font-bold text-lg mb-1">Text Submitted Successfully</h3>
                 <p className="text-green-800 dark:text-green-300">Your writing practice has been recorded. Review the model answer below.</p>
               </div>
             </div>
             
             <div className="space-y-2">
               <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-2">Your Text</h3>
               <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-700/60 p-6 rounded-xl">
                 <p className="text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap text-lg leading-relaxed">{text}</p>
               </div>
             </div>

             <div className="space-y-2">
               <h3 className="text-xs font-bold text-primary-500 uppercase tracking-widest pl-2">Model Answer</h3>
               <div className="bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 p-6 rounded-xl">
                 <p className="text-primary-900 dark:text-primary-100 font-medium text-lg leading-relaxed">
                   Hallo! Ich heiße Anna. Ich bin 25 Jahre alt. Ich komme aus Spanien, aber ich wohne jetzt in Berlin. 
                   Ich spreche Spanisch, Englisch und ein bisschen Deutsch. Meine Hobbys sind Lesen und Musik hören.
                 </p>
               </div>
             </div>

             <div className="pt-4 flex justify-end">
               <Button onClick={() => { setText(''); setSubmitted(false); }} size="lg" variant="outline" className="px-8 shadow-sm">
                 Write Another Text
               </Button>
             </div>
          </div>
        )}
      </Card>
    </div>
  );
}
