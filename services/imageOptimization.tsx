/**
 * Image optimization utilities for Lighthouse performance
 */

import React from 'react';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
  priority?: boolean;
}

/**
 * Convert ImageKit URL to optimized WebP with fallback
 * Adds compression, quality settings, and responsive variants
 */
export function optimizeImageKitUrl(
  url: string,
  width: number,
  height: number,
  quality: number = 80
): string {
  // Already optimized by ImageKit
  if (url.includes('?tr=')) return url;
  
  // Add ImageKit transformation parameters
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}tr=w-${width},h-${height},q-${quality},f-auto`;
}

/**
 * Generate responsive srcset for images
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [300, 500, 800, 1200]
): string {
  return widths
    .map(w => `${optimizeImageKitUrl(baseUrl, w, Math.round(w * 1.33))} ${w}w`)
    .join(', ');
}

/**
 * Get WebP variant of ImageKit URL
 */
export function getWebPUrl(url: string): string {
  if (url.includes('?tr=')) {
    return url.replace(/f-auto/, 'f-webp');
  }
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}tr=f-webp`;
}

/**
 * React Image component with optimization
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  title,
  loading = 'lazy',
  className,
  priority = false,
}) => {
  const optimizedSrc = optimizeImageKitUrl(src, width, height);
  const webpSrc = getWebPUrl(optimizedSrc);
  const srcSet = generateSrcSet(src);

  return (
    <picture>
      <source 
        srcSet={srcSet.replace(/\.jpg/g, '.webp')} 
        type="image/webp" 
      />
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 85vw"
        alt={alt}
        title={title}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        className={className}
      />
    </picture>
  );
};
