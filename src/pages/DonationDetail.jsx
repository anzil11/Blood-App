import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { donationService } from '../services/donationService';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import BloodGroupBadge from '../components/BloodGroupBadge';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import FormInput from '../components/FormInput';
import DatePicker from '../components/DatePicker';
import ConfirmationDialog from '../components/ConfirmationDialog';
import {
  History,
  ArrowLeft,
  Calendar,
  MapPin,
  Edit2,
  Trash2,
  CheckCircle2,
  Award,
} from 'lucide-react';

const DonationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { showAlert } = useAlert();

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDonation = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await donationService.getDonationById(id);
      setDonation(data);
      setEditFormData({
        donation_date: data.donation_date,
        donation_center: data.donation_center,
        units_donated: data.units_donated,
        status: data.status,
        notes: data.notes || '',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch donation record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonation();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      await donationService.updateDonation(id, editFormData);
      showAlert('Donation record updated successfully.', 'success');
      setIsEditing(false);
      fetchDonation();
    } catch (err) {
      console.error(err);
      showAlert('Failed to update donation record.', 'danger');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await donationService.deleteDonation(id);
      showAlert('Donation record deleted.', 'success');
      navigate('/donations');
    } catch (err) {
      console.error(err);
      showAlert('Failed to delete donation record.', 'danger');
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading donation details..." />;
  }

  if (error || !donation) {
    return (
      <div className="page-container">
        <ErrorMessage message={error || 'Donation record not found.'} />
        <Link to="/donations" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Donations
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/donations"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}
        >
          <ArrowLeft size={16} /> Back to Donations
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="page-title" style={{ fontSize: '1.5rem' }}>
              <span>Donation #{donation.id}</span>
            </h1>
            <StatusBadge status={donation.status} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {isAdmin && !isEditing && (
              <>
                <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
                  <Edit2 size={14} /> Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate} style={{ marginTop: '1rem' }}>
            <div className="form-grid">
              <DatePicker
                label="Donation Date"
                value={editFormData.donation_date}
                onChange={(e) => setEditFormData({ ...editFormData, donation_date: e.target.value })}
                required
              />
              <FormInput
                label="Donation Center"
                value={editFormData.donation_center}
                onChange={(e) => setEditFormData({ ...editFormData, donation_center: e.target.value })}
                required
              />
              <FormInput
                label="Units Donated"
                type="number"
                min="1"
                max="10"
                value={editFormData.units_donated}
                onChange={(e) => setEditFormData({ ...editFormData, units_donated: Number(e.target.value) })}
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
                value={editFormData.status}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                required
              />
            </div>
            <FormInput
              label="Notes"
              type="textarea"
              rows={3}
              value={editFormData.notes}
              onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)} disabled={savingEdit}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={savingEdit}>
                {savingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              padding: '1.25rem',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Donor Name
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '0.25rem' }}>
                  {donation.donor_name}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{donation.donor_email}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Blood Group
                </div>
                <div style={{ marginTop: '0.25rem' }}>
                  <BloodGroupBadge bloodGroup={donation.blood_group} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Units Donated
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
                  {donation.units_donated} Unit(s)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.9375rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.625rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Calendar size={16} /> Donation Date:
                </span>
                <span style={{ fontWeight: 700 }}>{formatDate(donation.donation_date)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.625rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <MapPin size={16} /> Donation Center:
                </span>
                <span style={{ fontWeight: 600 }}>{donation.donation_center}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.625rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Record Created At:</span>
                <span style={{ fontWeight: 600 }}>{formatDate(donation.created_at)}</span>
              </div>

              {donation.notes && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Notes:
                  </div>
                  <div style={{ padding: '0.875rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontStyle: 'italic', color: 'var(--secondary)' }}>
                    "{donation.notes}"
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Donation Record"
        message="Are you sure you want to delete this donation record? The donor's stats will be recalculated."
        confirmText="Delete Record"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DonationDetail;
