import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/crow')
}

      <Certifications />
      <Suspense
        fallback={
          <section className="py-24 px-4 text-center text-slate-500 font-mono text-sm">
            Loading GitHub data...
          </section>
        }
      >
        <GitHubShowcase />
      </Suspense>
      <Contact />
      <CrowSection />
      <Footer />
    </main>
  )
}
