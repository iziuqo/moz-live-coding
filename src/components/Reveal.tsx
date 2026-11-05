"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { duration, ease } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before animating; use it to stagger siblings. */
  delay?: number;
  className?: string;
};

/**
 * Fades and lifts its children into place on mount.
 * Respects the OS "reduce motion" setting by skipping the lift.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: duration.slow, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}
