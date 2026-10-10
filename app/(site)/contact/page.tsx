import type { Metadata } from "next";
import Ribbons from "@/components/Ribbons";
import ContactForm from "@/components/ContactForm";
import { Faq } from "@/components/ui";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const { contact, company, faq } = await getContent();

  return (
    <>
      <section className="hero">
        <Ribbons />
        <div className="wrap contact-grid">
          <div className="contact-side">
            <div className="head">
              <p className="eyebrow">Contact</p>
              <h1 className="t-h1">{contact.header.heading}</h1>
              <p className="t-lede">{contact.header.intro}</p>
            </div>
            <aside className="shell" data-tone="dark">
              <div className="core contact-card">
                <p className="kicker">{company.legalName}</p>
              <dl>
                <dt>Email</dt>
                <dd><a href={`mailto:${company.email}`}>{company.email}</a></dd>
                <dt>Phone</dt>
                <dd><a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a></dd>
                <dt>Office</dt>
                <dd>{company.location}</dd>
                <dt>LinkedIn</dt>
                <dd>
                  <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
                    View company page
                  </a>
                </dd>
              </dl>
                <p className="contact-note">{contact.emailNote}</p>
                <p className="contact-note">{contact.closing}</p>
              </div>
            </aside>
          </div>

          <div className="shell">
            <div className="core contact-form">
              <h2 className="t-h3">{contact.formHeading}</h2>
              <ContactForm
                interests={contact.interests}
                submitLabel={contact.submitLabel}
                confirmation={contact.confirmation}
              />
            </div>
          </div>
        </div>
      </section>

      <Faq heading={faq.heading} items={faq.items} />
    </>
  );
}
