export const DB = {
  navy: "#051B2E",
  navyMid: "#09243C",
  sky: "#DDEDF5",
  skyLight: "#F1F2F2",
  gold: "#FFCC53",
  orange: "#ff6900",
  teal: "#0693e3",
} as const;

export const LANDING_GUTTER = "w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20";

function readPublicEnvString(value: string | undefined) {
  if (typeof value !== "string") return "";
  return value.trim();
}

export const SITE_CONTACT = {
  email: readPublicEnvString(process.env.NEXT_PUBLIC_CONTACT_EMAIL) || "stewardjamalagency@gmail.com",
  phone: readPublicEnvString(process.env.NEXT_PUBLIC_CONTACT_PHONE) || "+233 54 311 1607",
  address: readPublicEnvString(process.env.NEXT_PUBLIC_CONTACT_ADDRESS) || "Accra, Ghana",
  hours: "Mon – Sat: 8:00am – 5:00pm",
} as const;

export const SERVICE_NAV = [
  { label: "Web Development And Design", href: "/services/web-development" },
  { label: "e-Commerce Development", href: "/services/web-development#ecommerce" },
  { label: "Search Engine Optimization", href: "/services/web-development#seo" },
  { label: "Digital Marketing & PPC Ads", href: "/#services" },
  { label: "Custom Web Applications", href: "/#services" },
  { label: "Business Marketing Development", href: "/#services" },
] as const;

export const PUBLIC_NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Service", href: "/services/web-development" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/#proposal" },
] as const;
