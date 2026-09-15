import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { settingsService } from '../services/settingsService';
import { useAlert } from '../context/AlertContext';
import DashboardCard from '../components/DashboardCard';
import BloodGroupBadge from '../components/BloodGroupBadge';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import {
  Users,
  Award,
  CheckCircle2,
  XCircle,
  Sliders,
  PlusCircle,
  Calendar,
  Clock,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Droplet,
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Interval Setting Modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [intervalMonths, setIntervalMonths] = useState(4);
  const [savingSettings, setSavingSettings] = useState(false);

  const { showAlert } = useAlert();

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await dashboardService.getAdminDashboard();
      setData(res);
      setIntervalMonths(res.minimum_interval_months || 4);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch admin dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await settingsService.updateDonationSettings(intervalMonths);
      showAlert(`Minimum donation interval updated to ${intervalMonths} months!`, 'success');
      setIsSettingsModalOpen(false);
      fetchDashboard();
    } catch (err) {
      console.error(err);
      showAlert('Failed to update donation settings.', 'danger');
    } finally {
      setSavingSettings(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading administrator metrics..." />;
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage message={error} onRetry={fetchDashboard} />
      </div>
    );
  }

  const recentDonationsColumns = [
    {
      header: 'Donor',
      accessor: 'donor_name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.donor_name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.donor_email}</div>
        </div>
      ),
    },
    {
      header: 'Blood Group',
      accessor: 'blood_group',
      render: (row) => <BloodGroupBadge bloodGroup={row.blood_group} />,
    },
    {
      header: 'Date',
      accessor: 'donation_date',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          {formatDate(row.donation_date)}
        </span>
      ),
    },
    {
      header: 'Center',
      accessor: 'donation_center',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const recentDonorsColumns = [
    {
      header: 'Donor Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <Link to={`/donors/${row.id}`} style={{ fontWeight: 700, color: 'var(--secondary)', textDecoration: 'none' }}>
            {row.name}
          </Link>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Blood',
      accessor: 'blood_group',
      render: (row) => <BloodGroupBadge bloodGroup={row.blood_group} />,
    },
    {
      header: 'City',
      accessor: 'city',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem' }}>
          <MapPin size={12} color="var(--text-muted)" />
          <span>{row.city}</span>
        </div>
      ),
    },
    {
      header: 'Eligibility',
      accessor: 'is_eligible',
      render: (row) => <StatusBadge status={row.is_eligible} type="eligibility" />,
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ShieldCheck size={28} color="var(--primary)" />
            <span>Administrator Dashboard</span>
          </h1>
          <p className="page-subtitle">
            Real-time analytics and management overview from SQLite3 database
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setIsSettingsModalOpen(true)}
          >
            <Sliders size={18} />
            <span>Interval: {data?.minimum_interval_months} Months</span>
          </button>
          <Link to="/donors" className="btn btn-primary">
            <Users size={18} />
            <span>Manage Donors</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <DashboardCard
          title="Total Registered Donors"
          value={data?.total_donors}
          subtext={`${data?.active_donors} active donor accounts`}
          icon={Users}
          color="blue"
        />
        <DashboardCard
          title="Total Completed Donations"
          value={data?.total_donations}
          subtext="Successful blood donation units"
          icon={Award}
          color="red"
        />
        <DashboardCard
          title="Eligible Donors"
          value={data?.eligible_donors}
          subtext="Available to donate right now"
          icon={CheckCircle2}
          color="green"
        />
        <DashboardCard
          title="Ineligible Donors"
          value={data?.not_eligible_donors}
          subtext="Currently within rest period"
          icon={XCircle}
          color="amber"
        />
      </div>

      {/* Blood Group Inventory / Breakdown */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Droplet size={18} color="var(--primary)" />
            <span>Blood Group Donor Distribution</span>
          </h3>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '1rem',
          textAlign: 'center',
        }}>
          {data?.blood_group_counts &&
            Object.entries(data.blood_group_counts).map(([bg, count]) => (
              <div
                key={bg}
                style={{
                  padding: '1rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  transition: 'var(--transition)',
                }}
              >
                <BloodGroupBadge bloodGroup={bg} />
                <div style={{ fontSize: '1.375rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--secondary)' }}>
                  {count}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Donors
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Tables Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Donations */}
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
            columns={recentDonationsColumns}
            data={data?.recent_donations || []}
            emptyMessage="No donation records found in database."
          />
        </div>

        {/* Recent Donors */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Users size={18} color="var(--primary)" />
              <span>Recently Registered Donors</span>
            </h3>
            <Link to="/donors" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <DataTable
            columns={recentDonorsColumns}
            data={data?.recent_donors || []}
            emptyMessage="No registered donors found."
          />
        </div>
      </div>

      {/* Donation Settings Modal */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Configure Minimum Donation Interval"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setIsSettingsModalOpen(false)}
              disabled={savingSettings}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSaveSettings}
              disabled={savingSettings}
            >
              {savingSettings ? 'Saving...' : 'Save Configuration'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveSettings}>
          <FormInput
            label="Minimum Interval (Months)"
            id="interval"
            type="number"
            min="1"
            max="24"
            value={intervalMonths}
            onChange={(e) => setIntervalMonths(e.target.value)}
            helpText="Default standard is 4 months. Modifying this immediately updates next eligible date calculations for all donors across the platform."
            required
          />
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
