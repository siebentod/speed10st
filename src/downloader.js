import { performance } from 'node:perf_hooks';

export const REQUESTS_COUNT = 10;
export const REQUEST_TIMEOUT_MS = 60_000;

/**
 * Performs one request and waits until the response body is fully received.
 * The body is consumed as a stream and only its size is counted,
 * so memory usage stays flat regardless of the file size.
 * @param {URL} url
 * @returns {Promise<{bytes: number, durationMs: number}>}
 */
export async function download(url) {
  const startedAt = performance.now();

  const response = await fetch(url, {
    // Ask for the raw payload: the size is then what actually went over the wire,
    // not the size after transparent decompression.
    headers: { 'Accept-Encoding': 'identity' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Unexpected response: HTTP ${response.status} ${response.statusText}`);
  }

  let bytes = 0;
  if (response.body) {
    for await (const chunk of response.body) {
      bytes += chunk.byteLength;
    }
  }

  return { bytes, durationMs: performance.now() - startedAt };
}

/**
 * Strictly sequential: the next request starts only after the previous one is fully received.
 * @param {URL} url
 * @param {number} [count]
 * @returns {Promise<Array<{bytes: number, durationMs: number}>>}
 */
export async function runBenchmark(url, count = REQUESTS_COUNT) {
  const results = [];
  for (let i = 0; i < count; i += 1) {
    results.push(await download(url));
  }
  return results;
}
