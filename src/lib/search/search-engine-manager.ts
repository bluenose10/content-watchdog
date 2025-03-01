
import { SearchEngineConfig, QuotaConfig } from './types';
import { quotaManager } from './quota-manager';

export class SearchEngineManager {
  private searchEngines: Record<string, SearchEngineConfig> = {};
  
  constructor() {
    // Initialize search engines with priority (higher = tried first)
    this.searchEngines = {
      'google': {
        name: 'Google Search',
        enabled: true,
        priority: 10,
        quotaConfig: quotaManager.getQuota('google')
      },
      'bing': {
        name: 'Bing Search',
        enabled: true,
        priority: 8,
        quotaConfig: quotaManager.getQuota('bing')
      },
      'youtube': {
        name: 'YouTube Search',
        enabled: true,
        priority: 5,
        quotaConfig: quotaManager.getQuota('youtube')
      }
    };
    
    console.log('SearchEngineManager initialized with multiple search engines');
  }
  
  public getAvailableSearchEngines(): string[] {
    return Object.keys(this.searchEngines)
      .filter(key => this.searchEngines[key].enabled && quotaManager.canMakeRequest(key))
      .sort((a, b) => this.searchEngines[b].priority - this.searchEngines[a].priority);
  }
  
  public toggleSearchEngine(name: string, enabled: boolean): void {
    if (this.searchEngines[name]) {
      this.searchEngines[name].enabled = enabled;
      console.log(`${name} search engine ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
  
  public setPriority(name: string, priority: number): void {
    if (this.searchEngines[name]) {
      this.searchEngines[name].priority = priority;
      console.log(`${name} search engine priority set to ${priority}`);
    }
  }
  
  public getSearchEngineStats(): any {
    const stats: Record<string, any> = {};
    
    Object.keys(this.searchEngines).forEach(key => {
      const engine = this.searchEngines[key];
      const quota = engine.quotaConfig;
      
      stats[key] = {
        name: engine.name,
        enabled: engine.enabled,
        priority: engine.priority,
        dailyUsage: quota.currentUsage,
        dailyLimit: quota.dailyLimit,
        dailyRemaining: quota.dailyLimit - quota.currentUsage,
        minuteUsage: quota.minuteUsage,
        minuteLimit: quota.perMinuteLimit,
        available: quotaManager.canMakeRequest(key)
      };
    });
    
    return stats;
  }
}

// Export singleton instance
export const searchEngineManager = new SearchEngineManager();

// Export convenience methods
export const getAvailableSearchEngines = () => searchEngineManager.getAvailableSearchEngines();
export const getSearchEngineStats = () => searchEngineManager.getSearchEngineStats();
export const toggleSearchEngine = (name: string, enabled: boolean) => 
  searchEngineManager.toggleSearchEngine(name, enabled);
export const enableBingSearch = () => toggleSearchEngine('bing', true);
export const disableBingSearch = () => toggleSearchEngine('bing', false);
export const setBingPriority = (priority: number) => 
  searchEngineManager.setPriority('bing', priority);
