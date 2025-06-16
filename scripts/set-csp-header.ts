#!/usr/bin/env -S node --experimental-strip-types --disable-warning=ExperimentalWarning
/**
 * This CLI script extracts Subresource Integrity (SRI) hashes from the`@kindspells/astro-shield`
 * JavaScript module and exports them to a JSON file.
 *
 * The generated JSON file is designed for consumption by Terraform, facilitating automated
 * deployment of Content Security Policy (CSP) headers.
 *
 * This utility addresses a limitation in `@kindspells/astro-shield`, which lacks built-in support
 * for directly exporting SRI hashes to JSON format.
 *
 * For more details, refer to the related issue:
 * {@link https://github.com/kindspells/astro-shield/issues/67}
 */
import { writeFileSync } from 'node:fs'; // eslint-disable-line import-x/no-nodejs-modules -- This is a node script
import { resolve } from 'node:path'; // eslint-disable-line unicorn/import-style, import-x/no-nodejs-modules -- This is a node script

import { perResourceSriHashes } from '../generated/sriHashes.mjs';

/** Enable JSON pretty printing for clearer diffs */
const INDENT = 2;
const NOOP_REPLACER = undefined;
// writeFileSync is happiest with an absolute file path.
const JSON_FILE = resolve(import.meta.dirname, '..', 'generated', 'sriHashes.json');

const getHashes = (key: 'scripts' | 'styles'): string => {
  const hashes = Object.values(perResourceSriHashes[key]);
  if (hashes.length > 0) {
    return `'${hashes.join("' '")}'`;
  }

  return '';
};

const sriHashes = {
  scripts: getHashes('scripts'),
  styles: getHashes('styles'),
};

const jsonStr = JSON.stringify(sriHashes, NOOP_REPLACER, INDENT);
writeFileSync(JSON_FILE, jsonStr);

console.log(`Generated ${JSON_FILE}`); // eslint-disable-line no-console -- This is a devops script
