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
 * Reads a cache file. If the read fails, warns and returns undefined.
 * @param path - Path of the file to read
 * @param label - Name of the file for the warning message
 * @param cacheKey - Cache key for the warning message
 */
const readCacheFile = (path: string, label: string, cacheKey: string): string | undefined => {
  try {
    return readFileSync(path, 'utf8');
  } catch (err) {
    console.warn(`Cannot read cache ${label} for ${cacheKey}:`, err);
    return undefined;
  }
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

  const metadataJson = readCacheFile(metadataPath, 'metadata', cacheKey);
  if (metadataJson === undefined) {
    return undefined;
  }

  let metadata: unknown;
  try {
    metadata = JSON.parse(metadataJson);
  } catch (err) {
    console.warn(`Cannot parse cache metadata for ${cacheKey}:`, err);
    return undefined;
  }

  if (!isCacheMetadata(metadata)) {
    console.warn(`Cache metadata has the wrong shape for ${cacheKey}`);
    return undefined;
  }

  const content = readCacheFile(contentPath, 'content', cacheKey);
  if (content === undefined) {
    return undefined;
  }

  return { content, metadata };
};

/**
 * Writes the contents and metadata for a rawUrl to a cacheKey location on disk.
 * @param rawUrl - Value of `rawUrl` key from ParsedGitHubUrl object
 * @param content - File contents to cache
 * @param metadata - Caching metadata
 */
export const writeCache = (rawUrl: string, content: string, metadata: CacheMetadata): void => {
  if (!isProjectRoot()) {
    return;
  }

  const cacheKey = generateCacheKey(rawUrl);
  const cacheDir = join(CACHE_DIR, cacheKey);
  const metadataPath = join(cacheDir, 'metadata.json');
  const contentPath = join(cacheDir, 'content.txt');

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
