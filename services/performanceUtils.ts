/**
 * Main-thread performance optimization utilities
 * Breaks up long tasks to improve TBT (Total Blocking Time)
 */

/**
 * Defer a function execution to avoid blocking the main thread
 * Uses requestIdleCallback with setTimeout fallback
 */
export function deferTask(callback: () => void, priority: 'high' | 'low' = 'low'): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => callback(), { 
      timeout: priority === 'high' ? 1000 : 2000 
    });
  } else {
    setTimeout(callback, priority === 'high' ? 0 : 16);
  }
}

/**
 * Break up a long-running task into smaller chunks
 * Yields to the browser between chunks
 */
export async function yieldToMain(): Promise<void> {
  return new Promise(resolve => {
    if ('scheduler' in window && 'yield' in (window as any).scheduler) {
      (window as any).scheduler.yield().then(resolve);
    } else {
      setTimeout(resolve, 0);
    }
  });
}

/**
 * Process an array in chunks to avoid blocking the main thread
 */
export async function processInChunks<T>(
  items: T[],
  processor: (item: T) => void,
  chunkSize: number = 10
): Promise<void> {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    chunk.forEach(processor);
    if (i + chunkSize < items.length) {
      await yieldToMain();
    }
  }
}

/**
 * Debounce scroll events to reduce main-thread work
 */
export function debounceScroll(
  callback: () => void,
  delay: number = 150
): () => void {
  let timeoutId: NodeJS.Timeout;

  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
}

/**
 * Throttle handler to limit function execution frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
