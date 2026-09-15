import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import DashboardCard from '../components/DashboardCard';
import BloodGroupBadge from '../components/BloodGroupBadge';
import StatusBadge from '../components/StatusBadge';
import EligibilityReminderBanner from '../components/EligibilityReminderBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DataTable from '../components/DataTable';
import {
  Droplet,
  Calendar,
  Award,
  Activity,
  PlusCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  User as UserIcon,
  ChevronRight,
} from 'lucide-react';

const DonorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await dashboardService.getDonorDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
      setError('Failed to load donor dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No records yet';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading your donor dashboard..." />;
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage message={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  const columns = [
    {
      header: 'Donation Date',
      accessor: 'donation_date',
      render: (row) => (
        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Calendar size={14} color="var(--primary)" />
          <span>{formatDate(row.donation_date)}</span>
        </div>
      ),
    },
    {
      header: 'Donation Center',
      accessor: 'donation_center',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <MapPin size={14} color="var(--text-muted)" />
          <span>{row.donation_center}</span>
        </div>
      ),
    },
    {
      header: 'Units',
      accessor: 'units_donated',
      render: (row) => <span>{row.units_donated} Unit(s)</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Notes',
      accessor: 'notes',
      render: (row) => (
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
          {row.notes || '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Welcome, {data?.name}!</span>
          </h1>
          <p className="page-subtitle">
            Donor Dashboard • Track your donations and life-saving impact
          </p>
        </div>
        <Link to="/donations/create" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Record Donation</span>
        </Link>
      </div>

      {/* Eligibility Reminder Banner */}
      <EligibilityReminderBanner
        isEligible={data?.is_eligible}
        nextEligibleDate={data?.next_eligible_date}
        reminder={data?.eligibility_reminder}
        intervalMonths={data?.interval_months}
      />

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <DashboardCard
          title="Total Donations"
          value={`${data?.total_donations || 0} Units`}
          subtext="Completed blood donations"
          icon={Award}
          color="blue"
        />
        <DashboardCard
          title="Last Donation"
          value={formatDate(data?.last_donation_date)}
          subtext={data?.last_donation_date ? 'Latest recorded donation' : 'No donations recorded'}
          icon={Calendar}
          color="red"
        />
        <DashboardCard
          title="Blood Group"
          value={<BloodGroupBadge bloodGroup={data?.blood_group} size="lg" />}
          subtext="Verified blood type"
          icon={Droplet}
          color="red"
        />
        <DashboardCard
          title="Donation Status"
          value={<StatusBadge status={data?.is_eligible} type="eligibility" />}
          subtext={
            data?.is_eligible
              ? 'Ready to donate now'
              : `Next: ${formatDate(data?.next_eligible_date)}`
          }
          icon={Activity}
          color={data?.is_eligible ? 'green' : 'amber'}
        />
      </div>

      {/* Profile Summary & Recent Donations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 360px) 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Donor Profile Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <UserIcon size={18} color="var(--primary)" />
              <span>Donor Profile</span>
            </h3>
            <Link to="/profile" className="btn btn-sm btn-secondary">
              Edit
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
              overflow: 'hidden',
              border: '2px solid var(--border-light)',
            }}>
              {data?.profile_photo ? (
                <img src={data.profile_photo} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <UserIcon size={36} />
              )}
            </div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{data?.name}</h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', alignItems: 'center' }}>
              <BloodGroupBadge bloodGroup={data?.blood_group} />
              <StatusBadge status={data?.availability} type="availability" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text-muted)' }}>
              <Mail size={16} color="var(--primary)" />
              <span style={{ color: 'var(--text-main)' }}>{data?.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text-muted)' }}>
              <Phone size={16} color="var(--primary)" />
              <span style={{ color: 'var(--text-main)' }}>{data?.phone || 'Not provided'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text-muted)' }}>
              <MapPin size={16} color="var(--primary)" />
              <span style={{ color: 'var(--text-main)' }}>{data?.city} {data?.address ? `• ${data.address}` : ''}</span>
            </div>
          </div>
        </div>

        {/* Recent Donations Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={18} color="var(--primary)" />
              <span>Recent Blood Donations</span>
            </h3>
            <Link to="/donations" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <DataTable
            columns={columns}
            data={data?.recent_donations || []}
            emptyMessage="You have not recorded any donations yet. Click 'Record Donation' to add your first one."
          />
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
