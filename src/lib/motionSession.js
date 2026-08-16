// Entrance animations should feel like a welcome, not a toll booth.
//
// They play on the first page a visitor lands on, then stay quiet for the rest
// of the browser session: moving between pages (or coming back to one they have
// already seen) renders instantly, and so does a reload. Opening a fresh tab
// later starts a new session and earns the welcome again.
const STORAGE_KEY = 'novola:intro-seen';

const hasWindow = typeof window !== 'undefined';

const readSeen = () => {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false; // private mode or storage blocked
  }
};

// The page the visitor arrived on. Once they navigate elsewhere the path no
// longer matches, so the new page renders static from its very first frame
// rather than animating once and being switched off afterwards.
const initialPath = hasWindow ? window.location.pathname : '';

let allowed = hasWindow ? !readSeen() : false;

export function shouldAnimate() {
  if (!allowed || !hasWindow) return false;
  return window.location.pathname === initialPath;
}

export function rememberSeen() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* storage unavailable, in-memory state still applies */
  }
}

export function stopAnimations() {
  allowed = false;
  rememberSeen();
}
