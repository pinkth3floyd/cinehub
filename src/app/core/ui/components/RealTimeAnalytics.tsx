'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRealTimeAnalyticsData } from '@/app/core/services/analyticsService';

const RealTimeAnalytics: React.FC = () => {
  const { data: realTimeData, isLoading, error } = useQuery({
    queryKey: ['real-time-analytics'],
    queryFn: getRealTimeAnalyticsData,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="dashbox">
        <div className="dashbox__title">
          <h3>
            <i className="ti ti-clock"></i> Real-Time Analytics
          </h3>
        </div>
        <div className="dashbox__content">
          <div className="text-center py-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2">Loading real-time data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashbox">
        <div className="dashbox__title">
          <h3>
            <i className="ti ti-clock"></i> Real-Time Analytics
          </h3>
        </div>
        <div className="dashbox__content">
          <div className="alert alert-danger">
            <i className="ti ti-alert-triangle me-2"></i>
            Failed to load real-time data. Please check your Google Analytics configuration.
            <br />
            <small className="text-muted">
              Make sure you have configured Google Analytics ID and service account credentials.
            </small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashbox">
      <div className="dashbox__title">
        <h3>
          <i className="ti ti-clock"></i> Real-Time Analytics
          <span className="real-time-indicator">
            <i className="ti ti-circle-fill"></i> LIVE
          </span>
        </h3>
      </div>
      
      <div className="dashbox__content">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="real-time-stat">
              <div className="real-time-stat__icon">
                <i className="ti ti-users"></i>
              </div>
              <div className="real-time-stat__content">
                <div className="real-time-stat__value">{realTimeData?.activeUsers || 0}</div>
                <div className="real-time-stat__label">Active Users</div>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-md-6">
            <div className="real-time-stat">
              <div className="real-time-stat__icon">
                <i className="ti ti-eye"></i>
              </div>
              <div className="real-time-stat__content">
                <div className="real-time-stat__value">{realTimeData?.currentPageViews || 0}</div>
                <div className="real-time-stat__label">Page Views</div>
              </div>
            </div>
          </div>
        </div>

        <div className="real-time-pages">
          <h4 className="real-time-pages__title">
            <i className="ti ti-list"></i> Top Pages Right Now
          </h4>
          <div className="real-time-pages__list">
            {realTimeData?.topPages.map((page, index) => (
              <div key={index} className="real-time-page">
                <div className="real-time-page__rank">#{index + 1}</div>
                <div className="real-time-page__path">{page.page}</div>
                <div className="real-time-page__views">{page.views} views</div>
              </div>
            ))}
          </div>
        </div>

        <div className="real-time-footer">
          <small className="text-muted">
            <i className="ti ti-refresh"></i> Updates every 30 seconds
          </small>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAnalytics;
