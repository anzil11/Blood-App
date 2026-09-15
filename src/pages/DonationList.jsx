import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donationService } from '../services/donationService';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import DataTable from '../components/DataTable';
import BloodGroupBadge from '../components/BloodGroupBadge';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationDialog from '../components/ConfirmationDialog';
import {
  History,
  PlusCircle,
  Search,
  RefreshCw,
  Calendar,
  MapPin,
  Edit2,
  Trash2,
  Eye,
  Filter,
} from 'lucide-react';

const DonationList = () => {
  const { user, isAdmin } = useAuth();
  const { showAlert } = useAlert();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Delete State
  const [donationToDelete, setDonationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDonations = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      if (bloodGroup) params.blood_group = bloodGroup;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const data = await donationService.getDonations(params);
      setDonations(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch donation records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [statusFilter, bloodGroup, dateFrom, dateTo]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDonations();
  };

  const handleReset = () => {
    setSearch('');
    setStatusFilter('');
    setBloodGroup('');
    setDateFrom('');
    setDateTo('');
  };

  const handleDeleteConfirm = async () => {
    if (!donationToDelete) return;
    setIsDeleting(true);
    try {
      await donationService.deleteDonation(donationToDelete.id);
      showAlert('Donation record deleted.', 'success');
      setDonationToDelete(null);
      fetchDonations();
    } catch (err) {
      console.error(err);
      showAlert('Failed to delete donation record.', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      width: '60px',
      render: (row) => <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>#{row.id}</span>,
    },
    ...(isAdmin
      ? [
          {
            header: 'Donor Details',
            accessor: 'donor_name',
            render: (row) => (
              <div>
                <Link to={`/donors/${row.donor}`} style={{ fontWeight: 700, color: 'var(--secondary)', textDecoration: 'none' }}>
                  {row.donor_name}
                </Link>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.donor_email}</div>
              </div>
            ),
          },
          {
            header: 'Blood Group',
            accessor: 'blood_group',
            render: (row) => <BloodGroupBadge bloodGroup={row.blood_group} />,
          },
        ]
      : []),
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
      render: (row) => <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{row.notes || '—'}</span>,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
          <Link to={`/donations/${row.id}`} className="btn btn-sm btn-secondary" title="View details / edit">
            <Eye size={14} />
          </Link>
          {isAdmin && (
            <button
              onClick={() => setDonationToDelete(row)}
              className="btn btn-sm btn-danger"
              title="Delete donation"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <History size={28} color="var(--primary)" />
            <span>{isAdmin ? 'Donation History Management' : 'My Blood Donations'}</span>
          </h1>
          <p className="page-subtitle">
            {isAdmin
              ? 'Complete registry of all blood donation records with search & filters'
              : 'Your personal history of blood donations and saved lives'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={fetchDonations} disabled={loading}>
            <RefreshCw size={16} /> Refresh
          </button>
          <Link to="/donations/create" className="btn btn-primary">
            <PlusCircle size={16} /> Record Donation
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} />

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearch}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'flex-end',
          }}>
            {isAdmin && (
              <div>
                <label className="form-label" style={{ fontSize: '0.8125rem' }}>Search</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Donor, center, notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '2.25rem' }}
                  />
                  <Search size={16} color="var(--text-light)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
            )}

            {isAdmin && (
              <div>
                <label className="form-label" style={{ fontSize: '0.8125rem' }}>Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="form-control"
                >
                  <option value="">All Blood Groups</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            )}

            <div>
              <label className="form-label" style={{ fontSize: '0.8125rem' }}>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-control"
              >
                <option value="">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {isAdmin && (
              <>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8125rem' }}>From Date</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8125rem' }}>To Date</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="form-control"
                  />
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Search size={16} /> Filter
              </button>
              <button type="button" onClick={handleReset} className="btn btn-secondary">
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Donations Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <span>Donation Records</span>
            <span className="badge badge-info" style={{ marginLeft: '0.5rem' }}>
              {donations.length} Record(s)
            </span>
          </h3>
        </div>

        <DataTable
          columns={columns}
          data={donations}
          isLoading={loading}
          emptyMessage="No donation records found."
        />
      </div>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!donationToDelete}
        onClose={() => setDonationToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Donation Record"
        message={`Are you sure you want to delete donation record #${donationToDelete?.id} from ${donationToDelete?.donation_center}? The donor's statistics and next eligible date will recalculate automatically.`}
        confirmText="Delete Record"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DonationList;
