import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { VocabularyWord } from '../types';
import { VOCABULARY } from '../data/content';
import { useProgress } from '../store/ProgressContext';
import { PlayCircle } from 'lucide-react';

export function VocabularyView() {
  const [activeSession, setActiveSession] = useState(false);
  const [cards, setCards] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const { updateVocabularyStatus, addMistake, recordAnswer, addStudySession } = useProgress();
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  const startSession = (count: number) => {
    // Basic shuffle
    const shuffled = [...VOCABULARY].sort(() => Math.random() - 0.5).slice(0, count);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setActiveSession(true);
    setSessionStartTime(Date.now());
  };

  const endSession = () => {
    const durationMinutes = Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000));
    addStudySession({
      durationMinutes,
      topics: ['vocabulary'],
      questionsAnswered: currentIndex,
      correctAnswers: currentIndex // Simplification for flashcards
    });
    setActiveSession(false);
  };

  const handleResponse = (quality: 'again' | 'hard' | 'good' | 'easy') => {
    const currentCard = cards[currentIndex];
    
    // Update progress
    recordAnswer('vocabulary', quality !== 'again');
    
    if (quality === 'again') {
      updateVocabularyStatus(currentCard.id, 'learning');
      addMistake({
        questionId: `vocab-${currentCard.id}`,
        questionText: currentCard.english,
        topic: 'vocabulary',
        userAnswer: 'Forgot',
        correctAnswer: currentCard.german,
        explanation: 'Vocabulary review'
      });
    } else if (quality === 'easy' || quality === 'good') {
      updateVocabularyStatus(currentCard.id, 'review');
    }

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      endSession();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeSession) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(true);
      } else if (isFlipped) {
        if (e.key === '1') handleResponse('again');
        if (e.key === '2') handleResponse('hard');
        if (e.key === '3') handleResponse('good');
        if (e.key === '4') handleResponse('easy');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSession, isFlipped, currentIndex]);

  if (!activeSession) {
    return (
      <div className="space-y-8 animate-in fade-in max-w-2xl mx-auto mt-8">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-3 text-neutral-900 dark:text-neutral-100">Vocabulary</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">Master your A1 vocabulary with spaced repetition.</p>
        </header>

        <Card className="text-center py-12 px-6">
          <h2 className="text-xl font-semibold mb-8 text-neutral-900 dark:text-neutral-100">Start Practice Session</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button onClick={() => startSession(10)} size="lg" className="justify-center shadow-sm">10 Cards</Button>
            <Button onClick={() => startSession(20)} size="lg" variant="secondary" className="justify-center">20 Cards</Button>
            <Button onClick={() => startSession(50)} size="lg" variant="outline" className="justify-center">50 Cards</Button>
            <Button onClick={() => startSession(VOCABULARY.length)} size="lg" variant="ghost" className="justify-center">All Words</Button>
          </div>
        </Card>
      </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in mt-4 md:mt-8">
      <div className="flex justify-between items-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
        <span className="bg-white dark:bg-neutral-900 px-3 py-1 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-800">
          {currentIndex + 1} <span className="opacity-50">/ {cards.length}</span>
        </span>
        <button onClick={endSession} className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">End Session ✕</button>
      </div>
      
      <div 
        className="relative w-full aspect-[4/3] sm:aspect-video min-h-[350px] perspective-1000 cursor-pointer group"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        {/* Front */}
        <Card className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 transition-all duration-300 ${isFlipped ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 shadow-md hover:shadow-lg'}`}>
          <div className="text-5xl md:text-6xl font-bold text-center tracking-tight text-neutral-900 dark:text-neutral-100">
            {card.article && <span className="text-primary-600 dark:text-primary-400 font-normal mr-3">{card.article}</span>}
            {card.german}
          </div>
          <div className="absolute bottom-8 text-neutral-400 dark:text-neutral-500 text-sm font-medium flex items-center gap-2">
            Click to reveal <span className="hidden sm:inline">or press Space</span>
          </div>
        </Card>

        {/* Back */}
        <Card className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 md:p-12 transition-all duration-300 bg-white dark:bg-neutral-900 ${isFlipped ? 'opacity-100 scale-100 shadow-md' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <div className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{card.german}</div>
          <div className="text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 mb-8">{card.english}</div>
          
          <div className="w-full max-w-sm space-y-4">
            {card.plural && (
              <div className="flex justify-between items-center py-3 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Plural</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{card.plural}</span>
              </div>
            )}
            
            <div className="py-4 border-t border-neutral-100 dark:border-neutral-800">
              <div className="text-neutral-900 dark:text-neutral-100 font-medium mb-1">{card.example}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">{card.exampleEnglish}</div>
            </div>
          </div>
        </Card>
      </div>

      {isFlipped && (
        <div className="grid grid-cols-4 gap-2 sm:gap-4 animate-in slide-in-from-bottom-4 pt-2">
          <Button onClick={() => handleResponse('again')} variant="danger" className="flex-col h-16 py-2">
            <span className="text-sm font-semibold">Again</span>
            <span className="text-[10px] opacity-75 font-normal hidden sm:block">1</span>
          </Button>
          <Button onClick={() => handleResponse('hard')} variant="outline" className="flex-col h-16 py-2 border-orange-200 dark:border-orange-900/50 hover:bg-orange-50 dark:hover:bg-orange-900/20">
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">Hard</span>
            <span className="text-[10px] text-orange-400 dark:text-orange-600 font-normal hidden sm:block">2</span>
          </Button>
          <Button onClick={() => handleResponse('good')} variant="outline" className="flex-col h-16 py-2 border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Good</span>
            <span className="text-[10px] text-blue-400 dark:text-blue-600 font-normal hidden sm:block">3</span>
          </Button>
          <Button onClick={() => handleResponse('easy')} variant="secondary" className="flex-col h-16 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 border-none">
            <span className="text-sm font-semibold">Easy</span>
            <span className="text-[10px] opacity-75 font-normal hidden sm:block">4</span>
          </Button>
        </div>
      )}
    </div>
  );
}
