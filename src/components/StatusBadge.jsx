import React from 'react';
import { CheckCircle2, XCircle, Clock, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

const StatusBadge = ({ status, type }) => {
  if (status === undefined || status === null) return null;

  // Handle boolean or string status
  let badgeClass = 'badge-info';
  let label = String(status);
  let Icon = Clock;

  const normalized = String(status).toUpperCase();

  if (type === 'eligibility' || normalized === 'ELIGIBLE' || normalized === 'ELIGIBLE TO DONATE' || status === true) {
    if (normalized === 'ELIGIBLE' || normalized === 'ELIGIBLE TO DONATE' || status === true) {
      badgeClass = 'badge-success';
      label = 'Eligible to Donate';
      Icon = CheckCircle2;
    } else {
      badgeClass = 'badge-danger';
      label = 'Not Eligible';
      Icon = XCircle;
    }
  } else if (type === 'availability') {
    if (status === true || normalized === 'AVAILABLE' || normalized === 'TRUE') {
      badgeClass = 'badge-success';
      label = 'Available';
      Icon = ShieldCheck;
    } else {
      badgeClass = 'badge-warning';
      label = 'Unavailable';
      Icon = ShieldAlert;
    }
  } else if (type === 'active') {
    if (status === true || normalized === 'ACTIVE' || normalized === 'TRUE') {
      badgeClass = 'badge-success';
      label = 'Active';
      Icon = CheckCircle2;
    } else {
      badgeClass = 'badge-danger';
      label = 'Inactive';
      Icon = XCircle;
    }
  } else if (normalized === 'COMPLETED') {
    badgeClass = 'badge-success';
    label = 'Completed';
    Icon = CheckCircle2;
  } else if (normalized === 'PENDING') {
    badgeClass = 'badge-warning';
    label = 'Pending';
    Icon = Clock;
  } else if (normalized === 'CANCELLED') {
    badgeClass = 'badge-danger';
    label = 'Cancelled';
    Icon = XCircle;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <Icon size={13} />
      {label}
    </span>
  );
};

export default StatusBadge;
