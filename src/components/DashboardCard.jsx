import React from 'react';

const DashboardCard = ({ title, value, subtext, icon: Icon, color = 'red' }) => {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${color}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div className="metric-content">
        <div className="metric-label">{title}</div>
        <div className="metric-value">{value !== undefined && value !== null ? value : '-'}</div>
        {subtext && <div className="metric-subtext">{subtext}</div>}
      </div>
    </div>
  );
};

export default DashboardCard;
