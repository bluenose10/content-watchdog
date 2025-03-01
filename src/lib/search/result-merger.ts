
export class ResultMerger {
  // Merge results from different engines avoiding duplicates
  public mergeSearchResults(target: any, source: any): void {
    if (!source.items || !Array.isArray(source.items)) return;
    
    const existingUrls = new Set(
      target.items.map((item: any) => item.url || '')
    );
    
    for (const item of source.items) {
      // Skip if we already have an item with the same URL
      if (item.url && existingUrls.has(item.url)) continue;
      
      target.items.push(item);
      if (item.url) existingUrls.add(item.url);
    }
  }
}

// Create singleton instance
export const resultMerger = new ResultMerger();
