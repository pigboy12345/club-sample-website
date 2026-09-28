"use client";

import { motion, useReducedMotion } from "framer-motion";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  tone?: "dark" | "light";
  align?: "center" | "left";
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = "dark",
  align = "center",
}: SectionHeadingProps) {
  const light = tone === "light";
  const centered = align === "center";
  const reduce = useReducedMotion();

  const line = (delay: number, Tag: "p" | "h2", children: React.ReactNode, className: string) => {
    const content = <Tag className={className}>{children}</Tag>;
    if (reduce) return content;

    return (
      <motion.div
        className="overflow-hidden"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.div
          variants={{ hidden: { x: "-105%" }, show: { x: "0%" } }}
          transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {content}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className={`mb-10 sm:mb-14 ${centered ? "mx-auto max-w-2xl text-center" : "max-w-xl text-left"}`}>
      {line(
        0,
        "p",
        eyebrow,
        `mb-3 text-xs font-semibold uppercase tracking-[0.22em] ${light ? "text-amber-200" : "text-teal-700"}`
      )}
      {line(
        0.08,
        "h2",
        title,
        `font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl ${light ? "text-white" : "text-stone-900"}`
      )}
      {subtitle
        ? line(
            0.16,
            "p",
            subtitle,
            `mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-teal-50/85" : "text-stone-600"}`
          )
        : null}
      <span
        className={`mt-5 block h-px w-16 bg-gradient-to-r from-teal-500 to-amber-400 ${centered ? "mx-auto" : ""}`}
        aria-hidden
      />
    </div>
  );
}
