export const API_TIMEOUT_MS = 8_000;

export async function withAbortTimeout<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  timeoutMs = API_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timeoutError = new DOMException(
    `Request timed out after ${timeoutMs}ms`,
    "TimeoutError",
  );

  const timeoutId = setTimeout(() => {
    controller.abort(timeoutError);
  }, timeoutMs);

  const abortPromise = new Promise<never>((_, reject) => {
    controller.signal.addEventListener(
      "abort",
      () => reject(controller.signal.reason ?? timeoutError),
      { once: true },
    );
  });

  try {
    return await Promise.race([operation(controller.signal), abortPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
}
