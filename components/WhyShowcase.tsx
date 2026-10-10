"use client";

import { useRef, useState } from "react";
import { glyphPaths } from "./ui";

type Item = { title: string; text: string };

// Which line drawing goes with each reason, in order: box, link, bars, heart.
const drawings = [4, 2, 7, 5];

// Interactive list of reasons. One is open at a time; it advances on its own
// (the progress line is the timer, so hovering pauses it) and the large panel
// redraws its line drawing for whichever reason is open.
export default function WhyShowcase({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);

  // The glow inside the panel follows the cursor.
  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    panel.current?.style.setProperty("--mx", `${event.clientX - box.left}px`);
    panel.current?.style.setProperty("--my", `${event.clientY - box.top}px`);
  }

  return (
    <div className="why" data-reveal>
      <div className="why-list" role="tablist" aria-orientation="vertical">
        {items.map((item, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            id={`why-tab-${index}`}
            aria-selected={index === active}
            aria-controls="why-panel"
            className="why-item"
            onClick={() => setActive(index)}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
          >
            <span className="why-count">{String(index + 1).padStart(2, "0")}</span>
            <span className="why-body">
              <span className="why-title">{item.title}</span>
              <span className="why-text">
                <span>{item.text}</span>
              </span>
            </span>
            {index === active && (
              <span className="why-progress" onAnimationEnd={() => setActive((index + 1) % items.length)} />
            )}
          </button>
        ))}
      </div>

      <div className="why-panel" id="why-panel" role="tabpanel" aria-labelledby={`why-tab-${active}`} ref={panel} onPointerMove={onMove}>
        <span className="why-rings" aria-hidden="true" />
        {items.map((item, index) => (
          <div className="why-slide" key={index} data-active={index === active} aria-hidden={index !== active}>
            {/* Remounting on activation restarts the stroke-drawing animation. */}
            <svg key={index === active ? "on" : "off"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path pathLength={1} d={glyphPaths[drawings[index % drawings.length]]} />
            </svg>
            <span className="why-big">{String(index + 1).padStart(2, "0")}</span>
            <span className="why-caption">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
