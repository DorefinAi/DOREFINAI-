// Default site copy, taken from websiteContent.docx. Everything here can be
// edited from /admin; saved edits live in data/content.json and override these.

export const defaultContent = {
  company: {
    name: "Dorefin AI",
    legalName: "Dorefin AI Pvt Ltd",
    tagline: "Purpose-built AI products for the industries that matter.",
    email: "arathore@dorefinai.com",
    careersEmail: "arathore@dorefinai.com",
    phone: "+91 9019193141",
    location: "Jaipur, Rajasthan, India",
    linkedin: "https://www.linkedin.com/company/dorefin-ai",
    footerNote: "Built with care in Jaipur, India.",
  },
  home: {
    hero: {
      eyebrow: "AI for newsrooms and digital teams",
      headline: "You do the thinking. Our AI does the grind.",
      subheadline:
        "Dorefin builds AI products that take the complex, repetitive work off your team’s plate, so they can focus on what matters most.",
      primaryCta: "Explore our products",
      secondaryCta: "Talk to us",
    },
    ticker: [
      "Trusted by forward-thinking newsrooms and digital teams across India.",
      "Built in India. Built for scale.",
    ],
    whatWeDo: {
      heading: "AI that fits in. Not AI you fit around.",
      paragraphs: [
        "Dorefin AI designs intelligent products for industries that run on speed, accuracy, and trust. Our tools plug straight into the systems you already use. No disruption. No steep learning curve. From newsrooms covering the clock to digital teams scaling content across platforms, our AI works the way you already do.",
        "One size fits no one. Every product we ship is purpose-built for one challenge, tested in real environments, and refined with the teams who use it every day.",
      ],
    },
    productsHeading: "Two products. One job each.",
    howItWorks: {
      heading: "Connect. Automate. Scale.",
      steps: [
        {
          title: "Connect",
          text: "We plug into the systems your team already uses. No rip-and-replace. No new dashboards to learn.",
        },
        {
          title: "Automate",
          text: "Our AI takes the repetitive, time-sensitive tasks. Your team keeps the work that actually needs a human touch.",
        },
        {
          title: "Scale",
          text: "Your output grows. Dorefin grows with it. More volume, same quality, no extra headcount.",
        },
      ],
    },
    why: {
      heading: "Built different. On purpose.",
      items: [
        {
          title: "Made for your industry",
          text: "No generic AI here. A newsroom and a social media team have very different problems, so they get very different products.",
        },
        {
          title: "Plugs in. Pushes nothing out.",
          text: "Dorefin works inside your existing tools. No migration headaches. No retraining. Same workflow, only faster.",
        },
        {
          title: "Built in India, for scale",
          text: "We know the pace and pressure of Indian media and digital markets. We build here, for the challenges you face here.",
        },
        {
          title: "Humans stay in charge",
          text: "Our AI doesn’t replace your team. It gives them superpowers, and keeps them in the loop and in control.",
        },
      ],
    },
    audiences: {
      heading: "Built for teams that can’t slow down.",
      items: [
        "News channels",
        "Digital newsrooms",
        "Wire services",
        "Media houses",
        "Digital media teams",
        "Social media managers",
        "Brand teams",
        "Content agencies",
      ],
    },
    cta: {
      heading: "See what AI can do for your team.",
      body: "Run a newsroom or a digital content operation? Tell us what slows your team down and we’ll talk through how Dorefin can help. No pressure, just a conversation.",
      button: "Get in touch",
      secondary: "Or explore our products first",
    },
  },
  products: {
    header: {
      heading: "AI for the work that matters.",
      intro:
        "One industry. One challenge. One product built to solve it. No bloated feature lists, no vague promises. Just intelligent tools that make your team’s day measurably better.",
    },
    items: [
      {
        id: "vartmaan",
        name: "Vartmaan AI",
        tagline: "The Newsroom, Reimagined.",
        short:
          "News automation for modern media houses. From wire to assignment-ready story: faster, smarter, always on.",
        description:
          "Vartmaan AI is intelligent news automation built for modern media houses. It works alongside your newsroom systems and speeds up the trip from source to screen, taking on the repetitive, time-critical tasks that slow your team down.",
        capabilities: [
          {
            title: "Smart wire ingestion",
            text: "Reads every incoming feed and surfaces what matters, ready for your assignment desk.",
          },
          {
            title: "Story-ready drafts",
            text: "Turns raw inputs into structured, editable drafts. Your editors refine. They don’t rebuild.",
          },
          {
            title: "System integration",
            text: "Plugs into the newsroom systems you already run. Nothing new to learn.",
          },
          {
            title: "Always on",
            text: "Runs 24/7 at the pace of news, so your team can focus on journalism, not logistics.",
          },
        ],
        workflow: [
          { title: "Ingest", text: "Incoming news feeds are processed automatically, around the clock." },
          { title: "Surface", text: "What matters is surfaced and made ready for your assignment desk." },
          { title: "Draft", text: "Raw inputs become structured, editable story drafts." },
          { title: "Refine", text: "Your editors refine and decide. People stay in the loop and in control." },
        ],
        audience:
          "News channels, digital newsrooms, wire services, and media houses looking to modernise their editorial pipeline without disrupting it.",
        status: "Pre-release",
        cta: "Register your interest",
      },
      {
        id: "social",
        name: "Socia-L AI",
        tagline: "Your Digital Presence, Amplified.",
        short:
          "Automation for digital content teams. Create, schedule, and optimise across platforms with AI that knows your brand voice.",
        description:
          "Socia-L AI is intelligent digital automation for teams running a multi-platform presence. Create, adapt, schedule, and optimise across every channel, with your brand voice consistent and your team in control.",
        capabilities: [
          {
            title: "Multi-platform publishing",
            text: "Create once. Publish everywhere. Socia-L tailors format, tone, and length for each platform automatically.",
          },
          {
            title: "Brand-aware content",
            text: "It learns your voice, your style guidelines, and your audience, so every post sounds like you.",
          },
          {
            title: "Smart scheduling",
            text: "Every channel publishes when your audience is actually paying attention.",
          },
          {
            title: "Performance insights",
            text: "See what’s working and what isn’t. Clear, actionable analytics, not vanity dashboards.",
          },
        ],
        workflow: [
          { title: "Create", text: "Write the piece once, in your own brand voice." },
          { title: "Adapt", text: "Format, tone, and length are tailored for every platform automatically." },
          { title: "Schedule", text: "Each channel publishes when your audience is actually paying attention." },
          { title: "Learn", text: "Clear, actionable analytics show what is working and what isn’t." },
        ],
        audience:
          "Digital media teams, social media managers, brand teams, and content agencies looking to scale output without scaling headcount.",
        status: "Pre-release",
        cta: "Register your interest",
      },
    ],
    cta: {
      heading: "Not sure which one fits?",
      body: "Every team is different. Tell us what you’re working on and we’ll tell you honestly where Dorefin fits. No sales pitch, just a real conversation.",
      button: "Schedule a call",
    },
  },
  about: {
    header: {
      heading: "The company behind the intelligence.",
      intro:
        "Dorefin AI is an artificial intelligence company from Jaipur, India. We bring AI to industries where speed and precision aren’t optional. They’re the standard. We’re a small, focused team with one clear belief: AI should make people’s work better, not harder.",
    },
    mission: {
      heading: "What drives us.",
      mission:
        "Build AI that genuinely improves how industries operate: useful from day one, respectful of existing workflows, and ready to grow with the teams that use it.",
      vision:
        "A future where every professional team, whatever its size or budget, has intelligent tools that let it do its best work.",
    },
    story: {
      heading: "From Jaipur, with purpose.",
      paragraphs: [
        "Dorefin AI started with a straightforward question: why are the industries that move the fastest still running on the slowest tools?",
        "We saw newsrooms juggling breaking stories across clunky systems. Digital teams copy-pasting content across five platforms. Talented people spending their days on work a machine could do in seconds.",
        "So we started building. Not grand, all-in-one platforms, but focused, sharp products that solve one problem really well. Built in Jaipur, tested with real teams, shipped when they’re actually ready.",
        "We’re still early. And that’s exactly where we want to be.",
      ],
    },
    values: {
      heading: "What we believe.",
      items: [
        {
          title: "Usefulness over hype",
          text: "If it doesn’t solve a real problem for a real team, we don’t ship it.",
        },
        {
          title: "Respect the workflow",
          text: "We build around how people already work, not around how we wish they worked.",
        },
        {
          title: "Transparency",
          text: "Our AI is a tool, not a black box. Teams should always understand what it’s doing and why.",
        },
        {
          title: "Ship and iterate",
          text: "We’d rather put something useful in your hands today and improve it together, than wait for perfection.",
        },
      ],
    },
    join: {
      heading: "Come build with us.",
      body: "We’re a small team solving big problems. If you care about building things that work, not just things that demo well, we should talk.",
      note: "We’re always looking for sharp, curious people. Drop us a line at",
    },
  },
  careers: {
    header: {
      heading: "Come build with us.",
      intro:
        "We’re a small team solving big problems. If you care about building things that work, not just things that demo well, we should talk.",
    },
    lookingFor: {
      heading: "Who we’re looking for.",
      items: [
        {
          title: "Builders, not demo-makers",
          text: "You care whether the thing works for a real team on a real deadline, not just whether it looks good in a pitch.",
        },
        {
          title: "Sharp and curious",
          text: "You ask why a workflow is the way it is before you try to change it.",
        },
        {
          title: "Comfortable on a small team",
          text: "We’re early. You’ll own problems end to end and sit close to the people using what you build.",
        },
        {
          title: "Happy to ship and iterate",
          text: "You’d rather put something useful in someone’s hands today and improve it together than wait for perfect.",
        },
      ],
    },
    apply: {
      heading: "No open roles listed. Write to us anyway.",
      body: "We’re always looking for sharp, curious people. Tell us what you’ve built and what you’d like to work on.",
      button: "Email us about working here",
    },
  },
  faq: {
    heading: "Questions, answered.",
    items: [
      {
        question: "What does Dorefin AI build?",
        answer:
          "AI products for media and digital teams. Vartmaan AI automates newsroom work from wire ingestion to assignment-ready drafts. Socia-L AI helps content teams create, adapt, schedule, and optimise across platforms.",
      },
      {
        question: "Do we have to replace the systems we already use?",
        answer:
          "No. Dorefin products plug into your existing tools. There is no rip-and-replace, no migration, and no new dashboard for your team to learn.",
      },
      {
        question: "Does the AI replace our editors or content team?",
        answer:
          "No. Every product is designed to keep humans in the loop and in control. The AI handles repetitive, time-sensitive tasks so your team can spend their energy on work that needs a human touch.",
      },
      {
        question: "Who are the products for?",
        answer:
          "Vartmaan AI is for news channels, digital newsrooms, wire services, and media houses. Socia-L AI is for digital media teams, social media managers, brand teams, and content agencies.",
      },
      {
        question: "Can we use the products today?",
        answer:
          "Not yet. Vartmaan AI and Socia-L AI are both in pre-release. Register your interest from the contact page, tell us what you’re working on, and we’ll reply personally within 24 hours.",
      },
      {
        question: "Where is Dorefin AI based?",
        answer: "Jaipur, Rajasthan, India. Our products are built here, for the pace of Indian media and digital markets.",
      },
    ],
  },
  legal: {
    privacy: {
      heading: "Privacy policy",
      updated: "Last updated October 2026",
      sections: [
        {
          title: "What we collect",
          text: "When you use the contact form we collect the details you enter: your name, email address, phone number and company if you provide them, the product you are interested in, and your message.",
        },
        {
          title: "How we use it",
          text: "We use these details only to reply to you and to follow up on your enquiry. We do not sell your information or use it for advertising.",
        },
        {
          title: "Cookies",
          text: "This website does not use advertising or tracking cookies.",
        },
        {
          title: "Keeping and deleting your details",
          text: "We keep enquiries for as long as we need them to respond and to maintain a record of our conversation. You can ask us to delete your details at any time by emailing us.",
        },
        {
          title: "Contact",
          text: "For any question about your information, write to us at the email address shown on the contact page.",
        },
      ],
    },
    terms: {
      heading: "Terms of use",
      updated: "Last updated October 2026",
      sections: [
        {
          title: "Using this website",
          text: "This website is provided by Dorefin AI Pvt Ltd to share information about the company and its products. By using it you agree to these terms.",
        },
        {
          title: "Product information",
          text: "Descriptions of our products are for general information. They are not an offer or a binding commitment. Any product engagement is governed by a separate written agreement.",
        },
        {
          title: "Content",
          text: "The text, design, and marks on this website belong to Dorefin AI Pvt Ltd. Please do not reproduce them without our permission.",
        },
        {
          title: "No warranty",
          text: "We work to keep this website accurate and available, but it is provided as is, without warranties of any kind.",
        },
        {
          title: "Contact",
          text: "Questions about these terms can be sent to the email address shown on the contact page.",
        },
      ],
    },
  },
  contact: {
    header: {
      heading: "Let’s talk.",
      intro:
        "Exploring what AI can do for your team? Want to hear when our products open up? Just have a question? Reach out. We answer every message personally. No bots, no ticket numbers.",
    },
    formHeading: "Send us a message",
    interests: ["Vartmaan AI", "Socia-L AI", "Both", "General Inquiry"],
    submitLabel: "Send message",
    confirmation:
      "Thank you for reaching out! We’ll get back to you within 24 hours. If it’s urgent, call us directly at +91 9019193141.",
    emailNote: "Prefer email? Write to us and we’ll get back to you within a day.",
    closing:
      "Built with care in Jaipur. The person you write to is probably the person building the product. That’s by design.",
  },
};

export type Content = typeof defaultContent;

const MAX_TEXT = 5000;
const MAX_ITEMS = 24;

// An empty copy of a value's shape, used when the admin adds a list item.
export function blank<T>(shape: T): T {
  if (typeof shape === "string") return "" as T;
  if (Array.isArray(shape)) return [] as T;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(shape as object)) out[key] = blank(value);
  return out as T;
}

// Forces `input` into the shape of `shape`: unknown keys are dropped, missing
// or mistyped values fall back, strings and lists are capped. Used both when
// loading saved content and when validating what the admin sends.
export function conform<T>(shape: T, input: unknown, fallback: T = shape): T {
  if (typeof shape === "string") {
    return (typeof input === "string" ? input.slice(0, MAX_TEXT) : fallback) as T;
  }
  if (Array.isArray(shape)) {
    if (!Array.isArray(input)) return fallback;
    if (!shape.length) return fallback;
    return input.slice(0, MAX_ITEMS).map((item) => conform(shape[0], item, blank(shape[0]))) as T;
  }
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(shape as object)) {
    out[key] = conform(value, source[key], (fallback as Record<string, unknown>)[key]);
  }
  return out as T;
}
