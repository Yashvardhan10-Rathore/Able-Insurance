import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notifications } from '../../data/mockData';

const breadcrumbMap = {
  '/dashboard':    ['Home', 'Dashboard'],
  '/customers':    ['Home', 'Customers'],
  '/policies':     ['Home', 'Policies'],
  '/payments':     ['Home', 'Payments'],
  '/renewals':     ['Home', 'Renewals'],
  '/documents':    ['Home', 'Documents'],
  '/ai-import':    ['Home', 'AI Import'],
  '/ai-assistant': ['Home', 'AI Assistant'],
  '/analytics':    ['Home', 'Analytics'],
  '/notifications':['Home', 'Notifications'],
  '/settings':     ['Home', 'Settings'],
  '/customers/add':['Home', 'Customers', 'Add Customer'],
  '/customers/:id':['Home', 'Customers', 'Profile'],
  '/policies/create':['Home', 'Policies', 'Create Policy'],
};

export default function Header({ collapsed }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const crumbs = breadcrumbMap[location.pathname] || ['Home', 'Dashboard'];
  const unread = notifications.filter(n => !n.read).length;

  const roleColors = { owner: '#C9A227', agent: '#0B1F4D', accountant: '#10B981' };

  return (
    <header className={`header ${collapsed ? 'collapsed' : ''}`} id="app-header">
      {/* Breadcrumb */}
      <div className="header-breadcrumb">
        <div className="breadcrumb">
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="breadcrumb-sep">/</span>}
              <span className={i === crumbs.length - 1 ? 'breadcrumb-current' : ''}>{c}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="header-search" id="global-search">
        <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          placeholder="Search customers, policies..."
          id="global-search-input"
        />
      </div>

      {/* Actions */}
      <div className="header-actions">
        {/* Theme Toggle */}
        <button
          className="header-icon-btn"
          onClick={toggleTheme}
          id="theme-toggle-btn"
          data-tooltip={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <button
          className="header-icon-btn"
          onClick={() => navigate('/notifications')}
          id="notifications-btn"
          aria-label="Notifications"
          style={{ position: 'relative' }}
        >
          <Bell size={18} />
          {unread > 0 && <span className="notif-dot" />}
        </button>

        {/* User Menu */}
        <div className="dropdown" style={{ position: 'relative' }}>
          <button
            className="user-avatar-btn"
            onClick={() => setShowUserMenu(v => !v)}
            id="user-menu-btn"
          >
            <div
              className="avatar"
              style={{ background: `linear-gradient(135deg, var(--primary), var(--primary-lighter))` }}
            >
              {user?.avatar || 'AS'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'Admin'}</div>
              <div className="user-role" style={{ color: roleColors[user?.role] || 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user?.role || 'Owner'}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {showUserMenu && (
            <div className="dropdown-menu" style={{ right: 0 }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              </div>
              <div
                className="dropdown-item"
                onClick={() => { setShowUserMenu(false); navigate('/settings'); }}
              >
                <User size={14} /> Profile
              </div>
              <div
                className="dropdown-item"
                onClick={() => { setShowUserMenu(false); navigate('/settings'); }}
              >
                <Settings size={14} /> Settings
              </div>
              <div className="dropdown-divider" />
              <div
                className="dropdown-item danger"
                onClick={() => { logout(); setShowUserMenu(false); }}
                id="logout-btn"
              >
                <LogOut size={14} /> Sign out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
