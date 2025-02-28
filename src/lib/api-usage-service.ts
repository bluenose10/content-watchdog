
import { supabase } from '@/lib/supabase';

/**
 * Fetches API call statistics from the database
 */
export async function getApiCallStats(timeframe: string = 'monthly') {
  try {
    // In a real implementation, you would query your database
    // for actual API call statistics based on logs
    
    // For now, returning the most recent search queries count as a proxy for API usage
    const { data: searchQueries, error } = await supabase
      .from('search_queries')
      .select('created_at, query_type')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Process the data to get counts by month or other time periods
    let processedData;
    switch(timeframe) {
      case 'daily':
        processedData = processApiCallsByDay(searchQueries || []);
        break;
      case 'weekly':
        processedData = processApiCallsByWeek(searchQueries || []);
        break;
      case 'yearly':
        processedData = processApiCallsByYear(searchQueries || []);
        break;
      case 'monthly':
      default:
        processedData = processApiCallsByMonth(searchQueries || []);
    }
    
    return { 
      apiCalls: processedData,
      totalCalls: searchQueries?.length || 0,
      googleApiCalls: searchQueries?.filter(q => q.query_type === 'name' || q.query_type === 'hashtag')?.length || 0,
      imageApiCalls: searchQueries?.filter(q => q.query_type === 'image')?.length || 0
    };
  } catch (error) {
    console.error('Error fetching API call stats:', error);
    return { 
      apiCalls: [],
      totalCalls: 0,
      googleApiCalls: 0,
      imageApiCalls: 0
    };
  }
}

/**
 * Processes raw query data into daily API call counts
 */
function processApiCallsByDay(queries: any[]) {
  // Group queries by day
  const dailyData: Record<string, { google: number, supabase: number, storage: number }> = {};
  
  queries.forEach(query => {
    const date = new Date(query.created_at);
    const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    if (!dailyData[dayKey]) {
      dailyData[dayKey] = { google: 0, supabase: 0, storage: 0 };
    }
    
    // Increment the appropriate counter
    if (query.query_type === 'image') {
      dailyData[dayKey].google += 1;
      dailyData[dayKey].storage += 1;
    } else {
      dailyData[dayKey].google += 1;
    }
    
    // Each query involves at least one Supabase call
    dailyData[dayKey].supabase += 1;
  });
  
  // Convert to array for charting
  return Object.entries(dailyData)
    .map(([date, counts]) => ({
      date,
      google: counts.google,
      supabase: counts.supabase,
      storage: counts.storage
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Processes raw query data into weekly API call counts
 */
function processApiCallsByWeek(queries: any[]) {
  // Group queries by week (using ISO week numbering)
  const weeklyData: Record<string, { google: number, supabase: number, storage: number }> = {};
  
  queries.forEach(query => {
    const date = new Date(query.created_at);
    const year = date.getFullYear();
    
    // Get ISO week number
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    
    const weekKey = `${year}-W${String(weekNumber).padStart(2, '0')}`;
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { google: 0, supabase: 0, storage: 0 };
    }
    
    // Increment the appropriate counter
    if (query.query_type === 'image') {
      weeklyData[weekKey].google += 1;
      weeklyData[weekKey].storage += 1;
    } else {
      weeklyData[weekKey].google += 1;
    }
    
    // Each query involves at least one Supabase call
    weeklyData[weekKey].supabase += 1;
  });
  
  // Convert to array for charting
  return Object.entries(weeklyData)
    .map(([date, counts]) => ({
      date,
      google: counts.google,
      supabase: counts.supabase,
      storage: counts.storage
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Processes raw query data into monthly API call counts
 */
function processApiCallsByMonth(queries: any[]) {
  // Group queries by month
  const monthlyData: Record<string, { google: number, supabase: number, storage: number }> = {};
  
  queries.forEach(query => {
    const date = new Date(query.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { google: 0, supabase: 0, storage: 0 };
    }
    
    // Increment the appropriate counter
    if (query.query_type === 'image') {
      monthlyData[monthKey].google += 1;
      monthlyData[monthKey].storage += 1;
    } else {
      monthlyData[monthKey].google += 1;
    }
    
    // Each query involves at least one Supabase call
    monthlyData[monthKey].supabase += 1;
  });
  
  // Convert to array for charting
  return Object.entries(monthlyData)
    .map(([date, counts]) => ({
      date,
      google: counts.google,
      supabase: counts.supabase,
      storage: counts.storage
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Processes raw query data into yearly API call counts
 */
function processApiCallsByYear(queries: any[]) {
  // Group queries by year
  const yearlyData: Record<string, { google: number, supabase: number, storage: number }> = {};
  
  queries.forEach(query => {
    const date = new Date(query.created_at);
    const yearKey = `${date.getFullYear()}`;
    
    if (!yearlyData[yearKey]) {
      yearlyData[yearKey] = { google: 0, supabase: 0, storage: 0 };
    }
    
    // Increment the appropriate counter
    if (query.query_type === 'image') {
      yearlyData[yearKey].google += 1;
      yearlyData[yearKey].storage += 1;
    } else {
      yearlyData[yearKey].google += 1;
    }
    
    // Each query involves at least one Supabase call
    yearlyData[yearKey].supabase += 1;
  });
  
  // Convert to array for charting
  return Object.entries(yearlyData)
    .map(([date, counts]) => ({
      date,
      google: counts.google,
      supabase: counts.supabase,
      storage: counts.storage
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Estimates API costs based on usage
 */
export async function getApiCostEstimates() {
  try {
    const { apiCalls, totalCalls, googleApiCalls, imageApiCalls } = await getApiCallStats();
    
    // Apply cost models
    // These are example rates - adjust based on your actual pricing
    const googleCostPerCall = 0.005; // $0.005 per search API call
    const supabaseCostBase = 25; // $25 base cost
    const storageCostPerGB = 0.023; // $0.023 per GB
    
    // Estimate storage - in a real app, query actual storage usage
    const estimatedStorageGB = Math.max(1, Math.floor(totalCalls / 100));
    
    const googleCost = googleApiCalls * googleCostPerCall;
    const imageCost = imageApiCalls * 0.01; // Higher cost for image API calls
    const storageCost = estimatedStorageGB * storageCostPerGB;
    const supabaseCost = supabaseCostBase + (totalCalls * 0.0001); // Base + per-operation cost
    
    const totalCost = googleCost + imageCost + storageCost + supabaseCost;
    
    // Generate monthly cost data
    const monthlyCostData = apiCalls.map(monthData => ({
      month: monthData.date.split('-')[1],
      cost: (
        (monthData.google * googleCostPerCall) +
        (monthData.storage * 0.01) +
        (supabaseCostBase / apiCalls.length) +
        (monthData.supabase * 0.0001)
      ).toFixed(2)
    }));
    
    // Calculate month-over-month change
    let previousMonthCost = 0;
    let currentMonthCost = 0;
    
    if (monthlyCostData.length >= 2) {
      previousMonthCost = parseFloat(monthlyCostData[monthlyCostData.length - 2].cost);
      currentMonthCost = parseFloat(monthlyCostData[monthlyCostData.length - 1].cost);
    }
    
    const costChange = previousMonthCost > 0 
      ? Math.round(((currentMonthCost - previousMonthCost) / previousMonthCost) * 100) 
      : 0;
    
    return {
      costBreakdown: [
        { name: "Google APIs", value: +(googleCost + imageCost).toFixed(2) },
        { name: "Supabase", value: +supabaseCost.toFixed(2) },
        { name: "Storage", value: +storageCost.toFixed(2) }
      ],
      totalMonthlyCost: +totalCost.toFixed(2),
      googleApiCost: +(googleCost + imageCost).toFixed(2),
      storageCost: +storageCost.toFixed(2),
      supabaseCost: +supabaseCost.toFixed(2),
      monthlyCostData: monthlyCostData.slice(-12), // Last 12 months
      costChange: costChange
    };
  } catch (error) {
    console.error('Error calculating API costs:', error);
    return {
      costBreakdown: [],
      totalMonthlyCost: 0,
      googleApiCost: 0,
      storageCost: 0,
      supabaseCost: 0,
      monthlyCostData: [],
      costChange: 0
    };
  }
}

/**
 * Gets storage usage statistics
 */
export async function getStorageStats() {
  try {
    // In a real implementation, query your storage metrics
    // For now, estimate based on the number of image searches
    const { data: imageQueries, error } = await supabase
      .from('search_queries')
      .select('created_at')
      .eq('query_type', 'image')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Process the data to get storage by month
    const monthlyData = processStorageByMonth(imageQueries || []);
    
    // Estimate total storage used
    const totalImages = imageQueries?.length || 0;
    const estimatedStorageGB = Math.max(0.1, (totalImages * 2) / 1000); // Estimate ~2MB per image
    
    // Calculate storage growth rate
    let previousMonthStorage = 0;
    let currentMonthStorage = 0;
    
    if (monthlyData.length >= 2) {
      previousMonthStorage = monthlyData[monthlyData.length - 2].images;
      currentMonthStorage = monthlyData[monthlyData.length - 1].images;
    }
    
    const storageGrowthRate = previousMonthStorage > 0 
      ? Math.round(((currentMonthStorage - previousMonthStorage) / previousMonthStorage) * 100) 
      : 0;
    
    return {
      storageUsage: monthlyData,
      totalStorageGB: +estimatedStorageGB.toFixed(1),
      imagesStorageGB: +(estimatedStorageGB * 0.7).toFixed(1), // 70% of storage is images
      databaseStorageGB: +(estimatedStorageGB * 0.2).toFixed(1), // 20% is database
      backupsStorageGB: +(estimatedStorageGB * 0.1).toFixed(1), // 10% is backups
      storageGrowthRate: storageGrowthRate
    };
  } catch (error) {
    console.error('Error fetching storage stats:', error);
    return {
      storageUsage: [],
      totalStorageGB: 0.1,
      imagesStorageGB: 0.07,
      databaseStorageGB: 0.02,
      backupsStorageGB: 0.01,
      storageGrowthRate: 0
    };
  }
}

/**
 * Processes image queries into monthly storage usage
 */
function processStorageByMonth(queries: any[]) {
  const baseSizePerImageMB = 2; // Assume 2MB per image
  const monthlyData: Record<string, { images: number, data: number, backups: number }> = {};
  let runningTotalImages = 0;
  
  // Group by month and calculate cumulative storage
  queries.forEach(query => {
    const date = new Date(query.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    runningTotalImages += 1;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { 
        images: 0, 
        data: 0, 
        backups: 0 
      };
    }
  });
  
  // Calculate cumulative storage
  let cumulativeImages = 0;
  
  return Object.entries(monthlyData)
    .map(([date]) => {
      // Add a random number of images for this month (1-5)
      const newImages = Math.floor(Math.random() * 5) + 1;
      cumulativeImages += newImages;
      
      // Convert to GB
      const imagesGB = +(cumulativeImages * baseSizePerImageMB / 1024).toFixed(1);
      const dataGB = +(imagesGB * 0.3).toFixed(1); // 30% of image storage
      const backupsGB = +(imagesGB * 0.1).toFixed(1); // 10% of image storage
      
      return {
        date,
        images: imagesGB,
        data: dataGB,
        backups: backupsGB
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Gets real-time usage metrics
 */
export async function getRealTimeMetrics() {
  try {
    // In a real app, this would query your real-time API usage metrics
    // For now, generating some sample data
    
    // Generate timestamps for the last 24 hours, at 1 hour intervals
    const timestamps = Array.from({ length: 24 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - (24 - i));
      return date.toISOString();
    });
    
    // Generate simulated API load values (0-100%)
    const apiLoad = timestamps.map(() => Math.floor(Math.random() * 100));
    
    // Generate response times (100-500ms)
    const responseTime = timestamps.map(() => 100 + Math.floor(Math.random() * 400));
    
    // Generate error rates (0-5%)
    const errorRate = timestamps.map(() => Math.random() * 5);
    
    return {
      timestamps,
      apiLoad,
      responseTime,
      errorRate,
      currentLoad: apiLoad[apiLoad.length - 1],
      avgResponseTime: Math.round(responseTime.reduce((a, b) => a + b, 0) / responseTime.length),
      currentErrorRate: errorRate[errorRate.length - 1].toFixed(2)
    };
  } catch (error) {
    console.error('Error fetching real-time metrics:', error);
    return {
      timestamps: [],
      apiLoad: [],
      responseTime: [],
      errorRate: [],
      currentLoad: 0,
      avgResponseTime: 0,
      currentErrorRate: '0.00'
    };
  }
}
