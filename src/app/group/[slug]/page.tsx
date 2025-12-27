import { notFound } from "next/navigation";
import { GroupsResponse, GroupResponse, BreedResponse, Breed } from "@/types/api";
import { nameToSlug } from "@/utils/slug";
import { getPageProcessingTime } from '@/utils/timing'
import TimingFooter from "@/components/TimingFooter";

async function getAllGroups(): Promise<GroupsResponse> {
  const res = await fetch(
    "https://dogapi.dog/api/v2/groups?page[size]=1000",
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

async function getGroupById(id: string): Promise<GroupResponse> {
  const res = await fetch(`https://dogapi.dog/api/v2/groups/${id}?include=breeds`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch group");
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

export default async function GroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Get all groups to find the one matching the slug
  const groupsData = await getAllGroups();
  const matchingGroup = groupsData.data.find(
    (group) => nameToSlug(group.attributes.name) === slug
  );

  if (!matchingGroup) {
    notFound();
  }

  // Fetch the full group details with breeds
  const groupData = await getGroupById(matchingGroup.id);
  const group = groupData.data;
  
  // Get breeds from included array, or fetch them by ID if they're in relationships
  let breeds: Breed[] = groupData.included || [];
  
  if (breeds.length === 0 && group.relationships?.breeds?.data) {
    // Fetch breeds by their IDs if they weren't included
    const breedPromises = group.relationships.breeds.data.map((breedRef) =>
      getBreedById(breedRef.id)
    );
    const breedResponses = await Promise.all(breedPromises);
    breeds = breedResponses.map((response) => response.data);
  }

  const processingTime = getPageProcessingTime()
  return (
    <>
    <meta name="x-page-processing-time" content={processingTime.toFixed(2)} />
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <a
          href="/group"
          className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to All Groups
        </a>

        <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-lg mb-8">
          <h1 className="text-4xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">
            {group.attributes.name}
          </h1>
        </div>

        {/* Breeds in this group */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
            Breeds in this Group
          </h2>
          {breeds.length > 0 ? (
            <div className="space-y-4">
              {breeds.map((breed) => (
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
          ) : (
            <p className="text-zinc-700 dark:text-zinc-300">
              No breeds found in this group.
            </p>
          )}
        </section>
        <TimingFooter />
      </main>
    </div>
    </>
  );
}

