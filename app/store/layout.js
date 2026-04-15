export const metadata = {
  title: "Papi's Store | Dripping Springs TX Apparel",
  description: "Original Papi's Store apparel — quality t-shirts and merch from Dripping Springs, Texas. Ships nationwide.",
  keywords: ['Dripping Springs Texas apparel', "Papi's Store", 'Texas t-shirts', 'Hill Country merch', 'Dripping Springs gifts'],
  openGraph: {
    title: "Papi's Store",
    description: 'Original Dripping Springs, TX apparel. Quality tees, ships nationwide.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/store`,
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/store`,
  },
}

export default function StoreLayout({ children }) {
  return children
}
