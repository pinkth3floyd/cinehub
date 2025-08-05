'use client';

import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon 
}) => {
  return (
    <div className="stats">
      <span>{title}</span>
      <p>
        {value} 
        {change && (
          <b className={changeType === 'positive' ? 'green' : 'red'}>
            {change}
          </b>
        )}
      </p>
      <i className={icon}></i>
    </div>
  );
};

export default StatsCard; 