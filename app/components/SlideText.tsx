"use client";

import { motion, useReducedMotion } from "framer-motion";

type SlideTextProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function SlideText({ children, className = "", delay = 0 }: SlideTextProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      <motion.div
        variants={{ hidden: { x: "-105%" }, show: { x: "0%" } }}
        transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
