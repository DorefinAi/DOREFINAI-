"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Fades in every [data-reveal] element as it scrolls into view. Elements stay
// visible without JavaScript: the hidden state only applies once this has run.
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    // Anything already on screen is shown as-is, so the first paint never flickers.
    const below = targets.filter((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add("is-in");
        return false;
      }
      return true;
    });
    root.classList.add("reveal-on");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    below.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
