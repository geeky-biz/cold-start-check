export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { BreedsResponse } from "@/types/api";
import { nameToSlug } from "@/utils/slug";
import { getPageProcessingTime } from '@/utils/timing'
import TimingFooter from "@/components/TimingFooter";
import { fakeFetch } from "@/utils/fakeFetch";

async function getBreeds(page: number = 1): Promise<BreedsResponse> {
  const res = await fakeFetch(
    `https://dogapi.dog/api/v2/breeds?page[number]=${page}&page[size]=10`,
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

export default async function BreedsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = parseInt(pageParam || "1", 10);

  const breedsData = await getBreeds(currentPage);
  const hasNextPage = !!breedsData.links?.next;
  const totalRecords = breedsData.meta?.pagination?.records || 0;
  const totalPages = breedsData.meta?.pagination 
    ? Math.ceil(totalRecords / 10)
    : (hasNextPage ? currentPage + 1 : currentPage);

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

        <h1 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-zinc-50">
          All Dog Breeds
        </h1>

        <div className="space-y-4 mb-8">
          {breedsData.data.map((breed) => (
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

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4">
          {currentPage > 1 && (
            <a
              href={`/breed?page=${currentPage - 1}`}
              className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
            >
              Previous
            </a>
          )}

          <span className="text-zinc-900 dark:text-zinc-50">
            Page {currentPage}{totalRecords > 0 ? ` of ${totalPages}` : ''}
          </span>

          {hasNextPage && (
            <a
              href={`/breed?page=${currentPage + 1}`}
              className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
            >
              Next
            </a>
          )}
        </div>
        <TimingFooter />
      </main>
    </div>
    </>
  );
}

