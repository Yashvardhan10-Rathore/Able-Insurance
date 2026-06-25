import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Shield, AlertTriangle, XCircle, IndianRupee,
  Pencil, FileText, Download, RefreshCw, ChevronLeft, ChevronRight,
  Car, Heart, LifeBuoy, SlidersHorizontal, Calendar, X
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { policies } from '../data/mockData';

const TYPE_ICONS = {
  Vehicle: <Car size={13} />,
  Health: <Heart size={13} />,
  Life: <LifeBuoy size={13} />,
};

const TYPE_BADGE = {
  Vehicle: 'badge-primary',
  Health: 'badge-success',
  Life: 'badge-gold',
};

const STATUS_BADGE = {
  Active:   'badge-success',
  Expiring: 'badge-warning',
  Expired:  'badge-danger',
};

const ITEMS_PER_PAGE = 8;

export default function Policies() {
  const navigate = useNavigate();
  const today = new Date();

  const [search, setSearch]         = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom]     = useState('');
  const [dateTo, setDateTo]         = useState('');
  const [page, setPage]             = useState(1);
  const [editModal, setEditModal]   = useState(null);
  const [toast, setToast]           = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // KPIs
  const stats = useMemo(() => ({
    active:       policies.filter(p => p.status === 'Active').length,
    expiring:     policies.filter(p => p.status === 'Expiring').length,
    expired:      policies.filter(p => p.status === 'Expired').length,
    totalPremium: policies.reduce((s, p) => s + p.premium, 0),
  }), []);

  // Filtered policies
  const filtered = useMemo(() => {
    return policies.filter(p => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        p.id.toLowerCase().includes(q) ||
        p.customer.toLowerCase().includes(q) ||
        p.insurer.toLowerCase().includes(q);
      const matchType   = typeFilter === 'All'   || p.type   === typeFilter;
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchFrom   = !dateFrom || p.startDate >= dateFrom;
      const matchTo     = !dateTo   || p.expiryDate <= dateTo;
      return matchSearch && matchType && matchStatus && matchFrom && matchTo;
    });
  }, [search, typeFilter, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const daysUntilExpiry = (expiryDate) =>
    differenceInDays(parseISO(expiryDate), today);

  const formatPremium = (n) =>
    '₹' + n.toLocaleString('en-IN');

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            style={{
              position: 'fixed', top: '80px', right: '24px',
              zIndex: 'var(--z-toast)',
              background: toast.type === 'success' ? 'var(--success)' : 'var(--danger)',
              color: 'white', padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
              fontWeight: 600, fontSize: '0.875rem',
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Policies</h1>
          <p className="page-subtitle">Manage all insurance policies across customers</p>
        </div>
        <button id="btn-create-policy" className="btn btn-gold" onClick={() => navigate('/policies/create')}>
          <Plus size={16} />
          Create Policy
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-4 gap-4" style={{ marginBottom: '1.5rem' }}>
        {[
          {
            label: 'Active Policies', value: stats.active, icon: <Shield size={20} />,
            iconBg: 'var(--success-bg)', iconColor: 'var(--success)', i: 0,
          },
          {
            label: 'Expiring Soon', value: stats.expiring, icon: <AlertTriangle size={20} />,
            iconBg: 'var(--warning-bg)', iconColor: 'var(--warning)', i: 1,
          },
          {
            label: 'Expired', value: stats.expired, icon: <XCircle size={20} />,
            iconBg: 'var(--danger-bg)', iconColor: 'var(--danger)', i: 2,
          },
          {
            label: 'Total Premium', value: formatPremium(stats.totalPremium),
            icon: <IndianRupee size={20} />,
            iconBg: 'var(--info-bg)', iconColor: 'var(--info)', i: 3,
          },
        ].map(({ label, value, icon, iconBg, iconColor, i }) => (
          <motion.div
            key={label}
            className="kpi-card"
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <div className="flex items-center justify-between">
              <span className="kpi-label">{label}</span>
              <span
                className="kpi-icon"
                style={{ background: iconBg, color: iconColor }}
              >
                {icon}
              </span>
            </div>
            <div className="kpi-value" style={{ fontSize: typeof value === 'string' ? '1.35rem' : undefined }}>
              {value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div className="filter-bar" style={{ marginBottom: 0 }}>
          {/* Search */}
          <div className="input-icon-wrapper" style={{ flex: 1, minWidth: '220px' }}>
            <Search size={15} className="input-icon" />
            <input
              id="policy-search"
              className="form-input"
              placeholder="Search policy, customer, insurer…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          {/* Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              id="filter-type"
              className="form-select"
              value={typeFilter}
              onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
              style={{ width: '150px' }}
            >
              <option value="All">All Types</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Health">Health</option>
              <option value="Life">Life</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            id="filter-status"
            className="form-select"
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ width: '150px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring">Expiring</option>
            <option value="Expired">Expired</option>
          </select>

          {/* Date From */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              id="filter-date-from"
              type="date"
              className="form-input"
              placeholder="From"
              value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setPage(1); }}
              style={{ width: '145px' }}
            />
          </div>
          <input
            id="filter-date-to"
            type="date"
            className="form-input"
            placeholder="To"
            value={dateTo}
            onChange={e => { setDateTo(e.target.value); setPage(1); }}
            style={{ width: '145px' }}
          />

          {/* Clear Filters */}
          {(search || typeFilter !== 'All' || statusFilter !== 'All' || dateFrom || dateTo) && (
            <button
              id="btn-clear-filters"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setSearch(''); setTypeFilter('All');
                setStatusFilter('All'); setDateFrom('');
                setDateTo(''); setPage(1);
              }}
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <motion.div
        className="table-wrapper"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <table className="data-table">
          <thead>
            <tr>
              <th>Policy Number</th>
              <th>Customer</th>
              <th>Insurance Type</th>
              <th>Insurer</th>
              <th>Start Date</th>
              <th>Expiry Date</th>
              <th>Premium</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <Shield size={28} />
                    </div>
                    <h3>No policies found</h3>
                    <p>Try adjusting your filters or search term.</p>
                  </div>
                </td>
              </tr>
            ) : paginated.map((pol) => {
              const days = daysUntilExpiry(pol.expiryDate);
              const isUrgent = pol.status !== 'Expired' && days >= 0 && days < 7;
              return (
                <tr key={pol.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {isUrgent && (
                        <span
                          title={`Expires in ${days} day${days === 1 ? '' : 's'}!`}
                          style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: 'var(--danger)', flexShrink: 0,
                            animation: 'pulse 2s infinite',
                          }}
                        />
                      )}
                      <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {pol.id}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div
                        className="avatar"
                        style={{ width: '30px', height: '30px', fontSize: '0.65rem', flexShrink: 0 }}
                      >
                        {pol.customer.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 500 }}>{pol.customer}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${TYPE_BADGE[pol.type] || 'badge-muted'}`}>
                      {TYPE_ICONS[pol.type]} {pol.type}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>{pol.insurer}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>
                    {format(parseISO(pol.startDate), 'dd MMM yyyy')}
                  </td>
                  <td>
                    <div>
                      <div style={{ fontSize: '0.825rem', color: days < 7 && pol.status !== 'Expired' ? 'var(--danger)' : 'var(--text-secondary)' }}>
                        {format(parseISO(pol.expiryDate), 'dd MMM yyyy')}
                      </div>
                      {pol.status !== 'Expired' && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {days < 0 ? 'Expired' : `${days}d left`}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatPremium(pol.premium)}
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[pol.status] || 'badge-muted'}`}>
                      {pol.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                      <button
                        id={`btn-edit-${pol.id}`}
                        className="btn btn-ghost btn-sm btn-icon"
                        data-tooltip="Edit Policy"
                        onClick={() => setEditModal(pol)}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        id={`btn-pdf-${pol.id}`}
                        className="btn btn-ghost btn-sm btn-icon"
                        data-tooltip="Generate PDF"
                        onClick={() => navigate('/pdf-generation')}
                      >
                        <FileText size={14} />
                      </button>
                      <button
                        id={`btn-download-${pol.id}`}
                        className="btn btn-ghost btn-sm btn-icon"
                        data-tooltip="Download"
                        onClick={() => showToast(`Downloading ${pol.id}…`)}
                      >
                        <Download size={14} />
                      </button>
                      <button
                        id={`btn-renew-${pol.id}`}
                        className="btn btn-ghost btn-sm btn-icon"
                        data-tooltip="Renew Policy"
                        onClick={() => showToast(`Renewal initiated for ${pol.id}`, 'success')}
                        style={{ color: pol.status === 'Expiring' ? 'var(--warning)' : undefined }}
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <span>
            Showing{' '}
            <strong>{Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}</strong>–
            <strong>{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</strong>{' '}
            of <strong>{filtered.length}</strong> policies
          </span>
          <div className="pagination-btns">
            <button
              id="pg-prev"
              className="page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                id={`pg-${n}`}
                className={`page-btn ${n === page ? 'active' : ''}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              id="pg-next"
              className="page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditModal(null)}
          >
            <motion.div
              className="modal modal-lg"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <h2 className="modal-title">Edit Policy</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {editModal.id} — {editModal.customer}
                  </p>
                </div>
                <button id="btn-close-edit-modal" className="btn btn-ghost btn-sm btn-icon" onClick={() => setEditModal(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="modal-body">
                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Policy Number</label>
                    <input className="form-input" defaultValue={editModal.id} readOnly style={{ background: 'var(--bg-secondary)' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Customer</label>
                    <input className="form-input" defaultValue={editModal.customer} readOnly style={{ background: 'var(--bg-secondary)' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Insurance Type</label>
                    <select id="edit-type" className="form-select" defaultValue={editModal.type}>
                      <option>Vehicle</option><option>Health</option><option>Life</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Insurer</label>
                    <input id="edit-insurer" className="form-input" defaultValue={editModal.insurer} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input id="edit-start" type="date" className="form-input" defaultValue={editModal.startDate} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input id="edit-expiry" type="date" className="form-input" defaultValue={editModal.expiryDate} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Premium (₹)</label>
                    <input id="edit-premium" type="number" className="form-input" defaultValue={editModal.premium} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select id="edit-status" className="form-select" defaultValue={editModal.status}>
                      <option>Active</option><option>Expiring</option><option>Expired</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button id="btn-cancel-edit" className="btn btn-outline" onClick={() => setEditModal(null)}>Cancel</button>
                <button
                  id="btn-save-edit"
                  className="btn btn-primary"
                  onClick={() => { setEditModal(null); showToast(`Policy ${editModal.id} updated successfully`); }}
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
