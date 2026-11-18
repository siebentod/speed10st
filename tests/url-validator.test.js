import { describe, expect, it } from 'vitest';
import { parseUrl } from '../src/url-validator.js';

describe('parseUrl', () => {
  it('parses a valid http(s) URL', () => {
    expect(parseUrl('https://example.com/a.jpg').href).toBe('https://example.com/a.jpg');
  });

  it('throws when the argument is missing', () => {
    expect(() => parseUrl(undefined)).toThrow(/URL is required/);
  });

  it('throws on an invalid URL', () => {
    expect(() => parseUrl('not a url')).toThrow(/Invalid URL/);
  });

  it('throws on a non-http protocol', () => {
    expect(() => parseUrl('ftp://example.com/a.jpg')).toThrow(/Unsupported protocol/);
  });
});
