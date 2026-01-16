import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

// Utility for class merging (you might want to move this to a shared utils file eventually)
export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background active:scale-[0.98]",
    {
        variants: {
            variant: {
                primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 border border-white/10 relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/10 after:to-transparent after:opacity-0 hover:after:opacity-100",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border shadow-sm",
                outline: "border border-input bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground hover:border-accent shadow-sm",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 px-4 rounded-xl text-xs",
                lg: "h-14 px-8 rounded-2xl text-base",
                icon: "h-11 w-11",
            },
            fullWidth: {
                true: "w-full",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
            fullWidth: false,
        },
    }
);

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, isLoading, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
