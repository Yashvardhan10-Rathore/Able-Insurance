import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Bot, Settings } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

const mobileNavItems = [
  { label: 'Dashboard', path: '/dashboard',    icon: LayoutDashboard },
  { label: 'Customers', path: '/customers',    icon: Users },
  { label: 'Policies',  path: '/policies',     icon: FileText },
  { label: 'AI',        path: '/ai-assistant', icon: Bot },
  { label: 'Settings',  path: '/settings',     icon: Settings },
];

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <Header collapsed={collapsed} />
        <main className="page-wrapper animate-fade-in">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="mobile-bottom-nav">
        <div className="mobile-nav-items">
          {mobileNavItems.map(item => (
            <button
              key={item.path}
              className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
