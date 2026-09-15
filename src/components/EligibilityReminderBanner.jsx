import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Droplet, PlusCircle } from 'lucide-react';

const EligibilityReminderBanner = ({
  isEligible,
  nextEligibleDate,
  reminder,
  intervalMonths,
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (isEligible) {
    return (
      <div className="eligibility-banner eligible">
        <div className="eligibility-info">
          <div className="eligibility-icon">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <div className="eligibility-title" style={{ color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Eligible to Donate</span>
              <span className="badge badge-success">Active Donor</span>
            </div>
            <div className="eligibility-desc" style={{ color: '#166534', fontWeight: 600, fontSize: '0.95rem' }}>
              {reminder || '🩸 You are eligible to donate blood again.'}
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#15803d', marginTop: '0.25rem' }}>
              Every unit donated can save up to three lives. Thank you for your generosity!
            </div>
          </div>
        </div>
        <Link to="/donations/create" className="btn btn-primary" style={{ background: '#16a34a', borderColor: '#15803d' }}>
          <PlusCircle size={18} />
          <span>Record New Donation</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="eligibility-banner not-eligible">
      <div className="eligibility-info">
        <div className="eligibility-icon">
          <Clock size={28} />
        </div>
        <div>
          <div className="eligibility-title" style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Currently Not Eligible</span>
            <span className="badge badge-danger">Rest Period</span>
          </div>
          <div className="eligibility-desc" style={{ color: '#991b1b', fontWeight: 600 }}>
            Next eligible donation date: <span style={{ textDecoration: 'underline' }}>{formatDate(nextEligibleDate)}</span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#b91c1c', marginTop: '0.25rem' }}>
            Minimum interval between donations is {intervalMonths || 4} months for donor recovery.
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityReminderBanner;
