import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
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
        marginBottom: '1.5rem',
      }}>
        <Droplet size={44} />
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Page Not Found
      </h2>
      <p style={{ maxWidth: '400px', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        The requested page does not exist or you might not have permission to view it.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        <Home size={18} /> Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
