import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { GRAMMAR_TOPICS, QUESTIONS } from '../data/content';
import { QuizEngine } from './QuizEngine';

export function GrammatikView() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(GRAMMAR_TOPICS[0].id);
  const [isPracticing, setIsPracticing] = useState(false);

  if (isPracticing) {
    const topicQuestions = QUESTIONS.filter(q => q.topic === 'grammatik');
    
    return (
      <QuizEngine 
        title="Grammatik Practice" 
        description="Practice German grammar rules."
        topic="grammatik"
        questions={topicQuestions}
        onFinish={() => setIsPracticing(false)}
      />
    );
  }

  const selectedTopic = GRAMMAR_TOPICS.find(t => t.id === selectedTopicId) || GRAMMAR_TOPICS[0];

  return (
    <div className="space-y-6 animate-in fade-in md:h-[calc(100vh-120px)] flex flex-col">
      <header className="shrink-0 mb-2 sm:mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2 text-neutral-900 dark:text-neutral-100">Grammatik</h1>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">Review grammar rules and test your knowledge.</p>
      </header>

      {/* Mobile Horizontal Topics Pills */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 shrink-0 no-scrollbar">
        {GRAMMAR_TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopicId(topic.id)}
            className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors shrink-0 ${
              selectedTopicId === topic.id
                ? 'bg-primary-600 text-white border-primary-600 font-semibold shadow-xs'
                : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
            }`}
          >
            {topic.title}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Desktop Sidebar - Topics List */}
        <Card className="hidden md:block md:w-72 shrink-0 overflow-y-auto p-4 space-y-1 bg-white/50 dark:bg-neutral-900/50 scroll-smooth">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-2">Topics</div>
          {GRAMMAR_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between group ${
                selectedTopicId === topic.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <span>{topic.title}</span>
              {selectedTopicId === topic.id && <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
            </button>
          ))}
        </Card>

        {/* Content - Explanation */}
        <Card className="flex-1 md:overflow-y-auto p-4 sm:p-8 relative flex flex-col scroll-smooth">
          <div className="flex-1">
            <div className="text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">
              Lesson {selectedTopic.lesson}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-neutral-900 dark:text-neutral-100 break-words">{selectedTopic.title}</h2>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6 sm:mb-8 break-words">
                {selectedTopic.explanation}
              </p>
              
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 p-4 sm:p-6 space-y-3 sm:space-y-4">
                <h3 className="text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3 sm:mb-4">Examples</h3>
                {selectedTopic.examples.map((ex, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-base sm:text-lg break-words">{ex.german}</span>
                    <span className="hidden sm:inline text-neutral-300 dark:text-neutral-600">—</span>
                    <span className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base break-words">{ex.english}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-neutral-100 dark:border-neutral-800 flex justify-end shrink-0">
            <Button onClick={() => setIsPracticing(true)} size="lg" className="w-full sm:w-auto px-8">
              Practice this topic
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
