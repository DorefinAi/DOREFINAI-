type Props = { heading: string; updated: string; sections: { title: string; text: string }[] };

export default function LegalPage({ heading, updated, sections }: Props) {
  return (
    <section className="page-head legal">
      <div className="wrap wrap-narrow">
        <p className="eyebrow">Legal</p>
        <h1 className="t-h2">{heading}</h1>
        <p className="legal-updated">{updated}</p>
        {sections.map((section, index) => (
          <div className="legal-section" key={index}>
            <h2 className="t-h4">{section.title}</h2>
            <p>{section.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
