'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
// import { getAnalyticsData } from '../../services/analyticsService';
import { getAnalyticsData } from '@/app/core/services/analyticsService';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface CountryData {
  country: string;
  countryCode: string;
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface AnalyticsMapProps {
  className?: string;
}

// Country coordinates for map markers
const countryCoordinates: Record<string, [number, number]> = {
  'US': [39.8283, -98.5795], // United States
  'IN': [20.5937, 78.9629],  // India
  'GB': [55.3781, -3.4360],  // United Kingdom
  'CA': [56.1304, -106.3468], // Canada
  'DE': [51.1657, 10.4515],   // Germany
  'AU': [-25.2744, 133.7751], // Australia
  'FR': [46.2276, 2.2137],    // France
  'BR': [-14.2350, -51.9253], // Brazil
  'JP': [36.2048, 138.2529],  // Japan
  'MX': [23.6345, -102.5528], // Mexico
  'IT': [41.8719, 12.5674],   // Italy
  'ES': [40.4637, -3.7492],   // Spain
  'NL': [52.1326, 5.2913],    // Netherlands
  'SE': [60.1282, 18.6435],   // Sweden
  'NO': [60.4720, 8.4689],    // Norway
  'DK': [56.2639, 9.5018],    // Denmark
  'FI': [61.9241, 25.7482],   // Finland
  'CH': [46.8182, 8.2275],    // Switzerland
  'AT': [47.5162, 14.5501],   // Austria
  'BE': [50.8503, 4.3517],    // Belgium
  'PL': [51.9194, 19.1451],   // Poland
  'CZ': [49.8175, 15.4730],   // Czech Republic
  'HU': [47.1625, 19.5033],   // Hungary
  'RO': [45.9432, 24.9668],   // Romania
  'BG': [42.7339, 25.4858],   // Bulgaria
  'HR': [45.1000, 15.2000],   // Croatia
  'SI': [46.0569, 14.5058],   // Slovenia
  'SK': [48.6690, 19.6990],   // Slovakia
  'EE': [58.5953, 25.0136],   // Estonia
  'LV': [56.8796, 24.6032],   // Latvia
  'LT': [55.1694, 23.8813],   // Lithuania
  'IE': [53.1424, -7.6921],   // Ireland
  'PT': [39.3999, -8.2245],   // Portugal
  'GR': [39.0742, 21.8243],   // Greece
  'CY': [35.1264, 33.4299],   // Cyprus
  'MT': [35.9375, 14.3754],   // Malta
  'LU': [49.8153, 6.1296],    // Luxembourg
  'IS': [64.9631, -19.0208],  // Iceland
  'LI': [47.1660, 9.5554],    // Liechtenstein
  'MC': [43.7384, 7.4246],    // Monaco
  'SM': [43.9424, 12.4578],   // San Marino
  'VA': [41.9029, 12.4534],   // Vatican City
  'AD': [42.5462, 1.6016],    // Andorra
};

const AnalyticsMap: React.FC<AnalyticsMapProps> = ({ className = '' }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['analytics-data'],
    queryFn: () => getAnalyticsData(30),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  if (!isClient) {
    return (
      <div className={`analytics-map ${className}`}>
        <div className="analytics-map__loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading map...</span>
          </div>
          <p className="mt-3">Loading interactive map...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`analytics-map ${className}`}>
        <div className="analytics-map__loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading analytics data...</span>
          </div>
          <p className="mt-3">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`analytics-map ${className}`}>
        <div className="analytics-map__error">
          <div className="alert alert-danger">
            <i className="ti ti-alert-triangle me-2"></i>
            Failed to load analytics data. Please check your Google Analytics configuration.
            <br />
            <small className="text-muted">
              Make sure you have configured Google Analytics ID and service account credentials.
            </small>
          </div>
        </div>
      </div>
    );
  }

  const countries = analyticsData?.countries || [];

  // Calculate the maximum sessions for scaling circle sizes
  const maxSessions = Math.max(...countries.map(c => c.sessions));

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`analytics-map ${className}`}>
      <div className="analytics-map__header">
        <h3 className="analytics-map__title">
          <i className="ti ti-world"></i>
          Global Traffic Overview
        </h3>
        <div className="analytics-map__stats">
          <div className="analytics-map__stat">
            <span className="analytics-map__stat-label">Total Sessions:</span>
            <span className="analytics-map__stat-value">
              {formatNumber(analyticsData?.totalSessions || 0)}
            </span>
          </div>
          <div className="analytics-map__stat">
            <span className="analytics-map__stat-label">Total Users:</span>
            <span className="analytics-map__stat-value">
              {formatNumber(analyticsData?.totalUsers || 0)}
            </span>
          </div>
          <div className="analytics-map__stat">
            <span className="analytics-map__stat-label">Page Views:</span>
            <span className="analytics-map__stat-value">
              {formatNumber(analyticsData?.totalPageViews || 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="analytics-map__container">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '500px', width: '100%' }}
          className="analytics-map__map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {countries.map((country) => {
            const coordinates = countryCoordinates[country.countryCode];
            if (!coordinates) return null;

            const radius = Math.max(8, (country.sessions / maxSessions) * 50);
            const intensity = Math.min(1, country.sessions / maxSessions);

            return (
              <CircleMarker
                key={country.countryCode}
                center={coordinates}
                radius={radius}
                pathOptions={{
                  fillColor: `rgba(59, 130, 246, ${intensity})`,
                  color: 'rgba(59, 130, 246, 0.8)',
                  weight: 2,
                  fillOpacity: 0.7,
                }}
              >
                <Popup>
                  <div className="analytics-map__popup">
                    <h4 className="analytics-map__popup-title">
                      <i className="ti ti-flag"></i>
                      {country.country}
                    </h4>
                    <div className="analytics-map__popup-stats">
                      <div className="analytics-map__popup-stat">
                        <span className="analytics-map__popup-label">Sessions:</span>
                        <span className="analytics-map__popup-value">
                          {formatNumber(country.sessions)}
                        </span>
                      </div>
                      <div className="analytics-map__popup-stat">
                        <span className="analytics-map__popup-label">Users:</span>
                        <span className="analytics-map__popup-value">
                          {formatNumber(country.users)}
                        </span>
                      </div>
                      <div className="analytics-map__popup-stat">
                        <span className="analytics-map__popup-label">Page Views:</span>
                        <span className="analytics-map__popup-value">
                          {formatNumber(country.pageViews)}
                        </span>
                      </div>
                      <div className="analytics-map__popup-stat">
                        <span className="analytics-map__popup-label">Bounce Rate:</span>
                        <span className="analytics-map__popup-value">
                          {country.bounceRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="analytics-map__popup-stat">
                        <span className="analytics-map__popup-label">Avg. Session:</span>
                        <span className="analytics-map__popup-value">
                          {formatDuration(country.avgSessionDuration)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      <div className="analytics-map__legend">
        <div className="analytics-map__legend-title">Traffic Intensity</div>
        <div className="analytics-map__legend-items">
          <div className="analytics-map__legend-item">
            <div className="analytics-map__legend-circle analytics-map__legend-circle--high"></div>
            <span>High Traffic</span>
          </div>
          <div className="analytics-map__legend-item">
            <div className="analytics-map__legend-circle analytics-map__legend-circle--medium"></div>
            <span>Medium Traffic</span>
          </div>
          <div className="analytics-map__legend-item">
            <div className="analytics-map__legend-circle analytics-map__legend-circle--low"></div>
            <span>Low Traffic</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsMap;
