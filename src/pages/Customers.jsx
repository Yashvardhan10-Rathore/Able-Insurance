import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Download, UserPlus, Users, AlertTriangle,
  XCircle, MoreVertical, Eye, Edit2, FileText, Trash2,
  ChevronLeft, ChevronRight, X, CheckCircle, Car, Heart, Shield,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { customers } from '../data/mockData';

/* ── helpers ─────────────────────────────────────────────── */
const getStatusBadge = (status) => {
  const map = {
    Active:   'badge badge-success',
    Expiring: 'badge badge-warning',
    Expired:  'badge badge-danger',
  };
  return map[status] ?? 'badge badge-muted';
};

const getPolicyBadge = (type) => {
  const map = {
    Vehicle: 'badge badge-primary',
    Health:  'badge badge-gold',
    Life:    'badge badge-info',
  };
  return map[type] ?? 'badge badge-muted';
};

const getInitials = (name) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const avatarColors = [
  '#0B1F4D', '#1a3a7a', '#2952a3', '#C9A227', '#10B981',
  '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
];
const getAvatarColor = (id) =>
  avatarColors[parseInt(id.replace(/\D/g, ''), 10) % avatarColors.length];

const PAGE_SIZE = 12;

/* ── ActionDropdown ──────────────────────────────────────── */
function ActionDropdown({ customer, onDelete }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button
        id={`action-btn-${customer.id}`}
        className="btn btn-ghost btn-icon btn-sm"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        aria-label="Actions"
      >
        <MoreVertical size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="dropdown-menu"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              id={`view-${customer.id}`}
              className="dropdown-item"
              onClick={() => { setOpen(false); navigate(`/customers/${customer.id}`); }}
            >
              <Eye size={15} /> View Profile
            </div>
            <div
              id={`edit-${customer.id}`}
              className="dropdown-item"
              onClick={() => { setOpen(false); toast.success('Opening editor…'); }}
            >
              <Edit2 size={15} /> Edit
            </div>
            <div
              id={`policy-${customer.id}`}
              className="dropdown-item"
              onClick={() => { setOpen(false); toast.success('Generating policy PDF…'); }}
            >
              <FileText size={15} /> Generate Policy
            </div>
            <div className="dropdown-divider" />
            <div
              id={`delete-${customer.id}`}
              className="dropdown-item danger"
              onClick={() => { setOpen(false); onDelete(customer); }}
            >
              <Trash2 size={15} /> Delete
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── DeleteModal ─────────────────────────────────────────── */
function DeleteModal({ customer, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal"
        style={{ maxWidth: 420 }}
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-title" style={{ color: 'var(--danger)' }}>Delete Customer</span>
          <button id="delete-modal-close" className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--danger-bg)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <Trash2 size={24} color="var(--danger)" />
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{customer?.name}</strong>?
            This action cannot be undone and will remove all associated policies and documents.
          </p>
        </div>
        <div className="modal-footer">
          <button id="delete-cancel" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button id="delete-confirm" className="btn btn-danger" onClick={() => onConfirm(customer)}>
            <Trash2 size={15} /> Delete Customer
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function Customers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [policyFilter, setPolicyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [localCustomers, setLocalCustomers] = useState(customers);

  /* stats */
  const stats = useMemo(() => ({
    active:   localCustomers.filter((c) => c.status === 'Active').length,
    expiring: localCustomers.filter((c) => c.status === 'Expiring').length,
    expired:  localCustomers.filter((c) => c.status === 'Expired').length,
  }), [localCustomers]);

  /* filtered list */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return localCustomers.filter((c) => {
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.mobile.includes(q);
      const matchPolicy = !policyFilter || c.policyType === policyFilter;
      const matchStatus = !statusFilter || c.status === statusFilter;
      return matchSearch && matchPolicy && matchStatus;
    });
  }, [localCustomers, search, policyFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (customer) => {
    setLocalCustomers((prev) => prev.filter((c) => c.id !== customer.id));
    setDeleteTarget(null);
    toast.success(`${customer.name} removed successfully`);
  };

  const clearFilters = () => {
    setSearch('');
    setPolicyFilter('');
    setStatusFilter('');
    setPage(1);
  };

  useEffect(() => { setPage(1); }, [search, policyFilter, statusFilter]);

  const hasFilters = search || policyFilter || statusFilter;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const rowVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.22 } },
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">{filtered.length} of {localCustomers.length} total customers</p>
        </div>
        <div className="flex gap-2">
          <button id="export-customers-btn" className="btn btn-outline">
            <Download size={16} /> Export
          </button>
          <button
            id="add-customer-btn"
            className="btn btn-gold"
            onClick={() => navigate('/customers/add')}
          >
            <UserPlus size={16} /> Add Customer
          </button>
        </div>
      </div>

      {/* ── Stats Row ───────────────────────────────────── */}
      <div className="grid grid-3 gap-4" style={{ marginBottom: '1.25rem' }}>
        {[
          { label: 'Active Customers', value: stats.active, icon: CheckCircle, color: 'var(--success)', bg: 'var(--success-bg)', id: 'stat-active' },
          { label: 'Expiring Soon', value: stats.expiring, icon: AlertTriangle, color: 'var(--warning)', bg: 'var(--warning-bg)', id: 'stat-expiring' },
          { label: 'Expired Policies', value: stats.expired, icon: XCircle, color: 'var(--danger)', bg: 'var(--danger-bg)', id: 'stat-expired' },
        ].map(({ label, value, icon: Icon, color, bg, id }) => (
          <motion.div
            key={id}
            id={id}
            className="kpi-card flex items-center gap-4"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="kpi-icon" style={{ background: bg }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <div className="kpi-value" style={{ fontSize: '1.5rem', marginBottom: 0 }}>{value}</div>
              <div className="kpi-label">{label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Filter Bar ──────────────────────────────────── */}
      <div className="filter-bar">
        <div className="input-icon-wrapper" style={{ flex: 1, minWidth: 200 }}>
          <Search size={16} className="input-icon" />
          <input
            id="customer-search"
            className="form-input"
            placeholder="Search by name, ID, email or mobile…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          id="policy-type-filter"
          className="form-select"
          style={{ width: 160 }}
          value={policyFilter}
          onChange={(e) => setPolicyFilter(e.target.value)}
        >
          <option value="">All Policy Types</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Health">Health</option>
          <option value="Life">Life</option>
        </select>
        <select
          id="status-filter"
          className="form-select"
          style={{ width: 140 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Expiring">Expiring</option>
          <option value="Expired">Expired</option>
        </select>
        {hasFilters && (
          <button id="clear-filters-btn" className="btn btn-outline btn-sm" onClick={clearFilters}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Customer</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Policy Type</th>
              <th>Renewal Date</th>
              <th>Status</th>
              <th style={{ width: 60, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><Users size={28} /></div>
                    <h3>No customers found</h3>
                    <p>Try adjusting your search or filters.</p>
                    <button id="empty-clear-btn" className="btn btn-outline btn-sm" onClick={clearFilters}>
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((customer) => (
                <motion.tr
                  key={customer.id}
                  variants={rowVariants}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/customers/${customer.id}`)}
                >
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 4 }}>
                      {customer.id}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="avatar"
                        style={{ background: getAvatarColor(customer.id), flexShrink: 0 }}
                      >
                        {getInitials(customer.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{customer.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{customer.city}, {customer.state}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{customer.mobile}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{customer.email}</td>
                  <td>
                    <span className={getPolicyBadge(customer.policyType)}>
                      {customer.policyType === 'Vehicle' && <Car size={10} />}
                      {customer.policyType === 'Health' && <Heart size={10} />}
                      {customer.policyType === 'Life' && <Shield size={10} />}
                      {customer.policyType}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem' }}>
                    {format(new Date(customer.renewalDate), 'dd MMM yyyy')}
                  </td>
                  <td>
                    <span className={getStatusBadge(customer.status)}>
                      {customer.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <ActionDropdown customer={customer} onDelete={setDeleteTarget} />
                  </td>
                </motion.tr>
              ))
            )}
          </motion.tbody>
        </table>

        {/* ── Pagination ─────────────────────────────────── */}
        {filtered.length > 0 && (
          <div className="pagination">
            <span>
              Showing{' '}
              <strong>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</strong>
              {' '}of <strong>{filtered.length}</strong>
            </span>
            <div className="pagination-btns">
              <button
                id="page-prev"
                className="page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let num;
                if (totalPages <= 7) num = i + 1;
                else if (page <= 4) num = i + 1;
                else if (page >= totalPages - 3) num = totalPages - 6 + i;
                else num = page - 3 + i;
                return (
                  <button
                    key={num}
                    id={`page-btn-${num}`}
                    className={`page-btn ${page === num ? 'active' : ''}`}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                );
              })}
              <button
                id="page-next"
                className="page-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Modal ────────────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            customer={deleteTarget}
            onConfirm={handleDelete}
            onClose={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
