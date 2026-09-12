import React from 'react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 hover:from-amber-400 hover:to-yellow-500 shadow-[0_4px_14px_0_rgba(245,158,11,0.39)]',
      secondary: 'bg-slate-800 text-amber-500 border-2 border-slate-700 hover:border-amber-500/50 hover:bg-slate-700',
      outline: 'bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500/10',
      danger: 'bg-red-600 text-white hover:bg-red-500',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg w-full',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={props.disabled ? {} : { scale: 1.02 }}
        whileTap={props.disabled ? {} : { scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
