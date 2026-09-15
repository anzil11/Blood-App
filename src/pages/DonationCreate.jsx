import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { donationService } from '../services/donationService';
import { donorService } from '../services/donorService';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import FormInput from '../components/FormInput';
import DatePicker from '../components/DatePicker';
import ErrorMessage from '../components/ErrorMessage';
import { PlusCircle, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';

const DonationCreate = () => {
  const { user, isAdmin } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    donor: '',
    donation_date: new Date().toISOString().split('T')[0],
    donation_center: 'City Blood Bank',
    units_donated: 1,
    status: 'COMPLETED',
    notes: 'Regular blood donation',
  });

  const [donorsList, setDonorsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDonors, setLoadingDonors] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      const fetchDonors = async () => {
        setLoadingDonors(true);
        try {
          const list = await donorService.getDonors();
          setDonorsList(list);
          if (list.length > 0) {
            setFormData((prev) => ({ ...prev, donor: list[0].id }));
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingDonors(false);
        }
      };
      fetchDonors();
    }
  }, [isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { ...formData };
      if (!isAdmin) {
        delete payload.donor; // Backend assigns request.user.donor_profile automatically
      } else {
        payload.donor = Number(payload.donor);
      }

      await donationService.createDonation(payload);
      showAlert('Blood donation recorded successfully!', 'success');
      if (isAdmin) {
        navigate('/donations');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Failed to save donation record. Please check your inputs.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const donorOptions = donorsList.map((d) => ({
    value: d.id,
    label: `${d.name} (${d.blood_group}) - ${d.city}`,
  }));

  const statusOptions = [
    { value: 'COMPLETED', label: 'Completed (Standard)' },
    { value: 'PENDING', label: 'Pending / Processing' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to={isAdmin ? '/donations' : '/dashboard'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h1 className="page-title" style={{ fontSize: '1.5rem' }}>
            <PlusCircle size={24} color="var(--primary)" />
            <span>Record Blood Donation</span>
          </h1>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Please input accurate donation details. Completed donations automatically recalculate total donor counts and determine the next eligible donation date based on system intervals.
        </p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          {isAdmin && (
            <FormInput
              label="Select Donor"
              id="donor"
              name="donor"
              type="select"
              options={donorOptions}
              value={formData.donor}
              onChange={handleChange}
              disabled={loadingDonors}
              helpText={loadingDonors ? 'Loading donors list...' : 'Choose the registered donor for this donation.'}
              required
            />
          )}

          <div className="form-grid">
            <DatePicker
              label="Donation Date"
              id="donation_date"
              name="donation_date"
              value={formData.donation_date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              helpText="Date when the donation occurred."
              required
            />

            <FormInput
              label="Donation Center / Hospital"
              id="donation_center"
              name="donation_center"
              placeholder="e.g. City Blood Bank, District Hospital"
              value={formData.donation_center}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Units Donated"
              id="units_donated"
              name="units_donated"
              type="number"
              min="1"
              max="5"
              value={formData.units_donated}
              onChange={handleChange}
              helpText="Number of whole blood or apheresis units (typically 1)."
              required
            />

            <FormInput
              label="Donation Status"
              id="status"
              name="status"
              type="select"
              options={statusOptions}
              value={formData.status}
              onChange={handleChange}
              required
            />
          </div>

          <FormInput
            label="Notes & Observations"
            id="notes"
            name="notes"
            type="textarea"
            rows={3}
            placeholder="Add any relevant notes, hemoglobin readings, or donation camp details..."
            value={formData.notes}
            onChange={handleChange}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Link to={isAdmin ? '/donations' : '/dashboard'} className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <CheckCircle2 size={18} />
              <span>{loading ? 'Saving Record...' : 'Save Donation Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationCreate;
