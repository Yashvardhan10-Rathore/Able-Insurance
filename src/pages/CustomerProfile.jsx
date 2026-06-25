import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, FileText, Mail, RefreshCw, User, Phone,
  MapPin, Calendar, Car, Heart, Shield, CreditCard,
  Download, Plus, Clock, CheckCircle, AlertTriangle,
  Edit2, MessageSquare, PaperclipIcon, ChevronRight,
  Banknote, Activity,
} from 'lucide-react';
import { format, differenceInDays, isPast } from 'date-fns';
import toast from 'react-hot-toast';
import { customers, policies, payments, documents } from '../data/mockData';

/* ── helpers ─────────────────────────────────────────────── */
const getInitials = (name) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const avatarColors = [
  'linear-gradient(135deg,#0B1F4D,#2952a3)',
  'linear-gradient(135deg,#065F46,#10B981)',
  'linear-gradient(135deg,#92400E,#C9A227)',
  'linear-gradient(135deg,#1E40AF,#3B82F6)',
  'linear-gradient(135deg,#6D28D9,#8B5CF6)',
  'linear-gradient(135deg,#9D174D,#EC4899)',
];
const getAvatarColor = (id) =>
  avatarColors[parseInt(id.replace(/\D/g, ''), 10) % avatarColors.length];

const getStatusClass = (s) =>
  ({ Active: 'badge-success', Expiring: 'badge-warning', Expired: 'badge-danger' }[s] ?? 'badge-muted');

const getPolicyIcon = (type) =>
  ({ Vehicle: Car, Health: Heart, Life: Shield }[type] ?? Shield);

/* ── Static extended data for demo purposes ─────────────── */
const extendedCustomers = {
  CLI1001: {
    dob: '1988-03-15', gender: 'Male', occupation: 'Business Owner',
    altMobile: '9876543299', address: '24, Nehru Park, Satellite',
    city: 'Ahmedabad', state: 'Gujarat', pincode: '380015',
    memberSince: '2023-04-12',
    notes: [
      { id: 'N1', text: 'Prefers calls after 6 PM.', date: '2026-06-10', author: 'Harsidh Panseriya' },
      { id: 'N2', text: 'Vehicle has additional CNG kit — update in policy.', date: '2026-05-28', author: 'Priya Menon' },
    ],
    timeline: [
      { id: 'T1', event: 'Policy renewed for FY 2025–26', date: '2025-07-15', type: 'success' },
      { id: 'T2', event: 'Payment of ₹18,500 received', date: '2025-07-15', type: 'success' },
      { id: 'T3', event: 'Renewal reminder sent via WhatsApp', date: '2026-06-20', type: 'info' },
      { id: 'T4', event: 'Vehicle inspection completed', date: '2025-07-14', type: 'info' },
      { id: 'T5', event: 'Customer profile created', date: '2023-04-12', type: 'info' },
    ],
    vehicle: { number: 'GJ05AB1234', make: 'Maruti Suzuki', model: 'Swift Dzire', year: '2020', variant: 'ZXi AMT', chassis: 'MA3FJEB1S01234567', engine: 'K12M1234567', color: 'Arctic White' },
  },
};

const getExtended = (id) => extendedCustomers[id] ?? {
  dob: '1990-06-15', gender: 'Male', occupation: 'Professional',
  altMobile: 'N/A', address: '10, Sample Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001',
  memberSince: '2023-01-01',
  notes: [{ id: 'N1', text: 'Long-term customer.', date: '2026-01-01', author: 'Admin' }],
  timeline: [
    { id: 'T1', event: 'Policy issued', date: '2025-01-01', type: 'success' },
    { id: 'T2', event: 'Payment received', date: '2025-01-01', type: 'success' },
    { id: 'T3', event: 'Customer profile created', date: '2023-01-01', type: 'info' },
  ],
  vehicle: null,
};

const TABS = ['Personal Info', 'Policy Info', 'Vehicle Info', 'Payment History', 'Documents', 'Notes'];

/* ── InfoField ───────────────────────────────────────────── */
function InfoField({ label, value, mono = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: mono ? 'monospace' : 'inherit', fontWeight: value === 'N/A' ? 400 : 500 }}>
        {value || 'N/A'}
      </span>
    </div>
  );
}

/* ── CountdownBadge ──────────────────────────────────────── */
function CountdownBadge({ renewalDate, status }) {
  const days = differenceInDays(new Date(renewalDate), new Date());
  if (status === 'Expired') return (
    <div style={{ background: 'var(--danger-bg)', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
      <XCircleIcon size={20} color="var(--danger)" style={{ margin: '0 auto 6px' }} />
      <div style={{ color: 'var(--danger-text)', fontWeight: 700, fontSize: '0.9rem' }}>Policy Expired</div>
      <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>
        on {format(new Date(renewalDate), 'dd MMM yyyy')}
      </div>
    </div>
  );
  if (days <= 30) return (
    <div style={{ background: 'var(--warning-bg)', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
      <AlertTriangle size={20} color="var(--warning)" style={{ margin: '0 auto 6px' }} />
      <div style={{ color: 'var(--warning-text)', fontWeight: 700, fontSize: '1.5rem' }}>{days}</div>
      <div style={{ color: 'var(--warning-text)', fontSize: '0.78rem' }}>days until renewal</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 4 }}>
        Due {format(new Date(renewalDate), 'dd MMM yyyy')}
      </div>
    </div>
  );
  return (
    <div style={{ background: 'var(--success-bg)', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
      <CheckCircle size={20} color="var(--success)" style={{ margin: '0 auto 6px' }} />
      <div style={{ color: 'var(--success-text)', fontWeight: 700, fontSize: '1.5rem' }}>{days}</div>
      <div style={{ color: 'var(--success-text)', fontSize: '0.78rem' }}>days to renewal</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 4 }}>
        Due {format(new Date(renewalDate), 'dd MMM yyyy')}
      </div>
    </div>
  );
}
function XCircleIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke={props.color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={props.style}>
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [newNote, setNewNote] = useState('');
  const [notesState, setNotesState] = useState(null);

  const customer = useMemo(
    () => customers.find((c) => c.id === id) ?? customers[0],
    [id]
  );
  const ext = useMemo(() => getExtended(customer.id), [customer.id]);
  const notes = notesState ?? ext.notes;

  const policy = useMemo(
    () => policies.find((p) => p.customerId === customer.id) ?? policies[0],
    [customer.id]
  );
  const customerPayments = useMemo(
    () => payments.filter((p) => p.customer === customer.name),
    [customer.name]
  );
  const customerDocs = useMemo(
    () => documents.filter((d) => d.customer === customer.name),
    [customer.name]
  );

  const PolicyIcon = getPolicyIcon(customer.policyType);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotesState([
      { id: `N${Date.now()}`, text: newNote.trim(), date: format(new Date(), 'yyyy-MM-dd'), author: 'Harsidh Panseriya' },
      ...notes,
    ]);
    setNewNote('');
    toast.success('Note added');
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* ── Back ──────────────────────────────────────── */}
      <button
        id="back-btn"
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '1rem' }}
        onClick={() => navigate('/customers')}
      >
        <ArrowLeft size={16} /> Back to Customers
      </button>

      {/* ── Profile Header Card ──────────────────────── */}
      <motion.div
        className="card"
        style={{ marginBottom: '1.25rem', padding: '1.5rem' }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: getAvatarColor(customer.id),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '1.5rem', fontWeight: 800,
              boxShadow: '0 4px 16px rgba(11,31,77,0.25)', flexShrink: 0,
            }}>
              {getInitials(customer.name)}
            </div>
            {/* Info */}
            <div>
              <div className="flex items-center gap-3" style={{ flexWrap: 'wrap', marginBottom: 4 }}>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 800 }}>{customer.name}</h2>
                <span className={`badge ${getStatusClass(customer.status)}`}>{customer.status}</span>
                <span className={`badge ${customer.policyType === 'Vehicle' ? 'badge-primary' : customer.policyType === 'Health' ? 'badge-gold' : 'badge-info'}`}>
                  <PolicyIcon size={11} /> {customer.policyType}
                </span>
              </div>
              <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ fontFamily: 'monospace', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4 }}>{customer.id}</span>
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {ext.city}, {ext.state}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />
                  Member since {format(new Date(ext.memberSince), 'MMMM yyyy')}
                </span>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <button id="gen-policy-btn" className="btn btn-outline btn-sm" onClick={() => toast.success('Generating PDF…')}>
              <FileText size={15} /> Generate PDF
            </button>
            <button id="send-email-btn" className="btn btn-outline btn-sm" onClick={() => toast.success(`Email sent to ${customer.email}`)}>
              <Mail size={15} /> Send Email
            </button>
            <button id="renew-policy-btn" className="btn btn-gold btn-sm" onClick={() => toast.success('Renewal process started')}>
              <RefreshCw size={15} /> Renew Policy
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Main Layout ──────────────────────────────── */}
      <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>

        {/* ── LEFT: Tabs (70%) ───────────────────────── */}
        <motion.div
          style={{ flex: '0 0 68%', minWidth: 0 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <div className="card">
            {/* Tab Nav */}
            <div style={{ padding: '0 1.25rem' }}>
              <div className="tabs" style={{ marginBottom: 0, overflowX: 'auto' }}>
                {TABS.map((tab, i) => (
                  <button
                    key={tab}
                    id={`tab-${i}`}
                    className={`tab-btn ${activeTab === i ? 'active' : ''}`}
                    onClick={() => setActiveTab(i)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ padding: '1.5rem' }}
              >
                {/* ── Tab 0: Personal Info ──────────────── */}
                {activeTab === 0 && (
                  <div>
                    <div className="section-title">Personal Information</div>
                    <div className="grid grid-2 gap-4" style={{ marginBottom: '1.5rem' }}>
                      <InfoField label="Full Name" value={customer.name} />
                      <InfoField label="Date of Birth" value={ext.dob ? format(new Date(ext.dob), 'dd MMMM yyyy') : 'N/A'} />
                      <InfoField label="Gender" value={ext.gender} />
                      <InfoField label="Occupation" value={ext.occupation} />
                      <InfoField label="Mobile" value={customer.mobile} mono />
                      <InfoField label="Alternate Mobile" value={ext.altMobile} mono />
                      <InfoField label="Email" value={customer.email} />
                      <InfoField label="Address" value={ext.address} />
                      <InfoField label="City" value={ext.city} />
                      <InfoField label="State" value={ext.state} />
                      <InfoField label="Pincode" value={ext.pincode} mono />
                    </div>
                  </div>
                )}

                {/* ── Tab 1: Policy Info ────────────────── */}
                {activeTab === 1 && (
                  <div>
                    <div className="section-title">Policy Details</div>
                    <div className="grid grid-2 gap-4">
                      <InfoField label="Policy Number" value={policy.id} mono />
                      <InfoField label="Policy Type" value={policy.type} />
                      <InfoField label="Insurance Company" value={policy.insurer} />
                      <InfoField label="Start Date" value={format(new Date(policy.startDate), 'dd MMM yyyy')} />
                      <InfoField label="Expiry Date" value={format(new Date(policy.expiryDate), 'dd MMM yyyy')} />
                      <InfoField label="Annual Premium" value={`₹${policy.premium.toLocaleString('en-IN')}`} />
                      <InfoField label="Payment Mode" value="Annual" />
                      <InfoField label="Status" value={policy.status} />
                    </div>
                  </div>
                )}

                {/* ── Tab 2: Vehicle Info ───────────────── */}
                {activeTab === 2 && (
                  <div>
                    <div className="section-title">Vehicle Information</div>
                    {customer.policyType !== 'Vehicle' ? (
                      <div className="empty-state" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                        <div className="empty-state-icon"><Car size={28} /></div>
                        <h3>Not Applicable</h3>
                        <p>Vehicle information is only available for Vehicle insurance policies.</p>
                      </div>
                    ) : (
                      <div className="grid grid-2 gap-4">
                        <InfoField label="Vehicle Number" value={ext.vehicle?.number ?? customer.vehicle} mono />
                        <InfoField label="Make" value={ext.vehicle?.make ?? 'N/A'} />
                        <InfoField label="Model" value={ext.vehicle?.model ?? 'N/A'} />
                        <InfoField label="Year" value={ext.vehicle?.year ?? 'N/A'} />
                        <InfoField label="Variant" value={ext.vehicle?.variant ?? 'N/A'} />
                        <InfoField label="Color" value={ext.vehicle?.color ?? 'N/A'} />
                        <InfoField label="Chassis No." value={ext.vehicle?.chassis ?? 'N/A'} mono />
                        <InfoField label="Engine No." value={ext.vehicle?.engine ?? 'N/A'} mono />
                      </div>
                    )}
                  </div>
                )}

                {/* ── Tab 3: Payment History ────────────── */}
                {activeTab === 3 && (
                  <div>
                    <div className="section-title">Payment History</div>
                    {customerPayments.length === 0 ? (
                      <div className="empty-state" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                        <div className="empty-state-icon"><Banknote size={28} /></div>
                        <h3>No payment records</h3>
                      </div>
                    ) : (
                      <div className="table-wrapper">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Policy</th>
                              <th>Premium</th>
                              <th>Paid</th>
                              <th>Pending</th>
                              <th>Due Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customerPayments.map((p) => (
                              <tr key={p.id}>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.id}</td>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.policy}</td>
                                <td>₹{p.premium.toLocaleString('en-IN')}</td>
                                <td style={{ color: 'var(--success-text)', fontWeight: 600 }}>₹{p.paid.toLocaleString('en-IN')}</td>
                                <td style={{ color: p.pending > 0 ? 'var(--danger-text)' : 'var(--text-muted)' }}>₹{p.pending.toLocaleString('en-IN')}</td>
                                <td>{format(new Date(p.dueDate), 'dd MMM yyyy')}</td>
                                <td>
                                  <span className={`badge ${p.status === 'Paid' ? 'badge-success' : p.status === 'Partial' ? 'badge-warning' : 'badge-danger'}`}>
                                    {p.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Tab 4: Documents ─────────────────── */}
                {activeTab === 4 && (
                  <div>
                    <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                      <div className="section-title" style={{ marginBottom: 0 }}>Documents</div>
                      <button id="upload-doc-btn" className="btn btn-outline btn-sm" onClick={() => toast.success('Upload dialog coming soon')}>
                        <Plus size={14} /> Upload
                      </button>
                    </div>
                    {customerDocs.length === 0 ? (
                      <div className="empty-state" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                        <div className="empty-state-icon"><PaperclipIcon size={28} /></div>
                        <h3>No documents</h3>
                        <p>Upload documents related to this customer's policy.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {customerDocs.map((doc) => (
                          <div
                            key={doc.id}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '0.875rem 1rem', border: '1px solid var(--border)',
                              borderRadius: 8, background: 'var(--bg)', transition: 'var(--transition)',
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div style={{
                                width: 36, height: 36, borderRadius: 6,
                                background: 'rgba(11,31,77,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <FileText size={18} color="var(--primary)" />
                              </div>
                              <div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{doc.name}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                  {doc.category} · {doc.size} · {format(new Date(doc.uploadDate), 'dd MMM yyyy')}
                                </div>
                              </div>
                            </div>
                            <button
                              id={`download-doc-${doc.id}`}
                              className="btn btn-outline btn-sm btn-icon"
                              onClick={() => toast.success(`Downloading ${doc.name}`)}
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Tab 5: Notes ─────────────────────── */}
                {activeTab === 5 && (
                  <div>
                    <div className="section-title">Notes</div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <textarea
                        id="new-note-input"
                        className="form-textarea"
                        style={{ minHeight: 80, marginBottom: '0.625rem', resize: 'vertical' }}
                        placeholder="Add a note about this customer…"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <button id="add-note-btn" className="btn btn-primary btn-sm" onClick={handleAddNote}>
                        <Plus size={14} /> Add Note
                      </button>
                    </div>
                    <div className="divider" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          style={{
                            padding: '0.875rem 1rem', background: 'var(--bg)',
                            border: '1px solid var(--border)', borderRadius: 8,
                            borderLeft: '3px solid var(--primary-lighter)',
                          }}
                        >
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 6 }}>{note.text}</p>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            <strong>{note.author}</strong> · {format(new Date(note.date), 'dd MMM yyyy')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── RIGHT: Sidebar (30%) ───────────────────── */}
        <motion.div
          style={{ flex: '0 0 30%', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          {/* Policy Status Card */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>
              Policy Status
            </div>
            <CountdownBadge renewalDate={customer.renewalDate} status={customer.status} />
            <div className="divider" style={{ margin: '0.875rem 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { label: 'Policy No.', value: policy.id },
                { label: 'Insurer', value: policy.insurer },
                { label: 'Premium', value: `₹${policy.premium.toLocaleString('en-IN')}` },
                { label: 'Sum Assured', value: `₹${(policy.premium * 10).toLocaleString('en-IN')}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: 'monospace' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>
              Quick Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { id: 'qa-edit', icon: Edit2, label: 'Edit Customer', action: () => toast.success('Opening editor…') },
                { id: 'qa-sms', icon: MessageSquare, label: 'Send SMS Reminder', action: () => toast.success(`SMS sent to ${customer.mobile}`) },
                { id: 'qa-pdf', icon: FileText, label: 'Download Policy PDF', action: () => toast.success('Downloading PDF…') },
                { id: 'qa-payment', icon: CreditCard, label: 'Record Payment', action: () => toast.success('Opening payment form…') },
              ].map(({ id, icon: Icon, label, action }) => (
                <button
                  key={id}
                  id={id}
                  className="btn btn-outline btn-sm"
                  style={{ justifyContent: 'flex-start' }}
                  onClick={action}
                >
                  <Icon size={14} /> {label}
                  <ChevronRight size={13} style={{ marginLeft: 'auto' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Recent Activity
            </div>
            <div className="timeline">
              {ext.timeline.slice(0, 6).map((item) => (
                <div key={item.id} className="timeline-item">
                  <div
                    className="timeline-dot"
                    style={{
                      background: item.type === 'success' ? 'var(--success)' : item.type === 'warning' ? 'var(--warning)' : 'var(--primary-lighter)',
                    }}
                  />
                  <div className="timeline-content">{item.event}</div>
                  <div className="timeline-date">{format(new Date(item.date), 'dd MMM yyyy')}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
