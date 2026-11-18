import { computeStats } from './stats.js';

/**
 * Formats the benchmark report for console output.
 * @param {string} url
 * @param {Array<{bytes: number, durationMs: number}>} results
 * @returns {string}
 */
export function formatResults(url, results) {
  const { totalBytes, avgMs, totalMB, speedMbit } = computeStats(results);

  return [
    `URL:                  ${url}`,
    `Requests:             ${results.length}`,
    `Average request time: ${avgMs.toFixed(2)} ms`,
    `Total downloaded:     ${totalMB.toFixed(2)} MB (${totalBytes} bytes)`,
    `Download speed:       ${speedMbit.toFixed(2)} Mbit/s`,
  ].join('\n');
}
