"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const RADIUS = 70; // px around the cursor that is affected
const BOOST = 0.18; // extra scale for the word directly under the cursor
const ZONE = "main > section:not(:first-child):not([data-no-lens])";
const SKIP = ".mock, form, .btn, script, style, svg";

// Magnifying-glass hover: words near the cursor swell, strongest at the centre
// and fading with distance. Applies to every section except the first one on
// the page (and any section marked data-no-lens), and only for mouse users who haven't asked for reduced motion.
export default function Lens() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>(ZONE));

    // Wrap each word in a span so it can be scaled on its own.
    for (const section of sections) {
      const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) =>
          !node.nodeValue?.trim() || node.parentElement?.closest(SKIP) || node.parentElement?.classList.contains("lens-word")
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT,
      });
      const texts: Text[] = [];
      while (walker.nextNode()) texts.push(walker.currentNode as Text);

      for (const text of texts) {
        const fragment = document.createDocumentFragment();
        for (const part of text.nodeValue!.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            fragment.append(part);
            continue;
          }
          const word = document.createElement("span");
          word.className = "lens-word";
          word.textContent = part;
          fragment.append(word);
        }
        text.replaceWith(fragment);
      }
    }

    let active: HTMLElement[] = [];
    let frame = 0;
    let x = 0;
    let y = 0;
    let target: Element | null = null;

    const release = () => {
      for (const word of active) word.style.transform = "";
      active = [];
    };

    const update = () => {
      frame = 0;
      const section = target?.closest<HTMLElement>(ZONE);
      const next: HTMLElement[] = [];
      if (section && !target?.closest(SKIP)) {
        const frameBox = section.getBoundingClientRect();
        for (const word of section.querySelectorAll<HTMLElement>(".lens-word")) {
          // Layout offsets ignore transforms, so a word is always measured
          // where it rests, not where the lens has pushed it.
          let left = 0;
          let top = 0;
          for (let el: HTMLElement | null = word; el && el !== section; el = el.offsetParent as HTMLElement | null) {
            left += el.offsetLeft;
            top += el.offsetTop;
          }
          const cx = frameBox.left + left + word.offsetWidth / 2;
          const cy = frameBox.top + top + word.offsetHeight / 2;
          const distance = Math.hypot(cx - x, cy - y);
          if (distance > RADIUS) continue;
          const strength = Math.cos((distance / RADIUS) * (Math.PI / 2)) ** 4;
          word.style.transform = `scale(${(1 + BOOST * strength).toFixed(3)})`;
          next.push(word);
        }
      }
      for (const word of active) {
        if (next.includes(word)) continue;
        word.style.transform = "";
      }
      active = next;
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      target = event.target as Element;
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", release);
    window.addEventListener("scroll", release, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      release();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", release);
      window.removeEventListener("scroll", release);
    };
  }, [pathname]);

  return null;
}
