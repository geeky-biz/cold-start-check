import dataset from "@/data/benchmark-users.json";
import { getTimingData, getInitializedFrom } from "@/utils/timing";

export const runtime = "nodejs"; // explicit for Vercel

export async function GET(request: Request) {
  const start = Date.now();
  const timingData = getTimingData();

  const url = new URL(request.url);
  const minScore = Number(url.searchParams.get("minScore") ?? 0);
  const limit = Number(url.searchParams.get("limit") ?? 100);

  // DB-like operations
  const rows = dataset
    .filter(u => u.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const processingTime = Date.now() - start;

  return Response.json({
    data : {
        workload: "db-like",
        totalRows: dataset.length,
        returnedRows: rows.length,    
    },
    timing : {
      "x-page-processing-time": processingTime,
      "x-request-count": timingData.requestCount,
      "x-is-cold-start": timingData.isColdStart,
      "x-instance-age": ((Date.now() - timingData.instanceInitTime)/1000).toFixed(2)+'s',
      "x-initialized-from": getInitializedFrom() || ""  
    }
  });
}
