import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Mail, Printer, RefreshCw, ZoomIn, ZoomOut,
  FileText, Check, Car, Heart, LifeBuoy, ChevronDown,
  Shield, CheckSquare, Square, Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { customers, policies } from '../data/mockData';

const TEMPLATES = [
  {
    id: 'vehicle',
    label: 'Vehicle Policy',
    icon: <Car size={22} />,
    color: '#0B1F4D',
    bg: 'rgba(11,31,77,0.07)',
    accent: '#0B1F4D',
    desc: 'Motor / comprehensive cover',
  },
  {
    id: 'health',
    label: 'Health Policy',
    icon: <Heart size={22} />,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.07)',
    accent: '#065F46',
    desc: 'Medical & hospitalisation',
  },
  {
    id: 'life',
    label: 'Life Policy',
    icon: <LifeBuoy size={22} />,
    color: '#C9A227',
    bg: 'rgba(201,162,39,0.08)',
    accent: '#a88420',
    desc: 'Term / endowment plan',
  },
];

const SECTIONS = [
  { id: 'customer',  label: 'Customer Details',   icon: '👤' },
  { id: 'vehicle',   label: 'Vehicle / Asset Info', icon: '🚗' },
  { id: 'payment',   label: 'Payment History',     icon: '💳' },
  { id: 'terms',     label: 'Terms & Conditions',  icon: '📋' },
];

const formatRupees = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function PDFGeneration() {
  const [selectedTemplate, setSelectedTemplate] = useState('vehicle');
  const [selectedCustomerId, setSelectedCustomerId] = useState('CLI1001');
  const [selectedPolicyId, setSelectedPolicyId]     = useState('POL-2024-001');
  const [includedSections, setIncludedSections]     = useState({
    customer: true, vehicle: true, payment: true, terms: true,
  });
  const [zoom, setZoom]         = useState(100);
  const [toast, setToast]       = useState(null);
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef(null);

  const customer = customers.find(c => c.id === selectedCustomerId) || customers[0];
  const policy   = policies.find(p => p.id === selectedPolicyId) || policies[0];
  const template = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  const fileName = `${customer.id}_${policy.id}_${customer.name.split(' ')[0].toUpperCase()}_${policy.type.toUpperCase()}.pdf`;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleSection = (id) =>
    setIncludedSections(prev => ({ ...prev, [id]: !prev[id] }));

  const handleDownload = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      showToast(`✅  ${fileName} downloaded successfully!`, 'success');
    }, 1800);
  };

  const handleEmail = () => showToast(`📧  Document emailed to ${customer.email}`, 'info');
  const handlePrint  = () => {
    if (previewRef.current) window.print();
    showToast('🖨️  Sent to printer', 'success');
  };
  const handleRegen  = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); showToast('Document regenerated successfully', 'success'); }, 1200);
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            style={{
              position: 'fixed', top: '80px', right: '24px',
              zIndex: 'var(--z-toast)',
              background: toast.type === 'info' ? 'var(--info)' : 'var(--success)',
              color: 'white', padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
              fontWeight: 600, fontSize: '0.875rem', minWidth: '280px',
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Generate Policy Document</h1>
          <p className="page-subtitle">Select template, configure options, and generate a professional PDF</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="badge badge-success" style={{ padding: '0.35rem 0.875rem', fontSize: '0.78rem' }}>
            <Check size={12} /> Ready to Generate
          </span>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* LEFT – Controls (40%) */}
        <motion.div
          style={{ flex: '0 0 40%', minWidth: 0 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >

          {/* Template Selector */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div className="card-header">
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={16} style={{ color: 'var(--primary)' }} />
                Select Template
              </h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {TEMPLATES.map((tpl) => {
                  const isActive = selectedTemplate === tpl.id;
                  return (
                    <motion.button
                      key={tpl.id}
                      id={`tpl-${tpl.id}`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.875rem',
                        padding: '0.875rem 1rem',
                        borderRadius: 'var(--radius)',
                        border: isActive ? `2px solid var(--gold)` : '2px solid var(--border)',
                        background: isActive ? 'rgba(201,162,39,0.06)' : 'var(--surface)',
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'all 0.2s',
                        boxShadow: isActive ? 'var(--shadow-gold)' : 'none',
                      }}
                    >
                      <div style={{
                        width: '44px', height: '44px', borderRadius: 'var(--radius-sm)',
                        background: tpl.bg, color: tpl.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        border: isActive ? `1px solid ${tpl.color}30` : 'none',
                      }}>
                        {tpl.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{tpl.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tpl.desc}</div>
                      </div>
                      {isActive && (
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '50%',
                          background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Check size={12} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div className="card-header">
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} style={{ color: 'var(--primary)' }} />
                Document Settings
              </h3>
            </div>
            <div className="card-body">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Select Customer</label>
                <select
                  id="pdf-customer-select"
                  className="form-select"
                  value={selectedCustomerId}
                  onChange={e => {
                    setSelectedCustomerId(e.target.value);
                    const pol = policies.find(p => p.customerId === e.target.value);
                    if (pol) setSelectedPolicyId(pol.id);
                  }}
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Select Policy</label>
                <select
                  id="pdf-policy-select"
                  className="form-select"
                  value={selectedPolicyId}
                  onChange={e => setSelectedPolicyId(e.target.value)}
                >
                  {policies
                    .filter(p => p.customerId === selectedCustomerId)
                    .map(p => (
                      <option key={p.id} value={p.id}>{p.id} — {p.type}</option>
                    ))}
                </select>
              </div>

              {/* Include Sections */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div className="section-title" style={{ marginBottom: '0.5rem' }}>Include Sections</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {SECTIONS.map(sec => (
                    <label
                      key={sec.id}
                      id={`sec-${sec.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.625rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        background: includedSections[sec.id] ? 'rgba(11,31,77,0.04)' : 'var(--surface)',
                        transition: 'all 0.15s',
                        userSelect: 'none',
                      }}
                      onClick={() => toggleSection(sec.id)}
                    >
                      {includedSections[sec.id]
                        ? <CheckSquare size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        : <Square size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                      <span style={{ fontSize: '0.75rem' }}>{sec.icon}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: includedSections[sec.id] ? 600 : 400, color: 'var(--text-primary)' }}>
                        {sec.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* File Name */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div className="card-body">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Output File
              </div>
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.625rem 0.875rem',
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                color: 'var(--primary)',
                fontWeight: 700,
                wordBreak: 'break-all',
                letterSpacing: '-0.01em',
              }}>
                <FileText size={11} style={{ display: 'inline', marginRight: '0.375rem', verticalAlign: 'middle' }} />
                {fileName}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                Format: PDF · Est. size: ~245 KB
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <button
              id="btn-download-pdf"
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
              onClick={handleDownload}
              disabled={generating}
            >
              {generating ? (
                <span className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'var(--primary)' }} />
              ) : (
                <Download size={16} />
              )}
              {generating ? 'Generating PDF…' : 'Download PDF'}
            </button>

            <button
              id="btn-email-customer"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleEmail}
            >
              <Mail size={15} />
              Email to Customer
            </button>

            <div style={{ display: 'flex', gap: '0.625rem' }}>
              <button
                id="btn-print"
                className="btn btn-outline"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handlePrint}
              >
                <Printer size={15} />
                Print
              </button>
              <button
                id="btn-regenerate"
                className="btn btn-ghost"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleRegen}
                disabled={generating}
              >
                <RefreshCw size={15} className={generating ? 'animate-spin' : ''} />
                Regenerate
              </button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT – Preview (60%) */}
        <motion.div
          style={{ flex: '0 0 60%', minWidth: 0 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {/* Zoom Controls */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-muted">
                <Eye size={11} /> Document Preview
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Template: <strong style={{ color: 'var(--text-primary)' }}>{template.label}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <button
                id="btn-zoom-out"
                className="btn btn-outline btn-sm btn-icon"
                onClick={() => setZoom(z => Math.max(60, z - 10))}
                disabled={zoom <= 60}
              >
                <ZoomOut size={14} />
              </button>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', minWidth: '40px', textAlign: 'center' }}>
                {zoom}%
              </span>
              <button
                id="btn-zoom-in"
                className="btn btn-outline btn-sm btn-icon"
                onClick={() => setZoom(z => Math.min(150, z + 10))}
                disabled={zoom >= 150}
              >
                <ZoomIn size={14} />
              </button>
            </div>
          </div>

          {/* Document Preview */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--border)',
              overflow: 'auto',
              maxHeight: '82vh',
            }}
          >
            <motion.div
              ref={previewRef}
              key={selectedTemplate + selectedPolicyId}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                width: zoom < 100 ? `${10000 / zoom}%` : '100%',
                position: 'relative',
              }}
            >
              {/* The actual document */}
              <div style={{
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
                overflow: 'hidden',
                position: 'relative',
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                color: '#1a1a2e',
              }}>

                {/* PREVIEW watermark */}
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none', zIndex: 2,
                }}>
                  <span style={{
                    fontSize: '5rem', fontWeight: 900,
                    color: 'rgba(11,31,77,0.04)',
                    transform: 'rotate(-35deg)',
                    letterSpacing: '0.3em',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}>
                    PREVIEW
                  </span>
                </div>

                {/* Document Header */}
                <div style={{
                  background: template.id === 'health' ? 'linear-gradient(135deg, #065F46 0%, #10B981 100%)'
                    : template.id === 'life'   ? 'linear-gradient(135deg, #a88420 0%, #C9A227 100%)'
                    : 'linear-gradient(135deg, #07163a 0%, #0B1F4D 60%, #1a3a7a 100%)',
                  padding: '2rem 2.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* BG pattern */}
                  <div style={{
                    position: 'absolute', inset: 0, opacity: 0.05,
                    backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
                    backgroundSize: '20px 20px',
                  }} />

                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    {/* Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '8px',
                        background: '#C9A227', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 900, color: '#0B1F4D', fontSize: '1.25rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      }}>A</div>
                      <div>
                        <div style={{ color: 'white', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
                          ABLE INSURANCE
                        </div>
                        <div style={{ color: '#C9A227', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                          {template.label} Certificate
                        </div>
                      </div>
                    </div>
                    {/* Policy Meta */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#C9A227', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.02em' }}>
                        {policy.id}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', marginTop: '2px' }}>Policy Number</div>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        {policy.insurer}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem' }}>Insurer</div>
                    </div>
                  </div>

                  {/* Policy validity strip */}
                  <div style={{
                    marginTop: '1.5rem', display: 'flex', gap: '2rem',
                    background: 'rgba(255,255,255,0.1)', borderRadius: '6px',
                    padding: '0.625rem 1rem', backdropFilter: 'blur(8px)',
                  }}>
                    {[
                      { label: 'Policy Period', value: `${policy.startDate} to ${policy.expiryDate}` },
                      { label: 'Type',           value: policy.type },
                      { label: 'Premium',        value: formatRupees(policy.premium) },
                      { label: 'Status',         value: policy.status },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {label}
                        </div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', marginTop: '1px' }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Document Body */}
                <div style={{ padding: '2rem 2.5rem' }}>

                  {/* Customer Details */}
                  {includedSections.customer && (
                    <div style={{ marginBottom: '1.75rem' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        marginBottom: '0.875rem',
                      }}>
                        <div style={{
                          width: '3px', height: '18px', background: '#C9A227', borderRadius: '2px',
                        }} />
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0B1F4D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Customer Information
                        </h4>
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                        <tbody>
                          {[
                            { label: 'Insured Name',    value: customer.name },
                            { label: 'Customer ID',     value: customer.id },
                            { label: 'Mobile Number',   value: customer.mobile },
                            { label: 'Email Address',   value: customer.email },
                            { label: 'City / State',    value: `${customer.city}, ${customer.state}` },
                          ].map(({ label, value }, i) => (
                            <tr key={label} style={{ background: i % 2 === 0 ? '#F8FAFC' : 'white' }}>
                              <td style={{ padding: '0.5rem 0.875rem', fontWeight: 600, color: '#64748B', width: '38%', borderBottom: '1px solid #E2E8F0' }}>
                                {label}
                              </td>
                              <td style={{ padding: '0.5rem 0.875rem', color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>
                                {value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Policy Details */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                      <div style={{ width: '3px', height: '18px', background: '#C9A227', borderRadius: '2px' }} />
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0B1F4D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Policy Details
                      </h4>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <tbody>
                        {[
                          { label: 'Policy Number',     value: policy.id },
                          { label: 'Insurance Type',    value: policy.type },
                          { label: 'Insurance Company', value: policy.insurer },
                          { label: 'Start Date',        value: policy.startDate },
                          { label: 'Expiry Date',       value: policy.expiryDate },
                          ...(policy.vehicle ? [{ label: 'Vehicle Number', value: policy.vehicle }] : []),
                          { label: 'Policy Status',     value: policy.status },
                        ].map(({ label, value }, i) => (
                          <tr key={label} style={{ background: i % 2 === 0 ? '#F8FAFC' : 'white' }}>
                            <td style={{ padding: '0.5rem 0.875rem', fontWeight: 600, color: '#64748B', width: '38%', borderBottom: '1px solid #E2E8F0' }}>
                              {label}
                            </td>
                            <td style={{ padding: '0.5rem 0.875rem', color: '#0F172A', borderBottom: '1px solid #E2E8F0', fontWeight: label === 'Policy Number' ? 700 : 400 }}>
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Vehicle/Asset Info */}
                  {includedSections.vehicle && policy.vehicle && (
                    <div style={{ marginBottom: '1.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                        <div style={{ width: '3px', height: '18px', background: '#C9A227', borderRadius: '2px' }} />
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0B1F4D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Vehicle Information
                        </h4>
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                        <tbody>
                          {[
                            { label: 'Registration No.', value: policy.vehicle },
                            { label: 'Cover Type',       value: 'Comprehensive' },
                            { label: 'IDV',              value: '₹5,00,000' },
                            { label: 'NCB',              value: '20%' },
                          ].map(({ label, value }, i) => (
                            <tr key={label} style={{ background: i % 2 === 0 ? '#F8FAFC' : 'white' }}>
                              <td style={{ padding: '0.5rem 0.875rem', fontWeight: 600, color: '#64748B', width: '38%', borderBottom: '1px solid #E2E8F0' }}>
                                {label}
                              </td>
                              <td style={{ padding: '0.5rem 0.875rem', color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>
                                {value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Premium Breakdown */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                      <div style={{ width: '3px', height: '18px', background: '#C9A227', borderRadius: '2px' }} />
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0B1F4D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Premium Breakdown
                      </h4>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ background: '#0B1F4D' }}>
                          <th style={{ padding: '0.625rem 0.875rem', color: 'white', fontWeight: 700, textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Component
                          </th>
                          <th style={{ padding: '0.625rem 0.875rem', color: '#C9A227', fontWeight: 700, textAlign: 'right', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Amount (₹)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { label: 'Base Premium',   amount: Math.round(policy.premium * 0.7) },
                          { label: 'Add-on Covers',  amount: Math.round(policy.premium * 0.15) },
                          { label: 'GST @ 18%',      amount: Math.round(policy.premium * 0.15) },
                        ].map(({ label, amount }, i) => (
                          <tr key={label} style={{ background: i % 2 === 0 ? '#F8FAFC' : 'white' }}>
                            <td style={{ padding: '0.5rem 0.875rem', color: '#475569', borderBottom: '1px solid #E2E8F0' }}>{label}</td>
                            <td style={{ padding: '0.5rem 0.875rem', textAlign: 'right', color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>
                              {formatRupees(amount)}
                            </td>
                          </tr>
                        ))}
                        <tr style={{ background: '#0B1F4D' }}>
                          <td style={{ padding: '0.625rem 0.875rem', color: 'white', fontWeight: 800, fontSize: '0.875rem' }}>
                            Total Premium
                          </td>
                          <td style={{ padding: '0.625rem 0.875rem', textAlign: 'right', color: '#C9A227', fontWeight: 900, fontSize: '1rem' }}>
                            {formatRupees(policy.premium)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Payment History */}
                  {includedSections.payment && (
                    <div style={{ marginBottom: '1.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                        <div style={{ width: '3px', height: '18px', background: '#C9A227', borderRadius: '2px' }} />
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0B1F4D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Payment History
                        </h4>
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                        <thead>
                          <tr style={{ background: '#F1F5F9' }}>
                            {['Date', 'Mode', 'Reference', 'Amount', 'Status'].map(h => (
                              <th key={h} style={{ padding: '0.5rem 0.875rem', color: '#475569', fontWeight: 700, textAlign: 'left', fontSize: '0.72rem', borderBottom: '2px solid #E2E8F0' }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ padding: '0.5rem 0.875rem', borderBottom: '1px solid #E2E8F0' }}>{policy.startDate}</td>
                            <td style={{ padding: '0.5rem 0.875rem', borderBottom: '1px solid #E2E8F0' }}>Online / UPI</td>
                            <td style={{ padding: '0.5rem 0.875rem', borderBottom: '1px solid #E2E8F0', fontFamily: 'monospace', fontSize: '0.75rem' }}>TXN20240{policy.id.slice(-3)}</td>
                            <td style={{ padding: '0.5rem 0.875rem', borderBottom: '1px solid #E2E8F0', fontWeight: 700 }}>{formatRupees(policy.premium)}</td>
                            <td style={{ padding: '0.5rem 0.875rem', borderBottom: '1px solid #E2E8F0' }}>
                              <span style={{ background: '#ECFDF5', color: '#065F46', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700 }}>
                                Paid
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Terms & Conditions */}
                  {includedSections.terms && (
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                        <div style={{ width: '3px', height: '18px', background: '#C9A227', borderRadius: '2px' }} />
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0B1F4D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Terms & Conditions
                        </h4>
                      </div>
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '1rem', fontSize: '0.75rem', color: '#64748B', lineHeight: '1.7' }}>
                        <p>1. This policy is subject to the terms, conditions, exclusions, and limitations stated herein and in the policy schedule.</p>
                        <p style={{ marginTop: '0.5rem' }}>2. Any claim under this policy must be reported to Able Insurance within 48 hours of the incident.</p>
                        <p style={{ marginTop: '0.5rem' }}>3. The premium is non-refundable after the 15-day free-look period unless cancelled by the insurer.</p>
                        <p style={{ marginTop: '0.5rem' }}>4. Disputes arising from this policy shall be subject to the jurisdiction of courts in Ahmedabad, Gujarat.</p>
                        <p style={{ marginTop: '0.5rem' }}>5. This document is computer-generated and does not require a physical signature. Digital signature is embedded.</p>
                      </div>
                    </div>
                  )}

                  {/* Signature Lines */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                    {[
                      { label: 'Insured Signature', sub: customer.name },
                      { label: 'Agent Signature',   sub: 'Harsidh Panseriya' },
                      { label: 'Authorised Signatory', sub: 'Able Insurance' },
                    ].map(({ label, sub }) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{ borderBottom: '2px solid #CBD5E1', marginBottom: '0.375rem', height: '40px' }} />
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0B1F4D' }}>{label}</div>
                        <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>{sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Document Footer */}
                <div style={{
                  background: '#0B1F4D', padding: '0.875rem 2.5rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>
                    Generated by Able Insurance Management System · {format(new Date(), 'dd MMM yyyy, hh:mm a')}
                  </div>
                  <div style={{ color: '#C9A227', fontSize: '0.65rem', fontWeight: 700 }}>
                    {fileName}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
