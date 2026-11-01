/**
 * Invisible markers telling the loading screen which images to fetch and
 * decode up front (e.g. the Lanyard photos and certificate images), so those
 * sections are ready by the time the visitor scrolls to them.
 */
export function PreloadHints({ urls }: { urls: (string | null | undefined)[] }) {
  const list = [...new Set(urls.filter((url): url is string => Boolean(url)))];
  if (list.length === 0) return null;
  return (
    <>
      {list.map((url) => (
        <span key={url} hidden data-preload-image={url} />
      ))}
    </>
  );
}
