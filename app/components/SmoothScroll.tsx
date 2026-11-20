"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.05,
      anchors: { offset: -92 },
      autoToggle: true,
      stopInertiaOnNavigate: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || !href.includes("#")) return;
      const id = href.split("#")[1];
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -92, duration: 1.25 });
    };
    document.addEventListener("click", onClick);

    const moves = prefersReducedMotion()
      ? []
      : gsap.utils.toArray<HTMLElement>("[data-scroll-y]").map((el) => {
          const distance = Number(el.dataset.scrollY || "70");
          const hero = el.hasAttribute("data-hero-block");
          const trigger = (el.closest("section, footer") as HTMLElement) ?? el;
          return gsap.fromTo(
            el,
            { y: hero ? 0 : distance },
            {
              y: hero ? -distance : 0,
              ease: "none",
              scrollTrigger: {
                trigger,
                start: hero ? "top top" : "top 96%",
                end: hero ? "bottom top" : "top 32%",
                scrub: 0.85,
              },
            }
          );
        });

    const parallax = prefersReducedMotion()
      ? []
      : gsap.utils.toArray<HTMLElement>("[data-speed]").map((el) => {
      const speed = Number(el.dataset.speed || "1");
      const distance = (1 - speed) * 30;
      return gsap.fromTo(
        el,
        { yPercent: -distance },
        {
          yPercent: distance,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        window.setTimeout(() => {
          lenis.scrollTo(target as HTMLElement, { offset: -92, immediate: false });
        }, 80);
      }
    }

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 450);

    return () => {
      window.clearTimeout(refresh);
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(onTick);
      [...moves, ...parallax].forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
