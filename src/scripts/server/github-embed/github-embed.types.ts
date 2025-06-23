export interface CacheEntry {
  content: string;
  metadata: CacheMetadata;
}

export interface CacheMetadata {
  commitSha: string | undefined; // for permalink staleness detection
  etag: string | undefined;
  lastFetch: number; // timestamp
  originalUrl: string;
}

export interface FetchResult {
  content: string;
  etag: string | undefined;
  fromCache: boolean;
}

export interface GitHubUrlParts {
  filePath: string;
  owner: string;
  rawUrl: string;
  ref: string; // branch name or commit SHA
  repo: string;
}

export interface LineRange {
  end?: number | undefined;
  start?: number | undefined;
}

export interface ParsedGitHubUrl extends GitHubUrlParts {
  language: string;
  lineRange: LineRange;
  originalUrl: string;
}
