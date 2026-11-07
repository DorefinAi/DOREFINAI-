type Props = { heading: string; updated: string; sections: { title: string; text: string }[] };

// Privacy and terms, in the public site design (public/site/styles.css).
export default function LegalPage({ heading, updated, sections }: Props) {
  return (
    <section className="section page-hero" aria-labelledby="legal-title">
      <div className="wrap legal">
        <p className="eyebrow caption-3">Legal</p>
        <h1 className="heading-3 m-heading-4" id="legal-title">{heading}</h1>
        <p className="caption-2 subtle legal-updated">{updated}</p>
        {sections.map((section, index) => (
          <div className="legal-section" key={index}>
            <h2 className="title-1">{section.title}</h2>
            <p className="body-3 muted">{section.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
