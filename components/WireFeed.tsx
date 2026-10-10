"use client";

import { useEffect, useState } from "react";

// Schematic slugs, not real stories: the panel shows the path an item takes.
const items = [
  { slug: "Monsoon advisory", desk: "Weather" },
  { slug: "City council budget", desk: "City" },
  { slug: "Market close", desk: "Business" },
  { slug: "Cricket scorecard", desk: "Sport" },
  { slug: "Rail timetable change", desk: "Transport" },
];

const stages = ["Received", "Sorted", "Draft ready"];
const CYCLE = items.length + 3;

export default function WireFeed() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setTick((t) => t + 1), 1600);
    return () => clearInterval(timer);
  }, []);

  return (
    <figure className="mock">
      <div className="mock-head">
        Assignment desk
        <span className="mock-tag">Vartmaan AI</span>
      </div>
      <ol className="wire">
        {items.map((item, index) => {
          const phase = (((tick - index) % CYCLE) + CYCLE) % CYCLE;
          const stage = tick === 0 ? 2 : Math.min(phase, 2);
          return (
            <li key={item.slug} data-stage={stage}>
              <span className="wire-slug">{item.slug}</span>
              <span className="wire-desk">{stage > 0 ? item.desk : "Sorting"}</span>
              <span className="wire-stage">{stages[stage]}</span>
            </li>
          );
        })}
      </ol>
      <figcaption>Illustration: items arrive, are sorted to a desk, and reach editors as drafts.</figcaption>
    </figure>
  );
}
