import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, CreditCard, RefreshCw,
  FolderOpen, Upload, Bot, BarChart3, Bell, Settings,
  ChevronLeft, ChevronRight, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notifications } from '../../data/mockData';

const navItems = [
  { label: 'Dashboard',    path: '/dashboard',    icon: LayoutDashboard, section: 'MAIN' },
  { label: 'Customers',    path: '/customers',    icon: Users,           section: 'MAIN', badge: null },
  { label: 'Policies',     path: '/policies',     icon: FileText,        section: 'MAIN' },
  { label: 'Payments',     path: '/payments',     icon: CreditCard,      section: 'MAIN' },
  { label: 'Renewals',     path: '/renewals',     icon: RefreshCw,       section: 'MAIN', badge: 3 },
  { label: 'Documents',    path: '/documents',    icon: FolderOpen,      section: 'OPERATIONS' },
  { label: 'AI Import',    path: '/ai-import',    icon: Upload,          section: 'OPERATIONS' },
  { label: 'AI Assistant', path: '/ai-assistant', icon: Bot,             section: 'OPERATIONS' },
  { label: 'Analytics',    path: '/analytics',    icon: BarChart3,       section: 'INSIGHTS' },
  { label: 'Notifications',path: '/notifications',icon: Bell,            section: 'INSIGHTS', badge: notifications.filter(n=>!n.read).length },
  { label: 'Settings',     path: '/settings',     icon: Settings,        section: 'SYSTEM' },
];

const sections = ['MAIN', 'OPERATIONS', 'INSIGHTS', 'SYSTEM'];

export default function Sidebar({ collapsed, onToggle }) {
  const { user } = useAuth();

  return (
    <nav className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="app-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">A</div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <h2>Able Insurance</h2>
            <span>Management System</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="sidebar-nav">
        {sections.map(section => {
          const items = navItems.filter(n => n.section === section);
          return (
            <div key={section} style={{ marginBottom: '0.5rem' }}>
              {!collapsed && <div className="nav-section-label">{section}</div>}
              {items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  data-tooltip={collapsed ? item.label : undefined}
                >
                  <span className="nav-item-icon">
                    <item.icon size={18} />
                  </span>
                  <span className="nav-item-label">{item.label}</span>
                  {item.badge ? (
                    <span className="nav-badge">{item.badge}</span>
                  ) : null}
                </NavLink>
              ))}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        {!collapsed && user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            padding: '0.625rem 0.75rem', marginBottom: '0.5rem',
            borderRadius: '6px', background: 'rgba(255,255,255,0.06)'
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--gold)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'var(--primary)',
              fontSize: '0.7rem', fontWeight: 700, flexShrink: 0
            }}>
              {user.avatar}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ color: 'white', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem', textTransform: 'capitalize' }}>
                {user.role}
              </div>
            </div>
            <Shield size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />
          </div>
        )}
        <button className="sidebar-toggle-btn" onClick={onToggle} id="sidebar-toggle-btn">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </nav>
  );
}
