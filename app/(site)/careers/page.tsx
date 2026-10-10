import type { Metadata } from "next";
import Ribbons from "@/components/Ribbons";
import { Card, Cta, CtaPanel, Glyph, SectionHead } from "@/components/ui";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Careers" };

export default async function CareersPage() {
  const { careers, about, company } = await getContent();

  return (
    <>
      <section className="page-head">
        <Ribbons />
        <div className="wrap">
          <SectionHead as="h1" eyebrow="Careers" title={careers.header.heading} lede={careers.header.intro} center />
        </div>
      </section>

      <section className="section section-soft">
        <div className="wrap">
          <SectionHead eyebrow="The people" title={careers.lookingFor.heading} />
          <div className="bento">
            {careers.lookingFor.items.map((item, index) => (
              <Card key={index} className="feature">
                <Glyph index={index + 4} />
                <h3 className="t-h4">{item.title}</h3>
                <p>{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="How we work" title={about.values.heading} center />
          <ol className="steps" data-count={about.values.items.length}>
            {about.values.items.map((item, index) => (
              <li key={index} data-reveal style={{ transitionDelay: `${index * 70}ms` }}>
                <h3 className="t-h4">{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaPanel heading={careers.apply.heading} body={careers.apply.body}>
        <Cta href={`mailto:${company.careersEmail}`} variant="light">
          {careers.apply.button}
        </Cta>
      </CtaPanel>
    </>
  );
}
