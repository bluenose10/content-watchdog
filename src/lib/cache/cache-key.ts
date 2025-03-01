
/**
 * Generate a consistent cache key for a search query
 */
export const getCacheKey = (type: string, query: string, params: any = {}): string => {
  // Sort params to ensure consistent keys regardless of property order
  const sortedParams = params ? 
    JSON.stringify(params, Object.keys(params).sort()) : 
    '{}';
  
  return `${type}:${query.toLowerCase()}:${sortedParams}`;
};
