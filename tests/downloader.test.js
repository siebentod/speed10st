import http from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { REQUESTS_COUNT, download, runBenchmark } from '../src/downloader.js';

const PAYLOAD_SIZE = 100_000;

let server;
let baseUrl;
let activeRequests;
let maxActiveRequests;
let totalRequests;

beforeAll(async () => {
  const payload = Buffer.alloc(PAYLOAD_SIZE, 1);

  server = http.createServer((req, res) => {
    if (req.url === '/missing') {
      res.statusCode = 404;
      res.end('not found');
      return;
    }

    totalRequests += 1;
    activeRequests += 1;
    maxActiveRequests = Math.max(maxActiveRequests, activeRequests);
    res.on('close', () => {
      activeRequests -= 1;
    });

    // Small delay so that overlapping requests would be detected if they happened.
    setTimeout(() => res.end(payload), 5);
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
});

describe('download', () => {
  it('returns the exact body size and a positive duration', async () => {
    const { bytes, durationMs } = await download(new URL(`${baseUrl}/img.jpg`));

    expect(bytes).toBe(PAYLOAD_SIZE);
    expect(durationMs).toBeGreaterThan(0);
  });

  it('rejects on a non-2xx response', async () => {
    await expect(download(new URL(`${baseUrl}/missing`))).rejects.toThrow(/HTTP 404/);
  });
});

describe('runBenchmark', () => {
  it('makes exactly 10 requests, one at a time', async () => {
    activeRequests = 0;
    maxActiveRequests = 0;
    totalRequests = 0;

    const results = await runBenchmark(new URL(`${baseUrl}/img.jpg`));

    expect(REQUESTS_COUNT).toBe(10);
    expect(results).toHaveLength(10);
    expect(totalRequests).toBe(10);
    expect(maxActiveRequests).toBe(1);
    expect(results.every((r) => r.bytes === PAYLOAD_SIZE)).toBe(true);
  });
});
