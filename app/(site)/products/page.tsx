import type { Metadata } from "next";
import Ribbons from "@/components/Ribbons";
import ProductMock from "@/components/ProductMock";
import { Cta, CtaPanel, SectionHead, TextLink } from "@/components/ui";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  const { products, company } = await getContent();

  return (
    <>
      <section className="page-head">
        <Ribbons />
        <div className="wrap">
          <SectionHead as="h1" eyebrow="Products" title={products.header.heading} lede={products.header.intro} center />
        </div>
      </section>

      {products.items.map((product, index) => (
        <section className={`section${index % 2 === 0 ? " section-soft" : ""}`} id={product.id} key={product.id}>
          <div className={`wrap showcase${index % 2 ? " showcase-flip" : ""}`}>
            <div data-reveal>
              <p className="eyebrow">
                {product.name}
                {product.status && <span className="status">{product.status}</span>}
              </p>
              <h2 className="t-h2">{product.tagline}</h2>
              <p className="t-lede">{product.description}</p>
              <ul className="ticks">
                {product.capabilities.map((capability, i) => (
                  <li key={i}>{capability.title}</li>
                ))}
              </ul>
              <div className="actions">
                <Cta href={`/products/${product.id}`}>Explore {product.name}</Cta>
                <TextLink href="/contact">{product.cta}</TextLink>
              </div>
            </div>
            <div className="shell" data-tone="dark" data-reveal>
              <div className="core stage-solo">
                <ProductMock id={product.id} />
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Which one" title="Two products. Two kinds of team." center />
          <div className="duo">
            {products.items.map((product) => (
              <div className="shell" key={product.id} data-reveal>
                <div className="core fit">
                  <p className="kicker">{product.name} is for</p>
                  <p className="fit-text">{product.audience}</p>
                  <TextLink href={`/products/${product.id}`}>See {product.name}</TextLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaPanel heading={products.cta.heading} body={products.cta.body}>
        <Cta href="/contact" variant="light">
          {products.cta.button}
        </Cta>
        <a href={`mailto:${company.email}`} className="text-link">
          Write to us at {company.email}
        </a>
      </CtaPanel>
    </>
  );
}
