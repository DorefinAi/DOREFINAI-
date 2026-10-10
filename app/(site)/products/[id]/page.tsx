import type { Metadata } from "next";
import Ribbons from "@/components/Ribbons";
import { notFound } from "next/navigation";
import ProductMock from "@/components/ProductMock";
import { Card, Cta, CtaPanel, Faq, Glyph, SectionHead, TextLink } from "@/components/ui";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = (await getContent()).products.items.find((item) => item.id === id);
  return product ? { title: product.name, description: product.short } : {};
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const { products, faq } = await getContent();
  const product = products.items.find((item) => item.id === id);
  if (!product) notFound();
  const others = products.items.filter((item) => item.id !== id);

  return (
    <>
      <section className="hero">
        <Ribbons />
        <div className="wrap showcase">
          <div>
            <p className="eyebrow">
              {product.name}
              {product.status && <span className="status">{product.status}</span>}
            </p>
            <h1 className="t-h1">{product.tagline}</h1>
            <p className="t-lede">{product.description}</p>
            <div className="actions">
              <Cta href="/contact">{product.cta}</Cta>
              <TextLink href="/products">All products</TextLink>
            </div>
          </div>
          <div className="shell" data-tone="dark">
            <div className="core stage-solo">
              <ProductMock id={product.id} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="wrap">
          <SectionHead eyebrow="Capabilities" title={`What ${product.name} does.`} />
          <div className="bento">
            {product.capabilities.map((capability, index) => (
              <Card key={index} className="feature">
                <Glyph index={index + (product.id === "social" ? 4 : 0)} />
                <h3 className="t-h4">{capability.title}</h3>
                <p>{capability.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {product.workflow.length > 0 && (
        <section className="section">
          <div className="wrap">
            <SectionHead eyebrow="Workflow" title="From start to finish." center />
            <ol className="steps" data-count={product.workflow.length}>
              {product.workflow.map((step, index) => (
                <li key={index} data-reveal style={{ transitionDelay: `${index * 70}ms` }}>
                  <span className="step-n">{index + 1}</span>
                  <h3 className="t-h4">{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="section section-dark">
        <Ribbons dim />
        <div className="wrap">
          <div className="head head-center" data-reveal>
            <p className="eyebrow">Who it’s for</p>
            <p className="t-statement">{product.audience}</p>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section">
          <div className="wrap">
            <SectionHead eyebrow="Also from Dorefin" title="Explore the rest." />
            <div className="duo">
              {others.map((other) => (
                <div className="shell" key={other.id} data-reveal>
                  <div className="core fit">
                    <p className="kicker">{other.name}</p>
                    <h3 className="t-h3">{other.tagline}</h3>
                    <p>{other.short}</p>
                    <TextLink href={`/products/${other.id}`}>See {other.name}</TextLink>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Faq heading={faq.heading} items={faq.items} />

      <CtaPanel heading={products.cta.heading} body={products.cta.body}>
        <Cta href="/contact" variant="light">
          {products.cta.button}
        </Cta>
      </CtaPanel>
    </>
  );
}
