import dataset from "@/data/benchmark-users.json";

export const runtime = "nodejs"; // explicit for Vercel

export async function GET(request: Request) {
  const start = Date.now();

  const url = new URL(request.url);
  const minScore = Number(url.searchParams.get("minScore") ?? 0);
  const limit = Number(url.searchParams.get("limit") ?? 100);

  // DB-like operations
  const rows = dataset
    .filter(u => u.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return Response.json({
    workload: "db-like",
    totalRows: dataset.length,
    returnedRows: rows.length,
    durationMs: Date.now() - start,
  });
}
