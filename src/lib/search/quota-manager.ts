
import { QuotaConfig } from './types';

export class QuotaManager {
  private quotas: Record<string, QuotaConfig> = {};
  
  // Default quota values - adjust based on your actual API limits
  private DEFAULT_QUOTA: QuotaConfig = {
    dailyLimit: 10000,
    currentUsage: 0,
    resetTime: this.getEndOfDay(),
    perMinuteLimit: 60,
    minuteUsage: 0,
    minuteReset: Date.now() + 60000
  };
  
  constructor() {
    // Initialize default quotas for different search APIs
    this.quotas = {
      'google': { ...this.DEFAULT_QUOTA },
      'bing': { ...this.DEFAULT_QUOTA, dailyLimit: 3000, perMinuteLimit: 50 },
      'maps': { ...this.DEFAULT_QUOTA, dailyLimit: 5000 },
      'youtube': { ...this.DEFAULT_QUOTA, dailyLimit: 20000 }
    };
    
    // Set up periodic quota reset
    setInterval(() => this.checkAndResetQuotas(), 60000); // Check every minute
  }
  
  private getEndOfDay(): number {
    const now = new Date();
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23, 59, 59, 999
    );
    return endOfDay.getTime();
  }
  
  private checkAndResetQuotas(): void {
    const now = Date.now();
    
    // Reset daily quotas if needed
    Object.keys(this.quotas).forEach(key => {
      const quota = this.quotas[key];
      
      // Reset daily quota if past reset time
      if (now > quota.resetTime) {
        quota.currentUsage = 0;
        quota.resetTime = this.getEndOfDay();
      }
      
      // Reset minute quota if past minute reset
      if (now > quota.minuteReset) {
        quota.minuteUsage = 0;
        quota.minuteReset = now + 60000; // Next minute
      }
    });
  }
  
  public canMakeRequest(apiType: string): boolean {
    const quota = this.quotas[apiType] || this.DEFAULT_QUOTA;
    const now = Date.now();
    
    // Reset minute quota if needed
    if (now > quota.minuteReset) {
      quota.minuteUsage = 0;
      quota.minuteReset = now + 60000;
    }
    
    return (
      quota.currentUsage < quota.dailyLimit &&
      quota.minuteUsage < quota.perMinuteLimit
    );
  }
  
  public trackUsage(apiType: string): void {
    const quota = this.quotas[apiType] || this.DEFAULT_QUOTA;
    
    // Update quota usage
    quota.currentUsage++;
    quota.minuteUsage++;
  }
  
  public getQuota(apiType: string): QuotaConfig {
    return this.quotas[apiType] || this.DEFAULT_QUOTA;
  }
}

// Export singleton instance
export const quotaManager = new QuotaManager();
