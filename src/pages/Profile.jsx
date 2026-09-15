import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { authService } from '../services/authService';
import FormInput from '../components/FormInput';
import DatePicker from '../components/DatePicker';
import BloodGroupBadge from '../components/BloodGroupBadge';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { User, Mail, Phone, MapPin, CheckCircle2, Image as ImageIcon, KeyRound, Shield } from 'lucide-react';

const Profile = () => {
  const { user, refreshUser, isAdmin, isDonor } = useAuth();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    phone: '',
    blood_group: 'O+',
    date_of_birth: '',
    gender: 'MALE',
    city: '',
    address: '',
    availability: true,
    new_password: '',
    confirm_password: '',
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const p = user.donor_profile || {};
      setFormData({
        full_name: user.full_name || '',
        username: user.email || '',
        phone: p.phone || '',
        blood_group: p.blood_group || 'O+',
        date_of_birth: p.date_of_birth || '',
        gender: p.gender || 'MALE',
        city: p.city || '',
        address: p.address || '',
        availability: p.availability !== undefined ? p.availability : true,
        new_password: '',
        confirm_password: '',
      });
      if (p.profile_photo) {
        setPhotoPreview(p.profile_photo);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.new_password) {
      if (formData.new_password.length < 6) {
        setError('New password must be at least 6 characters long.');
        return;
      }
      if (formData.new_password !== formData.confirm_password) {
        setError('New password and confirmation do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('full_name', formData.full_name);
      data.append('username', formData.username);

      if (formData.new_password) {
        data.append('password', formData.new_password);
      }

      if (isDonor) {
        data.append('phone', formData.phone);
        data.append('blood_group', formData.blood_group);
        data.append('date_of_birth', formData.date_of_birth);
        data.append('gender', formData.gender);
        data.append('city', formData.city);
        data.append('address', formData.address);
        data.append('availability', formData.availability);
        if (profilePhoto) {
          data.append('profile_photo', profilePhoto);
        }
      }

      await authService.updateMe(data);
      await refreshUser();
      showAlert('Profile and credentials updated successfully!', 'success');
      setFormData((prev) => ({ ...prev, new_password: '', confirm_password: '' }));
    } catch (err) {
      console.error(err);
      const detail =
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.detail ||
        'Failed to update profile.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '850px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <User size={28} color="var(--primary)" />
            <span>My Account Profile</span>
          </h1>
          <p className="page-subtitle">Update your personal details, login credentials, and status</p>
        </div>
        <div>
          {isDonor && <BloodGroupBadge bloodGroup={formData.blood_group} size="lg" />}
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Profile Photo Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-light)',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}>
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
              overflow: 'hidden',
              border: '3px solid var(--border-light)',
            }}>
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={40} />
              )}
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user?.full_name}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Username: {user?.email}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.375rem', alignItems: 'center' }}>
                <span className="badge badge-info">{user?.role}</span>
                {isDonor && <StatusBadge status={formData.availability} type="availability" />}
              </div>
            </div>

            {isDonor && (
              <div style={{ marginLeft: 'auto' }}>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  <ImageIcon size={14} /> Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="form-grid">
            <FormInput
              label="Full Name / Display Name"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Username / Login Identifier"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. dyfipattambimc"
              helpText="You can change this username to log in with."
              required
            />

            {isDonor && (
              <>
                <FormInput
                  label="Phone Number"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Blood Group"
                  id="blood_group"
                  name="blood_group"
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
                  value={formData.blood_group}
                  onChange={handleChange}
                  required
                />

                <DatePicker
                  label="Date of Birth"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Gender"
                  id="gender"
                  name="gender"
                  type="select"
                  options={[
                    { value: 'MALE', label: 'Male' },
                    { value: 'FEMALE', label: 'Female' },
                    { value: 'OTHER', label: 'Other' },
                  ]}
                  value={formData.gender}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="City"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Emergency Availability"
                  id="availability"
                  name="availability"
                  type="select"
                  options={[
                    { value: true, label: 'Available to Contact' },
                    { value: false, label: 'Currently Unavailable' },
                  ]}
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value === 'true' || e.target.value === true })}
                />
              </>
            )}
          </div>

          {isDonor && (
            <FormInput
              label="Address"
              id="address"
              name="address"
              type="textarea"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="Residential address"
            />
          )}

          {/* Change Password Section */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-light)',
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}>
              <KeyRound size={18} color="var(--primary)" />
              <span>Change Password (Optional)</span>
            </h4>

            <div className="form-grid">
              <FormInput
                label="New Password"
                id="new_password"
                name="new_password"
                type="password"
                placeholder="Leave blank to keep unchanged"
                value={formData.new_password}
                onChange={handleChange}
                helpText="Minimum 6 characters if changing"
              />

              <FormInput
                label="Confirm New Password"
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Re-enter new password"
                value={formData.confirm_password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <CheckCircle2 size={18} />
              <span>{loading ? 'Saving Changes...' : 'Save Profile & Credentials'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
