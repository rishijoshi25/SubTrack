import React from 'react';
import './MetricCard.css';

interface MetricCardProps {
  title: string;
  value: string;
  percentageChange: number;
  icon?: React.ReactNode;
}

export default function MetricCard({title, value, percentageChange, icon}: MetricCardProps) {
  const isPositive = percentageChange >= 0;
  const changeClass = isPositive ? 'positive' : 'negative';

  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <h3 className="metric-card-title">{title}</h3>
        {icon && <div className="metric-card-icon">{icon}</div>}
      </div>
      
      <div className="metric-card-value">{value}</div>
      
      <div className={`metric-card-change ${changeClass}`}>
        <span className="change-arrow">{isPositive ? '↑' : '↓'}</span>
        <span className="change-percentage">{Math.abs(percentageChange)}%</span>
        <span className="change-label">vs last period</span>
      </div>
    </div>
  );
}