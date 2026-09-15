import React from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({
  label,
  id,
  name,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  min,
  max,
  helpText,
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id || name} className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Calendar size={14} color="var(--primary)" />
          <span>{label} {required && <span style={{ color: 'var(--primary)' }}>*</span>}</span>
        </label>
      )}

      <input
        id={id || name}
        name={name}
        type="date"
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        className={`form-control ${error ? 'is-invalid' : ''}`}
      />

      {error && <div className="form-error">{error}</div>}
      {helpText && !error && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {helpText}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
