import * as XLSX from "xlsx";

/**
 * Server Component by default (no "use client").
 * This code WILL run on the server.
 */

export function runXlsxServerSide() {
  // Create a workbook
  const workbook = XLSX.utils.book_new();

  // Create some deterministic data
  const data: number[][] = [];
  for (let i = 0; i < 1000; i++) {
    data.push([i, i * 2, i * 3]);
  }

  // Convert data to worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Benchmark");

  // Serialize workbook - use "array" for Cloudflare Workers compatibility
  // "buffer" requires Node.js Buffer API which isn't available in Workers
  const array = XLSX.write(workbook, {
    type: "array",
    bookType: "xlsx",
  });

  return {
    rows: data.length,
    sheetNames: workbook.SheetNames,
    bufferSizeBytes: array.byteLength || array.length,
  };
}
