import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  History,
  PlusCircle,
  User,
  Sliders,
  HeartHandshake
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const { isAdmin, isDonor } = useAuth();

  const navItems = isAdmin
    ? [
        { path: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
        { path: '/donors', label: 'Donor Management', icon: Users },
        { path: '/donations', label: 'Donation History', icon: History },
        { path: '/donations/create', label: 'Record Donation', icon: PlusCircle },
        { path: '/profile', label: 'My Account', icon: User },
      ]
    : [
        { path: '/dashboard', label: 'Donor Dashboard', icon: LayoutDashboard },
        { path: '/donations/create', label: 'Record Donation', icon: PlusCircle },
        { path: '/donations', label: 'My Donations', icon: History },
        { path: '/profile', label: 'My Profile', icon: User },
      ];

  return (
    <aside style={{
      width: isOpen ? '260px' : '0',
      minWidth: isOpen ? '260px' : '0',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      background: 'var(--secondary)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          color: '#ffffff',
          fontSize: '0.8125rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          opacity: 0.7,
        }}>
          <HeartHandshake size={18} color="#ef4444" />
          <span>{isAdmin ? 'Administration Portal' : 'Donor Portal'}</span>
        </div>
      </div>

      <nav style={{ padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={true}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? '#ffffff' : '#94a3b8',
                background: isActive ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : 'transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                transition: 'var(--transition)',
                boxShadow: isActive ? '0 2px 8px rgba(220, 38, 38, 0.35)' : 'none',
              })}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={{
        padding: '1.25rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontSize: '0.75rem',
        color: '#64748b',
        textAlign: 'center',
      }}>
        LifePulse v1.0 • Django + React
      </div>
    </aside>
  );
};

export default Sidebar;
