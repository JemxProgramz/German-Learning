import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '', 
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-1 dark:focus:ring-offset-neutral-900 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none touch-manipulation';
  
  const variants = {
    primary: 'bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600 shadow-sm shadow-primary-900/10 active:scale-[0.98]',
    secondary: 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 shadow-sm shadow-black/5 active:scale-[0.98]',
    outline: 'border-2 border-neutral-200 dark:border-neutral-700 bg-transparent hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 active:scale-[0.98]',
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 font-medium active:scale-[0.98]',
  };
  
  const sizes = {
    sm: 'min-h-[36px] sm:min-h-[32px] px-3 py-1 text-xs sm:text-sm',
    md: 'min-h-[44px] sm:min-h-[40px] px-4 py-2 text-sm',
    lg: 'min-h-[48px] sm:min-h-[44px] px-5 sm:px-6 py-2.5 text-base sm:text-lg',
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button 
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

