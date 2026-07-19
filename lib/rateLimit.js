// Minimal in-memory rate limiter (per server instance).
// Good enough to slow down brute-force attempts on the single admin login.
const attempts = new Map();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 8;

export function isRateLimited(key) {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.windowStart > WINDOW_MS) {
    attempts.set(key, { windowStart: now, count: 1 });
    return false;
  }

  record.count += 1;
  return record.count > MAX_ATTEMPTS;
}

export function resetRateLimit(key) {
  attempts.delete(key);
}
