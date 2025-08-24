'use server';

import { getSiteSettings } from '../utils/siteSettings';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';

interface CountryData {
  country: string;
  countryCode: string;
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface AnalyticsData {
  totalSessions: number;
  totalUsers: number;
  totalPageViews: number;
  avgBounceRate: number;
  avgSessionDuration: number;
  countries: CountryData[];
  topCountries: CountryData[];
}

// Initialize Google Analytics client
function getAnalyticsClient() {
  try {
    // Check if we have service account credentials
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      const credentials = JSON.parse(serviceAccountKey);
      return new BetaAnalyticsDataClient({
        credentials,
        projectId: credentials.project_id,
      });
    }
    
    // Fallback to application default credentials
    return new BetaAnalyticsDataClient();
  } catch (error) {
    console.error('Error initializing Analytics client:', error);
    return null;
  }
}

// Get GA4 Property ID from tracking ID
function getPropertyId(trackingId: string): string {
  // Convert G-WBQWZPRWCL to property ID format
  // You'll need to get your actual property ID from GA4 admin
  // For now, we'll use a placeholder - you'll need to replace this
  return `properties/${process.env.GA4_PROPERTY_ID || '123456789'}`;
}

// Country name to ISO code mapping
const countryCodeMap: Record<string, string> = {
  'United States': 'US',
  'India': 'IN',
  'United Kingdom': 'GB',
  'Canada': 'CA',
  'Germany': 'DE',
  'Australia': 'AU',
  'France': 'FR',
  'Brazil': 'BR',
  'Japan': 'JP',
  'Mexico': 'MX',
  'Italy': 'IT',
  'Spain': 'ES',
  'Netherlands': 'NL',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Belgium': 'BE',
  'Poland': 'PL',
  'Czech Republic': 'CZ',
  'Hungary': 'HU',
  'Romania': 'RO',
  'Bulgaria': 'BG',
  'Croatia': 'HR',
  'Slovenia': 'SI',
  'Slovakia': 'SK',
  'Estonia': 'EE',
  'Latvia': 'LV',
  'Lithuania': 'LT',
  'Ireland': 'IE',
  'Portugal': 'PT',
  'Greece': 'GR',
  'Cyprus': 'CY',
  'Malta': 'MT',
  'Luxembourg': 'LU',
  'Iceland': 'IS',
  'Liechtenstein': 'LI',
  'Monaco': 'MC',
  'San Marino': 'SM',
  'Vatican City': 'VA',
  'Andorra': 'AD',
};

function getCountryCode(countryName: string): string | null {
  return countryCodeMap[countryName] || null;
}

export async function getAnalyticsData(days: number = 30): Promise<AnalyticsData> {
  try {
    const settings = await getSiteSettings();
    const analyticsId = settings.google_analytics_id;

    if (!analyticsId) {
      throw new Error('No Google Analytics ID configured');
    }

    const client = getAnalyticsClient();
    if (!client) {
      throw new Error('Failed to initialize Analytics client');
    }

    const propertyId = getPropertyId(analyticsId);
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch country data
    const [countryResponse] = await client.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
      ],
      dimensions: [
        {
          name: 'country',
        },
      ],
      metrics: [
        {
          name: 'sessions',
        },
        {
          name: 'totalUsers',
        },
        {
          name: 'screenPageViews',
        },
        {
          name: 'bounceRate',
        },
        {
          name: 'averageSessionDuration',
        },
      ],
      limit: 50,
    });

    // Fetch overall metrics
    const [overallResponse] = await client.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
      ],
      metrics: [
        {
          name: 'sessions',
        },
        {
          name: 'totalUsers',
        },
        {
          name: 'screenPageViews',
        },
        {
          name: 'bounceRate',
        },
        {
          name: 'averageSessionDuration',
        },
      ],
    });

    // Process country data
    const countries: CountryData[] = [];
    if (countryResponse.rows) {
      for (const row of countryResponse.rows) {
        const countryName = row.dimensionValues?.[0]?.value || 'Unknown';
        const countryCode = getCountryCode(countryName);
        
        if (countryCode) {
          countries.push({
            country: countryName,
            countryCode,
            sessions: parseInt(row.metricValues?.[0]?.value || '0'),
            users: parseInt(row.metricValues?.[1]?.value || '0'),
            pageViews: parseInt(row.metricValues?.[2]?.value || '0'),
            bounceRate: parseFloat(row.metricValues?.[3]?.value || '0'),
            avgSessionDuration: parseFloat(row.metricValues?.[4]?.value || '0'),
          });
        }
      }
    }

    // Process overall metrics
    const overallRow = overallResponse.rows?.[0];
    const totalSessions = parseInt(overallRow?.metricValues?.[0]?.value || '0');
    const totalUsers = parseInt(overallRow?.metricValues?.[1]?.value || '0');
    const totalPageViews = parseInt(overallRow?.metricValues?.[2]?.value || '0');
    const avgBounceRate = parseFloat(overallRow?.metricValues?.[3]?.value || '0');
    const avgSessionDuration = parseFloat(overallRow?.metricValues?.[4]?.value || '0');

    return {
      totalSessions,
      totalUsers,
      totalPageViews,
      avgBounceRate,
      avgSessionDuration,
      countries: countries.sort((a, b) => b.sessions - a.sessions),
      topCountries: countries.slice(0, 5),
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
}

// Function to get analytics data for a specific date range
export async function getAnalyticsDataByDateRange(startDate: string, endDate: string): Promise<AnalyticsData> {
  try {
    const settings = await getSiteSettings();
    const analyticsId = settings.google_analytics_id;

    if (!analyticsId) {
      throw new Error('No Google Analytics ID configured');
    }

    const client = getAnalyticsClient();
    if (!client) {
      throw new Error('Failed to initialize Analytics client');
    }

    const propertyId = getPropertyId(analyticsId);
    
    // Fetch country data for specific date range
    const [countryResponse] = await client.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        {
          name: 'country',
        },
      ],
      metrics: [
        {
          name: 'sessions',
        },
        {
          name: 'totalUsers',
        },
        {
          name: 'screenPageViews',
        },
        {
          name: 'bounceRate',
        },
        {
          name: 'averageSessionDuration',
        },
      ],
      limit: 50,
    });

    // Fetch overall metrics for specific date range
    const [overallResponse] = await client.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [
        {
          name: 'sessions',
        },
        {
          name: 'totalUsers',
        },
        {
          name: 'screenPageViews',
        },
        {
          name: 'bounceRate',
        },
        {
          name: 'averageSessionDuration',
        },
      ],
    });

    // Process country data
    const countries: CountryData[] = [];
    if (countryResponse.rows) {
      for (const row of countryResponse.rows) {
        const countryName = row.dimensionValues?.[0]?.value || 'Unknown';
        const countryCode = getCountryCode(countryName);
        
        if (countryCode) {
          countries.push({
            country: countryName,
            countryCode,
            sessions: parseInt(row.metricValues?.[0]?.value || '0'),
            users: parseInt(row.metricValues?.[1]?.value || '0'),
            pageViews: parseInt(row.metricValues?.[2]?.value || '0'),
            bounceRate: parseFloat(row.metricValues?.[3]?.value || '0'),
            avgSessionDuration: parseFloat(row.metricValues?.[4]?.value || '0'),
          });
        }
      }
    }

    // Process overall metrics
    const overallRow = overallResponse.rows?.[0];
    const totalSessions = parseInt(overallRow?.metricValues?.[0]?.value || '0');
    const totalUsers = parseInt(overallRow?.metricValues?.[1]?.value || '0');
    const totalPageViews = parseInt(overallRow?.metricValues?.[2]?.value || '0');
    const avgBounceRate = parseFloat(overallRow?.metricValues?.[3]?.value || '0');
    const avgSessionDuration = parseFloat(overallRow?.metricValues?.[4]?.value || '0');

    return {
      totalSessions,
      totalUsers,
      totalPageViews,
      avgBounceRate,
      avgSessionDuration,
      countries: countries.sort((a, b) => b.sessions - a.sessions),
      topCountries: countries.slice(0, 5),
    };
  } catch (error) {
    console.error('Error fetching analytics data by date range:', error);
    throw error;
  }
}

// Function to get real-time analytics data
export async function getRealTimeAnalyticsData(): Promise<{
  activeUsers: number;
  currentPageViews: number;
  topPages: Array<{ page: string; views: number }>;
}> {
  try {
    const settings = await getSiteSettings();
    const analyticsId = settings.google_analytics_id;

    if (!analyticsId) {
      throw new Error('No Google Analytics ID configured');
    }

    const client = getAnalyticsClient();
    if (!client) {
      throw new Error('Failed to initialize Analytics client');
    }

    const propertyId = getPropertyId(analyticsId);
    
    // Get current date for real-time data
    const today = new Date().toISOString().split('T')[0];

    // Fetch real-time active users (last 30 minutes)
    const [activeUsersResponse] = await client.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: today,
          endDate: today,
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });

    // Fetch current page views
    const [pageViewsResponse] = await client.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: today,
          endDate: today,
        },
      ],
      metrics: [
        {
          name: 'screenPageViews',
        },
      ],
    });

    // Fetch top pages for today
    const [topPagesResponse] = await client.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: today,
          endDate: today,
        },
      ],
      dimensions: [
        {
          name: 'pagePath',
        },
      ],
      metrics: [
        {
          name: 'screenPageViews',
        },
      ],
      limit: 5,
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
    });

    // Process real-time data
    const activeUsers = parseInt(activeUsersResponse.rows?.[0]?.metricValues?.[0]?.value || '0');
    const currentPageViews = parseInt(pageViewsResponse.rows?.[0]?.metricValues?.[0]?.value || '0');
    
    const topPages: Array<{ page: string; views: number }> = [];
    if (topPagesResponse.rows) {
      for (const row of topPagesResponse.rows) {
        const page = row.dimensionValues?.[0]?.value || '/';
        const views = parseInt(row.metricValues?.[0]?.value || '0');
        topPages.push({ page, views });
      }
    }

    return {
      activeUsers,
      currentPageViews,
      topPages,
    };
  } catch (error) {
    console.error('Error fetching real-time analytics data:', error);
    throw error;
  }
}
