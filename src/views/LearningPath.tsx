import React, { useEffect, useRef } from 'react';
import { useProgress } from '../store/ProgressContext';
import { BookOpen, Headphones, PenLine, Mic, Star, Check, Lock, Map as MapIcon, Flag } from 'lucide-react';
import { Card } from '../components/Card';

const PATH_NODES = Array.from({ length: 25 }, (_, i) => {
  const lessonNumber = i + 1;
  const isCheckpoint = lessonNumber % 5 === 0;
  
  const icons = [BookOpen, Headphones, PenLine, Mic];
  const Icon = isCheckpoint ? Star : icons[i % icons.length];
  
  return {
    id: lessonNumber,
    lesson: lessonNumber,
    isCheckpoint,
    Icon
  };
});

export function LearningPathView({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const { progress } = useProgress();
  const pathContainerRef = useRef<HTMLDivElement>(null);
  
  // Find current active lesson
  let activeLesson = 1;
  for (let i = 1; i <= PATH_NODES.length; i++) {
    if ((progress.lessonProgress[i] || 0) < 100) {
      activeLesson = i;
      break;
    }
  }

  // Winding offset calculation
  const getOffset = (index: number) => {
    return Math.sin(index * 0.6) * 60; // Max 60px left or right
  };

  useEffect(() => {
    // Smooth scroll to the active lesson on mount
    const activeEl = document.getElementById(`node-${activeLesson}`);
    if (activeEl && pathContainerRef.current) {
      setTimeout(() => {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [activeLesson]);

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-32 px-4 animate-in fade-in duration-300">
      
      <div className="mb-10 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-bold tracking-wide uppercase">
          <Flag size={16} /> A1 German
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">Unit 1: Basics</h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-medium">Introduce yourself, order food, and get around.</p>
      </div>

      <div ref={pathContainerRef} className="relative flex flex-col items-center">
        {PATH_NODES.map((node, index) => {
          const isCompleted = activeLesson > node.lesson || (progress.lessonProgress[node.lesson] === 100);
          const isCurrent = activeLesson === node.lesson;
          const isLocked = activeLesson < node.lesson;
          
          const offset = getOffset(index);
          const nextOffset = index < PATH_NODES.length - 1 ? getOffset(index + 1) : offset;
          
          let bgClass = "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600";
          let borderClass = "border-neutral-300 dark:border-neutral-700 border-b-neutral-300 dark:border-b-neutral-700";
          let shadowClass = "";
          
          if (isCompleted) {
            bgClass = "bg-primary-500 text-white";
            borderClass = "border-primary-600 border-b-primary-700";
          } else if (isCurrent) {
            bgClass = "bg-primary-500 text-white";
            borderClass = "border-primary-600 border-b-primary-700";
            shadowClass = "ring-4 ring-primary-500/30 animate-pulse";
          }
          
          return (
            <div key={node.id} className="relative w-full flex justify-center py-6">
              
              {/* SVG connection line to the next node */}
              {index < PATH_NODES.length - 1 && (
                <svg className="absolute top-[50%] left-0 w-full h-full pointer-events-none" style={{ zIndex: 0, height: 'calc(100% + 48px)' }}>
                  <path 
                    d={`M calc(50% + ${offset}px) 32 C calc(50% + ${offset}px) 70, calc(50% + ${nextOffset}px) 30, calc(50% + ${nextOffset}px) 100`} 
                    fill="none" 
                    stroke={isCompleted ? "#c1293c" : "#e5e5e5"} 
                    strokeWidth="12" 
                    strokeLinecap="round" 
                    className="dark:opacity-80"
                  />
                </svg>
              )}
              
              <div id={`node-${node.lesson}`} className="relative z-10" style={{ transform: `translateX(${offset}px)` }}>
                {isCurrent && (
                   <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-800 px-4 py-2 rounded-xl font-bold text-primary-600 dark:text-primary-400 shadow-lg border border-neutral-200 dark:border-neutral-700 whitespace-nowrap animate-bounce z-20">
                     START
                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-neutral-800 rotate-45 border-b border-r border-neutral-200 dark:border-neutral-700"></div>
                   </div>
                )}
                
                <button 
                  onClick={() => {
                    if (!isLocked && onNavigate) {
                      // Logic to pick the right view based on the node's Icon or index
                      const views = ['vocabulary', 'artikel', 'grammatik', 'satzbildung', 'horen', 'lesen', 'schreiben', 'sprechen'];
                      const viewTarget = node.isCheckpoint ? 'mocktest' : views[index % views.length];
                      onNavigate(viewTarget);
                    }
                  }}
                  className={`relative ${node.isCheckpoint ? 'w-20 h-20' : 'w-16 h-16'} rounded-full flex items-center justify-center border-2 border-b-[6px] transition-all hover:scale-105 hover:brightness-110 active:scale-95 active:border-b-2 active:translate-y-1 ${bgClass} ${borderClass} ${shadowClass}`}
                  disabled={isLocked}
                >
                  <node.Icon size={node.isCheckpoint ? 32 : 24} className={isLocked ? "opacity-50" : ""} />
                  
                  {isCompleted && (
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full p-1 shadow-sm border-2 border-white dark:border-neutral-900">
                      <Check size={14} strokeWidth={4} />
                    </div>
                  )}
                  {isLocked && !isCompleted && !isCurrent && (
                     <div className="absolute -bottom-1 -right-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 rounded-full p-1 shadow-sm border-2 border-white dark:border-neutral-900">
                       <Lock size={12} strokeWidth={3} />
                     </div>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-16 text-center space-y-2 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-200 dark:bg-neutral-800 text-neutral-400 border-4 border-neutral-300 dark:border-neutral-700">
           <Lock size={24} />
        </div>
        <h2 className="text-xl font-bold text-neutral-400 dark:text-neutral-600">Unit 2: Daily Life</h2>
        <p className="text-neutral-400 dark:text-neutral-600 font-medium">Complete Unit 1 to unlock</p>
      </div>
    </div>
  );
}
