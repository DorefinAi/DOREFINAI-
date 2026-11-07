import SiteShell from "@/components/site/Shell";

// Copy is edited from /admin, so pages are rendered per request.
export const dynamic = "force-dynamic";

// About, privacy and terms, in the same design as the static pages in public/site.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
