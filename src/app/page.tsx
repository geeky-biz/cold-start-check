export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { BreedsResponse, FactsResponse } from "@/types/api";
import { nameToSlug } from "@/utils/slug";
import { getPageProcessingTime } from '@/utils/timing'
import TimingFooter from "@/components/TimingFooter";
import { fakeFetch } from "@/utils/fakeFetch";

async function getBreeds(): Promise<BreedsResponse> {
  const res = await fakeFetch("https://dogapi.dog/api/v2/breeds", {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch breeds");
  }

  return res.json();
}

async function getFacts(): Promise<FactsResponse> {
  const res = await fakeFetch("https://dogapi.dog/api/v2/facts?limit=5", {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch facts");
  }

  return res.json();
}

export default async function Home() {
  const [breedsData, factsData] = await Promise.all([
    getBreeds(),
    getFacts(),
  ]);

  const topThreeBreeds = breedsData.data.slice(0, 3);

  const processingTime = getPageProcessingTime()
  return (
    <>
    <meta name="x-page-processing-time" content={processingTime.toFixed(2)} />
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-zinc-50">
          Dog Breeds & Facts
        </h1>

        {/* Navigation */}
        <nav className="mb-8 flex gap-4">
          <a
            href="/breed"
            className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
          >
            All Breeds
          </a>
          <a
            href="/group"
            className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
          >
            All Groups
          </a>
        </nav>

        {/* Top 3 Breeds */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
            Featured Dog Breeds
          </h2>
          <div className="space-y-4">
            {topThreeBreeds.map((breed) => (
              <div
                key={breed.id}
                className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md"
              >
                <a
                  href={`/breed/${nameToSlug(breed.attributes.name)}`}
                  className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {breed.attributes.name}
                </a>
                <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                  {breed.attributes.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Dog Facts */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
            Fun Dog Facts
          </h2>
          <div className="space-y-3">
            {factsData.data.map((fact) => (
              <div
                key={fact.id}
                className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm"
              >
                <p className="text-zinc-700 dark:text-zinc-300">
                  {fact.attributes.body}
                </p>
              </div>
            ))}
          </div>
        </section>
        <TimingFooter />
      </main>
    </div>
    </>
  );
}
