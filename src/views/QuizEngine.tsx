import React, { useState } from 'react';
import { Question, Topic } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { useProgress } from '../store/ProgressContext';
import { Play, RotateCcw } from 'lucide-react';

interface QuizEngineProps {
  questions: Question[];
  topic: Topic;
  title: string;
  description: string;
  onFinish?: () => void;
}

export function QuizEngine({ questions, topic, title, description, onFinish }: QuizEngineProps) {
  const [active, setActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  
  const { recordAnswer, addMistake, addStudySession } = useProgress();

  const startQuiz = () => {
    setActive(true);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setSessionScore({ correct: 0, total: 0 });
    setSessionStartTime(Date.now());
  };

  const handleFinish = () => {
    const durationMinutes = Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000));
    addStudySession({
      durationMinutes,
      topics: [topic],
      questionsAnswered: sessionScore.total,
      correctAnswers: sessionScore.correct
    });
    setActive(false);
    if (onFinish) onFinish();
  };

  const submitAnswer = () => {
    if (!selectedAnswer) return;
    
    const question = questions[currentIndex];
    const isCorrect = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer.includes(selectedAnswer.trim()) 
      : question.correctAnswer === selectedAnswer.trim();

    setIsSubmitted(true);
    recordAnswer(topic, isCorrect);
    
    setSessionScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (!isCorrect) {
      addMistake({
        questionId: question.id,
        questionText: question.question,
        topic,
        userAnswer: selectedAnswer,
        correctAnswer: Array.isArray(question.correctAnswer) ? question.correctAnswer[0] : question.correctAnswer,
        explanation: question.explanation
      });
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      handleFinish();
    }
  };

  if (!active) {
    return (
      <div className="space-y-8 animate-in fade-in max-w-2xl mx-auto mt-4 md:mt-8">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-3 text-neutral-900 dark:text-neutral-100">{title}</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">{description}</p>
        </header>
        
        {sessionScore.total > 0 && (
          <Card className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-none p-6 text-center shadow-lg">
            <h2 className="font-semibold text-sm uppercase tracking-wider mb-2 opacity-80">Previous Session Result</h2>
            <div className="text-5xl font-bold mb-1 tracking-tight">
              {sessionScore.correct} <span className="opacity-50 mx-1">/</span> {sessionScore.total} 
              <span className="text-2xl font-normal opacity-75 ml-4">({Math.round((sessionScore.correct / sessionScore.total) * 100)}%)</span>
            </div>
          </Card>
        )}

        <Card className="max-w-md mx-auto text-center py-16 px-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-6">
            <Play size={24} className="ml-1" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">Ready to practice?</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">{questions.length} questions available for this topic.</p>
          <Button onClick={startQuiz} size="lg" className="w-full justify-center text-lg h-14">
            Start Practice
          </Button>
        </Card>
      </div>
    );
  }

  const question = questions[currentIndex];
  const currentProgress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in mt-4 md:mt-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4 flex-1">
          <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="w-full max-w-[200px] bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary-500 h-full transition-all duration-300" style={{ width: `${currentProgress}%` }}></div>
          </div>
        </div>
        <button onClick={handleFinish} className="text-sm font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors ml-4">
          Quit ✕
        </button>
      </div>

      <Card className="p-6 md:p-10 shadow-sm border-neutral-200/60 dark:border-neutral-800/80">
        {question.audioUrl && (
          <div className="mb-8 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl flex items-center gap-4 border border-neutral-100 dark:border-neutral-700/50">
             <Button variant="secondary" className="rounded-full w-12 h-12 p-0 flex items-center justify-center shrink-0 shadow-sm bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600">
               <Play size={20} className="ml-1 text-primary-600 dark:text-primary-400" />
             </Button>
             <div className="flex-1">
               <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full w-full overflow-hidden">
                 <div className="w-0 h-full bg-primary-500"></div>
               </div>
             </div>
             <span className="text-xs text-neutral-400 font-medium font-mono">0:00 / 0:45</span>
          </div>
        )}

        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-neutral-900 dark:text-neutral-100 leading-tight">
          {question.question}
        </h2>

        <div className="space-y-3 mb-10">
          {question.questionType === 'multiple-choice' || question.questionType === 'true-false' ? (
            question.options?.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              let btnClass = isSelected 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100 ring-1 ring-primary-500' 
                : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100';
              
              if (isSubmitted) {
                const isCorrectOption = Array.isArray(question.correctAnswer) ? question.correctAnswer.includes(option) : question.correctAnswer === option;
                if (isCorrectOption) {
                  btnClass = 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 ring-1 ring-green-500';
                } else if (isSelected && !isCorrectOption) {
                  btnClass = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 ring-1 ring-red-500';
                } else {
                  btnClass = 'border-neutral-200 dark:border-neutral-800 opacity-40 text-neutral-900 dark:text-neutral-100';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl border-2 transition-all font-medium text-lg group ${btnClass}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected && !isSubmitted ? 'border-primary-500 bg-primary-500' : isSubmitted ? (Array.isArray(question.correctAnswer) ? question.correctAnswer.includes(option) : question.correctAnswer === option) ? 'border-green-500 bg-green-500' : isSelected ? 'border-red-500 bg-red-500' : 'border-neutral-300 dark:border-neutral-600' : 'border-neutral-300 dark:border-neutral-600 group-hover:border-primary-400'}`}>
                    {isSelected && !isSubmitted && <div className="w-2 h-2 rounded-full bg-white"/>}
                    {isSubmitted && (Array.isArray(question.correctAnswer) ? question.correctAnswer.includes(option) : question.correctAnswer === option) && <div className="w-2 h-2 rounded-full bg-white"/>}
                    {isSubmitted && isSelected && !(Array.isArray(question.correctAnswer) ? question.correctAnswer.includes(option) : question.correctAnswer === option) && <div className="w-2 h-0.5 rounded-full bg-white"/>}
                  </div>
                  {option}
                </button>
              );
            })
          ) : (
            <div>
              <input
                type="text"
                disabled={isSubmitted}
                value={selectedAnswer || ''}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className={`w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-0 text-xl font-medium bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors
                  ${isSubmitted 
                    ? (Array.isArray(question.correctAnswer) ? question.correctAnswer.includes(selectedAnswer?.trim() || '') : question.correctAnswer === selectedAnswer?.trim())
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100'
                    : 'border-neutral-200 dark:border-neutral-700 focus:border-primary-500 dark:focus:border-primary-500 hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && selectedAnswer && !isSubmitted) submitAnswer();
                }}
              />
            </div>
          )}
        </div>

        {isSubmitted && (
          <div className="bg-neutral-50/80 dark:bg-neutral-800/50 p-5 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 animate-in slide-in-from-top-4 mb-8 flex gap-4">
            <div className="mt-0.5 text-primary-500"><RotateCcw size={20}/></div>
            <div>
              <h3 className="font-bold mb-1 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Explanation</h3>
              <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">{question.explanation}</p>
              {question.englishMeaning && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 italic mt-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60">
                  "{question.englishMeaning}"
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-neutral-100 dark:border-neutral-800">
          {!isSubmitted ? (
            <Button size="lg" onClick={submitAnswer} disabled={!selectedAnswer} className="min-w-[140px] shadow-sm">
              Check Answer
            </Button>
          ) : (
            <Button size="lg" onClick={nextQuestion} className="min-w-[140px] shadow-sm">
              {currentIndex < questions.length - 1 ? 'Next Question →' : 'Finish Session'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
