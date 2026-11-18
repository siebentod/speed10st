/**
 * Parses and validates a CLI URL argument.
 * @param {string|undefined} arg
 * @returns {URL}
 */
export function parseUrl(arg) {
  if (!arg) {
    throw new Error('URL is required.\nUsage: node main.js <url>');
  }

  let url;
  try {
    url = new URL(arg);
  } catch {
    throw new Error(`Invalid URL: ${arg}`);
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`Unsupported protocol "${url.protocol}". Use http or https.`);
  }

  return url;
}
