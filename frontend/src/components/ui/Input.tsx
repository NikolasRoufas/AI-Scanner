import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from './Button'; // Reusing cn utility

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium leading-none text-[hsl(var(--muted-foreground))] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={type}
                        className={cn(
                            "flex h-11 w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background)/0.5)] px-3 py-2 text-sm ring-offset-[hsl(var(--background))] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                            error && "border-[hsl(var(--destructive))] focus-visible:ring-[hsl(var(--destructive))]",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-sm font-medium text-[hsl(var(--destructive))]">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export default Input;
