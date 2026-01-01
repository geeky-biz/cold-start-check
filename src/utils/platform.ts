/**
 * Platform detection utility
 * Determines which platform/runtime the code is running on
 */

export type Platform = 'cloudflare' | 'vercel' | 'netlify' | 'node' | 'unknown';

export function getPlatform(): Platform {
  // Check for Cloudflare Workers/Pages
  // Cloudflare Workers have specific runtime characteristics
  if (typeof process !== 'undefined' && process.env) {
    // Check for Cloudflare-specific environment variables
    if (process.env.CF_PAGES === '1' || process.env.CF_PAGES_BRANCH) {
      return 'cloudflare';
    }
    
    // Check for Cloudflare Workers runtime indicators
    // Cloudflare Workers don't have full Node.js environment
    if (
      typeof Buffer === 'undefined' &&
      typeof process.cwd === 'undefined' &&
      typeof caches !== 'undefined'
    ) {
      return 'cloudflare';
    }
  }
  
  // Runtime check: Cloudflare Workers environment
  if (typeof globalThis !== 'undefined') {
    // Cloudflare Workers have caches but may not have full Node.js APIs
    if (
      typeof caches !== 'undefined' &&
      typeof Request !== 'undefined' &&
      (typeof Buffer === 'undefined' || typeof process?.cwd !== 'function')
    ) {
      return 'cloudflare';
    }
  }

  // Check for Vercel
  if (typeof process !== 'undefined') {
    if (process.env?.VERCEL === '1' || process.env?.VERCEL_ENV) {
      return 'vercel';
    }
    // Check for Netlify
    if (process.env?.NETLIFY === 'true' || process.env?.NETLIFY_DEV) {
      return 'netlify';
    }
    // Standard Node.js
    if (process.env?.NODE_ENV) {
      return 'node';
    }
  }

  return 'unknown';
}

export function isCloudflare(): boolean {
  return getPlatform() === 'cloudflare';
}

export function isVercel(): boolean {
  return getPlatform() === 'vercel';
}

export function isNetlify(): boolean {
  return getPlatform() === 'netlify';
}

