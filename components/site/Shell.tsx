import Script from "next/script";
import { SiteFooter, SiteNav } from "@/components/site/Chrome";

// Styles, nav, footer and script of the public site design (public/site), for Next.js pages.
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" precedence="default" />
      <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" precedence="default" />
      <link rel="stylesheet" href="/site/styles.css" precedence="default" />
      <link rel="icon" href="/site/favicon.svg" type="image/svg+xml" />
      <a className="skip-link button-sm" href="#main">Skip to content</a>
      <SiteNav />
      <main id="main">{children}</main>
      <SiteFooter />
      <Script src="/site/app.js" strategy="afterInteractive" />
    </>
  );
}
