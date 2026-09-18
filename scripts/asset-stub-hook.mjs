/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Module hook that lets Node import src/data.ts directly: bundler-only asset
 * imports (`import img from './assets/...jpg'`) resolve to the public URL the
 * built site serves them from, and extensionless relative imports pick up their
 * `.ts` file, instead of crashing the loader.
 */
const ASSET_RE = /\.(jpe?g|png|svg|webp|avif|gif)$/i;
const STUB_PREFIX = 'asset-stub:';
const PUBLIC_ASSET_BASE = 'https://alekhlasfood.com/assets/';

export async function resolve(specifier, context, nextResolve) {
  if (ASSET_RE.test(specifier)) {
    return { url: STUB_PREFIX + specifier, shortCircuit: true };
  }
  if (/^\.{1,2}\//.test(specifier) && !/\.[a-z]+$/i.test(specifier)) {
    return nextResolve(`${specifier}.ts`, context);
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith(STUB_PREFIX)) {
    const fileName = url.slice(STUB_PREFIX.length).split('/').pop();
    return {
      format: 'module',
      shortCircuit: true,
      source: `export default ${JSON.stringify(PUBLIC_ASSET_BASE + fileName)};`
    };
  }
  return nextLoad(url, context);
}
