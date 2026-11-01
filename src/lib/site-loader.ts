/** sessionStorage key: the loading screen shows once per browser session. */
export const LOADER_SESSION_KEY = "rifs-loader-seen";

/** Class set on <html> by the inline head script when the loader was already seen. */
export const LOADER_SKIP_CLASS = "rifs-loader-skip";

/**
 * Inline script for <head>. It runs before first paint, so returning visitors
 * (same session) never see the server-rendered overlay flash.
 */
export const loaderSkipScript = `try{if(sessionStorage.getItem("${LOADER_SESSION_KEY}"))document.documentElement.classList.add("${LOADER_SKIP_CLASS}")}catch(e){}`;

/** Shared timing for the loading bar (pre-hydration script + React component). */
export const LOADER_TIMING = {
  /** Intended length of the loading experience. */
  durationMs: 10000,
  /** Creep time constant: the bar keeps moving while waiting on slow resources. */
  creepMs: 5000,
  /** Max the pre-hydration script may approach (React decides the rest once it knows readiness). */
  preMax: 0.8,
  /** Slower creep before hydration, so the bar is still visibly moving on very slow connections. */
  preCreepMs: 14000,
} as const;

/** Element ids the pre-hydration script drives. */
export const LOADER_IDS = { bar: "site-loader-bar", head: "site-loader-head", percent: "site-loader-pct" } as const;

/** Window flag set by the React loader when it takes over the bar. */
export const LOADER_TAKEOVER_FLAG = "__rifsLoaderTakeover";
/** Window value: the bar position the pre-hydration script reached (0–1). */
export const LOADER_PRE_VALUE = "__rifsLoaderPre";

/**
 * Inline script for <head>: animates the loading bar *before* React hydrates.
 * The overlay is server-rendered, but the React-driven animation only starts
 * after the JS bundle has downloaded — on a slow connection that left the bar
 * frozen at 0% for many seconds. Same curve as the React loader, capped at
 * `preMax`; React continues from wherever this left off.
 */
export const loaderProgressScript = `(function(){
if(document.documentElement.classList.contains("${LOADER_SKIP_CLASS}"))return;
var D=${LOADER_TIMING.durationMs},C=${LOADER_TIMING.preCreepMs},M=${LOADER_TIMING.preMax},w=window;
function ease(t){return(t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2)*.3+t*.7}
function f(now){
if(w["${LOADER_TAKEOVER_FLAG}"])return;
var b=document.getElementById("${LOADER_IDS.bar}");
if(b){
var v=Math.min(ease(Math.min(now/D,1)),M*(1-Math.exp(-now/C)));
w["${LOADER_PRE_VALUE}"]=v;
b.style.transform="scaleX("+v+")";
var h=document.getElementById("${LOADER_IDS.head}");if(h)h.style.left=v*100+"%";
var p=document.getElementById("${LOADER_IDS.percent}");if(p)p.textContent=Math.floor(v*100)+"%";
}
requestAnimationFrame(f);
}
requestAnimationFrame(f);
})();`;
