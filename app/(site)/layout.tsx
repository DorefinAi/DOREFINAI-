import Link from "next/link";
import Lens from "@/components/Lens";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Wordmark from "@/components/Wordmark";
import { getContent } from "@/lib/store";

// Copy is edited from /admin, so pages are rendered per request.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { company, products } = await getContent();

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <Reveal />
      <Lens />

      <main id="main">{children}</main>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div className="footer-brand">
            <Wordmark />
            <p>{company.tagline}</p>
          </div>
          <div>
            <h2>Company</h2>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h2>Products</h2>
            <ul>
              <li><Link href="/products">All products</Link></li>
              {products.items.map((product) => (
                <li key={product.id}>
                  <Link href={`/products/${product.id}`}>{product.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Get in touch</h2>
            <ul>
              <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
              <li><a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a></li>
              <li>{company.location}</li>
              <li>
                <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="wrap footer-bar">
          <span>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </span>
          <span className="footer-legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </span>
          <span>{company.footerNote}</span>
        </div>
      </footer>
    </>
  );
}
