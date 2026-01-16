import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from './Button';

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "glass-panel rounded-2xl p-6 text-card-foreground border border-white/10 shadow-xl shadow-black/5",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
