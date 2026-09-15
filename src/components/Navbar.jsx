import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, LogOut, User as UserIcon, Shield, Menu } from 'lucide-react';
import BloodGroupBadge from './BloodGroupBadge';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAdmin, isDonor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const donorProfile = user?.donor_profile;

  return (
    <header style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-light)',
      padding: '0.875rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}
            title="Toggle Sidebar"
          >
            <Menu size={18} />
          </button>
        )}
        <Link to={isAdmin ? '/admin' : '/dashboard'} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          textDecoration: 'none',
          color: 'var(--secondary)',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)',
          }}>
            <Droplet size={20} fill="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--secondary)' }}>
              Life<span style={{ color: 'var(--primary)' }}>Pulse</span>
            </span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, display: 'block', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1 }}>
              Blood Donation System
            </span>
          </div>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {donorProfile?.blood_group && (
          <BloodGroupBadge bloodGroup={donorProfile.blood_group} />
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.375rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-light)',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: isAdmin ? 'var(--secondary)' : 'var(--primary-light)',
            color: isAdmin ? '#ffffff' : 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.875rem',
          }}>
            {isAdmin ? <Shield size={16} /> : <UserIcon size={16} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--secondary)' }}>
              {user?.full_name || user?.email}
            </span>
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: isAdmin ? 'var(--primary)' : 'var(--text-muted)',
              textTransform: 'uppercase',
            }}>
              {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-sm"
          title="Logout"
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
