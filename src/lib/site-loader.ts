/** sessionStorage key: the loading screen shows once per browser session. */
export const LOADER_SESSION_KEY = "rifs-loader-seen";

/** Class set on <html> by the inline head script when the loader was already seen. */
export const LOADER_SKIP_CLASS = "rifs-loader-skip";

/**
 * Inline script for <head>. It runs before first paint, so returning visitors
 * (same session) never see the server-rendered overlay flash.
 */
export const loaderSkipScript = `try{if(sessionStorage.getItem("${LOADER_SESSION_KEY}"))document.documentElement.classList.add("${LOADER_SKIP_CLASS}")}catch(e){}`;
