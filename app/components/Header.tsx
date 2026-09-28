"use client";

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NotificationBell from "./NotificationBell";

const navItems = [
  { name: "Home", href: "/#home", id: "home" },
  { name: "About", href: "/#about", id: "about" },
  { name: "Mission", href: "/#mission", id: "mission" },
  { name: "Activities", href: "/#activities", id: "activities" },
  { name: "Gallery", href: "/#gallery", id: "gallery" },
  { name: "Contact", href: "/#contact", id: "contact" },
];

const sectionIds = navItems.map((item) => item.id);

function currentSection() {
  const marker = 110;
  let current = sectionIds[0];
  for (const id of sectionIds) {
    const section = document.getElementById(id);
    if (!section) continue;
    if (section.getBoundingClientRect().top - marker <= 0) current = id;
  }
  const nearBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (nearBottom) return "contact";
  return current;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const pathname = usePathname();
  const solid = true;
  const onHome = pathname === "/";

  useEffect(() => {
    if (!onHome) return;

    const update = () => setActiveId(currentSection());
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("hashchange", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("hashchange", update);
    };
  }, [onHome]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-stone-200/80 bg-[#f6f3ee]/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between gap-3 sm:h-20">
          <a href="/#home" className="flex min-w-0 items-center" aria-label="Bappuji home">
            <Image
              src="/bappuji_main_logo_enhanced.png"
              alt="Bappuji Kala Kayika Samskarika Vedhi"
              width={220}
              height={64}
              priority
              className="h-9 w-auto sm:h-11"
            />
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = onHome && activeId === item.id;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={active ? "true" : undefined}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "bg-teal-800 text-white"
                      : solid
                        ? "text-stone-700 hover:bg-teal-50 hover:text-teal-800"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
            <NotificationBell tone={solid ? "dark" : "light"} />
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <NotificationBell tone={solid ? "dark" : "light"} />
            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className={`inline-flex items-center justify-center rounded-full p-2 transition-colors ${
                solid ? "text-stone-800 hover:bg-stone-200/70" : "text-white hover:bg-white/10"
              }`}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-out lg:hidden ${
            isMenuOpen ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-1 border-t border-stone-200/80 pb-4 pt-2">
            {navItems.map((item) => {
              const active = onHome && activeId === item.id;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={active ? "true" : undefined}
                  className={`block rounded-xl px-3 py-3 text-base font-medium transition-colors ${
                    active
                      ? "bg-teal-800 text-white"
                      : "text-stone-800 hover:bg-teal-50 hover:text-teal-800"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
