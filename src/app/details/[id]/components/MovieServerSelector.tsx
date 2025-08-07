'use client';

import React from 'react';

interface Server {
  id: string;
  name: string;
  url: string;
  quality?: string;
  language?: string;
}

interface MovieServerSelectorProps {
  servers: Server[];
  selectedServer: Server | null;
  onServerSelect: (server: Server) => void;
}

export default function MovieServerSelector({ servers, selectedServer, onServerSelect }: MovieServerSelectorProps) {
  const getQualityBadge = (quality?: string) => {
    if (!quality) return null;
    
    const qualityMap: { [key: string]: { label: string; class: string } } = {
      '4K': { label: '4K', class: 'badge--purple' },
      '1080p': { label: '1080p', class: 'badge--green' },
      '720p': { label: '720p', class: 'badge--blue' },
      '480p': { label: '480p', class: 'badge--yellow' },
      '360p': { label: '360p', class: 'badge--orange' }
    };

    const qualityInfo = qualityMap[quality] || { label: quality, class: 'badge--default' };
    
    return (
      <span className={`badge ${qualityInfo.class}`}>
        {qualityInfo.label}
      </span>
    );
  };

  const getLanguageBadge = (language?: string) => {
    if (!language) return null;
    
    return (
      <span className="badge badge--secondary">
        {language.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="server-selector">
      <div className="server-selector__header">
        <h3 className="server-selector__title">
          <i className="ti ti-server"></i>
          Video Servers
        </h3>
        <span className="server-selector__count">
          {servers.length} server{servers.length !== 1 ? 's' : ''} available
        </span>
      </div>
      
      <div className="server-selector__list">
        {servers.map((server, index) => (
          <button
            key={server.id}
            className={`server-selector__item ${selectedServer?.id === server.id ? 'server-selector__item--active' : ''}`}
            onClick={() => onServerSelect(server)}
            type="button"
          >
            <div className="server-selector__item-content">
              <div className="server-selector__item-info">
                <span className="server-selector__item-name">
                  {server.name}
                </span>
                <div className="server-selector__item-badges">
                  {getQualityBadge(server.quality)}
                  {getLanguageBadge(server.language)}
                </div>
              </div>
              <div className="server-selector__item-status">
                {selectedServer?.id === server.id ? (
                  <i className="ti ti-check text-success"></i>
                ) : (
                  <i className="ti ti-player-play"></i>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {selectedServer && (
        <div className="server-selector__current">
          <div className="server-selector__current-info">
            <span className="server-selector__current-label">Currently playing:</span>
            <span className="server-selector__current-name">{selectedServer.name}</span>
            {selectedServer.quality && (
              <span className="server-selector__current-quality">{selectedServer.quality}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 