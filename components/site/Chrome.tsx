// Navigation and footer of the public site, matching public/site/index.html (the homepage).
// Plain <a> tags on purpose: /site/app.js wires the menu and theme on each full page load.

const Mark = () => (
  <svg className="brand-mark" viewBox="0 0 155 110" fill="none" aria-hidden="true">
    <circle cx="75" cy="55" r="47" stroke="currentColor" strokeWidth="15" />
    <rect x="4" y="47" width="56" height="16" fill="currentColor" />
    <rect x="91" y="47" width="60" height="16" fill="currentColor" />
  </svg>
);

const LINKS = [
  { href: "/products", label: "Products" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  return (
    <>
      <nav className="nav" aria-label="Main">
        <a className="brand title-3" href="/" aria-label="Dorefin AI home">
          <Mark />
          <span className="brand-name">Dorefin AI</span>
        </a>
        <div className="nav-links">
          {LINKS.map((l) => (
            <a key={l.href} className="title-4" href={l.href}>{l.label}</a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="btn btn--icon" type="button" data-theme-cycle aria-label="Theme: Dark. Switch to Light" title="Theme: Dark. Switch to Light">
            <i className="ph ph-moon" aria-hidden="true"></i>
          </button>
          <a className="btn btn--primary button-sm" href="/contact">Book a demo</a>
          <button className="btn btn--icon menu-toggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu">
            <span className="bar" aria-hidden="true"></span>
            <span className="bar" aria-hidden="true"></span>
          </button>
        </div>
      </nav>
      <div className="menu" id="menu" data-open="false" inert>
        <ul className="menu-links">
          {LINKS.map((l, i) => (
            <li key={l.href} className="menu-item" style={{ ["--d" as string]: `${i * 60}ms` }}>
              <a className="heading-5" href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer band">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col">
            <a className="brand title-3" href="/" style={{ padding: 0 }}>
              <Mark />
              Dorefin AI
            </a>
            <p className="body-6 muted" style={{ maxWidth: 360 }}>AI products for newsroom desks and digital publishing teams. Jaipur, India.</p>
          </div>
          <nav className="footer-col" aria-labelledby="footer-site">
            <h2 className="caption-3" id="footer-site">Site</h2>
            <a className="body-6" href="/products">Products</a>
            <a className="body-6" href="/how-it-works">How it works</a>
            <a className="body-6" href="/about">About</a>
            <a className="body-6" href="/contact#faq">FAQ</a>
            <a className="body-6" href="/contact">Book a demo call</a>
          </nav>
          <div className="footer-col">
            <h2 className="caption-3">Contact</h2>
            <a className="body-6" href="mailto:arathore@dorefinai.com">arathore@dorefinai.com</a>
            <a className="body-6" href="tel:+919019193141">+91 9019193141</a>
            <a className="body-6" href="https://www.linkedin.com/company/dorefin-ai/" target="_blank" rel="noopener">LinkedIn</a>
            <p className="body-6 muted">LIC Towers, Sector 2, Vidhyadhar Nagar, Jaipur 302019</p>
          </div>
        </div>
        <div className="footer-legal">
          <p className="caption-5">© 2026 Dorefin AI Technologies Pvt Ltd. CIN U62011RJ2026PTC118545</p>
          <div className="footer-col" style={{ flexDirection: "row", gap: "var(--s-300)" }}>
            <a className="caption-5" href="/privacy">Privacy policy</a>
            <a className="caption-5" href="/terms">Terms</a>
            <a className="caption-5" href="mailto:privacy@dorefinai.com">privacy@dorefinai.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
