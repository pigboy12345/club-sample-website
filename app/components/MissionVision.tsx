"use client";

import React from "react";
import { Eye, Target } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SlideText from "./SlideText";

const cards = [
  {
    icon: Target,
    title: "Our mission",
    image: "/images/mission-talent.png",
    imageAlt: "Youth learning arts and skills together in Kalkuzhy",
    body: "Our mission is to nurture talent, empower youth, and celebrate the rich cultural heritage of Kalkuzhy. Through a vibrant mix of arts, sports, cultural activities, and social service, we strive to foster unity, uphold democratic values, and create opportunities that drive the holistic growth and well-being of our community.",
  },
  {
    icon: Eye,
    title: "Our vision",
    image: "/images/vision-generations.png",
    imageAlt: "Generations walking together through a Kerala village",
    body: "To build a united, progressive, and culturally vibrant Kalkuzhy, where arts, sports, education, and service come together to inspire growth, harmony, and opportunities for every generation.",
  },
];

const MissionVision: React.FC = () => {
  return (
    <section id="mission" className="relative overflow-hidden bg-[#062421] py-16 text-white sm:py-24">
      <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />
      <div data-scroll-y="80" className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Purpose"
            title="Mission & vision"
            subtitle="What guides the forum, and the Kalkuzhy we are working toward."
            tone="light"
          />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={index * 0.08}>
                <article className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
                  <div className="mb-5 overflow-hidden rounded-2xl">
                    <img
                      src={card.image}
                      alt={card.imageAlt}
                      data-speed="0.9"
                      className="h-44 w-full scale-110 object-cover sm:h-52"
                    />
                  </div>
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-200/15 text-amber-200">
                    <Icon className="h-6 w-6" />
                  </div>
                  <SlideText delay={0.08}>
                    <h3 className="font-display text-2xl font-semibold sm:text-3xl">{card.title}</h3>
                  </SlideText>
                  <SlideText delay={0.16}>
                    <p className="mt-4 text-base leading-relaxed text-teal-50/85">{card.body}</p>
                  </SlideText>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
