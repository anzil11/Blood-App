import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { donorService } from '../services/donorService';
import { donationService } from '../services/donationService';
import { useAlert } from '../context/AlertContext';
import BloodGroupBadge from '../components/BloodGroupBadge';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import DatePicker from '../components/DatePicker';
import ConfirmationDialog from '../components/ConfirmationDialog';
import {
  User,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Clock,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const DonorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [donor, setDonor] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  // Record Donation Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [newDonationData, setNewDonationData] = useState({
    donation_date: new Date().toISOString().split('T')[0],
    donation_center: 'City Blood Bank',
    units_donated: 1,
    status: 'COMPLETED',
    notes: 'Regular donation',
  });
  const [savingDonation, setSavingDonation] = useState(false);

  // Delete State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDonorAndDonations = async () => {
    setLoading(true);
    setError('');
    try {
      const donorData = await donorService.getDonorById(id);
      setDonor(donorData);
      setEditFormData({
        full_name: donorData.name,
        phone: donorData.phone,
        blood_group: donorData.blood_group,
        date_of_birth: donorData.date_of_birth,
        gender: donorData.gender,
        city: donorData.city,
        address: donorData.address,
        availability: donorData.availability,
        is_active: donorData.is_active,
      });

      const donationsData = await donationService.getDonations({ donor: id });
      setDonations(donationsData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch donor details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorAndDonations();
  }, [id]);

  const handleSaveDonorEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      await donorService.updateDonor(id, editFormData);
      showAlert('Donor profile updated successfully!', 'success');
      setIsEditModalOpen(false);
      fetchDonorAndDonations();
    } catch (err) {
      console.error(err);
      showAlert('Failed to update donor profile.', 'danger');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleRecordDonation = async (e) => {
    e.preventDefault();
    setSavingDonation(true);
    try {
      await donationService.createDonation({
        ...newDonationData,
        donor: id,
      });
      showAlert('Donation record created successfully!', 'success');
      setIsRecordModalOpen(false);
      fetchDonorAndDonations();
    } catch (err) {
      console.error(err);
      showAlert('Failed to record donation.', 'danger');
    } finally {
      setSavingDonation(false);
    }
  };

  const handleDeleteDonor = async () => {
    setIsDeleting(true);
    try {
      await donorService.deleteDonor(id);
      showAlert('Donor deleted successfully.', 'success');
      navigate('/donors');
    } catch (err) {
      console.error(err);
      showAlert('Failed to delete donor.', 'danger');
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading donor details..." />;
  }

  if (error || !donor) {
    return (
      <div className="page-container">
        <ErrorMessage message={error || 'Donor not found.'} />
        <Link to="/donors" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Donors
        </Link>
      </div>
    );
  }

  const donationColumns = [
    {
      header: 'ID',
      accessor: 'id',
      width: '60px',
      render: (row) => <span style={{ fontWeight: 700 }}>#{row.id}</span>,
    },
    {
      header: 'Date',
      accessor: 'donation_date',
      render: (row) => (
        <span style={{ fontWeight: 600 }}>{formatDate(row.donation_date)}</span>
      ),
    },
    {
      header: 'Donation Center',
      accessor: 'donation_center',
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
        <Link to={`/donations/${row.id}`} className="btn btn-sm btn-secondary">
          Edit / Details
        </Link>
      ),
    },
  ];

  return (
    <div className="page-container">
      {/* Back button & header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/donors" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Donor Directory
        </Link>
      </div>

      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.5rem',
            overflow: 'hidden',
          }}>
            {donor.profile_photo_url ? (
              <img src={donor.profile_photo_url} alt={donor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={30} />
            )}
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>
              <span>{donor.name}</span>
              <BloodGroupBadge bloodGroup={donor.blood_group} size="lg" />
            </h1>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <StatusBadge status={donor.is_eligible} type="eligibility" />
              <StatusBadge status={donor.availability} type="availability" />
              <StatusBadge status={donor.is_active} type="active" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 size={16} /> Edit Profile
          </button>
          <button className="btn btn-primary" onClick={() => setIsRecordModalOpen(true)}>
            <PlusCircle size={16} /> Record Donation
          </button>
          <button className="btn btn-danger" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Grid: Profile Info + Donation Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Profile Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Personal & Contact Details</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Email Address</span>
              <span style={{ fontWeight: 600 }}>{donor.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Phone</span>
              <span style={{ fontWeight: 600 }}>{donor.phone || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>City</span>
              <span style={{ fontWeight: 600 }}>{donor.city}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Date of Birth</span>
              <span style={{ fontWeight: 600 }}>{formatDate(donor.date_of_birth)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Gender</span>
              <span style={{ fontWeight: 600 }}>{donor.gender}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Address</span>
              <span style={{ fontWeight: 600, textAlign: 'right' }}>{donor.address || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Registration Date</span>
              <span style={{ fontWeight: 600 }}>{formatDate(donor.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Stats & Eligibility Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Eligibility & Donation Metrics</h3>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Total Donations
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)' }}>
                {donor.total_donations || 0} Units
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Last Donation Date
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '0.25rem' }}>
                {formatDate(donor.last_donation_date)}
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: donor.is_eligible ? 'var(--success-light)' : 'var(--danger-light)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: donor.is_eligible ? 'var(--success-text)' : 'var(--danger-text)', fontWeight: 700 }}>
                Next Eligible Date
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: donor.is_eligible ? 'var(--success-text)' : 'var(--danger-text)', marginTop: '0.25rem' }}>
                {formatDate(donor.next_eligible_date)}
              </div>
            </div>
          </div>

          <div style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: donor.is_eligible ? '#f0fdf4' : '#fff1f2',
            border: `1px solid ${donor.is_eligible ? '#86efac' : '#fca5a5'}`,
            fontSize: '0.875rem',
            fontWeight: 600,
            color: donor.is_eligible ? '#15803d' : '#b91c1c',
          }}>
            {donor.eligibility_reminder}
          </div>
        </div>
      </div>

      {/* Donation History Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Clock size={18} color="var(--primary)" />
            <span>Donation History Records</span>
          </h3>
          <button className="btn btn-sm btn-primary" onClick={() => setIsRecordModalOpen(true)}>
            <PlusCircle size={14} /> Add Record
          </button>
        </div>

        <DataTable
          columns={donationColumns}
          data={donations}
          emptyMessage="No donation records found for this donor."
        />
      </div>

      {/* Edit Donor Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Donor Profile"
        maxWidth="620px"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)} disabled={savingEdit}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveDonorEdit} disabled={savingEdit}>
              {savingEdit ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveDonorEdit}>
          <div className="form-grid">
            <FormInput
              label="Full Name"
              value={editFormData.full_name || ''}
              onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
              required
            />
            <FormInput
              label="Phone Number"
              value={editFormData.phone || ''}
              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              required
            />
            <FormInput
              label="Blood Group"
              type="select"
              options={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
              ]}
              value={editFormData.blood_group || 'O+'}
              onChange={(e) => setEditFormData({ ...editFormData, blood_group: e.target.value })}
              required
            />
            <DatePicker
              label="Date of Birth"
              value={editFormData.date_of_birth || ''}
              onChange={(e) => setEditFormData({ ...editFormData, date_of_birth: e.target.value })}
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
              value={editFormData.gender || 'MALE'}
              onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
              required
            />
            <FormInput
              label="City"
              value={editFormData.city || ''}
              onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
              required
            />
            <FormInput
              label="Availability Status"
              type="select"
              options={[
                { value: true, label: 'Available' },
                { value: false, label: 'Unavailable' },
              ]}
              value={editFormData.availability}
              onChange={(e) => setEditFormData({ ...editFormData, availability: e.target.value === 'true' || e.target.value === true })}
            />
            <FormInput
              label="Account Active State"
              type="select"
              options={[
                { value: true, label: 'Active Account' },
                { value: false, label: 'Inactive / Suspended' },
              ]}
              value={editFormData.is_active}
              onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.value === 'true' || e.target.value === true })}
            />
          </div>
          <FormInput
            label="Address"
            type="textarea"
            rows={2}
            value={editFormData.address || ''}
            onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
          />
        </form>
      </Modal>

      {/* Record Donation Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title={`Record Blood Donation for ${donor.name}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsRecordModalOpen(false)} disabled={savingDonation}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleRecordDonation} disabled={savingDonation}>
              {savingDonation ? 'Recording...' : 'Record Donation'}
            </button>
          </>
        }
      >
        <form onSubmit={handleRecordDonation}>
          <DatePicker
            label="Donation Date"
            value={newDonationData.donation_date}
            onChange={(e) => setNewDonationData({ ...newDonationData, donation_date: e.target.value })}
            required
          />
          <FormInput
            label="Donation Center / Hospital"
            value={newDonationData.donation_center}
            onChange={(e) => setNewDonationData({ ...newDonationData, donation_center: e.target.value })}
            placeholder="e.g. City Blood Bank"
            required
          />
          <div className="form-grid">
            <FormInput
              label="Units Donated"
              type="number"
              min="1"
              max="5"
              value={newDonationData.units_donated}
              onChange={(e) => setNewDonationData({ ...newDonationData, units_donated: Number(e.target.value) })}
              required
            />
            <FormInput
              label="Status"
              type="select"
              options={[
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ]}
              value={newDonationData.status}
              onChange={(e) => setNewDonationData({ ...newDonationData, status: e.target.value })}
              required
            />
          </div>
          <FormInput
            label="Notes (Optional)"
            type="textarea"
            rows={2}
            value={newDonationData.notes}
            onChange={(e) => setNewDonationData({ ...newDonationData, notes: e.target.value })}
            placeholder="Any medical or camp notes"
          />
        </form>
      </Modal>

      {/* Delete Donor Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteDonor}
        title="Delete Donor"
        message={`Are you sure you want to delete ${donor.name}? This action cannot be undone.`}
        confirmText="Delete Donor"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DonorDetail;
