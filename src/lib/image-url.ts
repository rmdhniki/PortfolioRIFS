/**
 * Route a remote image through the Next.js image optimizer (`/_next/image`).
 *
 * Used for images that WebGL components upload as textures (e.g. the
 * Circular Gallery). The optimizer:
 *  - resizes to `width` (must be one of next.config's image sizes; 1200 is a
 *    default device size) and serves WebP/AVIF, so a 4000px certificate no
 *    longer becomes a texture too big for integrated GPUs, and
 *  - serves it from the site's own origin, so texture loading no longer
 *    depends on cross-origin (CORS) responses that extensions/proxies can block.
 *
 * Remote hosts must be allowed in next.config `images.remotePatterns`.
 */
export function optimizedImageUrl(url: string, width = 1200, quality = 82): string {
  if (!/^https?:\/\//.test(url)) return url;
  return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
}
