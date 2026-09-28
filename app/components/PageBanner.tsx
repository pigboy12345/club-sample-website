"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "./motion";

type PageBannerProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  image?: string;
};

export default function PageBanner({ eyebrow, title, subtitle, icon, image }: PageBannerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-banner]", {
        y: 28,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#062421] text-white">
      {image ? (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={image}
            alt=""
            data-speed="0.8"
            className="absolute left-0 top-[-12%] h-[124%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#062421]/72" />
        </div>
      ) : null}
      <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-teal-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl" />
      <div ref={ref} className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        {icon ? (
          <div data-banner className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-amber-200 ring-1 ring-white/15">
            {icon}
          </div>
        ) : null}
        <p data-banner className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
          {eyebrow}
        </p>
        <h1 data-banner className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p data-banner className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-teal-50/85 sm:text-lg">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
