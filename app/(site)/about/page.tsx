import type { Metadata } from "next";
import Ribbons from "@/components/Ribbons";
import { Card, Cta, CtaPanel, Glyph, SectionHead, TextLink } from "@/components/ui";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const { about, company } = await getContent();

  return (
    <>
      <section className="page-head">
        <Ribbons />
        <div className="wrap">
          <SectionHead as="h1" eyebrow="About" title={about.header.heading} lede={about.header.intro} center />
        </div>
      </section>

      <section className="section section-soft">
        <div className="wrap">
          <SectionHead eyebrow="Purpose" title={about.mission.heading} />
          <div className="duo">
            <Card className="statement-card" tone="dark">
              <p className="kicker">Mission</p>
              <p className="t-statement">{about.mission.mission}</p>
            </Card>
            <Card className="statement-card">
              <p className="kicker">Vision</p>
              <p className="t-statement">{about.mission.vision}</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <SectionHead eyebrow="Our story" title={about.story.heading} />
          <div className="prose prose-lg" data-reveal>
            {about.story.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="wrap">
          <SectionHead eyebrow="Values" title={about.values.heading} />
          <div className="bento">
            {about.values.items.map((item, index) => (
              <Card key={index} className="feature">
                <Glyph index={index} />
                <h3 className="t-h4">{item.title}</h3>
                <p>{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <Ribbons dim />
        <div className="wrap">
          <div className="head head-center" data-reveal>
            <p className="eyebrow">Where we are</p>
            <p className="t-hero">{company.location}</p>
            <p className="t-lede">{company.footerNote}</p>
          </div>
        </div>
      </section>

      <CtaPanel heading={about.join.heading} body={about.join.body}>
        <Cta href="/careers" variant="light">
          See how we hire
        </Cta>
        <TextLink href="/contact">Talk to us</TextLink>
      </CtaPanel>
    </>
  );
}
