
import { supabase } from './supabase';
import { 
  getAvailableSearchEngines,
  optimizedSearch
} from './search';
import { quotaManager } from './search/quota-manager';
import { SearchQuery } from './db-types';

export interface PreFetchConfig {
  enabled: boolean;
  interval: number;
  maxQueries: number;
  lastRun: Date | null;
}

class PreFetchService {
  private config: PreFetchConfig = {
    enabled: false,
    interval: 6, // hours
    maxQueries: 10,
    lastRun: null
  };
  
  private isRunning: boolean = false;
  private timer: NodeJS.Timeout | null = null;
  
  constructor() {
    // Initialize prefetch service
    this.loadConfig();
  }
  
  private async loadConfig(): Promise<void> {
    const { data, error } = await supabase
      .from('system_config')
      .select('*')
      .eq('key', 'prefetch_config')
      .single();
      
    if (!error && data) {
      this.config = { ...this.config, ...JSON.parse(data.value) };
      console.log('PreFetch config loaded:', this.config);
    }
  }
  
  public async runPrefetch(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    try {
      console.log('Running scheduled pre-fetch...');
      
      // Check if we can make API requests
      const hasQuota = quotaManager.canMakeRequest('google') && quotaManager.canMakeRequest('bing');
      
      if (!hasQuota) {
        console.log('Pre-fetch skipped: API quota depleted');
        return;
      }
      
      // Get available engines to decide which to use
      const engines = getAvailableSearchEngines();
      
      // Get the most common searches
      const { data: queries, error } = await supabase
        .from('popular_searches')
        .select('*')
        .order('search_count', { ascending: false })
        .limit(this.config.maxQueries);
      
      if (error) {
        console.error('Error fetching popular searches:', error);
        return;
      }
      
      for (const query of queries) {
        // Pre-fetch results for popular queries for caching
        if (query.query_type === 'name' || query.query_type === 'hashtag') {
          await optimizedSearch('web', query.query_text);
          console.log(`Pre-fetched results for: ${query.query_text}`);
        }
      }
      
      this.config.lastRun = new Date();
      await this.saveConfig();
      
    } catch (error) {
      console.error('Error in pre-fetch process:', error);
    } finally {
      this.isRunning = false;
    }
  }
  
  private async saveConfig(): Promise<void> {
    const { error } = await supabase
      .from('system_config')
      .upsert({
        key: 'prefetch_config',
        value: JSON.stringify(this.config)
      });
      
    if (error) {
      console.error('Error saving pre-fetch config:', error);
    }
  }
  
  public startScheduledPrefetch(): void {
    if (this.timer) clearInterval(this.timer);
    
    if (!this.config.enabled) return;
    
    // Convert hours to milliseconds
    const intervalMs = this.config.interval * 60 * 60 * 1000;
    
    this.timer = setInterval(() => this.runPrefetch(), intervalMs);
    console.log(`Scheduled pre-fetch enabled, running every ${this.config.interval} hours`);
  }
  
  public stopScheduledPrefetch(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('Scheduled pre-fetch disabled');
    }
  }
  
  public getConfig(): PreFetchConfig {
    return { ...this.config };
  }
  
  public async updateConfig(newConfig: Partial<PreFetchConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    await this.saveConfig();
    
    // Restart the timer with new config
    this.stopScheduledPrefetch();
    if (this.config.enabled) {
      this.startScheduledPrefetch();
    }
  }
}

// Export singleton instance
export const preFetchService = new PreFetchService();

// Export convenience methods for PreFetchInitializer and PreFetchManager
export const schedulePreFetching = (intervalMinutes: number) => {
  preFetchService.updateConfig({ 
    enabled: true,
    interval: intervalMinutes / 60 // Convert minutes to hours
  });
  preFetchService.startScheduledPrefetch();
  
  return () => preFetchService.stopScheduledPrefetch();
};

export const startPreFetching = async () => {
  return preFetchService.runPrefetch();
};
