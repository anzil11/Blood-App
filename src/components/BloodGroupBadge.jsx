import React from 'react';
import { Droplet } from 'lucide-react';

const BloodGroupBadge = ({ bloodGroup, size = 'md' }) => {
  if (!bloodGroup) return null;

  const isLarge = size === 'lg';

  return (
    <span
      className={`blood-badge ${isLarge ? 'blood-badge-lg' : ''}`}
      title={`Blood Group: ${bloodGroup}`}
    >
      <Droplet size={isLarge ? 20 : 13} fill="#ffffff" />
      {bloodGroup}
    </span>
  );
};

export default BloodGroupBadge;
