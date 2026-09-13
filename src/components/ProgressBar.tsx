import React from 'react';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress: number; // 0 to 100
  label?: string;
  className?: string;
  height?: 'sm' | 'md';
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(({ 
  progress, label, className = '', height = 'md', ...props 
}, ref) => {
  const boundedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div ref={ref} className={`w-full ${className}`} {...props}>
      {label && (
        <div className="flex justify-between items-center mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          <span>{label}</span>
          <span>{Math.round(boundedProgress)}%</span>
        </div>
      )}
      <div className={`w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden ${height === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
        <div 
          className="bg-neutral-800 dark:bg-neutral-200 h-full rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${boundedProgress}%` }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';
