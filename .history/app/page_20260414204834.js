import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/store')
}

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
