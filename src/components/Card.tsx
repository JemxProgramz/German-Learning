import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, className = '', ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={`bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/80 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none p-4 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
