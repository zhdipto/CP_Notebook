const STORAGE_KEY = 'cp_device_id';

// Fallback for non-secure contexts, where crypto.randomUUID is unavailable
// (it requires HTTPS or localhost). Still 128 bits from a CSPRNG.
function randomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

// The whole notebook hangs off this one value: it is the sole proof that these
// snippets are yours, so it is generated once per browser and never leaves
// localStorage except as the X-Device-Id request header.
//
// Consequences worth being aware of: clearing site data, using a different
// browser, or opening a private window all mean a DIFFERENT id, and therefore
// a different (empty) notebook. There is no recovery path by design — there is
// no account to prove ownership with.
export function getDeviceId() {
  let id = null;
  try {
    id = localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private modes can throw on access rather than just returning null.
    return null;
  }

  if (!id) {
    id = randomId();
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Storage unavailable: the id still works for this page's lifetime, but
      // it won't survive a reload. Surfaced to the user by StorageWarning.
    }
  }
  return id;
}

// True when we cannot persist the id, so the UI can warn that nothing will be
// findable after a reload instead of silently losing the user's work.
export function isDeviceIdPersistent() {
  try {
    const id = getDeviceId();
    return Boolean(id) && localStorage.getItem(STORAGE_KEY) === id;
  } catch {
    return false;
  }
}
