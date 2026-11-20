"use client";

import React from "react";
import Link from "next/link";
import SlideText from "./SlideText";

const stats = [
  { value: "1970s", label: "First established" },
  { value: "2014", label: "Re-established" },
  { value: "Kalkuzhy", label: "Thrissur, Kerala" },
];

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#041716] text-white"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src="/images/hero-village.png"
          alt=""
          data-speed="0.82"
          className="absolute left-0 top-[-10%] h-[120%] w-full object-cover"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[#041716]/55" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#041716]/75 via-[#041716]/45 to-[#041716]/70" />

      <div data-hero-block data-scroll-y="120" className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-28 text-center sm:px-6 sm:pt-32 lg:px-8">
        <SlideText className="text-center" delay={0.05}>
          <p className="mb-5 inline-flex items-center rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Arts · Sports · Culture
          </p>
        </SlideText>
        <SlideText className="text-center" delay={0.14}>
          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Voice of <span className="text-teal-200">Kalkuzhy</span>
          </h1>
        </SlideText>
        <SlideText className="text-center" delay={0.22}>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white sm:text-2xl">
            Celebrating culture, inspiring growth, and bringing the village together.
          </p>
        </SlideText>
        <SlideText className="text-center" delay={0.3}>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/posts"
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-3 text-base font-semibold text-teal-950 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-amber-50 sm:w-auto"
          >
            Explore posts
          </Link>
          <a
            href="#about"
            className="inline-flex w-full items-center justify-center rounded-full border border-white/70 bg-white/10 px-7 py-3 text-base font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
          >
            About the club
          </a>
        </div>
        </SlideText>

        <SlideText className="text-center" delay={0.38}>
        <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/25 bg-[#041716]/80 px-4 py-4"
            >
              <dt className="font-display text-2xl text-white">{stat.value}</dt>
              <dd className="mt-1 text-sm text-white/90">{stat.label}</dd>
            </div>
          ))}
        </dl>
        </SlideText>
      </div>
    </section>
  );
};

export default Hero;
