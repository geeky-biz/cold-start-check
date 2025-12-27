import Link from "next/link";
import { GroupsResponse } from "@/types/api";
import { nameToSlug } from "@/utils/slug";
import { getPageProcessingTime } from '@/utils/timing'
import TimingFooter from "@/components/TimingFooter";

async function getGroups(page: number = 1): Promise<GroupsResponse> {
  const res = await fetch(
    `https://dogapi.dog/api/v2/groups?page[number]=${page}&page[size]=10`,
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch groups");
  }

  return res.json();
}

export default async function GroupsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = parseInt(pageParam || "1", 10);

  const groupsData = await getGroups(currentPage);
  const hasNextPage = !!groupsData.links?.next;
  const totalRecords = groupsData.meta?.pagination?.records || 0;
  const totalPages = groupsData.meta?.pagination 
    ? Math.ceil(totalRecords / 10)
    : (hasNextPage ? currentPage + 1 : currentPage);

  const processingTime = getPageProcessingTime()
  return (
    <>
    <meta name="x-page-processing-time" content={processingTime.toFixed(2)} />
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/"
          className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-zinc-50">
          All Dog Groups
        </h1>

        <div className="space-y-4 mb-8">
          {groupsData.data.map((group) => (
            <div
              key={group.id}
              className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md"
            >
              <Link
                href={`/group/${nameToSlug(group.attributes.name)}`}
                className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {group.attributes.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4">
          {currentPage > 1 && (
            <Link
              href={`/group?page=${currentPage - 1}`}
              className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
            >
              Previous
            </Link>
          )}

          <span className="text-zinc-900 dark:text-zinc-50">
            Page {currentPage}{totalRecords > 0 ? ` of ${totalPages}` : ''}
          </span>

          {hasNextPage && (
            <Link
              href={`/group?page=${currentPage + 1}`}
              className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
            >
              Next
            </Link>
          )}
        </div>
        <TimingFooter />
      </main>
    </div>
    </>
  );
}

