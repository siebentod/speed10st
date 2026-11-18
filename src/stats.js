/**
 * Aggregates per-request results into totals.
 * @param {Array<{bytes: number, durationMs: number}>} results
 * @returns {{totalBytes: number, totalMs: number, avgMs: number, totalMB: number, speedMbit: number}}
 */
export function computeStats(results) {
  const totalBytes = results.reduce((sum, r) => sum + r.bytes, 0);
  const totalMs = results.reduce((sum, r) => sum + r.durationMs, 0);

  return {
    totalBytes,
    totalMs,
    avgMs: totalMs / results.length,
    totalMB: totalBytes / 1e6,
    // Speed is weighted by volume: total bits over total time,
    // not an average of per-request speeds.
    speedMbit: (totalBytes * 8) / (totalMs / 1000) / 1e6,
  };
}
