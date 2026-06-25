import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw, Bell, ExternalLink, X, Search,
  AlertTriangle, Clock, Calendar, CheckCircle,
  ChevronLeft, ChevronRight, Zap, Phone, Shield
} from 'lucide-react';
import { format, addYears } from 'date-fns';
import toast from 'react-hot-toast';
import { renewals } from '../data/mockData';

const formatINR = (n) => '₹' + Number(n).toLocaleString('en-IN');

const PREMIUM_MAP = {
  'POL-2024-010': 14500,
  'POL-2024-004': 12000,
  'POL-2024-003': 36000,
  'POL-2024-001': 18500,
  'POL-2024-009': 22000,
  'POL-2024-002': 24000,
  'POL-2024-005': 30000,
};

function getDaysBadge(days) {
  if (days <= 0)  return { cls: 'badge-danger',   label: 'Today',      color: 'var(--danger)'  };
  if (days <= 3)  return { cls: 'badge-danger',   label: `${days}d`,   color: 'var(--danger)'  };
  if (days <= 7)  return { cls: 'badge-warning',  label: `${days}d`,   color: 'var(--warning)' };
  if (days <= 30) return { cls: 'badge-info',     label: `${days}d`,   color: 'var(--info)'    };
  return           { cls: 'badge-success',  label: `${days}d`,   color: 'var(--success)' };
}

const PAYMENT_MODES = ['Cash', 'UPI', 'Net Banking', 'Cheque', 'Card'];
const PAGE_SIZE = 6;

/* ─── Renew Policy Modal ─────────────────────────────────────── */
function RenewModal({ renewal, onClose }) {
  const [mode, setMode] = useState('UPI');
  const [confirming, setConfirming] = useState(false);
  const premium = PREMIUM_MAP[renewal.policy] ?? 20000;
  const newExpiry = addYears(new Date(renewal.expiryDate), 1);

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      toast.success(`Policy ${renewal.policy} renewed until ${format(newExpiry, 'dd MMM yyyy')}`);
      onClose();
    }, 900);
  };

  return (
    <div className="modal-overlay" id="renew-modal-overlay" onClick={(e) => e.target.id === 'renew-modal-overlay' && onClose()}>
      <motion.div
        className="modal modal-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.22 }}
      >
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="kpi-icon" style={{ background: 'rgba(201,162,39,0.12)' }}>
              <RefreshCw size={20} color="var(--gold-dark)" />
            </div>
            <div>
              <div className="modal-title">Renew Policy</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', marginTop: 2 }}>{renewal.policy}</div>
            </div>
          </div>
          <button id="close-renew-modal" className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Policy Summary */}
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', marginBottom: '1.25rem' }}>
            <div className="card-body" style={{ padding: '1.125rem' }}>
              <div className="grid grid-2 gap-4">
                {[
                  ['Customer',      renewal.customer],
                  ['Policy Type',   renewal.type],
                  ['Current Expiry', format(new Date(renewal.expiryDate), 'dd MMM yyyy')],
                  ['Premium',       formatINR(premium)],
                ].map(([l, v]) => (
                  <div key={l}>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 2 }}>{l}</div>
                    <div className="text-sm font-semi" style={{ color: 'white' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New Term */}
          <div className="card" style={{ border: '2px solid var(--success)', marginBottom: '1.25rem' }}>
            <div className="card-body" style={{ padding: '1rem' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
                <CheckCircle size={16} color="var(--success)" />
                <span className="text-sm font-semi" style={{ color: 'var(--success)' }}>New Policy Term</span>
              </div>
              <div className="grid grid-2 gap-4">
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: 2 }}>New Start Date</div>
                  <div className="font-semi text-sm">{format(new Date(renewal.expiryDate), 'dd MMM yyyy')}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: 2 }}>New Expiry Date</div>
                  <div className="font-semi text-sm" style={{ color: 'var(--success)' }}>{format(newExpiry, 'dd MMM yyyy')}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: 2 }}>Renewal Premium</div>
                  <div className="text-lg font-black" style={{ color: 'var(--primary)' }}>{formatINR(premium)}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: 2 }}>Duration</div>
                  <div className="font-semi text-sm">1 Year</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Mode */}
          <div className="form-group">
            <label className="form-label" htmlFor="renewal-pay-mode">Payment Mode <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select
              id="renewal-pay-mode"
              className="form-select"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button id="cancel-renew-modal" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button
            id="confirm-renew-btn"
            className="btn btn-gold"
            onClick={handleConfirm}
            disabled={confirming}
          >
            {confirming ? (
              <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Processing...</>
            ) : (
              <><RefreshCw size={15} /> Confirm Renewal</>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function Renewals() {
  const [search, setSearch]           = useState('');
  const [typeFilter, setTypeFilter]   = useState('All');
  const [reminderFilter, setReminder] = useState('All');
  const [page, setPage]               = useState(1);
  const [renewModal, setRenewModal]   = useState(null);
  const [sending, setSending]         = useState(null);

  /* Urgency counts */
  const today    = renewals.filter((r) => r.daysLeft <= 0).length;
  const thisWeek = renewals.filter((r) => r.daysLeft > 0 && r.daysLeft <= 7).length;
  const thisMon  = renewals.filter((r) => r.daysLeft > 7 && r.daysLeft <= 30).length;

  /* Filter */
  const filtered = useMemo(() => {
    return renewals.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = r.customer.toLowerCase().includes(q) || r.policy.toLowerCase().includes(q) || r.mobile.includes(q);
      const matchType   = typeFilter === 'All' || r.type === typeFilter;
      const matchRemind = reminderFilter === 'All' || r.status === reminderFilter;
      return matchSearch && matchType && matchRemind;
    });
  }, [search, typeFilter, reminderFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSendReminder = (r) => {
    setSending(r.id);
    setTimeout(() => {
      toast.success(`SMS & Email sent to ${r.customer}`);
      setSending(null);
    }, 700);
  };

  const handleBulkReminder = () => {
    toast.success(`Bulk reminders sent to ${renewals.filter((r) => r.status === 'Pending').length} customers`);
  };

  const policyTypes = ['All', ...new Set(renewals.map((r) => r.type))];

  return (
    <div className="page-wrapper animate-fade-in">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Renewals</h1>
          <p className="page-subtitle">Monitor expiring policies and send renewal reminders</p>
        </div>
        <button id="bulk-reminder-btn" className="btn btn-gold" onClick={handleBulkReminder}>
          <Bell size={16} /> Send Bulk Reminder
        </button>
      </div>

      {/* ── Urgency Cards ── */}
      <div className="grid grid-3 gap-4" style={{ marginBottom: '1.5rem' }}>
        {/* Expiring Today */}
        <motion.div
          className="card"
          style={{ borderLeft: '4px solid var(--danger)', overflow: 'hidden' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
        >
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="kpi-icon" style={{ background: 'var(--danger-bg)', position: 'relative' }}>
              <AlertTriangle size={22} color="var(--danger)" />
              <span className="animate-pulse" style={{
                position: 'absolute', top: -3, right: -3,
                width: 10, height: 10, borderRadius: '50%',
                background: 'var(--danger)', border: '2px solid var(--surface)',
              }} />
            </div>
            <div>
              <div className="kpi-label">Expiring Today</div>
              <div className="kpi-value" style={{ color: 'var(--danger)' }}>{today}</div>
              <div className="text-xs" style={{ color: 'var(--danger)', marginTop: 2 }}>⚠ Urgent action needed</div>
            </div>
          </div>
        </motion.div>

        {/* Expiring This Week */}
        <motion.div
          className="card"
          style={{ borderLeft: '4px solid var(--warning)' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
        >
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="kpi-icon" style={{ background: 'var(--warning-bg)' }}>
              <Clock size={22} color="var(--warning)" />
            </div>
            <div>
              <div className="kpi-label">Expiring This Week</div>
              <div className="kpi-value" style={{ color: 'var(--warning)' }}>{thisWeek}</div>
              <div className="text-xs" style={{ color: 'var(--warning)', marginTop: 2 }}>Follow up soon</div>
            </div>
          </div>
        </motion.div>

        {/* Expiring This Month */}
        <motion.div
          className="card"
          style={{ borderLeft: '4px solid var(--info)' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
        >
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="kpi-icon" style={{ background: 'var(--info-bg)' }}>
              <Calendar size={22} color="var(--info)" />
            </div>
            <div>
              <div className="kpi-label">Expiring This Month</div>
              <div className="kpi-value" style={{ color: 'var(--info)' }}>{thisMon}</div>
              <div className="text-xs" style={{ color: 'var(--info)', marginTop: 2 }}>Plan ahead</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Table Card ── */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Filter Bar */}
        <div className="card-header" style={{ paddingBottom: '1rem' }}>
          <div className="filter-bar" style={{ marginBottom: 0 }}>
            <div className="input-icon-wrapper" style={{ flex: 1, minWidth: 200 }}>
              <Search size={16} className="input-icon" />
              <input
                id="renewals-search"
                className="form-input"
                placeholder="Search customer, policy, mobile..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            <select
              id="type-filter"
              className="form-select"
              style={{ width: 160 }}
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            >
              {policyTypes.map((t) => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
            </select>

            <select
              id="reminder-filter"
              className="form-select"
              style={{ width: 180 }}
              value={reminderFilter}
              onChange={(e) => { setReminder(e.target.value); setPage(1); }}
            >
              <option value="All">All Reminders</option>
              <option value="Sent">Sent</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Mobile</th>
                <th>Policy No</th>
                <th>Type</th>
                <th>Expiry Date</th>
                <th>Days Left</th>
                <th>Premium</th>
                <th>Reminder</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No renewals found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((r) => {
                  const dayBadge = getDaysBadge(r.daysLeft);
                  const premium  = PREMIUM_MAP[r.policy] ?? 20000;
                  const isUrgent = r.daysLeft <= 3;
                  return (
                    <tr
                      key={r.id}
                      style={isUrgent ? { background: 'rgba(239,68,68,0.025)', borderLeft: '3px solid var(--danger)' } : {}}
                    >
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.7rem' }}>
                            {r.customer.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-semi text-sm">{r.customer}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <Phone size={12} /> {r.mobile}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary" style={{ fontFamily: 'monospace' }}>{r.policy}</span>
                      </td>
                      <td>
                        <span className={`badge ${r.type === 'Vehicle' ? 'badge-info' : r.type === 'Health' ? 'badge-success' : 'badge-gold'}`}>
                          <Shield size={10} /> {r.type}
                        </span>
                      </td>
                      <td className="text-sm" style={{ color: isUrgent ? 'var(--danger)' : 'var(--text-secondary)', fontWeight: isUrgent ? 600 : 400 }}>
                        {format(new Date(r.expiryDate), 'dd MMM yyyy')}
                      </td>
                      <td>
                        <span className={`badge ${dayBadge.cls}`}>
                          {dayBadge.label}
                        </span>
                      </td>
                      <td className="font-semi">{formatINR(premium)}</td>
                      <td>
                        <span className={`badge ${r.status === 'Sent' ? 'badge-success' : 'badge-warning'}`}>
                          {r.status === 'Sent' ? <CheckCircle size={11} /> : <Clock size={11} />} {r.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            id={`send-reminder-${r.id}`}
                            className="btn btn-sm btn-outline"
                            onClick={() => handleSendReminder(r)}
                            disabled={sending === r.id}
                            data-tooltip="Send Reminder"
                          >
                            {sending === r.id
                              ? <div className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />
                              : <Bell size={13} />
                            }
                          </button>
                          <button
                            id={`renew-${r.id}`}
                            className="btn btn-sm btn-gold"
                            onClick={() => setRenewModal(r)}
                            data-tooltip="Renew Policy"
                          >
                            <RefreshCw size={13} />
                          </button>
                          <button
                            id={`view-customer-${r.id}`}
                            className="btn btn-sm btn-outline"
                            onClick={() => toast('Navigating to customer profile...')}
                            data-tooltip="View Customer"
                          >
                            <ExternalLink size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <span>Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
            <div className="pagination-btns">
              <button id="renewals-prev" className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} id={`renewals-page-${n}`} className={`page-btn ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button id="renewals-next" className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {renewModal && (
          <RenewModal renewal={renewModal} onClose={() => setRenewModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
