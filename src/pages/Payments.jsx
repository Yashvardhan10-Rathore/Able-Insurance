import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IndianRupee, Download, Plus, Search, Filter,
  Banknote, Bell, Eye, X, CheckCircle, AlertCircle,
  Clock, TrendingUp, ChevronLeft, ChevronRight, FileText,
  CreditCard, Calendar, Receipt
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { payments } from '../data/mockData';

const formatINR = (n) =>
  '₹' + Number(n).toLocaleString('en-IN');

const STATUS_CONFIG = {
  Paid:    { cls: 'badge-success', icon: CheckCircle },
  Partial: { cls: 'badge-warning', icon: Clock },
  Overdue: { cls: 'badge-danger',  icon: AlertCircle },
};

const PAYMENT_MODES = ['Cash', 'UPI', 'Net Banking', 'Cheque', 'Card'];
const PAGE_SIZE = 6;

/* ─── Record Payment Modal ─────────────────────────────────── */
function RecordPaymentModal({ payment, onClose }) {
  const [form, setForm] = useState({
    amount: payment ? payment.pending : '',
    mode: 'UPI',
    date: format(new Date(), 'yyyy-MM-dd'),
    receipt: `RCT-${Date.now().toString().slice(-6)}`,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(`Payment of ${formatINR(form.amount)} recorded for ${payment.customer}`);
    onClose();
  };

  return (
    <div className="modal-overlay" id="record-payment-overlay" onClick={(e) => e.target.id === 'record-payment-overlay' && onClose()}>
      <motion.div
        className="modal"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.22 }}
      >
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="kpi-icon" style={{ background: 'rgba(201,162,39,0.12)' }}>
              <Banknote size={20} color="var(--gold-dark)" />
            </div>
            <span className="modal-title">Record Payment</span>
          </div>
          <button id="close-payment-modal" className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Customer & Policy Info */}
            <div className="card" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="card-body" style={{ padding: '0.875rem 1rem' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '0.375rem' }}>
                  <span className="text-sm font-semi" style={{ color: 'var(--text-primary)' }}>{payment.customer}</span>
                  <span className="badge badge-primary">{payment.policy}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Total: <strong style={{ color: 'var(--text-primary)' }}>{formatINR(payment.premium)}</strong></span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Paid: <strong style={{ color: 'var(--success)' }}>{formatINR(payment.paid)}</strong></span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Due: <strong style={{ color: 'var(--danger)' }}>{formatINR(payment.pending)}</strong></span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pay-amount">Amount <span>*</span></label>
              <div className="input-icon-wrapper">
                <IndianRupee size={16} className="input-icon" />
                <input
                  id="pay-amount"
                  type="number"
                  className="form-input"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Enter amount"
                  required
                  min={1}
                  max={payment.pending || payment.premium}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pay-mode">Payment Mode <span>*</span></label>
              <select
                id="pay-mode"
                className="form-select"
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
              >
                {PAYMENT_MODES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-2 gap-3">
              <div className="form-group">
                <label className="form-label" htmlFor="pay-date">Payment Date <span>*</span></label>
                <div className="input-icon-wrapper">
                  <Calendar size={16} className="input-icon" />
                  <input
                    id="pay-date"
                    type="date"
                    className="form-input"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pay-receipt">Receipt No.</label>
                <div className="input-icon-wrapper">
                  <Receipt size={16} className="input-icon" />
                  <input
                    id="pay-receipt"
                    type="text"
                    className="form-input"
                    value={form.receipt}
                    onChange={(e) => setForm({ ...form, receipt: e.target.value })}
                    placeholder="Auto-generated"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button id="cancel-payment-modal" type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button id="submit-payment-modal" type="submit" className="btn btn-gold">
              <CheckCircle size={16} /> Confirm Payment
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── View Details Modal ───────────────────────────────────── */
function ViewDetailsModal({ payment, onClose }) {
  return (
    <div className="modal-overlay" id="view-payment-overlay" onClick={(e) => e.target.id === 'view-payment-overlay' && onClose()}>
      <motion.div
        className="modal"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.22 }}
      >
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="kpi-icon" style={{ background: 'var(--info-bg)' }}>
              <FileText size={20} color="var(--info)" />
            </div>
            <span className="modal-title">Payment Details</span>
          </div>
          <button id="close-details-modal" className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              ['Payment ID', payment.id],
              ['Customer', payment.customer],
              ['Policy Number', payment.policy],
              ['Total Premium', formatINR(payment.premium)],
              ['Amount Paid', formatINR(payment.paid)],
              ['Pending Amount', formatINR(payment.pending)],
              ['Due Date', format(new Date(payment.dueDate), 'dd MMM yyyy')],
              ['Status', payment.status],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between" style={{ paddingBottom: '0.625rem', borderBottom: '1px solid var(--border-light)' }}>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span className="text-sm font-semi">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button id="close-details-btn" className="btn btn-outline" onClick={onClose}>Close</button>
          <button id="print-details-btn" className="btn btn-primary" onClick={() => { toast.success('Generating receipt PDF...'); onClose(); }}>
            <Download size={16} /> Download Receipt
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function Payments() {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom]       = useState('');
  const [dateTo, setDateTo]           = useState('');
  const [page, setPage]               = useState(1);
  const [recordModal, setRecordModal] = useState(null);  // payment obj
  const [detailModal, setDetailModal] = useState(null);

  /* KPI totals */
  const totalRevenue = payments.reduce((s, p) => s + p.premium, 0);
  const collected    = payments.reduce((s, p) => s + p.paid, 0);
  const pending      = payments.reduce((s, p) => s + p.pending, 0);
  const overdue      = payments.filter((p) => p.status === 'Overdue').reduce((s, p) => s + p.pending, 0);

  /* Filtering */
  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = p.customer.toLowerCase().includes(q) || p.policy.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchDate = (!dateFrom || p.dueDate >= dateFrom) && (!dateTo || p.dueDate <= dateTo);
      return matchSearch && matchStatus && matchDate;
    });
  }, [search, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Totals row */
  const rowTotalPremium = filtered.reduce((s, p) => s + p.premium, 0);
  const rowTotalPaid    = filtered.reduce((s, p) => s + p.paid, 0);
  const rowTotalPending = filtered.reduce((s, p) => s + p.pending, 0);

  const handleExportCSV = () => {
    const rows = [
      ['Customer', 'Policy', 'Total Premium', 'Paid', 'Pending', 'Due Date', 'Status'],
      ...filtered.map((p) => [p.customer, p.policy, p.premium, p.paid, p.pending, p.dueDate, p.status]),
    ];
    const csv  = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'payments.csv'; a.click();
    toast.success('CSV exported successfully');
  };

  const kpiCards = [
    { label: 'Total Revenue',    value: formatINR(totalRevenue), icon: TrendingUp,    bg: 'rgba(11,31,77,0.1)',         color: 'var(--primary)',  delta: '+12.4%', deltaDir: 'up' },
    { label: 'Collected',        value: formatINR(collected),    icon: CheckCircle,   bg: 'rgba(16,185,129,0.12)',       color: 'var(--success)',  delta: '+8.2%',  deltaDir: 'up' },
    { label: 'Pending',          value: formatINR(pending),      icon: Clock,         bg: 'rgba(245,158,11,0.12)',       color: 'var(--warning)',  delta: '-3.1%',  deltaDir: 'down' },
    { label: 'Overdue',          value: formatINR(overdue),      icon: AlertCircle,   bg: 'rgba(239,68,68,0.12)',        color: 'var(--danger)',   delta: '+2 new', deltaDir: 'down' },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments</h1>
          <p className="page-subtitle">Track premiums, collections, and overdue balances</p>
        </div>
        <div className="flex gap-2">
          <button id="export-payments-btn" className="btn btn-outline" onClick={handleExportCSV}>
            <Download size={16} /> Export
          </button>
          <button id="record-payment-btn" className="btn btn-gold" onClick={() => setRecordModal(payments[0])}>
            <Plus size={16} /> Record Payment
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-4 gap-4" style={{ marginBottom: '1.5rem' }}>
        {kpiCards.map((k, i) => (
          <motion.div
            key={k.label}
            className="kpi-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <div className="flex justify-between items-center">
              <p className="kpi-label">{k.label}</p>
              <div className="kpi-icon" style={{ background: k.bg }}>
                <k.icon size={20} color={k.color} />
              </div>
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className={`kpi-delta ${k.deltaDir}`}>
              {k.deltaDir === 'up' ? '▲' : '▼'} {k.delta} vs last month
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Filter Bar */}
        <div className="card-header" style={{ paddingBottom: '1rem' }}>
          <div className="filter-bar" style={{ marginBottom: 0 }}>
            <div className="input-icon-wrapper" style={{ flex: 1, minWidth: 200 }}>
              <Search size={16} className="input-icon" />
              <input
                id="payments-search"
                className="form-input"
                placeholder="Search customer or policy..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={15} style={{ color: 'var(--text-muted)' }} />
              {['All', 'Paid', 'Partial', 'Overdue'].map((s) => (
                <button
                  key={s}
                  id={`filter-${s.toLowerCase()}`}
                  className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                >
                  {s}
                </button>
              ))}
            </div>

            <input
              id="date-from"
              type="date"
              className="form-input"
              style={{ width: 160 }}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <input
              id="date-to"
              type="date"
              className="form-input"
              style={{ width: 160 }}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <button id="export-csv-btn" className="btn btn-outline btn-sm" onClick={handleExportCSV}>
              <Download size={14} /> CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Policy Number</th>
                <th>Total Premium</th>
                <th>Amount Paid</th>
                <th>Pending</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No payments found matching your filters.
                  </td>
                </tr>
              ) : (
                paginated.map((p) => {
                  const cfg = STATUS_CONFIG[p.status];
                  const isOverdue = p.status === 'Overdue';
                  return (
                    <tr
                      key={p.id}
                      style={isOverdue ? {
                        borderLeft: '3px solid var(--danger)',
                        background: 'rgba(239,68,68,0.025)',
                      } : {}}
                    >
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.7rem' }}>
                            {p.customer.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-semi text-sm">{p.customer}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary" style={{ fontFamily: 'monospace', letterSpacing: '0.02em' }}>{p.policy}</span>
                      </td>
                      <td className="font-semi">{formatINR(p.premium)}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 600 }}>{formatINR(p.paid)}</td>
                      <td style={{ color: p.pending > 0 ? 'var(--danger)' : 'var(--text-muted)', fontWeight: p.pending > 0 ? 600 : 400 }}>
                        {formatINR(p.pending)}
                      </td>
                      <td className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {format(new Date(p.dueDate), 'dd MMM yyyy')}
                      </td>
                      <td>
                        <span className={`badge ${cfg.cls}`}>
                          <cfg.icon size={11} /> {p.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            id={`record-${p.id}`}
                            className="btn btn-sm btn-gold"
                            onClick={() => setRecordModal(p)}
                            data-tooltip="Record Payment"
                            disabled={p.status === 'Paid'}
                            style={{ opacity: p.status === 'Paid' ? 0.4 : 1 }}
                          >
                            <Banknote size={13} />
                          </button>
                          <button
                            id={`remind-${p.id}`}
                            className="btn btn-sm btn-outline"
                            onClick={() => toast.success(`Reminder sent to ${p.customer}`)}
                            data-tooltip="Send Reminder"
                          >
                            <Bell size={13} />
                          </button>
                          <button
                            id={`view-${p.id}`}
                            className="btn btn-sm btn-outline"
                            onClick={() => setDetailModal(p)}
                            data-tooltip="View Details"
                          >
                            <Eye size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Totals Row */}
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ background: 'var(--bg-secondary)', fontWeight: 700 }}>
                  <td colSpan={2} style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Totals ({filtered.length} records)
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>{formatINR(rowTotalPremium)}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--success)' }}>{formatINR(rowTotalPaid)}</td>
                  <td style={{ padding: '0.75rem 1rem', color: rowTotalPending > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>{formatINR(rowTotalPending)}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <span>Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records</span>
            <div className="pagination-btns">
              <button
                id="prev-page-btn"
                className="page-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  id={`page-btn-${n}`}
                  className={`page-btn ${page === n ? 'active' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                id="next-page-btn"
                className="page-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {recordModal && (
          <RecordPaymentModal payment={recordModal} onClose={() => setRecordModal(null)} />
        )}
        {detailModal && (
          <ViewDetailsModal payment={detailModal} onClose={() => setDetailModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
