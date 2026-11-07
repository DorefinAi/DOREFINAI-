import type { Metadata } from "next";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const { about } = await getContent();

  return (
    <>
      <section className="section page-hero" aria-labelledby="about-title">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow caption-3">About</p>
            <h1 className="heading-2 m-heading-4" id="about-title">{about.header.heading}</h1>
            <p className="body-3 muted">{about.header.intro}</p>
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="team-title">
        <div className="wrap">
          <div className="section-head reveal">
            <h2 className="heading-3 m-heading-4" id="team-title">A small, focused team in Jaipur.</h2>
            <p className="body-3 muted">We ship products when they are ready, tested with the teams who will use them every day.</p>
          </div>
          <div className="proof">
            <article className="card founder reveal" aria-labelledby="founder-name">
              <div className="founder-id">
                <span className="avatar heading-6" aria-hidden="true">AR</span>
                <div>
                  <h3 className="title-1" id="founder-name">Aditya Rathore</h3>
                  <p className="caption-2 muted">Founder, Dorefin AI</p>
                </div>
              </div>
              <p className="body-3 muted">Built SaaS platforms across supply chain, fintech and DeFi, most of them around system integrations.</p>
              <ul className="facts">
                <li><i className="ph ph-seal-check" aria-hidden="true"></i><span className="body-6">Registered as Dorefin AI Technologies Pvt Ltd, CIN U62011RJ2026PTC118545.</span></li>
                <li><i className="ph ph-map-pin" aria-hidden="true"></i><span className="body-6">LIC Towers, Sector 2, Vidhyadhar Nagar, Jaipur 302019.</span></li>
              </ul>
              <a className="text-link button-sm" href="https://www.linkedin.com/in/aditya-rathore-2a0902171" target="_blank" rel="noopener">
                Aditya on LinkedIn <i className="ph ph-arrow-up-right" aria-hidden="true"></i>
              </a>
            </article>

            {/* When a pilot team gives a real quote, it can go here. Do not invent one. */}
            <article className="card card--dark band pilot reveal" aria-labelledby="pilot-title">
              <p className="card-label caption-3">Pilot slots open</p>
              <h3 className="heading-5" id="pilot-title">Become a pilot newsroom.</h3>
              <p className="body-3 muted">We are choosing a few desks to build alongside before release. Your workflow shapes the product.</p>
              <ul className="gain-list">
                <li><i className="ph ph-check-circle" aria-hidden="true"></i><span className="body-5">Work directly with the founder, no account managers</span></li>
                <li><i className="ph ph-check-circle" aria-hidden="true"></i><span className="body-5">Set up around the systems your desk already runs</span></li>
                <li><i className="ph ph-check-circle" aria-hidden="true"></i><span className="body-5">Use both products before they are public</span></li>
              </ul>
              <a className="btn btn--primary button-md pilot-cta" href="/contact">Talk about a pilot</a>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="mission-title">
        <div className="wrap">
          <div className="section-head reveal">
            <h2 className="heading-3 m-heading-4" id="mission-title">{about.mission.heading}</h2>
          </div>
          <div className="proof">
            <article className="card card--dark band reveal">
              <p className="card-label caption-3">Mission</p>
              <p className="heading-6">{about.mission.mission}</p>
            </article>
            <article className="card reveal">
              <p className="card-label caption-3">Vision</p>
              <p className="heading-6">{about.mission.vision}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="story-title">
        <div className="wrap about-story">
          <div className="section-head reveal">
            <h2 className="heading-3 m-heading-4" id="story-title">{about.story.heading}</h2>
          </div>
          <div className="prose reveal">
            {about.story.paragraphs.map((paragraph, index) => (
              <p key={index} className="body-3 muted">{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="values-title">
        <div className="wrap">
          <div className="section-head reveal">
            <h2 className="heading-3 m-heading-4" id="values-title">{about.values.heading}</h2>
          </div>
          <ul className="values">
            {about.values.items.map((item, index) => (
              <li key={index} className="reveal">
                <h3 className="title-2">{item.title}</h3>
                <p className="body-6 muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="join-title">
        <div className="wrap">
          <div className="section-head section-head--center reveal">
            <h2 className="heading-3 m-heading-4" id="join-title">{about.join.heading}</h2>
            <p className="body-3 muted">{about.join.body}</p>
            <p style={{ marginTop: "var(--s-300)" }}>
              <a className="btn btn--primary button-md" href="/contact">Book a demo call</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
