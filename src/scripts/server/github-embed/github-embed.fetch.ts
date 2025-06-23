import { constants } from 'node:http2';
import { setTimeout as delay } from 'node:timers/promises';

import { GITHUB_TOKEN } from 'astro:env/server';

import { readCache, writeCache } from './github-embed.cache.js';
import type { FetchResult, ParsedGitHubUrl } from './github-embed.types.js';

const DEFAULT_CACHE_MAX_AGE = 900_000; // 15 minutes
const RETRY_DELAY = 100; // milliseconds

const createHeaders = (etag?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    /* eslint-disable @typescript-eslint/naming-convention -- HTTP Request Headers */
    Authorization: `token ${GITHUB_TOKEN}`,
    'User-Agent': 'rgant/rob.gant.ninja',
    /* eslint-enable @typescript-eslint/naming-convention */
  };

  if (etag) {
    headers['If-None-Match'] = etag;
  }

  return headers;
};

const fetchFromGitHub = async (url: string, etag: string | undefined): Promise<Response> => {
  const headers = createHeaders(etag);

  try {
    return await fetch(url, { headers });
  } catch (err) {
    // Simple retry after brief delay
    console.warn(`GitHub fetch failed, retrying in ${RETRY_DELAY}ms:`, err);
    await delay(RETRY_DELAY);
    return fetch(url, { headers });
  }
};

export const fetchWithCache = async (parsedUrl: ParsedGitHubUrl): Promise<FetchResult> => {
  const cached = readCache(parsedUrl.rawUrl);

  // Try cache first
  if (cached && isCacheFresh(cached.metadata.lastFetch)) {
    // Cache was found and is not stale, no need to log warnings.
    return {
      content: cached.content,
      etag: cached.metadata.etag,
      fromCache: true,
    };
  }

  // Cache miss or stale. Fetch fresh content.
  const response = await fetchFromGitHub(parsedUrl.rawUrl, cached?.metadata.etag);

  if (!response.ok) {
    // Response could be 304 Not Modified or it could be an error status code.
    if (cached) {
      // Since we have a cache hit the !ok could be a 304 Not Modified response
      if (response.status === constants.HTTP_STATUS_NOT_MODIFIED) {
        // Content is confirmed current - update cache timestamp
        writeCache(parsedUrl.rawUrl, cached.content, {
          ...cached.metadata,
          lastFetch: Date.now(),
        });
      } else {
        // The response was an error
        logStalenessWarning(parsedUrl, cached.metadata.commitSha);
      }

      // Could be not modified, could be an error. Either way use cached content.
      return {
        content: cached.content,
        etag: cached.metadata.etag,
        fromCache: true,
      };
    }

    // Something went terribly wrong.
    throw new Error(`GitHub fetch failed: ${response.status} ${response.statusText} for ${parsedUrl.originalUrl}`);
  }

  const content = await response.text();
  const etag = response.headers.get('etag') ?? undefined;

  // Update cache
  writeCache(parsedUrl.rawUrl, content, {
    commitSha: parsedUrl.ref,
    etag,
    lastFetch: Date.now(),
    originalUrl: parsedUrl.originalUrl,
  });

  return { content, etag, fromCache: false };
};

const isCacheFresh = (lastFetch: number, maxAge: number = DEFAULT_CACHE_MAX_AGE): boolean => {
  const age = Date.now() - lastFetch;
  return age < maxAge;
};

const logStalenessWarning = (parsedUrl: ParsedGitHubUrl, cachedCommitSha?: string): void => {
  if (cachedCommitSha && cachedCommitSha !== parsedUrl.ref) {
    console.warn(`Content may be stale: cached commit ${cachedCommitSha} vs current ${parsedUrl.ref} for ${parsedUrl.originalUrl}`);
  }
};
