import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donorService } from '../services/donorService';
import { useAlert } from '../context/AlertContext';
import DataTable from '../components/DataTable';
import BloodGroupBadge from '../components/BloodGroupBadge';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationDialog from '../components/ConfirmationDialog';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import DatePicker from '../components/DatePicker';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from 'lucide-react';

const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and Filters
  const [search, setSearch] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [eligible, setEligible] = useState('');
  const [availability, setAvailability] = useState('');
  const [isActive, setIsActive] = useState('');

  // Delete & Status Action State
  const [donorToDelete, setDonorToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Donor Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDonorData, setNewDonorData] = useState({
    full_name: '',
    email: '',
    phone: '',
    blood_group: 'O+',
    date_of_birth: '1995-01-01',
    gender: 'MALE',
    city: '',
    address: '',
    password: 'Donor@12345',
  });
  const [isCreatingDonor, setIsCreatingDonor] = useState(false);
  const [addDonorError, setAddDonorError] = useState('');

  const { showAlert } = useAlert();

  const fetchDonors = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (bloodGroup) params.blood_group = bloodGroup;
      if (city.trim()) params.city = city.trim();
      if (eligible !== '') params.eligible = eligible;
      if (availability !== '') params.availability = availability;
      if (isActive !== '') params.is_active = isActive;

      const data = await donorService.getDonors(params);
      setDonors(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch donors from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [bloodGroup, eligible, availability, isActive]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  const handleClearFilters = () => {
    setSearch('');
    setBloodGroup('');
    setCity('');
    setEligible('');
    setAvailability('');
    setIsActive('');
  };

  const handleToggleActive = async (donor) => {
    try {
      const newStatus = !donor.is_active;
      await donorService.updateDonor(donor.id, { is_active: newStatus });
      showAlert(`Donor account has been ${newStatus ? 'activated' : 'deactivated'}.`, 'success');
      fetchDonors();
    } catch (err) {
      console.error(err);
      showAlert('Failed to update account status.', 'danger');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!donorToDelete) return;
    setIsDeleting(true);
    try {
      await donorService.deleteDonor(donorToDelete.id);
      showAlert('Donor record deleted successfully.', 'success');
      setDonorToDelete(null);
      fetchDonors();
    } catch (err) {
      console.error(err);
      showAlert('Failed to delete donor.', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateDonor = async (e) => {
    e.preventDefault();
    setAddDonorError('');
    setIsCreatingDonor(true);
    try {
      await donorService.createDonor(newDonorData);
      showAlert('New donor registered successfully!', 'success');
      setIsAddModalOpen(false);
      setNewDonorData({
        full_name: '',
        email: '',
        phone: '',
        blood_group: 'O+',
        date_of_birth: '1995-01-01',
        gender: 'MALE',
        city: '',
        address: '',
        password: 'Donor@12345',
      });
      fetchDonors();
    } catch (err) {
      console.error(err);
      setAddDonorError(err.response?.data?.detail || 'Failed to create donor.');
    } finally {
      setIsCreatingDonor(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
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
    {
      header: 'Donor Name & Contact',
      accessor: 'name',
      render: (row) => (
        <div>
          <Link
            to={`/donors/${row.id}`}
            style={{ fontWeight: 700, color: 'var(--secondary)', textDecoration: 'none' }}
          >
            {row.name}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Mail size={12} /> {row.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Phone size={12} /> {row.phone}
            </span>
          </div>
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
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem' }}>
          <MapPin size={13} color="var(--primary)" /> {row.city}
        </span>
      ),
    },
    {
      header: 'Last Donation',
      accessor: 'last_donation_date',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{formatDate(row.last_donation_date)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.total_donations || 0} donation(s)</div>
        </div>
      ),
    },
    {
      header: 'Next Eligible',
      accessor: 'next_eligible_date',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{formatDate(row.next_eligible_date)}</div>
          <StatusBadge status={row.is_eligible} type="eligibility" />
        </div>
      ),
    },
    {
      header: 'Availability',
      accessor: 'availability',
      render: (row) => <StatusBadge status={row.availability} type="availability" />,
    },
    {
      header: 'Account',
      accessor: 'is_active',
      render: (row) => <StatusBadge status={row.is_active} type="active" />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
          <Link
            to={`/donors/${row.id}`}
            className="btn btn-sm btn-secondary"
            title="View details"
          >
            <Eye size={14} />
          </Link>
          <button
            onClick={() => handleToggleActive(row)}
            className={`btn btn-sm ${row.is_active ? 'btn-secondary' : 'btn-primary'}`}
            title={row.is_active ? 'Deactivate Account' : 'Activate Account'}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
          >
            {row.is_active ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={() => setDonorToDelete(row)}
            className="btn btn-sm btn-danger"
            title="Delete Donor"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const bloodGroupOptions = [
    { value: '', label: 'All Blood Groups' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users size={28} color="var(--primary)" />
            <span>Donor Management</span>
          </h1>
          <p className="page-subtitle">
            Search, filter by blood group/city/eligibility, and manage registered donors
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={fetchDonors}
            disabled={loading}
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <UserPlus size={16} />
            <span>Register New Donor</span>
          </button>
        </div>
      </div>

      <ErrorMessage message={error} />

      {/* Filters and Search Toolbar (Processed on Django ORM Backend) */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'flex-end',
          }}>
            {/* Search Input */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8125rem' }}>Search Donor</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Name, email, phone, city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.25rem' }}
                />
                <Search size={16} color="var(--text-light)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Blood Group Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8125rem' }}>Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="form-control"
              >
                {bloodGroupOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8125rem' }}>City</label>
              <input
                type="text"
                placeholder="e.g. Pattambi, Kochi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-control"
              />
            </div>

            {/* Eligibility Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8125rem' }}>Eligibility</label>
              <select
                value={eligible}
                onChange={(e) => setEligible(e.target.value)}
                className="form-control"
              >
                <option value="">All Eligibility</option>
                <option value="true">Eligible to Donate</option>
                <option value="false">Not Eligible (Rest)</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8125rem' }}>Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="form-control"
              >
                <option value="">All Availability</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>

            {/* Account Status Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8125rem' }}>Account Status</label>
              <select
                value={isActive}
                onChange={(e) => setIsActive(e.target.value)}
                className="form-control"
              >
                <option value="">All Statuses</option>
                <option value="true">Active Only</option>
                <option value="false">Inactive Only</option>
              </select>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Search size={16} /> Filter
              </button>
              <button type="button" onClick={handleClearFilters} className="btn btn-secondary">
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Donors DataTable */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <span>Registered Donors List</span>
            <span className="badge badge-info" style={{ marginLeft: '0.5rem' }}>
              {donors.length} Found
            </span>
          </h3>
        </div>

        <DataTable
          columns={columns}
          data={donors}
          isLoading={loading}
          emptyMessage="No donors match the specified filters. Try adjusting your search or blood group."
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!donorToDelete}
        onClose={() => setDonorToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Donor Account"
        message={`Are you sure you want to delete donor "${donorToDelete?.name}" (${donorToDelete?.email})? All associated donation records will be permanently removed.`}
        confirmText="Delete Account"
        isDanger={true}
        isLoading={isDeleting}
      />

      {/* Add Donor Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Donor"
        maxWidth="620px"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isCreatingDonor}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreateDonor}
              disabled={isCreatingDonor}
            >
              {isCreatingDonor ? 'Registering...' : 'Register Donor'}
            </button>
          </>
        }
      >
        <ErrorMessage message={addDonorError} />
        <form onSubmit={handleCreateDonor}>
          <div className="form-grid">
            <FormInput
              label="Full Name"
              value={newDonorData.full_name}
              onChange={(e) => setNewDonorData({ ...newDonorData, full_name: e.target.value })}
              placeholder="e.g. John Doe"
              required
            />
            <FormInput
              label="Email Address"
              type="email"
              value={newDonorData.email}
              onChange={(e) => setNewDonorData({ ...newDonorData, email: e.target.value })}
              // placeholder="e.g. donor@example.com"
              required
            />
            <FormInput
              label="Phone Number"
              value={newDonorData.phone}
              onChange={(e) => setNewDonorData({ ...newDonorData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              required
            />
            <FormInput
              label="Blood Group"
              type="select"
              options={bloodGroupOptions.filter((o) => o.value !== '')}
              value={newDonorData.blood_group}
              onChange={(e) => setNewDonorData({ ...newDonorData, blood_group: e.target.value })}
              required
            />
            <DatePicker
              label="Date of Birth"
              value={newDonorData.date_of_birth}
              onChange={(e) => setNewDonorData({ ...newDonorData, date_of_birth: e.target.value })}
              required
            />
            <FormInput
              label="Gender"
              type="select"
              options={[
                { value: 'MALE', label: 'Male' },
                { value: 'FEMALE', label: 'Female' },
                { value: 'OTHER', label: 'Other' },
              ]}
              value={newDonorData.gender}
              onChange={(e) => setNewDonorData({ ...newDonorData, gender: e.target.value })}
              required
            />
            <FormInput
              label="City"
              value={newDonorData.city}
              onChange={(e) => setNewDonorData({ ...newDonorData, city: e.target.value })}
              placeholder="e.g. Pattambi"
              required
            />
            <FormInput
              label="Default Password"
              type="text"
              value={newDonorData.password}
              onChange={(e) => setNewDonorData({ ...newDonorData, password: e.target.value })}
              placeholder="e.g. Donor@12345"
              helpText="Visible so you can remember and share it with the donor"
              required
            />
          </div>
          <FormInput
            label="Address"
            type="textarea"
            rows={2}
            value={newDonorData.address}
            onChange={(e) => setNewDonorData({ ...newDonorData, address: e.target.value })}
            placeholder="Street address"
          />
        </form>
      </Modal>
    </div>
  );
};

export default DonorList;
