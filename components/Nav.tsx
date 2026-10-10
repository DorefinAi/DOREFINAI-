"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Wordmark from "./Wordmark";

const links = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const current = (href: string) => (pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined);

  return (
    <header className="nav" data-open={open}>
      <div className="nav-bar">
        <Wordmark />
        <nav className="nav-links" aria-label="Main">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} aria-current={current(href)}>
              {label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
        <Link href="/contact" className="nav-cta">
          Talk to us
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className="menu" id="menu" aria-hidden={!open} inert={!open}>
        <nav aria-label="Menu">
          {[{ href: "/", label: "Home" }, ...links].map(({ href, label }, index) => (
            <Link key={href} href={href} style={{ transitionDelay: open ? `${80 + index * 45}ms` : "0ms" }}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
