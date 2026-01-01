import { create, all } from "mathjs";
import users from "@/data/benchmark-users.json";
import type { BenchmarkUser } from "@/types/api";
import { getTimingData, getInitializedFrom } from "@/utils/timing";

export const runtime = "nodejs";

// Initialize mathjs (heavy module graph)
const math = create(all);

function scoreUser(u: BenchmarkUser): number {
  // Use mathjs ops to force library execution
  const base = math.add(u.age, u.purchases);
  const weighted = math.multiply(base, u.score);
  const result = math.mod(weighted, 97);
  // Ensure we return a number (mathjs can return various numeric types)
  return typeof result === "number" ? result : Number(result);
}

export async function GET() {
  const start = Date.now();
  const timingData = getTimingData();

  let total = 0;

  for (let i = 0; i < users.length; i++) {
    total += scoreUser(users[i]);
  }

  const processingTime = Date.now() - start;

  return Response.json({
    workload: "compute-like (mathjs)",
    usersProcessed: users.length,
    totalScore: Math.round(total),
    "x-page-processing-time": processingTime,
    "x-request-count": timingData.requestCount,
    "x-is-cold-start": timingData.isColdStart,
    "x-instance-age": ((Date.now() - timingData.instanceInitTime)/1000).toFixed(2)+'s',
    "x-initialized-from": getInitializedFrom() || "",
  });
}
