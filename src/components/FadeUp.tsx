'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';

/**
 * Lightweight fade-in-up animation that replaces framer-motion.
 * Uses CSS transitions instead of a 200KB JS library.
 */
export function FadeUp({ 
  children, 
  delay = 0, 
  className = '' 
}: { 
  children: ReactNode; 
  delay?: number; 
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Stagger container — children fade in one after another.
 */
export function Stagger({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}