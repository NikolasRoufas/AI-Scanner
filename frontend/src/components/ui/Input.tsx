import { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from './Button';
import { motion } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className={cn(
                        "text-sm font-medium leading-none transition-colors",
                        error ? "text-destructive" : isFocused ? "text-primary" : "text-muted-foreground",
                        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    )}>
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {/* Animated background glow on focus */}
                    <div className={cn(
                        "absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/50 to-indigo-400/50 opacity-0 blur transition duration-500",
                        isFocused && "opacity-75 blur-md"
                    )} />

                    <input
                        type={type}
                        className={cn(
                            "relative flex h-12 w-full rounded-xl border border-input bg-background/60 backdrop-blur-sm px-4 py-2 text-sm shadow-sm transition-all duration-200",
                            "placeholder:text-muted-foreground/70",
                            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                            "focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary/50", // Custom focus handling below
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-destructive focus-visible:border-destructive",
                            className
                        )}
                        ref={ref}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        {...props}
                    />
                </div>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-medium text-destructive flex items-center gap-1"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export default Input;
