import type { LineRange, ParsedGitHubUrl } from './github-embed.types';

const GITHUB_PATH_PATTERN = /^\/(?<owner>[^/]+)\/(?<repo>[^/]+)\/blob\/(?<ref>[^/]+)\/(?<filePath>.+?)$/u;
const LINE_RANGE_PATTERN = /^#L(?<start>\d+)(?:-L?(?<end>\d+))?$/u;

export const extractLines = (content: string, lineRange: LineRange): string => {
  // No line range specified - return full content
  if (lineRange.start == undefined) {
    return content;
  }

  // I don't expect to have Windows line endings, but for this case it doesn't matter as we are just
  // counting the lines to slice them.
  const lines = content.split('\n');

  // Convert to 0-based indexing (URLs use 1-based)
  const startIndex = lineRange.start - 1;
  const endIndex = typeof lineRange.end === 'number' ? lineRange.end - 1 : startIndex;

  // Validate line ranges
  if (startIndex < 0 || startIndex >= lines.length) {
    console.warn(`Invalid start line ${lineRange.start}, file has ${lines.length} lines`);
    return content;
  }

  if (endIndex < startIndex || endIndex >= lines.length) {
    console.warn(`Invalid end line ${lineRange.end}, file has ${lines.length} lines`);
    return content;
  }

  // Extract the specified range (slice end is exclusive, so +1)
  return lines.slice(startIndex, endIndex + 1).join('\n');
};

export const parseGitHubUrl = (url: string): ParsedGitHubUrl => {
  const parsedUrl = new URL(url);

  if (parsedUrl.hostname !== 'github.com') {
    throw new TypeError(`Expected github.com URL, got: ${parsedUrl.hostname}`);
  }

  const match = GITHUB_PATH_PATTERN.exec(parsedUrl.pathname);

  const { filePath, owner, ref, repo } = match?.groups ?? {};

  if (!filePath || !owner || !ref || !repo) {
    throw new TypeError(`Missing required URL components in: ${url}`);
  }

  const lineRange = parseLineRange(parsedUrl.hash);
  const language = detectLanguage(filePath);
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${filePath}`;

  return {
    filePath,
    language,
    lineRange,
    originalUrl: url,
    owner,
    rawUrl,
    ref,
    repo,
  };
};

const parseLineRange = (fragment?: string): LineRange => {
  if (!fragment) {
    return {};
  }

  const lineMatch = LINE_RANGE_PATTERN.exec(fragment);
  if (!lineMatch?.groups) {
    return {};
  }

  const start = Number(lineMatch.groups['start']);
  const end = lineMatch.groups['end'] ? Number(lineMatch.groups['end']) : undefined;

  return { end, start };
};

/**
 * Use simple split instead of path.extname() to handle edge cases better:
 * .nvmrc ⮕ 'nvmrc' (vs 'text' with extname)
 * .gitignore ⮕ 'gitignore' (vs 'text' with extname)
 * Dockerfile ⮕ 'dockerfile' (vs 'text' with extname)
 * package.json ⮕ 'json' (same with both approaches)
 * Shiki may have grammars for these specific file types
 */
const detectLanguage = (filePath: string): string => {
  const extension = filePath.split('.').pop()?.toLowerCase();
  return extension ?? 'text';
};
