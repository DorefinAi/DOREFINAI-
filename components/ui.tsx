import Link from "next/link";
import Ribbons from "./Ribbons";

export const Arrow = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

export function Title({ text }: { text: string }) {
  const cut = text.indexOf(". ");
  if (cut < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, cut + 1)} <span className="dim">{text.slice(cut + 2)}</span>
    </>
  );
}

type CtaProps = { href: string; children: React.ReactNode; variant?: "primary" | "ghost" | "light" };

// Pill button with the arrow seated in its own circle.
export function Cta({ href, children, variant = "primary" }: CtaProps) {
  const external = href.startsWith("mailto:") || href.startsWith("http");
  const inner = (
    <>
      {children}
      <span className="btn-icon">
        <Arrow />
      </span>
    </>
  );
  const className = `btn btn-${variant} btn-arrow`;
  return external ? (
    <a href={href} className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-link">
      {children}
      <Arrow />
    </Link>
  );
}

type HeadProps = { eyebrow?: string; title: string; lede?: string; center?: boolean; as?: "h1" | "h2" };

export function SectionHead({ eyebrow, title, lede, center, as: Tag = "h2" }: HeadProps) {
  return (
    <div className={`head${center ? " head-center" : ""}`} data-reveal>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className={Tag === "h1" ? "t-hero" : "t-h2"}>
        <Title text={title} />
      </Tag>
      {lede && <p className="t-lede">{lede}</p>}
    </div>
  );
}

// Card with a machined outer tray and an inner surface.
export function Card({ children, className = "", tone }: { children: React.ReactNode; className?: string; tone?: "dark" | "tint" }) {
  return (
    <div className={`shell ${className}`} data-tone={tone} data-reveal>
      <div className="core">{children}</div>
    </div>
  );
}

export function Faq({ heading, items }: { heading: string; items: { question: string; answer: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section className="section" data-no-lens>
      <div className="wrap faq">
        <SectionHead eyebrow="FAQ" title={heading} />
        <div className="faq-list" data-reveal>
          {items.map((item, index) => (
            <details key={index} name="faq">
              <summary>
                {item.question}
                <span className="faq-mark" aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

type PanelProps = { heading: string; body: string; children: React.ReactNode };

export function CtaPanel({ heading, body, children }: PanelProps) {
  return (
    <section className="section section-last">
      <div className="wrap">
        <div className="panel" data-reveal>
          <Ribbons dim />
          <h2 className="t-h2">
            <Title text={heading} />
          </h2>
          <p className="t-lede">{body}</p>
          <div className="actions">{children}</div>
        </div>
      </div>
    </section>
  );
}

export const glyphPaths = [
  "M4 7h16M4 12h10M4 17h13", // lines
  "M6 4h9l4 4v12H6zM14 4v5h5M9 13h7M9 17h5", // document
  "M9 8H6a4 4 0 000 8h3M15 8h3a4 4 0 010 8h-3M8 12h8", // link
  "M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z", // clock
  "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9", // box
  "M12 20s-7-4.2-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.8-7 10-7 10z", // heart
  "M5 5h14v14H5zM5 10h14M10 5v14", // grid
  "M5 19V11M12 19V5M19 19v-6", // bars
];

// Thin line glyphs, assigned by position so admin-added items still get one.
export function Glyph({ index }: { index: number }) {
  return (
    <span className="glyph" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d={glyphPaths[index % glyphPaths.length]} />
      </svg>
    </span>
  );
}
