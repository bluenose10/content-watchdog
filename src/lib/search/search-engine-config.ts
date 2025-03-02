
import { SearchEngineConfig } from './search-types';
import { quotaManager } from './quota-manager';

/**
 * Manages search engine configurations
 */
export class SearchEngineConfigManager {
  private searchEngines: Record<string, SearchEngineConfig> = {};

  constructor() {
    // Initialize search engines with priority (higher = tried first)
    this.searchEngines = {
      'google': {
        name: 'Google Search',
        enabled: true,
        priority: 10,
        quotaConfig: quotaManager['quotas']['google']
      },
      'bing': {
        name: 'Bing Search',
        enabled: true,
        priority: 8,
        quotaConfig: quotaManager['quotas']['bing']
      },
      'youtube': {
        name: 'YouTube Search',
        enabled: true,
        priority: 5,
        quotaConfig: quotaManager['quotas']['youtube']
      }
    };
  }

  /**
   * Get all available search engines sorted by priority
   */
  public getAvailableEngines(filterByQuota: boolean = true): string[] {
    return Object.keys(this.searchEngines)
      .filter(key => this.searchEngines[key].enabled && 
        (!filterByQuota || quotaManager.canMakeRequest(key)))
      .sort((a, b) => this.searchEngines[b].priority - this.searchEngines[a].priority);
  }

  /**
   * Enable or disable a search engine
   */
  public toggleEngine(name: string, enabled: boolean): void {
    if (this.searchEngines[name]) {
      this.searchEngines[name].enabled = enabled;
      console.log(`${name} search engine ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Set the priority for a search engine
   */
  public setPriority(name: string, priority: number): void {
    if (this.searchEngines[name]) {
      this.searchEngines[name].priority = priority;
      console.log(`${name} search engine priority set to ${priority}`);
    }
  }

  /**
   * Get statistics for all search engines
   */
  public getEngineStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    Object.keys(this.searchEngines).forEach(key => {
      const engine = this.searchEngines[key];
      const quota = engine.quotaConfig;
      
      stats[key] = {
        name: engine.name,
        enabled: engine.enabled,
        priority: engine.priority,
        ...quotaManager.getQuotaStats()[key]
      };
    });
    
    return stats;
  }
}

// Export singleton instance
export const searchEngineConfig = new SearchEngineConfigManager();
