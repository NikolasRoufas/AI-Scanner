import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './Button';

interface CircularProgressProps {
    size?: number;
    strokeWidth?: number;
    value: number; // 0 to 100
    className?: string;
    showValue?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    size = 120,
    strokeWidth = 10,
    value,
    className,
    showValue = true,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    // Determine color based on value
    const getColor = (val: number) => {
        if (val >= 80) return "text-emerald-500";
        if (val >= 60) return "text-amber-500";
        return "text-rose-500";
    };

    const colorClass = getColor(value);

    return (
        <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
            >
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-muted/30"
                />
                {/* Progress Circle */}
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    className={cn("drop-shadow-md", colorClass)}
                />
            </svg>
            {showValue && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className={cn("text-3xl font-bold", colorClass)}
                    >
                        {Math.round(value)}
                    </motion.span>
                    <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Score</span>
                </div>
            )}
        </div>
    );
};

export default CircularProgress;
