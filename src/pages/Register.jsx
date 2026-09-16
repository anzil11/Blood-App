import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { Droplet, ArrowRight, UserPlus, Image as ImageIcon } from 'lucide-react';
import FormInput from '../components/FormInput';
import DatePicker from '../components/DatePicker';
import ErrorMessage from '../components/ErrorMessage';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    blood_group: 'O+',
    date_of_birth: '1996-01-01',
    gender: 'MALE',
    address: '',
    city: '',
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { register } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (profilePhoto) {
        data.append('profile_photo', profilePhoto);
      }

      await register(data);
      showAlert('Account created successfully! Welcome to DYFI PATTAMBI MC Blood Bridge.', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      
      if (err.response?.data) {
        if (typeof err.response.data === 'object') {
          setFieldErrors(err.response.data);
          const firstErr = Object.values(err.response.data)[0];
          setError(Array.isArray(firstErr) ? firstErr[0] : String(firstErr));
        } else {
          setError(err.response.data.detail || 'Registration failed. Please try again.');
        }
      } else {
        setError('Connection error. Please check backend server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+ (A Positive)' },
    { value: 'A-', label: 'A- (A Negative)' },
    { value: 'B+', label: 'B+ (B Positive)' },
    { value: 'B-', label: 'B- (B Negative)' },
    { value: 'AB+', label: 'AB+ (AB Positive)' },
    { value: 'AB-', label: 'AB- (AB Negative)' },
    { value: 'O+', label: 'O+ (O Positive)' },
    { value: 'O-', label: 'O- (O Negative)' },
  ];

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <div className="auth-wrapper" style={{ padding: '3rem 1rem' }}>
      <div className="auth-card" style={{ maxWidth: '680px' }}>
        <div className="auth-brand">
          <div className="auth-logo">
            <Droplet size={32} fill="#ffffff" />
          </div>
          <h1 className="auth-title">Donor Registration</h1>
          <p className="auth-subtitle">Join our life-saving community of blood donors</p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <FormInput
              label="Full Name"
              id="full_name"
              name="full_name"
              placeholder="e.g. John Doe"
              value={formData.full_name}
              onChange={handleChange}
              error={fieldErrors.full_name?.[0]}
              required
            />

            <FormInput
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="e.g. john@example.com"
              value={formData.email}
              onChange={handleChange}
              error={fieldErrors.email?.[0]}
              required
            />

            <FormInput
              label="Phone Number"
              id="phone"
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              error={fieldErrors.phone?.[0]}
              required
            />

            <FormInput
              label="Blood Group"
              id="blood_group"
              name="blood_group"
              type="select"
              options={bloodGroupOptions}
              value={formData.blood_group}
              onChange={handleChange}
              error={fieldErrors.blood_group?.[0]}
              required
            />

            <DatePicker
              label="Date of Birth"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              error={fieldErrors.date_of_birth?.[0]}
              required
              max={new Date().toISOString().split('T')[0]}
            />

            <FormInput
              label="Gender"
              id="gender"
              name="gender"
              type="select"
              options={genderOptions}
              value={formData.gender}
              onChange={handleChange}
              error={fieldErrors.gender?.[0]}
              required
            />

            <FormInput
              label="City"
              id="city"
              name="city"
              placeholder="e.g. Pattambi, Kochi"
              value={formData.city}
              onChange={handleChange}
              error={fieldErrors.city?.[0]}
              required
            />

            <div className="form-group">
              <label htmlFor="profile_photo" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <ImageIcon size={14} color="var(--primary)" />
                <span>Profile Photo (Optional)</span>
              </label>
              <input
                id="profile_photo"
                name="profile_photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="form-control"
              />
            </div>
          </div>

          <FormInput
            label="Address"
            id="address"
            name="address"
            type="textarea"
            rows={2}
            placeholder="Complete street address"
            value={formData.address}
            onChange={handleChange}
            error={fieldErrors.address?.[0]}
          />

          <div className="form-grid">
            <FormInput
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              error={fieldErrors.password?.[0]}
              required
            />

            <FormInput
              label="Confirm Password"
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Re-enter password"
              value={formData.confirm_password}
              onChange={handleChange}
              error={fieldErrors.confirm_password?.[0]}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.25rem', padding: '0.875rem' }}
            disabled={loading}
          >
            {loading ? 'Registering Account...' : 'Create Donor Account'} <UserPlus size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
