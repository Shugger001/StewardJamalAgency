export type ServiceOffering = {
  id: string;
  title: string;
  intro: string;
  features: readonly string[];
};

export type ServicePageContent = {
  href: string;
  title: string;
  subtitle: string;
  heroImage: string;
  heroImageAlt: string;
  introTitle: string;
  introBody: string;
  highlightEyebrow: string;
  highlightTitle: string;
  highlightBody: string;
  whyChoose: readonly { title: string; body: string }[];
  results: readonly string[];
  offerings: readonly ServiceOffering[];
  extraSection?: {
    id?: string;
    title: string;
    body: string;
    linkHref?: string;
    linkLabel?: string;
  };
  faqs: readonly { q: string; a: string }[];
};

export const SERVICE_TESTIMONIALS = [
  {
    quote:
      "They rebuilt our service pages and fixed tracking on our contact forms. Within weeks we could see which campaigns were producing real enquiries—not just traffic.",
    name: "Ama Osei",
    role: "Founder",
  },
  {
    quote:
      "Professional process from brief to launch. The site is faster, easier to update, and our team finally has a structure we can grow into.",
    name: "Dr. Kwame Mensah",
    role: "CEO",
  },
] as const;
