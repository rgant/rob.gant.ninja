import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

import type { CacheEntry, CacheMetadata } from './github-embed.types.js';

const CACHE_DIR = '.cache/github-embed';
const HASH_LENGTH = 12; // 12 chars should be sufficient

const generateCacheKey = (url: string): string =>
  createHash('sha256').update(url).digest('hex')
    .slice(0, HASH_LENGTH);

/**
 * Type guard to check if `data` is of type CacheMetadata.
 */
const isCacheMetadata = (data: unknown): data is CacheMetadata => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  // Check required properties and their types
  if (!('lastFetch' in data) || typeof data.lastFetch !== 'number') {
    return false;
  }
  if (!('originalUrl' in data) || typeof data.originalUrl !== 'string') {
    return false;
  }

  // Check optional properties if they exist
  if ('commitSha' in data && data.commitSha !== undefined && typeof data.commitSha !== 'string') {
    return false;
  }
  if ('etag' in data && data.etag !== undefined && typeof data.etag !== 'string') {
    return false;
  }

  return true;
};

/**
 * Assume that if the current working directory includes a package.json file then it is the project
 * root.
 */
let isValidProjectRoot: boolean | undefined;
const isProjectRoot = (): boolean => {
  isValidProjectRoot ??= existsSync(join(process.cwd(), 'package.json'));
  if (!isValidProjectRoot) {
    console.warn('CWD is not project root, cache directory location invalid');
  }
  return isValidProjectRoot;
};

/**
 * Reads the metadata and contents for a cached file if any based on cacheKey from rawUrl.
 * @param rawUrl - Value of `rawUrl` key from ParsedGitHubUrl object
 */
export const readCache = (rawUrl: string): CacheEntry | undefined => {
  const cacheKey = generateCacheKey(rawUrl);
  const cacheDir = join(CACHE_DIR, cacheKey);
  const metadataPath = join(cacheDir, 'metadata.json');
  const contentPath = join(cacheDir, 'content.txt');

  if (!isProjectRoot() || !existsSync(metadataPath) || !existsSync(contentPath)) {
    return undefined;
  }

  try {
    const metadataJson = readFileSync(metadataPath, 'utf8');
    const metadata: unknown = JSON.parse(metadataJson);
    const content = readFileSync(contentPath, 'utf8');

    if (isCacheMetadata(metadata)) {
      return { content, metadata };
    }

    throw new TypeError('Malformed metadata JSON');
  } catch (err) {
    console.warn(`Failed to read cache for ${cacheKey}:`, err);
    return undefined;
  }
};

/**
 * Writes the contents and metadata for a rawUrl to a cacheKey location on disk.
 * @param rawUrl - Value of `rawUrl` key from ParsedGitHubUrl object
 * @param content - File contents to cache
 * @param metadata - Caching metadata
 */
export const writeCache = (rawUrl: string, content: string, metadata: CacheMetadata): void => {
  const cacheKey = generateCacheKey(rawUrl);
  const cacheDir = join(CACHE_DIR, cacheKey);
  const metadataPath = join(cacheDir, 'metadata.json');
  const contentPath = join(cacheDir, 'content.txt');

  if (!isProjectRoot()) {
    return;
  }

  try {
    // Ensure cache directory exists
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(metadataPath, JSON.stringify(metadata));
    writeFileSync(contentPath, content);
  } catch (err) {
    console.warn(`Failed to write cache for ${cacheKey}:`, err);
    // Don't throw - caching failures shouldn't break builds
  }
};
