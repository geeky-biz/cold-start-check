import { notFound } from "next/navigation";
import { BreedsResponse, BreedResponse } from "@/types/api";
import { nameToSlug } from "@/utils/slug";
import { getPageProcessingTime } from '@/utils/timing'
import TimingFooter from "@/components/TimingFooter";

async function getAllBreeds(): Promise<BreedsResponse> {
  const res = await fetch(
    "https://dogapi.dog/api/v2/breeds?page[size]=1000",
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch breeds");
  }

  return res.json();
}

async function getBreedById(id: string): Promise<BreedResponse> {
  const res = await fetch(`https://dogapi.dog/api/v2/breeds/${id}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch breed");
  }

  return res.json();
}

export default async function BreedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Get all breeds to find the one matching the slug
  const breedsData = await getAllBreeds();
  const matchingBreed = breedsData.data.find(
    (breed) => nameToSlug(breed.attributes.name) === slug
  );

  if (!matchingBreed) {
    notFound();
  }

  // Fetch the full breed details
  const breedData = await getBreedById(matchingBreed.id);
  const breed = breedData.data;

  const processingTime = getPageProcessingTime()
  return (
    <>
    <meta name="x-page-processing-time" content={processingTime.toFixed(2)} />
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <a
          href="/"
          className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Home
        </a>

        <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">
            {breed.attributes.name}
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                Description
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                {breed.attributes.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                  Male Weight Range
                </h2>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {breed.attributes.male_weight.min} -{" "}
                  {breed.attributes.male_weight.max} lbs
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                  Female Weight Range
                </h2>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {breed.attributes.female_weight.min} -{" "}
                  {breed.attributes.female_weight.max} lbs
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                Life Span
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                {breed.attributes.life.min} - {breed.attributes.life.max} years
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
                Hypoallergenic
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                {breed.attributes.hypoallergenic ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <a
            href="/breed"
            className="inline-block px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
          >
            View All Breeds
          </a>
        </div>
        <TimingFooter />
      </main>
    </div>
    </>
  );
}

