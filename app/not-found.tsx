import SiteShell from "@/components/site/Shell";

export default function NotFound() {
  return (
    <SiteShell>
    <section className="section page-hero" aria-labelledby="nf-title">
      <div className="wrap">
        <div className="section-head section-head--center">
          <p className="eyebrow caption-3">Page not found</p>
          <h1 className="heading-2 m-heading-4" id="nf-title">This page does not exist.</h1>
          <p className="body-3 muted">The link may be old, or the page may have moved.</p>
          <p style={{ marginTop: "var(--s-300)" }}>
            <a className="btn btn--primary button-md" href="/">Go to the home page</a>
          </p>
        </div>
      </div>
    </section>
    </SiteShell>
  );
}
