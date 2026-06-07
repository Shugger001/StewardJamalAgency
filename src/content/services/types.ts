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
      "They built us a stunning website and implemented an SEO strategy that changed everything. Within three months our orders increased dramatically and we started receiving bulk orders from corporate clients across Ghana.",
    name: "Ama Osei",
    role: "Founder",
  },
  {
    quote:
      "They developed a sleek, responsive website and ensured we ranked for industry keywords. Their professionalism and attention to detail were unparalleled.",
    name: "Dr. Kwame Mensah",
    role: "CEO",
  },
] as const;
