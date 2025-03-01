
import { ImageSearchParams, TextSearchParams } from "@/lib/db-types";

/**
 * Validates text search queries
 * @param query The search query to validate
 * @returns Sanitized search query
 */
export function validateTextSearch(query: string): string {
  // Validate that the query isn't empty
  const sanitizedQuery = sanitizeSearchQuery(query);
  if (!sanitizedQuery) {
    throw new Error("Search query cannot be empty");
  }
  
  return sanitizedQuery;
}

/**
 * Sanitizes search queries to prevent injection and remove unwanted characters
 * @param query The search query to sanitize
 * @returns Sanitized search query
 */
export function sanitizeSearchQuery(query: string): string {
  // Remove excessive whitespace
  let sanitized = query.trim().replace(/\s+/g, ' ');
  
  // Remove potentially harmful characters
  sanitized = sanitized.replace(/[<>]/g, '');
  
  return sanitized;
}

/**
 * Formats hashtag queries to ensure proper format
 * @param query The hashtag query
 * @returns Properly formatted hashtag
 */
export function formatHashtagQuery(query: string): string {
  const sanitized = sanitizeSearchQuery(query);
  return sanitized && !sanitized.startsWith('#') ? `#${sanitized}` : sanitized;
}

/**
 * Validates image files for search
 * @param file The file to validate
 * @throws Error if the file is invalid
 */
export function validateImageFile(file: File): void {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Please use JPEG, PNG, WebP, or GIF.`);
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    throw new Error(`File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size is 10MB.`);
  }
}

/**
 * Validates and normalizes text search parameters
 * @param params User-provided search parameters
 * @param defaultParams Default parameters to merge with
 * @returns Merged and validated parameters
 */
export function validateTextSearchParams(
  params: Partial<TextSearchParams> | undefined,
  defaultParams: TextSearchParams
): TextSearchParams {
  return {
    ...defaultParams,
    ...params
  };
}

/**
 * Validates and normalizes image search parameters
 * @param params User-provided search parameters
 * @param defaultParams Default parameters to merge with
 * @returns Merged and validated parameters
 */
export function validateImageSearchParams(
  params: Partial<ImageSearchParams> | undefined,
  defaultParams: ImageSearchParams
): ImageSearchParams {
  return {
    ...defaultParams,
    ...params
  };
}
