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
    <div className="space-y-6 animate-in fade-in h-[calc(100vh-120px)] flex flex-col">
      <header className="shrink-0 mb-4">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">Grammatik</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Review grammar rules and test your knowledge.</p>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Left Sidebar - Topics List */}
        <Card className="md:w-72 shrink-0 overflow-y-auto p-4 space-y-1 bg-white/50 dark:bg-neutral-900/50 scroll-smooth">
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

        {/* Right Content - Explanation */}
        <Card className="flex-1 overflow-y-auto p-8 relative flex flex-col scroll-smooth">
          <div className="flex-1">
            <div className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">
              Lesson {selectedTopic.lesson}
            </div>
            <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">{selectedTopic.title}</h2>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-8">
                {selectedTopic.explanation}
              </p>
              
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">Examples</h3>
                {selectedTopic.examples.map((ex, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">{ex.german}</span>
                    <span className="hidden sm:inline text-neutral-300 dark:text-neutral-600">—</span>
                    <span className="text-neutral-500 dark:text-neutral-400">{ex.english}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-neutral-100 dark:border-neutral-800 flex justify-end shrink-0">
            <Button onClick={() => setIsPracticing(true)} size="lg" className="w-full sm:w-auto px-8">
              Practice this topic
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
