"use client";

import { useEffect, useRef } from "react";

// Each ribbon is a bundle of fine strands that share a path and fan apart and
// pinch together along it, which reads as a band of light twisting in space.
const ribbons = [
  { y: 0.2, tilt: 0.34, amp: 70, len: 0.0042, speed: 0.22, spread: 150, colors: ["#34e3a1", "#22d3ee", "#3b6bff", "#8b5cf6"] },
  { y: 0.46, tilt: 0.3, amp: 90, len: 0.0034, speed: 0.17, spread: 190, colors: ["#8b5cf6", "#3b6bff", "#22d3ee", "#34e3a1"] },
  { y: 0.74, tilt: 0.24, amp: 60, len: 0.005, speed: 0.27, spread: 120, colors: ["#22d3ee", "#3b6bff", "#8b5cf6", "#3b6bff"] },
];

const STRANDS = 30;
const STEP = 10;

// Decorative flowing background. Paused off screen; drawn once if the visitor
// prefers reduced motion.
export default function Ribbons({ dim = false }: { dim?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const set = dim ? ribbons.slice(1, 2) : ribbons;
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;

    const draw = (time: number) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, width, height);
      const light = document.documentElement.dataset.theme === "light";
      ctx.globalCompositeOperation = light ? "source-over" : "lighter";
      ctx.lineWidth = 1.1;

      for (const ribbon of set) {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        ribbon.colors.forEach((color, index) => gradient.addColorStop(index / (ribbon.colors.length - 1), color));
        ctx.strokeStyle = gradient;

        for (let strand = 0; strand < STRANDS; strand++) {
          const offset = strand / (STRANDS - 1) - 0.5;
          // Strands at the edge of the band are fainter than those in its middle.
          ctx.globalAlpha = (dim ? 0.24 : 0.44) * (light ? 1.5 : 1) * (1 - Math.abs(offset) * 1.5);
          ctx.beginPath();
          for (let x = -STEP; x <= width + STEP; x += STEP) {
            const phase = x * ribbon.len + t * ribbon.speed;
            const twist = 0.2 + 0.8 * Math.abs(Math.sin(phase * 0.55 + ribbon.y * 9));
            const y =
              ribbon.y * height +
              ribbon.tilt * (x - width / 2) +
              Math.sin(phase + offset * 1.4) * ribbon.amp +
              Math.sin(phase * 0.42 - t * 0.11) * ribbon.amp * 0.7 +
              offset * ribbon.spread * twist;
            if (x === -STEP) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      draw(time);
      if (visible) frame = requestAnimationFrame(loop);
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (!visible) draw(4000);
    };

    const observer = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting && !still;
      if (visible && !was) frame = requestAnimationFrame(loop);
    });
    const resizer = new ResizeObserver(resize);

    // Redraw when the theme changes while the animation is paused.
    const themeWatch = new MutationObserver(() => {
      if (!visible) draw(4000);
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    resize();
    observer.observe(canvas);
    resizer.observe(canvas);

    return () => {
      visible = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizer.disconnect();
      themeWatch.disconnect();
    };
  }, [dim]);

  return <canvas ref={ref} className="ribbons" aria-hidden="true" />;
}
