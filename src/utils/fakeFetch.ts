// Import all data from the centralized data index
import {
  breedsData,
  breedsPage1Data,
  breedsAllData,
  factsData,
  groupsPage1Data,
  groupsAllData,
  groupDataMap,
} from "@/data";

/**
 * Maps API URLs to JSON data
 */
function getJsonData(url: string): unknown | null {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const searchParams = urlObj.searchParams;

  // Map URL patterns to JSON data
  if (pathname === '/api/v2/breeds') {
    if (searchParams.has('page[number]') && searchParams.get('page[size]') === '10') {
      return breedsPage1Data;
    }
    if (searchParams.get('page[size]') === '1000') {
      return breedsAllData;
    }
    // Default breeds endpoint
    return breedsData;
  }

  if (pathname === '/api/v2/facts') {
    return factsData;
  }

  if (pathname === '/api/v2/groups') {
    if (searchParams.has('page[number]') && searchParams.get('page[size]') === '10') {
      return groupsPage1Data;
    }
    if (searchParams.get('page[size]') === '1000') {
      return groupsAllData;
    }
    // Default groups endpoint - use page1 for now
    return groupsPage1Data;
  }

  // Individual breed by ID: /api/v2/breeds/{id}
  const breedMatch = pathname.match(/^\/api\/v2\/breeds\/([^/]+)$/);
  if (breedMatch) {
    const breedId = breedMatch[1];
    // Extract breed from breedsAllData
    const breed = (breedsAllData as { data?: Array<{ id: string }> }).data?.find((b) => b.id === breedId);
    if (breed) {
      return { data: breed };
    }
    return null;
  }

  // Individual group by ID: /api/v2/groups/{id}
  const groupMatch = pathname.match(/^\/api\/v2\/groups\/([^/]+)$/);
  if (groupMatch) {
    const groupId = groupMatch[1];
    // Get from the static import map
    const groupData = groupDataMap[groupId];
    if (groupData) {
      return groupData;
    }
    // Fallback: try to find in groupsAllData
    const group = (groupsAllData as { data?: Array<{ id: string }> }).data?.find((g) => g.id === groupId);
    if (group) {
      // Return group without included breeds (the code will fetch them separately if needed)
      return { data: group, included: [] };
    }
    return null;
  }

  return null;
}

/**
 * Fake fetch implementation that reads from local JSON files
 * Mimics the fetch API interface
 * Works in both Node.js and edge runtimes (Cloudflare Workers)
 */
export async function fakeFetch(
  url: string | URL,
  _options?: RequestInit
): Promise<Response> {
  const urlString = typeof url === 'string' ? url : url.toString();
  const data = getJsonData(urlString);

  if (!data) {
    return new Response(
      JSON.stringify({ error: `No JSON data mapped for URL: ${urlString}` }),
      {
        status: 404,
        statusText: 'Not Found',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    return new Response(JSON.stringify(data), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `Failed to process JSON data for URL: ${urlString}`,
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        statusText: 'Internal Server Error',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
