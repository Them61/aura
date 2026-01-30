/**
 * Web Vitals reporting for performance monitoring
 * Helps identify and track Core Web Vitals metrics
 */

export interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

// Thresholds for Core Web Vitals
const THRESHOLDS = {
  'CLS': { good: 0.1, poor: 0.25 },
  'FCP': { good: 1800, poor: 3000 },
  'LCP': { good: 2500, poor: 4000 },
  'FID': { good: 100, poor: 300 },
  'INP': { good: 200, poor: 500 },
  'TTFB': { good: 800, poor: 1800 },
};

function getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric as keyof typeof THRESHOLDS];
  if (!threshold) return 'needs-improvement';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

export function reportWebVitals(callback?: (metric: Metric) => void) {
  // Track Cumulative Layout Shift (CLS)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).hadRecentInput) continue;
          
          const metric: Metric = {
            name: 'CLS',
            value: (entry as any).value,
            rating: getRating('CLS', (entry as any).value),
            delta: (entry as any).value,
            id: `cls-${Date.now()}`,
          };
          
          if (callback) callback(metric);
          console.log('Web Vital [CLS]:', metric.value, metric.rating);
        }
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // PerformanceObserver not supported
    }
  }

  // Track Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        const metric: Metric = {
          name: 'LCP',
          value: (lastEntry as any).renderTime || (lastEntry as any).loadTime,
          rating: getRating('LCP', (lastEntry as any).renderTime || (lastEntry as any).loadTime),
          delta: (lastEntry as any).renderTime || (lastEntry as any).loadTime,
          id: `lcp-${Date.now()}`,
        };
        
        if (callback) callback(metric);
        console.log('Web Vital [LCP]:', metric.value, metric.rating);
      });
      
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // PerformanceObserver not supported
    }
  }

  // Track First Input Delay (FID) or Interaction to Next Paint (INP)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const metric: Metric = {
            name: (entry as any).name === 'first-input' ? 'FID' : 'INP',
            value: (entry as any).processingDuration,
            rating: getRating('FID', (entry as any).processingDuration),
            delta: (entry as any).processingDuration,
            id: `${(entry as any).name}-${Date.now()}`,
          };
          
          if (callback) callback(metric);
          console.log(`Web Vital [${metric.name}]:`, metric.value, metric.rating);
        }
      });
      
      observer.observe({ type: 'first-input', buffered: true });
      observer.observe({ type: 'interaction', buffered: true });
    } catch (e) {
      // PerformanceObserver not supported
    }
  }

  // Track Time to First Byte (TTFB)
  if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
      const ttfb = performance.timing.responseStart - performance.timing.navigationStart;
      const metric: Metric = {
        name: 'TTFB',
        value: ttfb,
        rating: getRating('TTFB', ttfb),
        delta: ttfb,
        id: `ttfb-${Date.now()}`,
      };
      
      if (callback) callback(metric);
      console.log('Web Vital [TTFB]:', metric.value, metric.rating);
    });
  }
}
