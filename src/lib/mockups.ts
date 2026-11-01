/**
 * Device mockups for the Projects section. The PNG/WebP files have a
 * transparent background *and* a transparent screen, so a screenshot rendered
 * underneath shows through the screen hole while the device frame (bezel,
 * rounded corners, camera) sits on top.
 *
 * `screen` is the screen hole as a quad (TL, TR, BR, BL) in the image's own
 * pixels. Measured from the source images (pict/*.png) by flood-filling the
 * hole and intersecting its four fitted edges; the angled mockups are real
 * perspective quads, so screenshots are warped with a CSS matrix3d.
 */

export type Point = readonly [number, number];
export type Quad = readonly [Point, Point, Point, Point];

export type DeviceMockup = {
  src: string;
  width: number;
  height: number;
  screen: Quad;
};

/** The flat "screen" element that gets warped onto the quad (CSS px before warping). */
export type ScreenSpec = {
  width: number;
  height: number;
  /** Outer corner radius (keeps the corners of the quad from poking out of the frame). */
  radius: number;
  /** Black bezel between the frame and the screenshot. */
  insetX: number;
  insetY: number;
  innerRadius: number;
};

export const PHONE_MOCKUPS: readonly DeviceMockup[] = [
  { src: "/images/mockups/mobile-1.webp", width: 1024, height: 1536, screen: [[184, 23], [839, 23], [839, 1477], [184, 1477]] },
  { src: "/images/mockups/mobile-2.webp", width: 1024, height: 1536, screen: [[346.2, 117.8], [893.8, 46.1], [673.5, 1464], [121.1, 1420.6]] },
  { src: "/images/mockups/mobile-3.webp", width: 1024, height: 1536, screen: [[126.5, 39.7], [669.1, 122.7], [972.5, 1443.2], [378.9, 1399.6]] },
];

export const LAPTOP_MOCKUPS: readonly DeviceMockup[] = [
  // laptop-1 is pict/leptop1.png cropped (y 340–1190), padded 125px each side to 3:2 and scaled ×1.2047.
  { src: "/images/mockups/laptop-1.webp", width: 1536, height: 1024, screen: [[283.1, 81.9], [1250.5, 81.9], [1250.5, 687.9], [283.1, 687.9]] },
  { src: "/images/mockups/laptop-2.webp", width: 1536, height: 1024, screen: [[97.5, 103.7], [946.7, 47.7], [1066.9, 603.3], [213.6, 725.2]] },
  { src: "/images/mockups/laptop-3.webp", width: 1536, height: 1024, screen: [[120.7, 133.9], [953.6, 63.9], [1067.4, 551.4], [236.2, 692.2]] },
];

/** 9:19.5 phone screen — upload portrait screenshots. */
export const PHONE_SCREEN: ScreenSpec = {
  width: 900,
  height: 1950,
  radius: 110,
  insetX: 28,
  insetY: 30,
  innerRadius: 86,
};

/** 16:10 laptop screen — upload landscape screenshots. */
export const LAPTOP_SCREEN: ScreenSpec = {
  width: 1600,
  height: 1000,
  radius: 14,
  insetX: 26,
  insetY: 26,
  innerRadius: 4,
};

/** Slide i uses mockup i % 3: 1, 2, 3, 1, 2, 3, … */
export function mockupFor(mockups: readonly DeviceMockup[], index: number): DeviceMockup {
  return mockups[index % mockups.length];
}

/**
 * CSS `matrix3d` that maps a `w`×`h` box (transform-origin 0 0) onto `quad`.
 * Standard square→quad homography, scaled to the box size.
 */
export function quadTransform(quad: Quad, w: number, h: number): string {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = quad;
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den;
  const k = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + k * y3, f = y0;
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, k / h, 0, 0, 1, 0, c, f, 0, 1];
  return `matrix3d(${m.map((v) => +v.toFixed(8)).join(",")})`;
}
