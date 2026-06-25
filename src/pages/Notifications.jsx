import React, { useState } from 'react';
import {
  Bell, RefreshCw, CreditCard, AlertCircle, Settings,
  Check, ExternalLink, CheckCheck, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { notifications as mockNotifications } from '../data/mockData';

// ── Helpers ───────────────────────────────────────────────────
const TYPE_META = {
  renewal: { icon: RefreshCw,   color: '#3B82F6', bg: '#EFF6FF' },
  payment: { icon: CreditCard,  color: '#F59E0B', bg: '#FFFBEB' },
  email:   { icon: Bell,        color: '#10B981', bg: '#ECFDF5' },
  system:  { icon: AlertCircle, color: '#6366F1', bg: '#EEF2FF' },
};

const PRIORITY_BADGE = {
  high:   'badge badge-danger',
  medium: 'badge badge-warning',
  low:    'badge badge-muted',
};

const TABS = [
  { key: 'all',     label: 'All' },
  { key: 'renewal', label: 'Renewals' },
  { key: 'payment', label: 'Payments' },
  { key: 'system',  label: 'System' },
];

// ── Detail Modal ──────────────────────────────────────────────
function NotifDetailModal({ notif, onClose }) {
  if (!notif) return null;
  const meta = TYPE_META[notif.type] || TYPE_META.system;
  const IconComp = meta.icon;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22 }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--radius-sm)',
              background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconComp size={20} color={meta.color} />
            </div>
            <span className="modal-title">{notif.title}</span>
          </div>
          <button id="notif-modal-close" className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', padding: '1rem',
            fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7,
          }}>
            {notif.message}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Type</div>
              <span className={`badge badge-${notif.type === 'renewal' ? 'info' : notif.type === 'payment' ? 'warning' : 'primary'}`}>
                {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Priority</div>
              <span className={PRIORITY_BADGE[notif.priority]}>
                {notif.priority.charAt(0).toUpperCase() + notif.priority.slice(1)}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Time</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{notif.time}</span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button id="notif-modal-dismiss" className="btn btn-outline btn-sm" onClick={onClose}>Dismiss</button>
          <button id="notif-modal-action" className="btn btn-primary btn-sm">
            {notif.type === 'renewal' ? 'View Policy' : notif.type === 'payment' ? 'View Payment' : 'View Details'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Notification Item ─────────────────────────────────────────
function NotifItem({ notif, onMarkRead, onViewDetail }) {
  const meta = TYPE_META[notif.type] || TYPE_META.system;
  const IconComp = meta.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.22 }}
      className={`notif-item${notif.read ? '' : ' unread'}`}
      id={`notif-item-${notif.id}`}
    >
      {/* Icon */}
      <div style={{
        width: 40, height: 40, borderRadius: 'var(--radius-sm)', flexShrink: 0,
        background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IconComp size={18} color={meta.color} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
          <span style={{
            fontSize: '0.875rem', fontWeight: 700,
            color: notif.read ? 'var(--text-primary)' : 'var(--primary)',
          }}>
            {notif.title}
          </span>
          <span className={PRIORITY_BADGE[notif.priority]}>
            {notif.priority.charAt(0).toUpperCase() + notif.priority.slice(1)}
          </span>
          <span style={{
            fontSize: '0.72rem', fontWeight: 500,
            color: 'var(--text-muted)', marginLeft: 'auto',
          }}>
            {notif.time}
          </span>
        </div>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {notif.message}
        </p>
        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.625rem' }}>
          {!notif.read && (
            <button
              id={`notif-mark-read-${notif.id}`}
              className="btn btn-outline btn-sm"
              onClick={() => onMarkRead(notif.id)}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem' }}
            >
              <Check size={12} /> Mark Read
            </button>
          )}
          <button
            id={`notif-view-${notif.id}`}
            className="btn btn-ghost btn-sm"
            onClick={() => onViewDetail(notif)}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem', color: 'var(--primary)' }}
          >
            <ExternalLink size={12} /> View Details
          </button>
        </div>
      </div>

      {/* Unread dot */}
      {!notif.read && <div className="notif-unread-dot" />}
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function Notifications() {
  const [items, setItems]         = useState(
    mockNotifications.map(n => ({ ...n }))
  );
  const [activeTab, setActiveTab] = useState('all');
  const [modalNotif, setModalNotif] = useState(null);

  const unreadCount = items.filter(n => !n.read).length;

  const tabCounts = {
    all:     items.length,
    renewal: items.filter(n => n.type === 'renewal').length,
    payment: items.filter(n => n.type === 'payment').length,
    system:  items.filter(n => n.type === 'system').length,
  };

  const filtered = activeTab === 'all'
    ? items
    : items.filter(n => n.type === activeTab);

  const markRead = (id) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success('Marked as read');
  };

  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const openSettings = () => {
    toast('Notification settings coming soon!', { icon: '⚙️' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">Stay updated with policy alerts, payment reminders, and system events</p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
          <button
            id="notif-mark-all-read"
            className="btn btn-outline btn-sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck size={14} /> Mark all as read
          </button>
          <button
            id="notif-settings-btn"
            className="btn btn-ghost btn-icon btn-sm"
            onClick={openSettings}
            title="Notification settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {unreadCount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            background: 'rgba(11,31,77,0.06)', border: '1px solid rgba(11,31,77,0.15)',
            borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem',
            marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            — including {items.filter(n => !n.read && n.priority === 'high').length} high priority alerts
          </span>
        </motion.div>
      )}

      {/* Tab Bar */}
      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            id={`notif-tab-${tab.key}`}
            className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span style={{
              marginLeft: '0.4rem',
              background: activeTab === tab.key ? 'var(--primary)' : 'var(--bg-secondary)',
              color: activeTab === tab.key ? 'white' : 'var(--text-muted)',
              borderRadius: 'var(--radius-full)', fontSize: '0.65rem', fontWeight: 700,
              padding: '0.1rem 0.4rem',
            }}>
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Notification List */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            <div className="empty-state-icon">
              <Bell size={28} />
            </div>
            <h3>No notifications here</h3>
            <p>All caught up! No {activeTab !== 'all' ? activeTab : ''} notifications to show.</p>
          </motion.div>
        ) : (
          filtered.map(notif => (
            <NotifItem
              key={notif.id}
              notif={notif}
              onMarkRead={markRead}
              onViewDetail={setModalNotif}
            />
          ))
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {modalNotif && (
          <NotifDetailModal
            key="modal"
            notif={modalNotif}
            onClose={() => setModalNotif(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
