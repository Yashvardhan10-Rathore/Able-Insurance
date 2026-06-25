import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload, CloudUpload, FileText, CheckCircle, AlertCircle,
  Pencil, Save, X, Sparkles, RefreshCw, ThumbsUp, Trash2,
  ShieldCheck, Zap, Database, ScanLine, Brain, Check, Loader2,
} from 'lucide-react';

/* ─── Types & constants ──────────────────────────────────────── */
// State machine: idle → uploading → processing → extracted → saved
const STATES = { IDLE: 'idle', UPLOADING: 'uploading', PROCESSING: 'processing', EXTRACTED: 'extracted', SAVED: 'saved' };

const WORKFLOW_STEPS = [
  { id: 1, label: 'Upload PDF',        icon: Upload,    description: 'File transfer complete' },
  { id: 2, label: 'OCR Processing',    icon: ScanLine,  description: 'Text extraction done' },
  { id: 3, label: 'AI Extraction',     icon: Brain,     description: 'Data fields identified' },
  { id: 4, label: 'Data Verification', icon: ShieldCheck,description: 'Confidence verified' },
  { id: 5, label: 'Save To Database',  icon: Database,  description: 'Ready to save' },
];

const EXTRACTED_FIELDS = [
  { key: 'customerName',   label: 'Customer Name',      value: 'Rajesh Kumar',         confidence: 97, editable: true },
  { key: 'policyNumber',   label: 'Policy Number',      value: 'POL-GJ-2024-7891',     confidence: 99, editable: true },
  { key: 'vehicleNumber',  label: 'Vehicle Number',     value: 'GJ06MN2345',           confidence: 91, editable: true },
  { key: 'insurer',        label: 'Insurance Company',  value: 'HDFC ERGO',            confidence: 98, editable: true },
  { key: 'premium',        label: 'Premium Amount',     value: '₹21,500',              confidence: 95, editable: true },
  { key: 'startDate',      label: 'Start Date',         value: '15 Jul 2025',          confidence: 88, editable: true },
  { key: 'expiryDate',     label: 'Expiry Date',        value: '14 Jul 2026',          confidence: 88, editable: true },
  { key: 'policyType',     label: 'Policy Type',        value: 'Vehicle',              confidence: 99, editable: true },
];

function confidenceColor(score) {
  if (score >= 95) return 'var(--success)';
  if (score >= 85) return 'var(--warning)';
  return 'var(--danger)';
}

function confidenceBg(score) {
  if (score >= 95) return 'var(--success-bg)';
  if (score >= 85) return 'var(--warning-bg)';
  return 'var(--danger-bg)';
}

/* ─── Workflow Step component ────────────────────────────────── */
function WorkflowStep({ step, status, delay }) {
  // status: 'pending' | 'active' | 'completed'
  const Icon = step.icon;
  return (
    <motion.div
      className={`ai-step${status === 'active' ? ' active' : ''}${status === 'completed' ? ' completed' : ''}`}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      <div className="ai-step-num">
        {status === 'completed' ? (
          <Check size={13} />
        ) : status === 'active' ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{ display: 'flex' }}
          >
            <Loader2 size={13} />
          </motion.div>
        ) : (
          step.id
        )}
      </div>
      <div style={{ flex: 1 }}>
        <p className="text-sm font-semi" style={{
          color: status === 'completed' ? 'var(--success-text)' :
                 status === 'active'    ? 'var(--gold-dark)' :
                 'var(--text-muted)',
        }}>{step.label}</p>
        {status !== 'pending' && (
          <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: 1 }}>
            {status === 'completed' ? step.description : 'Processing…'}
          </p>
        )}
      </div>
      {status === 'completed' && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
          <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
        </motion.div>
      )}
      {status === 'active' && (
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)',
          animation: 'pulse 1s infinite',
          flexShrink: 0,
        }} />
      )}
    </motion.div>
  );
}

/* ─── PDF Thumbnail Card ─────────────────────────────────────── */
function PdfPreviewCard({ file }) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ overflow: 'hidden', marginBottom: '1.25rem' }}
    >
      {/* Fake page header */}
      <div style={{
        height: 120, background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
      }}>
        <FileText size={48} style={{ color: 'var(--danger)', opacity: 0.6 }} />
        {/* fake lines */}
        <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
          {[80, 60, 70, 50].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: 6, width: `${w}%`, marginBottom: 6, borderRadius: 3 }} />
          ))}
        </div>
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'var(--danger)', color: 'white',
          fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
        }}>PDF</div>
      </div>
      <div className="card-body" style={{ padding: '0.875rem 1rem' }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-sm)',
            background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--danger)', flexShrink: 0,
          }}>
            <FileText size={18} />
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p className="text-sm font-semi truncate" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {(file.size / 1024).toFixed(1)} KB · PDF Document
            </p>
          </div>
          <span className="badge badge-success">Selected</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Confidence Bar ─────────────────────────────────────────── */
function ConfidenceMeter({ score }) {
  return (
    <div style={{ marginTop: '1.25rem' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
        <div className="flex items-center gap-2">
          <Sparkles size={14} style={{ color: 'var(--gold)' }} />
          <span className="text-sm font-semi">AI Confidence Score</span>
        </div>
        <motion.span
          className="text-lg font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: confidenceColor(score) }}
        >
          {score}%
        </motion.span>
      </div>
      <div className="progress-bar" style={{ height: 10 }}>
        <motion.div
          style={{
            height: '100%',
            borderRadius: 'var(--radius-full)',
            background: `linear-gradient(90deg, ${confidenceColor(score)}, ${confidenceColor(score)}bb)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '0.375rem' }}>
        {score >= 95 ? '✓ High confidence — ready to approve' :
         score >= 85 ? '⚠ Medium confidence — review highlighted fields' :
                       '✗ Low confidence — manual review required'}
      </p>
    </div>
  );
}

/* ─── Editable Field Row ─────────────────────────────────────── */
function ExtractedField({ field, allEditing, formData, onChange }) {
  const [editing, setEditing] = useState(false);
  const isEditing = allEditing || editing;
  const isLowConf = field.confidence < 92;

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: isLowConf ? 'rgba(245,158,11,0.05)' : 'transparent',
        borderBottom: '1px solid var(--border-light)',
        borderLeft: isLowConf ? '3px solid var(--warning)' : '3px solid transparent',
        transition: 'background 0.2s',
      }}
    >
      {/* Confidence indicator */}
      <div
        title={`Confidence: ${field.confidence}%`}
        style={{
          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
          background: confidenceColor(field.confidence),
        }}
      />

      {/* Label */}
      <div style={{ width: 160, flexShrink: 0 }}>
        <p className="text-xs font-semi" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {field.label}
        </p>
      </div>

      {/* Value */}
      <div style={{ flex: 1 }}>
        {isEditing ? (
          <input
            id={`ai-field-${field.key}`}
            className="form-input"
            style={{ padding: '0.375rem 0.625rem', fontSize: '0.875rem' }}
            value={formData[field.key]}
            onChange={e => onChange(field.key, e.target.value)}
            onBlur={() => setEditing(false)}
            autoFocus={editing && !allEditing}
          />
        ) : (
          <p className="text-sm font-semi" style={{ color: 'var(--text-primary)' }}>
            {formData[field.key]}
          </p>
        )}
      </div>

      {/* Confidence badge */}
      <span
        className="badge"
        style={{
          background: confidenceBg(field.confidence),
          color: confidenceColor(field.confidence),
          flexShrink: 0,
        }}
      >
        {field.confidence}%
      </span>

      {/* Edit icon */}
      {!allEditing && (
        <button
          id={`edit-field-${field.key}`}
          className="btn btn-ghost btn-icon btn-sm"
          onClick={() => setEditing(e => !e)}
          title="Edit field"
          style={{ flexShrink: 0 }}
        >
          <Pencil size={13} />
        </button>
      )}
    </div>
  );
}

/* ─── Success Animation ──────────────────────────────────────── */
function SuccessBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      style={{
        background: 'linear-gradient(135deg, var(--success-bg), #d1fae5)',
        border: '1px solid var(--success)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--success)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 1.25rem',
          boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
        }}
      >
        <CheckCircle size={36} color="white" />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success-text)', marginBottom: '0.5rem' }}
      >
        Customer record created!
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ color: 'var(--success-text)', fontSize: '0.9rem', opacity: 0.85 }}
      >
        Rajesh Kumar has been added to your system with policy <strong>POL-GJ-2024-7891</strong>.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}
      >
        <span className="badge badge-success"><CheckCircle size={11} /> Policy saved</span>
        <span className="badge badge-success"><CheckCircle size={11} /> Vehicle linked</span>
        <span className="badge badge-success"><CheckCircle size={11} /> Renewal scheduled</span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function AIImport() {
  const [appState, setAppState]         = useState(STATES.IDLE);
  const [file, setFile]                 = useState(null);
  const [activeStep, setActiveStep]     = useState(0);       // 0-based index of currently processing step
  const [completedSteps, setCompletedSteps] = useState([]);
  const [allEditing, setAllEditing]     = useState(false);
  const [formData, setFormData]         = useState(
    Object.fromEntries(EXTRACTED_FIELDS.map(f => [f.key, f.value]))
  );

  /* ── Dropzone ── */
  const onDrop = useCallback((accepted) => {
    if (accepted.length) {
      setFile(accepted[0]);
      startProcessing(accepted[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png'] },
    multiple: false,
    disabled: appState !== STATES.IDLE,
  });

  /* ── State machine ── */
  const startProcessing = (f) => {
    setAppState(STATES.UPLOADING);
    setCompletedSteps([]);
    setActiveStep(0);
  };

  useEffect(() => {
    if (appState === STATES.UPLOADING) {
      // Kick off step-by-step animation
      let step = 0;
      const advance = () => {
        if (step < WORKFLOW_STEPS.length) {
          setActiveStep(step);
          setTimeout(() => {
            setCompletedSteps(prev => [...prev, step]);
            step++;
            if (step < WORKFLOW_STEPS.length) {
              setActiveStep(step);
              setTimeout(advance, 1000);
            } else {
              setActiveStep(-1);
              setAppState(STATES.EXTRACTED);
            }
          }, 1200);
        }
      };
      setTimeout(advance, 600);
    }
  }, [appState]);

  const handleFieldChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleApprove = () => {
    setAppState(STATES.SAVED);
  };

  const handleDiscard = () => {
    setAppState(STATES.IDLE);
    setFile(null);
    setActiveStep(0);
    setCompletedSteps([]);
    setAllEditing(false);
    setFormData(Object.fromEntries(EXTRACTED_FIELDS.map(f => [f.key, f.value])));
  };

  const isProcessing = appState === STATES.UPLOADING || appState === STATES.PROCESSING;
  const overallConfidence = 94;

  return (
    <div className="animate-fade-in">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">AI PDF Import</h1>
            <span
              className="badge badge-gold"
              style={{ fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              <Zap size={10} /> Beta
            </span>
          </div>
          <p className="page-subtitle">Extract insurance data automatically from policy PDFs using AI</p>
        </div>
        {appState !== STATES.IDLE && appState !== STATES.SAVED && (
          <button id="ai-import-reset-btn" className="btn btn-outline" onClick={handleDiscard}>
            <RefreshCw size={15} /> Start Over
          </button>
        )}
      </div>

      {/* ── Two Column Layout ── */}
      <div className="flex gap-6" style={{ alignItems: 'flex-start' }}>

        {/* ═══════════════════════════════════════════
            LEFT COLUMN — 45%
        ═══════════════════════════════════════════ */}
        <div style={{ width: '43%', flexShrink: 0 }}>

          {/* ── Dropzone or PDF Preview ── */}
          {appState === STATES.IDLE ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                {...getRootProps()}
                id="ai-dropzone"
                className={`dropzone${isDragActive ? ' active' : ''}`}
                style={{
                  padding: '3.5rem 2rem',
                  cursor: 'pointer',
                  marginBottom: '1.25rem',
                  background: isDragActive ? 'rgba(201,162,39,0.04)' : 'var(--bg)',
                  borderColor: isDragActive ? 'var(--gold)' : 'var(--border)',
                }}
              >
                <input {...getInputProps()} id="ai-file-input" />
                <motion.div
                  animate={isDragActive ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: isDragActive ? 'rgba(201,162,39,0.12)' : 'var(--bg-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.25rem',
                    border: isDragActive ? '2px dashed var(--gold)' : '2px dashed var(--border)',
                    transition: 'all 0.2s',
                  }}>
                    <CloudUpload size={32} style={{ color: isDragActive ? 'var(--gold)' : 'var(--text-muted)' }} />
                  </div>
                  <p className="font-semi" style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                    {isDragActive ? 'Drop your file here!' : 'Drag & drop your policy PDF here'}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    or click to browse from your computer
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="chip">PDF</span>
                    <span className="chip">JPG</span>
                    <span className="chip">PNG</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '0.875rem' }}>
                    Max file size: 25 MB
                  </p>
                </motion.div>
              </div>

              {/* How it works */}
              <div className="card card-body" style={{ padding: '1rem 1.25rem' }}>
                <p className="section-title" style={{ marginBottom: '0.75rem' }}>How AI Import Works</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {[
                    { icon: ScanLine, text: 'OCR extracts text from your PDF' },
                    { icon: Brain,    text: 'AI identifies key insurance fields' },
                    { icon: ShieldCheck, text: 'Confidence scoring for each field' },
                    { icon: Database,    text: 'One-click save to customer database' },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div style={{
                        width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                        background: 'rgba(201,162,39,0.1)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: 'var(--gold)',
                        flexShrink: 0,
                      }}>
                        <Icon size={14} />
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div>
              {/* PDF Preview Card */}
              {file && <PdfPreviewCard file={file} />}

              {/* Workflow Steps */}
              <div className="card" style={{ overflow: 'hidden', marginBottom: '1.25rem' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <Brain size={16} style={{ color: 'var(--gold)' }} />
                    <p className="font-semi text-sm">Processing Pipeline</p>
                  </div>
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <div className="ai-workflow">
                    {WORKFLOW_STEPS.map((step, idx) => {
                      const status =
                        completedSteps.includes(idx) ? 'completed' :
                        activeStep === idx            ? 'active' :
                        'pending';
                      return (
                        <WorkflowStep
                          key={step.id}
                          step={step}
                          status={status}
                          delay={idx * 0.08}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Confidence Meter — only show after extraction */}
              {(appState === STATES.EXTRACTED || appState === STATES.SAVED) && (
                <div className="card card-body">
                  <ConfidenceMeter score={overallConfidence} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════
            RIGHT COLUMN — 55%
        ═══════════════════════════════════════════ */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">

            {/* ── IDLE: placeholder ── */}
            {appState === STATES.IDLE && (
              <motion.div
                key="idle-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card"
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} style={{ color: 'var(--text-muted)' }} />
                    <p className="font-semi text-sm" style={{ color: 'var(--text-muted)' }}>Extracted Information</p>
                  </div>
                </div>
                <div className="empty-state" style={{ padding: '4rem 2rem' }}>
                  <div className="empty-state-icon">
                    <FileText size={28} />
                  </div>
                  <h3>No file selected</h3>
                  <p>Upload a policy PDF on the left to extract insurance data automatically.</p>
                </div>
              </motion.div>
            )}

            {/* ── UPLOADING / PROCESSING ── */}
            {isProcessing && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="card"
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}>
                      <Loader2 size={16} style={{ color: 'var(--gold)' }} />
                    </motion.div>
                    <p className="font-semi text-sm">AI is processing your document…</p>
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {EXTRACTED_FIELDS.map((field, i) => (
                      <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 150, flexShrink: 0 }}>
                          <p className="text-xs font-semi" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {field.label}
                          </p>
                        </div>
                        <div className="skeleton" style={{ flex: 1, height: 28, borderRadius: 6 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── EXTRACTED: form ── */}
            {appState === STATES.EXTRACTED && (
              <motion.div
                key="extracted"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="card"
                style={{ overflow: 'hidden' }}
              >
                {/* Card Header */}
                <div style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'linear-gradient(135deg, rgba(201,162,39,0.06), rgba(11,31,77,0.04))',
                }}>
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} style={{ color: 'var(--gold)' }} />
                    <p className="font-semi">Extracted Information</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-gold">
                      <Brain size={10} /> AI Extracted
                    </span>
                    <button
                      id="ai-edit-all-btn"
                      className={`btn btn-sm${allEditing ? ' btn-primary' : ' btn-outline'}`}
                      onClick={() => setAllEditing(e => !e)}
                    >
                      <Pencil size={13} />
                      {allEditing ? 'Done Editing' : 'Edit All'}
                    </button>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4" style={{ padding: '0.625rem 1rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)' }}>
                  {[
                    { color: 'var(--success)',  label: 'High confidence (≥95%)' },
                    { color: 'var(--warning)',   label: 'Medium (85-94%)' },
                    { color: 'var(--danger)',    label: 'Low (<85%) — review' },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Fields */}
                <div>
                  {EXTRACTED_FIELDS.map((field) => (
                    <ExtractedField
                      key={field.key}
                      field={field}
                      allEditing={allEditing}
                      formData={formData}
                      onChange={handleFieldChange}
                    />
                  ))}
                </div>

                {/* Verification status */}
                <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Policy Number', ok: true },
                    { label: 'Vehicle Reg.',  ok: true },
                    { label: 'Insurer',       ok: true },
                    { label: 'Dates',         ok: false },
                  ].map(({ label, ok }) => (
                    <div key={label} className="flex items-center gap-1">
                      {ok
                        ? <CheckCircle size={13} style={{ color: 'var(--success)' }} />
                        : <AlertCircle size={13} style={{ color: 'var(--warning)' }} />}
                      <span className="text-xs font-medium" style={{ color: ok ? 'var(--success-text)' : 'var(--warning-text)' }}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{
                  padding: '1rem 1.25rem',
                  borderTop: '1px solid var(--border)',
                  display: 'flex', gap: '0.75rem', justifyContent: 'flex-end',
                  background: 'var(--bg-secondary)',
                }}>
                  <button
                    id="ai-discard-btn"
                    className="btn btn-ghost"
                    onClick={handleDiscard}
                  >
                    <Trash2 size={15} /> Discard
                  </button>
                  <button
                    id="ai-approve-btn"
                    className="btn btn-gold"
                    onClick={handleApprove}
                  >
                    <ThumbsUp size={15} /> Approve & Save
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── SAVED: success ── */}
            {appState === STATES.SAVED && (
              <motion.div
                key="saved"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SuccessBanner />

                {/* Summary card */}
                <div className="card card-body" style={{ marginTop: '1.25rem' }}>
                  <p className="section-title" style={{ marginBottom: '1rem' }}>Saved Record Summary</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {EXTRACTED_FIELDS.map(field => (
                      <div key={field.key} className="flex items-center" style={{ gap: '1rem' }}>
                        <span className="text-xs font-semi" style={{ color: 'var(--text-muted)', width: 160, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {field.label}
                        </span>
                        <span className="text-sm font-semi" style={{ color: 'var(--text-primary)' }}>
                          {formData[field.key]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3" style={{ marginTop: '1rem' }}>
                  <button id="ai-import-another-btn" className="btn btn-outline" onClick={handleDiscard}>
                    <Upload size={15} /> Import Another
                  </button>
                  <button id="ai-view-customer-btn" className="btn btn-primary">
                    <CheckCircle size={15} /> View Customer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
