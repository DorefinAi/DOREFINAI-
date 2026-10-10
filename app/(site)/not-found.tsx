import { Cta } from "@/components/ui";
import Ribbons from "@/components/Ribbons";

export default function NotFound() {
  return (
    <section className="page-head">
      <Ribbons />
      <div className="wrap">
        <div className="head head-center">
          <p className="eyebrow">Page not found</p>
          <h1 className="t-hero">This page doesn’t exist.</h1>
          <p className="t-lede">The link may be old, or the page may have moved.</p>
          <div className="actions">
            <Cta href="/">Go to the home page</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
