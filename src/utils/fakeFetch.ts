import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Maps API URLs to local JSON file paths
 */
function getJsonFilePath(url: string): string | null {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const searchParams = urlObj.searchParams;

  // Base data directory
  const dataDir = join(process.cwd(), 'src', 'data');

  // Map URL patterns to JSON files
  if (pathname === '/api/v2/breeds') {
    if (searchParams.has('page[number]') && searchParams.get('page[size]') === '10') {
      return join(dataDir, 'breeds-page1.json');
    }
    if (searchParams.get('page[size]') === '1000') {
      return join(dataDir, 'breeds-all.json');
    }
    // Default breeds endpoint
    return join(dataDir, 'breeds.json');
  }

  if (pathname === '/api/v2/facts') {
    return join(dataDir, 'facts.json');
  }

  if (pathname === '/api/v2/groups') {
    if (searchParams.has('page[number]') && searchParams.get('page[size]') === '10') {
      return join(dataDir, 'groups-page1.json');
    }
    if (searchParams.get('page[size]') === '1000') {
      return join(dataDir, 'groups-all.json');
    }
    // Default groups endpoint
    return join(dataDir, 'groups.json');
  }

  // Individual breed by ID: /api/v2/breeds/{id}
  const breedMatch = pathname.match(/^\/api\/v2\/breeds\/([^/]+)$/);
  if (breedMatch) {
    const breedId = breedMatch[1];
    return join(dataDir, `breed-${breedId}.json`);
  }

  // Individual group by ID: /api/v2/groups/{id}
  const groupMatch = pathname.match(/^\/api\/v2\/groups\/([^/]+)$/);
  if (groupMatch) {
    const groupId = groupMatch[1];
    return join(dataDir, `group-${groupId}.json`);
  }

  return null;
}

/**
 * Fake fetch implementation that reads from local JSON files
 * Mimics the fetch API interface
 */
export async function fakeFetch(
  url: string | URL,
  options?: RequestInit
): Promise<Response> {
  const urlString = typeof url === 'string' ? url : url.toString();
  const jsonPath = getJsonFilePath(urlString);

  if (!jsonPath) {
    return new Response(
      JSON.stringify({ error: `No JSON file mapped for URL: ${urlString}` }),
      {
        status: 404,
        statusText: 'Not Found',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const jsonContent = readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(jsonContent);

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
        error: `Failed to read JSON file: ${jsonPath}`,
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

