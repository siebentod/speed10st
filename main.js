#!/usr/bin/env node

import { runBenchmark } from './src/downloader.js';
import { formatResults } from './src/formatter.js';
import { parseUrl } from './src/url-validator.js';

async function main() {
  const url = parseUrl(process.argv[2]);
  const results = await runBenchmark(url);
  console.log(formatResults(url.href, results));
}

main().catch((err) => {
  const reason = err.cause?.message ? ` (${err.cause.message})` : '';
  console.error(`Error: ${err.message}${reason}`);
  process.exitCode = 1;
});
