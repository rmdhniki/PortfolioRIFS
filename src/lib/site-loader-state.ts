"use client";

import { useSyncExternalStore } from "react";
import { LOADER_SESSION_KEY, LOADER_SKIP_CLASS } from "./site-loader";

const EVENT = "rifs:loader-done";
let done = false;

export function markLoaderDone() {
  if (done) return;
  done = true;
  try {
    sessionStorage.setItem(LOADER_SESSION_KEY, "1");
  } catch {
    // Storage can be unavailable (private mode); the loader just shows again next time.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function isLoaderSkipped() {
  return document.documentElement.classList.contains(LOADER_SKIP_CLASS);
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

/**
 * True once the initial loading screen has finished (or was skipped this
 * session). Use it to hold entrance animations until the page is revealed.
 */
export function useLoaderDone() {
  return useSyncExternalStore(subscribe, () => done || isLoaderSkipped(), () => false);
}
