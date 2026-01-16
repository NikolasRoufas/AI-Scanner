import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from './Button';

export interface SelectOption {
    label: string;
    value: string | number;
}

interface SelectProps {
    label?: string;
    value: string | number | null;
    onChange: (value: string | number) => void;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

const Select: React.FC<SelectProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder = "Select an option",
    disabled = false,
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (optionValue: string | number) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={cn("space-y-2 relative", className)} ref={containerRef}>
            {label && (
                <label className="text-sm font-medium text-muted-foreground ml-1">
                    {label}
                </label>
            )}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={cn(
                    "relative flex items-center justify-between w-full h-12 px-4 rounded-xl border bg-background/50 backdrop-blur-sm transition-all duration-200 cursor-pointer",
                    isOpen ? "border-primary ring-2 ring-primary/20" : "border-input hover:border-primary/50",
                    disabled && "opacity-50 cursor-not-allowed bg-muted/50"
                )}
            >
                <span className={cn("text-sm truncate pr-8", !selectedOption && "text-muted-foreground")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground absolute right-4 transition-transform duration-200", isOpen && "rotate-180")} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 overflow-hidden bg-popover border border-border rounded-xl shadow-xl shadow-black/10 max-h-60 overflow-y-auto custom-scrollbar"
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={cn(
                                    "px-4 py-3 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-between",
                                    option.value === value && "bg-primary/5 text-primary font-medium"
                                )}
                            >
                                <span className="truncate">{option.label}</span>
                                {option.value === value && (
                                    <Check className="w-4 h-4 text-primary" />
                                )}
                            </div>
                        ))}
                        {options.length === 0 && (
                            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                                No options available
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Select;
