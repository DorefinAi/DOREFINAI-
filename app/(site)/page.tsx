import SocialMock from "@/components/SocialMock";
import Ribbons from "@/components/Ribbons";
import WhyShowcase from "@/components/WhyShowcase";
import WireFeed from "@/components/WireFeed";
import { Card, Cta, CtaPanel, Faq, SectionHead, TextLink, Title } from "@/components/ui";
import { getContent } from "@/lib/store";

export default async function HomePage() {
  const { home, products, faq } = await getContent();

  return (
    <>
      <section className="hero">
        <Ribbons />
        <div className="wrap">
          <div className="head head-center hero-copy">
            <p className="eyebrow">{home.hero.eyebrow}</p>
            <h1 className="t-hero">
              <Title text={home.hero.headline} />
            </h1>
            <p className="t-lede">{home.hero.subheadline}</p>
            <div className="actions">
              <Cta href="/products">{home.hero.primaryCta}</Cta>
              <Cta href="/contact" variant="ghost">
                {home.hero.secondaryCta}
              </Cta>
            </div>
          </div>

          {home.ticker.length > 0 && (
            <ul className="trust">
              {home.ticker.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section section-dark">
        <Ribbons dim />
        <div className="wrap">
          <SectionHead eyebrow="See it work" title="Watch the busywork disappear." center />
          <div className="stage-grid" data-reveal>
            <WireFeed />
            <SocialMock />
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="wrap split">
          <SectionHead eyebrow="What we do" title={home.whatWeDo.heading} />
          <div className="prose prose-lg" data-reveal>
            {home.whatWeDo.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Products" title={home.productsHeading} center />
          <div className="duo">
            {products.items.map((product, index) => (
              <Card key={product.id} className="product-card" tone={index % 2 === 0 ? "dark" : "tint"}>
                <div className="product-card-copy">
                  <p className="kicker">
                    {product.name}
                    {product.status && <span className="status">{product.status}</span>}
                  </p>
                  <h3 className="t-h3">{product.tagline}</h3>
                  <p>{product.short}</p>
                </div>
                <ul className="ticks">
                  {product.capabilities.map((capability, i) => (
                    <li key={i}>{capability.title}</li>
                  ))}
                </ul>
                <TextLink href={`/products/${product.id}`}>Learn more about {product.name}</TextLink>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="wrap">
          <SectionHead eyebrow="How it works" title={home.howItWorks.heading} center />
          <ol className="steps">
            {home.howItWorks.steps.map((step, index) => (
              <li key={index} data-reveal style={{ transitionDelay: `${index * 70}ms` }}>
                <span className="step-n">{index + 1}</span>
                <h3 className="t-h4">{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Why Dorefin" title={home.why.heading} />
          <WhyShowcase items={home.why.items} />
        </div>
      </section>

      {home.audiences.items.length > 0 && (
        <section className="section section-dark">
        <Ribbons dim />
          <div className="wrap">
            <SectionHead eyebrow="Who it’s for" title={home.audiences.heading} center />
            <ul className="chips" data-reveal>
              {home.audiences.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Faq heading={faq.heading} items={faq.items} />

      <CtaPanel heading={home.cta.heading} body={home.cta.body}>
        <Cta href="/contact" variant="light">
          {home.cta.button}
        </Cta>
        <TextLink href="/products">{home.cta.secondary}</TextLink>
      </CtaPanel>
    </>
  );
}
