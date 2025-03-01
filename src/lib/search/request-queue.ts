
import { QueuedRequest } from './search-types';

export class RequestQueueManager {
  private requestQueue: Array<QueuedRequest> = [];
  private isProcessing = false;
  private userPriorities: Map<string, boolean> = new Map<string, boolean>();
  
  constructor() {}
  
  public addToQueue(request: QueuedRequest): void {
    this.requestQueue.push(request);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }
  
  // Process the queue with priority consideration
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      // Sort the queue to prioritize premium users if we have any priority requests
      if (this.userPriorities.size > 0) {
        this.requestQueue.sort((a, b) => {
          const aHasPriority = a.userId && this.hasUserPriority(a.userId);
          const bHasPriority = b.userId && this.hasUserPriority(b.userId);
          
          if (aHasPriority && !bHasPriority) return -1;
          if (!aHasPriority && bHasPriority) return 1;
          return 0;
        });
      }
      
      // Process the next request in the queue
      const nextRequest = this.requestQueue.shift();
      if (nextRequest) {
        await nextRequest.execute();
      }
    } catch (error) {
      console.error('Error processing Search API request:', error);
    } finally {
      this.isProcessing = false;
      
      // Continue processing if there are more requests
      if (this.requestQueue.length > 0) {
        // Small delay between requests to avoid rate limiting
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }
  
  // Set user priority based on subscription tier
  public setPriorityMode(userId: string, isPriority: boolean): void {
    // Set this user's priority status
    this.userPriorities.set(userId, isPriority);
    
    console.log(`User ${userId} priority mode set to ${isPriority}`);
  }
  
  // Check if a user has priority
  public hasUserPriority(userId: string): boolean {
    return this.userPriorities.get(userId) || false;
  }
}

// Export singleton instance
export const requestQueue = new RequestQueueManager();
