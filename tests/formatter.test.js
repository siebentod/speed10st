import { describe, expect, it } from 'vitest';
import { formatResults } from '../src/formatter.js';

describe('formatResults', () => {
  it('computes average time, total size and speed', () => {
    // 10 requests x 1 MB, 1000 ms each:
    // total = 10 MB in 10 s = 8 Mbit/s, average = 1000 ms.
    const results = Array.from({ length: 10 }, () => ({ bytes: 1_000_000, durationMs: 1000 }));

    const output = formatResults('http://x/y', results);

    expect(output).toContain('Requests:             10');
    expect(output).toContain('Average request time: 1000.00 ms');
    expect(output).toContain('Total downloaded:     10.00 MB (10000000 bytes)');
    expect(output).toContain('Download speed:       8.00 Mbit/s');
  });

  it('weights speed by volume instead of averaging per-request speeds', () => {
    const results = [
      { bytes: 1_000_000, durationMs: 1000 }, //  8 Mbit/s
      { bytes: 10_000_000, durationMs: 1000 }, // 80 Mbit/s
      { bytes: 1_000_000, durationMs: 8000 }, //  1 Mbit/s
    ];

    // Weighted: 12 MB in 10 s = 9.6 Mbit/s.
    // A plain average of per-request speeds would give ~29.67 Mbit/s.
    expect(formatResults('http://x/y', results)).toContain('Download speed:       9.60 Mbit/s');
  });
});
