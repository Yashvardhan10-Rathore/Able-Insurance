import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  UserSearch, ChevronDown, FileText, Send, Save,
  Shield, Car, Heart, LifeBuoy, UserPlus, Calendar,
  BadgeCheck, AlertCircle, Info, Building2
} from 'lucide-react';
import { format, addYears } from 'date-fns';
import { customers, agents } from '../data/mockData';

const INSURANCE_TYPES = ['Vehicle', 'Health', 'Life', 'Property', 'Travel'];
const INSURANCE_COMPANIES = [
  'HDFC ERGO', 'ICICI Lombard', 'Bajaj Allianz', 'Star Health',
  'Niva Bupa', 'Max Bupa', 'LIC India', 'SBI Life', 'Max Life',
  'New India', 'Reliance GI',
];
const PAYMENT_MODES = ['Annual', 'Semi-Annual', 'Quarterly', 'Monthly'];
const NOMINEE_RELATIONS = ['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Other'];

const genPolicyNumber = () => {
  const yr = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `POL-${yr}-${seq}`;
};

const formatRupees = (n) => {
  if (!n) return '₹0';
  return '₹' + Number(n).toLocaleString('en-IN');
};

const TypeIcon = ({ type }) => {
  const map = { Vehicle: Car, Health: Heart, Life: LifeBuoy };
  const Icon = map[type] || Shield;
  return <Icon size={14} />;
};

export default function PolicyCreate() {
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      policyNumber:    genPolicyNumber(),
      insuranceType:   'Vehicle',
      insuranceCompany:'HDFC ERGO',
      startDate:       format(new Date(), 'yyyy-MM-dd'),
      expiryDate:      format(addYears(new Date(), 1), 'yyyy-MM-dd'),
      premium:         '',
      paymentMode:     'Annual',
      firstPayment:    '',
      remainingAmount: '',
      paymentDueDate:  '',
      nomineeName:     '',
      nomineeRelation: 'Spouse',
      agentName:       '',
      notes:           '',
      customerId:      '',
    },
  });

  const [customerSearch, setCustomerSearch]   = useState('');
  const [showCustomerDrop, setShowCustomerDrop] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [savingDraft, setSavingDraft]           = useState(false);
  const [toast, setToast]                       = useState(null);

  const watchedValues = watch();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filter customers for dropdown
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.id.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.mobile.includes(customerSearch)
  );

  const selectCustomer = useCallback((cust) => {
    setSelectedCustomer(cust);
    setCustomerSearch(cust.name);
    setShowCustomerDrop(false);
    setValue('customerId', cust.id);
    setValue('insuranceType', cust.policyType || 'Vehicle');
    if (cust.premium) setValue('premium', cust.premium);
  }, [setValue]);

  // Auto-calc remaining
  useEffect(() => {
    const p = Number(watchedValues.premium) || 0;
    const f = Number(watchedValues.firstPayment) || 0;
    setValue('remainingAmount', Math.max(0, p - f));
  }, [watchedValues.premium, watchedValues.firstPayment, setValue]);

  const onGeneratePDF = handleSubmit(() => navigate('/pdf-generation'));

  const onSaveDraft = () => {
    setSavingDraft(true);
    setTimeout(() => {
      setSavingDraft(false);
      showToast('Draft saved successfully');
    }, 1200);
  };

  const onSendToCustomer = handleSubmit(() => {
    showToast('Policy sent to customer via email & SMS');
  });

  // Preview file name
  const previewFileName = selectedCustomer
    ? `${selectedCustomer.id}_${watchedValues.policyNumber}_${selectedCustomer.name.split(' ')[0].toUpperCase()}_${watchedValues.insuranceType.toUpperCase()}.pdf`
    : `CLI0000_${watchedValues.policyNumber}_CUSTOMER_${watchedValues.insuranceType?.toUpperCase() || 'POLICY'}.pdf`;

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: '80px', right: '24px',
            zIndex: 'var(--z-toast)',
            background: toast.type === 'success' ? 'var(--success)' : 'var(--danger)',
            color: 'white', padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
            fontWeight: 600, fontSize: '0.875rem', minWidth: '260px',
          }}
        >
          <BadgeCheck size={15} style={{ display: 'inline', marginRight: '0.5rem' }} />
          {toast.msg}
        </motion.div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Policy</h1>
          <p className="page-subtitle">Fill in the details to issue a new insurance policy</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button id="btn-back-policies" className="btn btn-outline" onClick={() => navigate('/policies')}>
            ← Back to Policies
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* LEFT – Form (65%) */}
        <motion.div
          style={{ flex: '0 0 65%', minWidth: 0 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <form onSubmit={e => e.preventDefault()}>

            {/* ── Section 1: Customer Selection ── */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div className="card-header" style={{ paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--info-bg)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserSearch size={14} />
                  </span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Customer Selection</h3>
                </div>
              </div>
              <div className="card-body" style={{ paddingTop: '0.5rem' }}>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label">Search Customer <span>*</span></label>
                  <div className="input-icon-wrapper">
                    <UserSearch size={15} className="input-icon" />
                    <input
                      id="customer-search-input"
                      className="form-input"
                      placeholder="Search by name, ID, or mobile…"
                      value={customerSearch}
                      onChange={e => { setCustomerSearch(e.target.value); setShowCustomerDrop(true); }}
                      onFocus={() => setShowCustomerDrop(true)}
                      style={{ paddingLeft: '2.25rem' }}
                      autoComplete="off"
                    />
                  </div>
                  {showCustomerDrop && customerSearch && (
                    <div
                      style={{
                        position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
                        zIndex: 50, maxHeight: '220px', overflowY: 'auto',
                      }}
                    >
                      {filteredCustomers.length === 0 ? (
                        <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
                          No customers found
                        </div>
                      ) : filteredCustomers.map(c => (
                        <div
                          key={c.id}
                          className="dropdown-item"
                          id={`cust-opt-${c.id}`}
                          onClick={() => selectCustomer(c)}
                        >
                          <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.65rem' }}>
                            {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.id} · {c.mobile}</div>
                          </div>
                          <span className={`badge ${c.status === 'Active' ? 'badge-success' : 'badge-warning'}`} style={{ marginLeft: 'auto' }}>
                            {c.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedCustomer && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: '0.75rem',
                      background: 'var(--info-bg)',
                      border: '1px solid var(--info)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem 1rem',
                      display: 'flex', gap: '1rem', alignItems: 'center',
                    }}
                  >
                    <div className="avatar" style={{ background: 'var(--info)', fontSize: '0.8rem', width: '38px', height: '38px' }}>
                      {selectedCustomer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: 'var(--info-text)' }}>{selectedCustomer.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--info-text)', opacity: 0.8 }}>
                        {selectedCustomer.id} · {selectedCustomer.mobile} · {selectedCustomer.city}, {selectedCustomer.state}
                      </div>
                    </div>
                    <BadgeCheck size={18} style={{ color: 'var(--info)' }} />
                  </motion.div>
                )}

                <div style={{ marginTop: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Info size={12} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Can't find the customer?{' '}
                    <a href="/customers/create" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                      <UserPlus size={11} style={{ display: 'inline' }} /> Add New Customer
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* ── Section 2: Policy Information ── */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div className="card-header" style={{ paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(11,31,77,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={14} />
                  </span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Policy Information</h3>
                </div>
              </div>
              <div className="card-body" style={{ paddingTop: '0.5rem' }}>
                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Policy Number <span>*</span></label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        id="policy-number"
                        className={`form-input ${errors.policyNumber ? 'error' : ''}`}
                        {...register('policyNumber', { required: 'Required' })}
                      />
                      <button
                        id="btn-regen-polnum"
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setValue('policyNumber', genPolicyNumber())}
                        style={{ flexShrink: 0 }}
                      >
                        ↺
                      </button>
                    </div>
                    {errors.policyNumber && <p className="form-error">{errors.policyNumber.message}</p>}
                    <p className="form-hint">Auto-generated — you may customise</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Insurance Type <span>*</span></label>
                    <select id="insurance-type" className="form-select" {...register('insuranceType', { required: true })}>
                      {INSURANCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Insurance Company <span>*</span></label>
                    <div className="input-icon-wrapper">
                      <Building2 size={14} className="input-icon" />
                      <select id="insurance-company" className="form-select" {...register('insuranceCompany')} style={{ paddingLeft: '2.25rem' }}>
                        {INSURANCE_COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Coverage Amount (₹)</label>
                    <input
                      id="coverage-amount"
                      type="number"
                      className="form-input"
                      placeholder="e.g. 500000"
                      {...register('coverageAmount')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Start Date <span>*</span></label>
                    <div className="input-icon-wrapper">
                      <Calendar size={14} className="input-icon" />
                      <input
                        id="start-date"
                        type="date"
                        className={`form-input ${errors.startDate ? 'error' : ''}`}
                        {...register('startDate', { required: 'Required' })}
                        style={{ paddingLeft: '2.25rem' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Expiry Date <span>*</span></label>
                    <div className="input-icon-wrapper">
                      <Calendar size={14} className="input-icon" />
                      <input
                        id="expiry-date"
                        type="date"
                        className={`form-input ${errors.expiryDate ? 'error' : ''}`}
                        {...register('expiryDate', { required: 'Required' })}
                        style={{ paddingLeft: '2.25rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 3: Premium Information ── */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div className="card-header" style={{ paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>₹</span>
                  </span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Premium Information</h3>
                </div>
              </div>
              <div className="card-body" style={{ paddingTop: '0.5rem' }}>
                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Total Premium (₹) <span>*</span></label>
                    <input
                      id="total-premium"
                      type="number"
                      className={`form-input ${errors.premium ? 'error' : ''}`}
                      placeholder="e.g. 18500"
                      {...register('premium', { required: 'Required', min: { value: 1, message: 'Must be > 0' } })}
                    />
                    {errors.premium && <p className="form-error">{errors.premium.message}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Payment Mode</label>
                    <select id="payment-mode" className="form-select" {...register('paymentMode')}>
                      {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">First Payment (₹)</label>
                    <input
                      id="first-payment"
                      type="number"
                      className="form-input"
                      placeholder="Amount collected"
                      {...register('firstPayment')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Remaining Amount (₹)</label>
                    <input
                      id="remaining-amount"
                      type="number"
                      className="form-input"
                      placeholder="Auto-calculated"
                      readOnly
                      style={{ background: 'var(--bg-secondary)' }}
                      {...register('remainingAmount')}
                    />
                    <p className="form-hint">Auto-calculated from Total − First Payment</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Payment Due Date</label>
                    <input id="payment-due-date" type="date" className="form-input" {...register('paymentDueDate')} />
                  </div>
                </div>

                {watchedValues.premium && watchedValues.firstPayment && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      marginTop: '1rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.875rem 1rem',
                      display: 'flex', gap: '1.5rem',
                    }}
                  >
                    {[
                      { label: 'Total', value: formatRupees(watchedValues.premium), color: 'var(--text-primary)' },
                      { label: 'Collected', value: formatRupees(watchedValues.firstPayment), color: 'var(--success)' },
                      { label: 'Outstanding', value: formatRupees(watchedValues.remainingAmount), color: watchedValues.remainingAmount > 0 ? 'var(--danger)' : 'var(--success)' },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color }}>{value}</div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* ── Section 4: Additional Details ── */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div className="card-header" style={{ paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--warning-bg)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Info size={14} />
                  </span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Additional Details</h3>
                </div>
              </div>
              <div className="card-body" style={{ paddingTop: '0.5rem' }}>
                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Nominee Name</label>
                    <input id="nominee-name" className="form-input" placeholder="Full name" {...register('nomineeName')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nominee Relation</label>
                    <select id="nominee-relation" className="form-select" {...register('nomineeRelation')}>
                      {NOMINEE_RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Agent Name</label>
                    <select id="agent-name" className="form-select" {...register('agentName')}>
                      <option value="">-- Select Agent --</option>
                      {agents.map(a => <option key={a.id} value={a.name}>{a.name} ({a.role})</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label">Internal Notes</label>
                  <textarea
                    id="policy-notes"
                    className="form-textarea"
                    placeholder="Any special conditions, remarks, or notes…"
                    rows={3}
                    {...register('notes')}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'flex-end', paddingBottom: '1.5rem' }}>
              <button
                id="btn-save-draft"
                type="button"
                className="btn btn-outline"
                onClick={onSaveDraft}
                disabled={savingDraft}
              >
                {savingDraft ? (
                  <span className="spinner" style={{ width: '14px', height: '14px' }} />
                ) : (
                  <Save size={15} />
                )}
                {savingDraft ? 'Saving…' : 'Save Draft'}
              </button>
              <button
                id="btn-generate-pdf"
                type="button"
                className="btn btn-gold"
                onClick={onGeneratePDF}
              >
                <FileText size={15} />
                Generate PDF
              </button>
              <button
                id="btn-send-customer"
                type="button"
                className="btn btn-primary"
                onClick={onSendToCustomer}
              >
                <Send size={15} />
                Send to Customer
              </button>
            </div>
          </form>
        </motion.div>

        {/* RIGHT – Live Preview (35%) */}
        <motion.div
          style={{ flex: '0 0 35%', minWidth: 0, position: 'sticky', top: '80px' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Live Preview</h3>
                <span className="badge badge-muted">Draft</span>
              </div>
            </div>
            <div className="card-body">
              {/* Mini policy document */}
              <div
                style={{
                  position: 'relative',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  background: 'var(--surface)',
                  fontSize: '0.78rem',
                }}
              >
                {/* Watermark */}
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none', zIndex: 2,
                }}>
                  <span style={{
                    fontSize: '2.5rem', fontWeight: 900,
                    color: 'rgba(11,31,77,0.06)',
                    transform: 'rotate(-30deg)',
                    letterSpacing: '0.25em',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}>
                    PREVIEW
                  </span>
                </div>

                {/* Header */}
                <div style={{ background: 'var(--primary)', padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '26px', height: '26px', borderRadius: '4px',
                      background: 'var(--gold)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontWeight: 900, color: 'var(--primary)', fontSize: '0.65rem',
                    }}>A</div>
                    <div>
                      <div style={{ color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>ABLE INSURANCE</div>
                      <div style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>Policy Certificate</div>
                    </div>
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.75rem' }}>
                        {watchedValues.policyNumber || 'POL-XXXX-XXX'}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.6rem' }}>Policy No.</div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '0.875rem 1rem' }}>
                  {/* Type badge */}
                  <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className={`badge ${watchedValues.insuranceType === 'Vehicle' ? 'badge-primary' : watchedValues.insuranceType === 'Health' ? 'badge-success' : 'badge-gold'}`}>
                      <TypeIcon type={watchedValues.insuranceType} />
                      {watchedValues.insuranceType} Insurance
                    </span>
                    <span className="badge badge-muted">{watchedValues.insuranceCompany}</span>
                  </div>

                  {/* Customer info */}
                  <div style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px dashed var(--border)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Insured</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {selectedCustomer?.name || '— Customer Name —'}
                    </div>
                    {selectedCustomer && (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                        {selectedCustomer.mobile} · {selectedCustomer.city}
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {[
                      { label: 'Start Date', value: watchedValues.startDate },
                      { label: 'Expiry Date', value: watchedValues.expiryDate },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.6rem' }}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.75rem' }}>
                          {value || '— —'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Premium */}
                  <div style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.25)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gold-dark)', fontWeight: 600 }}>Annual Premium</span>
                    <span style={{ fontWeight: 800, color: 'var(--gold-dark)', fontSize: '0.95rem' }}>
                      {watchedValues.premium ? formatRupees(watchedValues.premium) : '₹ —'}
                    </span>
                  </div>

                  {/* Nominee */}
                  {watchedValues.nomineeName && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Nominee: <strong style={{ color: 'var(--text-primary)' }}>{watchedValues.nomineeName}</strong>
                      {watchedValues.nomineeRelation && ` (${watchedValues.nomineeRelation})`}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderTop: '1px solid var(--border)', fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  This is a preview. Official document requires authorised signature.
                </div>
              </div>

              {/* File name preview */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.375rem', fontWeight: 600 }}>
                  Output File Name
                </div>
                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.5rem 0.875rem',
                  fontFamily: 'monospace',
                  fontSize: '0.72rem',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  wordBreak: 'break-all',
                }}>
                  <FileText size={11} style={{ display: 'inline', marginRight: '0.375rem', verticalAlign: 'middle' }} />
                  {previewFileName}
                </div>
              </div>

              {/* Quick stats */}
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                {[
                  { label: 'Type', value: watchedValues.insuranceType },
                  { label: 'Mode', value: watchedValues.paymentMode },
                  { label: 'Agent', value: watchedValues.agentName?.split(' ')[0] || '—' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value || '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
