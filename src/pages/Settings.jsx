import React, { useState } from 'react';
import {
  Building2, Users, Mail, FileText, HardDrive, Database,
  Link, Shield, Palette, Save, Plus, Eye, EyeOff, Upload,
  Check, RefreshCw, Monitor, Moon, Sun, ChevronRight,
  Trash2, Edit2, ToggleLeft, Key, Clock, Globe, Bell,
  AlertTriangle, CheckCircle, Camera, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { agents } from '../data/mockData';

// ── Nav sections ──────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'company',      icon: Building2,  label: 'Company Profile' },
  { id: 'users',        icon: Users,      label: 'Users & Roles' },
  { id: 'email',        icon: Mail,       label: 'Email Settings' },
  { id: 'pdf',          icon: FileText,   label: 'PDF Templates' },
  { id: 'storage',      icon: HardDrive,  label: 'Storage' },
  { id: 'backup',       icon: Database,   label: 'Backup' },
  { id: 'integrations', icon: Link,       label: 'Integrations' },
  { id: 'security',     icon: Shield,     label: 'Security' },
  { id: 'theme',        icon: Palette,    label: 'Theme' },
];

const ROLE_BADGE = {
  owner:      'badge badge-gold',
  agent:      'badge badge-primary',
  accountant: 'badge badge-success',
};

const ROLE_LABEL = { owner: 'Owner', agent: 'Agent', accountant: 'Accountant' };

// ── Section Wrapper ───────────────────────────────────────────
function SectionCard({ title, subtitle, children, action }) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ marginBottom: '1.25rem' }}
    >
      <div className="card-header" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem', borderBottom: '1px solid var(--border)',
      }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
          {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      <div style={{ padding: '1.25rem' }}>{children}</div>
    </motion.div>
  );
}

function FormRow({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, id }) {
  return (
    <label className="toggle" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  );
}

// ── Section: Company Profile ──────────────────────────────────
function CompanyProfile() {
  const [form, setForm] = useState({
    name: 'Able Insurance Management',
    tagline: 'Trusted Protection for Every Journey',
    email: 'info@ableinsurance.com',
    phone: '+91 98765 43210',
    address: '301, Business Hub, Ahmedabad, Gujarat - 380015',
    gstin: '24ABCDE1234F1Z5',
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <SectionCard title="Company Profile" subtitle="Update your company information shown on documents and emails">
      <FormRow>
        <div className="form-group">
          <label className="form-label" htmlFor="cp-name">Company Name <span>*</span></label>
          <input id="cp-name" className="form-input" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="cp-tagline">Tagline</label>
          <input id="cp-tagline" className="form-input" value={form.tagline} onChange={e => set('tagline', e.target.value)} />
        </div>
      </FormRow>
      <FormRow>
        <div className="form-group">
          <label className="form-label" htmlFor="cp-email">Business Email <span>*</span></label>
          <input id="cp-email" className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="cp-phone">Phone Number</label>
          <input id="cp-phone" className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
      </FormRow>
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label className="form-label" htmlFor="cp-address">Office Address</label>
        <textarea id="cp-address" className="form-textarea" rows={2} value={form.address}
          onChange={e => set('address', e.target.value)} style={{ minHeight: 72, resize: 'none' }} />
      </div>
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" htmlFor="cp-gstin">GSTIN</label>
        <input id="cp-gstin" className="form-input" value={form.gstin} onChange={e => set('gstin', e.target.value)} />
      </div>

      {/* Logo Upload */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label">Company Logo</label>
        <div className="dropzone" id="cp-logo-drop" style={{ padding: '1.5rem', cursor: 'pointer' }}
          onClick={() => toast('File upload not available in demo')}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={28} color="var(--text-muted)" />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Click or drag to upload logo
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              PNG, JPG or SVG · Max 2 MB
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button id="cp-save-btn" className="btn btn-gold" onClick={() => toast.success('Company profile saved!')}>
          <Save size={15} /> Save Changes
        </button>
      </div>
    </SectionCard>
  );
}

// ── Section: Users & Roles ────────────────────────────────────
function UsersRoles() {
  const [userList, setUserList] = useState(agents);

  const toggleStatus = (id) => {
    setUserList(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
    ));
    toast.success('User status updated');
  };

  const PERMISSIONS = [
    'View Customers',
    'Edit Policies',
    'Access Payments',
    'Generate Reports',
    'Manage Settings',
  ];
  const ROLE_PERMISSIONS = {
    Owner: [true, true, true, true, true],
    Agent: [true, true, false, true, false],
    Accountant: [true, false, true, true, false],
  };

  return (
    <>
      <SectionCard
        title="Team Members"
        subtitle="Manage agents and their system access"
        action={
          <button id="users-add-btn" className="btn btn-gold btn-sm"
            onClick={() => toast('Add User modal coming soon!')}>
            <Plus size={14} /> Add User
          </button>
        }
      >
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Agent</th><th>Email</th><th>Role</th>
                <th>Customers</th><th>Policies</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.72rem' }}>
                        {u.name.split(' ').map(p => p[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.email}</td>
                  <td><span className={ROLE_BADGE[u.role]}>{ROLE_LABEL[u.role]}</span></td>
                  <td style={{ fontWeight: 600 }}>{u.customers}</td>
                  <td style={{ fontWeight: 600 }}>{u.policies}</td>
                  <td>
                    <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-muted'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button id={`user-edit-${u.id}`} className="btn btn-ghost btn-icon btn-sm"
                        title="Edit" onClick={() => toast('Edit user coming soon!')}>
                        <Edit2 size={14} />
                      </button>
                      <button id={`user-toggle-${u.id}`} className="btn btn-ghost btn-icon btn-sm"
                        title={u.status === 'Active' ? 'Deactivate' : 'Activate'}
                        onClick={() => toggleStatus(u.id)}>
                        <ToggleLeft size={14} color={u.status === 'Active' ? 'var(--success)' : 'var(--text-muted)'} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Role Permissions Matrix */}
      <SectionCard title="Role Permissions" subtitle="Feature access by role">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th><span className="badge badge-gold">Owner</span></th>
                <th><span className="badge badge-primary">Agent</span></th>
                <th><span className="badge badge-success">Accountant</span></th>
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((perm, i) => (
                <tr key={perm}>
                  <td style={{ fontWeight: 500 }}>{perm}</td>
                  {['Owner', 'Agent', 'Accountant'].map(role => (
                    <td key={role}>
                      {ROLE_PERMISSIONS[role][i]
                        ? <Check size={16} color="var(--success)" />
                        : <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>—</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </>
  );
}

// ── Section: Email Settings ───────────────────────────────────
function EmailSettings() {
  const [smtpForm, setSmtpForm] = useState({
    host: 'smtp.gmail.com', port: '587', user: 'info@ableinsurance.com',
    pass: '', encryption: 'TLS',
  });
  const [showPass, setShowPass] = useState(false);
  const set = (k, v) => setSmtpForm(p => ({ ...p, [k]: v }));

  return (
    <SectionCard title="Email Settings" subtitle="Configure SMTP server for sending emails and reminders">
      <FormRow>
        <div className="form-group">
          <label className="form-label" htmlFor="smtp-host">SMTP Host</label>
          <input id="smtp-host" className="form-input" value={smtpForm.host} onChange={e => set('host', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="smtp-port">Port</label>
          <input id="smtp-port" className="form-input" value={smtpForm.port} onChange={e => set('port', e.target.value)} />
        </div>
      </FormRow>
      <FormRow>
        <div className="form-group">
          <label className="form-label" htmlFor="smtp-user">Email Username</label>
          <input id="smtp-user" className="form-input" value={smtpForm.user} onChange={e => set('user', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="smtp-pass">Password</label>
          <div className="input-icon-wrapper">
            <input
              id="smtp-pass"
              className="form-input"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••••"
              value={smtpForm.pass}
              onChange={e => set('pass', e.target.value)}
            />
            <button
              className="input-icon-right"
              onClick={() => setShowPass(p => !p)}
              id="smtp-show-pass"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      </FormRow>
      <div className="form-group" style={{ marginBottom: '1.5rem', maxWidth: 200 }}>
        <label className="form-label" htmlFor="smtp-enc">Encryption</label>
        <select id="smtp-enc" className="form-select" value={smtpForm.encryption}
          onChange={e => set('encryption', e.target.value)}>
          <option>TLS</option><option>SSL</option><option>None</option>
        </select>
      </div>

      {/* Email Template Preview */}
      <div style={{
        background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        padding: '1rem', marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.625rem' }}>
          Email Preview
        </div>
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '0.75rem' }}>A</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Able Insurance</span>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            Dear <strong>[Customer Name]</strong>,<br />
            Your policy <strong>[Policy ID]</strong> is expiring on <strong>[Date]</strong>.<br />
            Please contact us to renew and stay protected.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button id="smtp-test-btn" className="btn btn-outline btn-sm"
          onClick={() => toast.success('Test email sent to info@ableinsurance.com')}>
          <Mail size={14} /> Send Test Email
        </button>
        <button id="smtp-save-btn" className="btn btn-gold btn-sm"
          onClick={() => toast.success('Email settings saved!')}>
          <Save size={14} /> Save Settings
        </button>
      </div>
    </SectionCard>
  );
}

// ── Section: PDF Templates ────────────────────────────────────
function PDFTemplates() {
  const [active, setActive] = useState(0);
  const TEMPLATES = [
    { id: 0, name: 'Standard Policy', desc: 'Clean professional layout with Able branding', color: 'var(--primary)' },
    { id: 1, name: 'Compact Summary', desc: 'Condensed single-page policy summary', color: 'var(--gold-dark)' },
    { id: 2, name: 'Detailed Report', desc: 'Full breakdown with clauses and addenda', color: '#10B981' },
  ];

  return (
    <SectionCard title="PDF Templates" subtitle="Choose and customize the policy document layout">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {TEMPLATES.map(t => (
          <div
            key={t.id}
            id={`pdf-tmpl-${t.id}`}
            onClick={() => setActive(t.id)}
            style={{
              border: `2px solid ${active === t.id ? t.color : 'var(--border)'}`,
              borderRadius: 'var(--radius)', padding: '1rem', cursor: 'pointer',
              transition: 'var(--transition)', background: active === t.id ? `${t.color}08` : 'var(--surface)',
            }}
          >
            {/* Mock thumbnail */}
            <div style={{
              height: 110, background: 'var(--bg)', borderRadius: 'var(--radius-sm)',
              marginBottom: '0.75rem', border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', padding: '0.625rem', gap: '0.35rem', overflow: 'hidden',
            }}>
              <div style={{ height: 10, width: '70%', background: t.color, borderRadius: 4, opacity: 0.8 }} />
              <div style={{ height: 6, width: '50%', background: 'var(--border)', borderRadius: 4 }} />
              <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[90, 75, 85, 60].map((w, i) => (
                  <div key={i} style={{ height: 4, width: `${w}%`, background: 'var(--border)', borderRadius: 4 }} />
                ))}
              </div>
              <div style={{ marginTop: 'auto', height: 20, background: `${t.color}22`, borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</span>
              {active === t.id && (
                <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  <Check size={10} /> Active
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{t.desc}</p>
            <button
              id={`pdf-customize-${t.id}`}
              className={`btn btn-sm w-full ${active === t.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={e => { e.stopPropagation(); setActive(t.id); toast.success(`${t.name} template activated`); }}
            >
              {active === t.id ? 'Customize' : 'Use Template'}
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ── Section: Storage ──────────────────────────────────────────
function StorageSettings() {
  const [autoBackup, setAutoBackup] = useState(true);
  const BARS = [
    { label: 'Policy Documents', used: 1.2, total: 5,  color: 'var(--primary)' },
    { label: 'Customer Files',   used: 0.8, total: 5,  color: 'var(--gold-dark)' },
    { label: 'System Backups',   used: 2.1, total: 10, color: '#10B981' },
  ];
  const totalUsed = 4.1, totalGB = 20;

  return (
    <SectionCard title="Storage" subtitle="Manage file storage and backup preferences">
      {/* Total */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Total Storage Used</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{totalUsed} GB / {totalGB} GB</span>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div className="progress-fill" style={{ width: `${(totalUsed / totalGB) * 100}%` }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
          {totalGB - totalUsed} GB available
        </div>
      </div>

      {/* Per-category */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
        {BARS.map(b => (
          <div key={b.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.label}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{b.used} GB</span>
            </div>
            <div className="progress-bar">
              <div style={{
                height: '100%', borderRadius: 'var(--radius-full)',
                background: b.color, width: `${(b.used / b.total) * 100}%`,
                transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Auto-backup toggle */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem',
      }}>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            Automatic Backup
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Daily backup at 2:00 AM · Last: Today
          </div>
        </div>
        <Toggle id="storage-auto-backup" checked={autoBackup} onChange={setAutoBackup} />
      </div>
    </SectionCard>
  );
}

// ── Section: Backup ───────────────────────────────────────────
function BackupSettings() {
  return (
    <SectionCard title="Backup & Restore" subtitle="Manage data backups and restore points">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { name: 'Full Backup — Jun 24, 2026', size: '4.1 GB', status: 'success', time: '2:00 AM' },
          { name: 'Full Backup — Jun 23, 2026', size: '4.0 GB', status: 'success', time: '2:00 AM' },
          { name: 'Full Backup — Jun 22, 2026', size: '3.9 GB', status: 'success', time: '2:01 AM' },
        ].map((b, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.875rem 1rem', background: 'var(--bg)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
          }}>
            <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{b.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.size} · {b.time}</div>
            </div>
            <button id={`backup-restore-${i}`} className="btn btn-outline btn-sm"
              onClick={() => toast.success('Restore initiated')}>
              <RefreshCw size={12} /> Restore
            </button>
          </div>
        ))}
      </div>
      <button id="backup-now-btn" className="btn btn-primary btn-sm"
        onClick={() => toast.success('Manual backup started...')}>
        <Database size={14} /> Backup Now
      </button>
    </SectionCard>
  );
}

// ── Section: Integrations ─────────────────────────────────────
function IntegrationsSettings() {
  const INTEGRATIONS = [
    { id: 'int-wb',    name: 'WhatsApp Business',  desc: 'Send renewal reminders via WhatsApp', icon: '💬', active: true },
    { id: 'int-drive', name: 'Google Drive',        desc: 'Auto-save documents to Drive',        icon: '📁', active: false },
    { id: 'int-slack',  name: 'Slack Notifications', desc: 'Get alerts in your Slack workspace',  icon: '🔔', active: false },
    { id: 'int-razorpay', name: 'Razorpay',         desc: 'Accept online premium payments',      icon: '💳', active: true },
  ];
  const [states, setStates] = useState(
    Object.fromEntries(INTEGRATIONS.map(i => [i.id, i.active]))
  );

  return (
    <SectionCard title="Integrations" subtitle="Connect third-party services to Able">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {INTEGRATIONS.map(intg => (
          <div key={intg.id} style={{
            background: 'var(--bg)', border: `1px solid ${states[intg.id] ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)', padding: '1rem', transition: 'var(--transition)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{intg.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{intg.name}</div>
              </div>
              <Toggle
                id={`toggle-${intg.id}`}
                checked={states[intg.id]}
                onChange={v => {
                  setStates(p => ({ ...p, [intg.id]: v }));
                  toast.success(`${intg.name} ${v ? 'connected' : 'disconnected'}`);
                }}
              />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{intg.desc}</p>
            {states[intg.id] && (
              <span className="badge badge-success" style={{ marginTop: '0.5rem', fontSize: '0.65rem' }}>
                <Zap size={9} /> Connected
              </span>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ── Section: Security ─────────────────────────────────────────
function SecuritySettings() {
  const [twoFA, setTwoFA]         = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newP: '', confirm: '' });
  const [showCurr, setShowCurr]   = useState(false);
  const [showNew, setShowNew]     = useState(false);
  const set = (k, v) => setPasswords(p => ({ ...p, [k]: v }));

  const LOGIN_HISTORY = [
    { ip: '103.20.45.12', location: 'Ahmedabad, Gujarat', time: 'Today 9:32 AM',    device: 'Chrome / Windows' },
    { ip: '103.20.45.12', location: 'Ahmedabad, Gujarat', time: 'Yesterday 6:15 PM', device: 'Chrome / Windows' },
    { ip: '49.36.18.201', location: 'Mumbai, Maharashtra', time: 'Jun 22, 2026',    device: 'Mobile / Android' },
  ];

  return (
    <>
      <SectionCard title="Change Password" subtitle="Update your account password regularly for security">
        <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="sec-curr-pass">Current Password</label>
            <div className="input-icon-wrapper">
              <input id="sec-curr-pass" className="form-input"
                type={showCurr ? 'text' : 'password'} placeholder="••••••••"
                value={passwords.current} onChange={e => set('current', e.target.value)} />
              <button className="input-icon-right" id="sec-show-curr"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setShowCurr(p => !p)}>
                {showCurr ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="sec-new-pass">New Password</label>
            <div className="input-icon-wrapper">
              <input id="sec-new-pass" className="form-input"
                type={showNew ? 'text' : 'password'} placeholder="Min. 8 characters"
                value={passwords.newP} onChange={e => set('newP', e.target.value)} />
              <button className="input-icon-right" id="sec-show-new"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setShowNew(p => !p)}>
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="sec-confirm-pass">Confirm New Password</label>
            <input id="sec-confirm-pass" className="form-input" type="password"
              placeholder="Re-enter new password"
              value={passwords.confirm} onChange={e => set('confirm', e.target.value)} />
          </div>
          <button id="sec-change-pass-btn" className="btn btn-primary btn-sm"
            style={{ alignSelf: 'flex-start' }}
            onClick={() => {
              if (!passwords.current) { toast.error('Enter current password'); return; }
              if (passwords.newP !== passwords.confirm) { toast.error('Passwords do not match'); return; }
              toast.success('Password changed successfully');
              setPasswords({ current: '', newP: '', confirm: '' });
            }}>
            <Key size={14} /> Update Password
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" subtitle="Add an extra layer of security to your account">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {twoFA ? '2FA is Enabled' : '2FA is Disabled'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {twoFA ? 'Your account is protected with authenticator app.' : 'Enable 2FA for stronger security.'}
            </div>
          </div>
          <Toggle id="sec-2fa-toggle" checked={twoFA} onChange={(v) => {
            setTwoFA(v);
            toast.success(`Two-factor authentication ${v ? 'enabled' : 'disabled'}`);
          }} />
        </div>
        {twoFA && (
          <div style={{
            background: 'var(--success-bg)', border: '1px solid var(--success)',
            borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--success-text)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <CheckCircle size={15} /> Authenticator app linked · Last verified 2 hours ago
          </div>
        )}
      </SectionCard>

      <SectionCard title="Login History" subtitle="Recent sign-in activity on your account">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>IP Address</th><th>Location</th><th>Device</th><th>Time</th><th></th></tr>
            </thead>
            <tbody>
              {LOGIN_HISTORY.map((log, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.ip}</td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Globe size={13} color="var(--text-muted)" />{log.location}</div></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.device}</td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Clock size={13} color="var(--text-muted)" />{log.time}</div></td>
                  <td>{i === 0 ? <span className="badge badge-success">Current</span> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button id="sec-end-sessions-btn" className="btn btn-danger btn-sm"
          style={{ marginTop: '1rem' }}
          onClick={() => toast.success('All other sessions terminated')}>
          End All Other Sessions
        </button>
      </SectionCard>
    </>
  );
}

// ── Section: Theme ────────────────────────────────────────────
function ThemeSettings() {
  const [theme, setTheme]       = useState('light');
  const [primary, setPrimary]   = useState('#0B1F4D');
  const [accent, setAccent]     = useState('#C9A227');
  const [fontSize, setFontSize] = useState(14);

  const applyTheme = (t) => {
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : '');
    toast.success(`${t.charAt(0).toUpperCase() + t.slice(1)} mode activated`);
  };

  return (
    <SectionCard title="Theme & Appearance" subtitle="Customize the look and feel of the application">
      {/* Theme Toggle */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="form-label" style={{ marginBottom: '0.625rem' }}>Color Theme</div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[
            { key: 'light', icon: Sun,     label: 'Light' },
            { key: 'dark',  icon: Moon,    label: 'Dark' },
            { key: 'system',icon: Monitor, label: 'System' },
          ].map(opt => {
            const IconC = opt.icon;
            return (
              <button
                key={opt.key}
                id={`theme-${opt.key}`}
                onClick={() => applyTheme(opt.key)}
                style={{
                  flex: 1, padding: '0.875rem', border: `2px solid ${theme === opt.key ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)', background: theme === opt.key ? 'rgba(11,31,77,0.06)' : 'var(--surface)',
                  cursor: 'pointer', transition: 'var(--transition)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                }}
              >
                <IconC size={22} color={theme === opt.key ? 'var(--primary)' : 'var(--text-muted)'} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: theme === opt.key ? 'var(--primary)' : 'var(--text-secondary)' }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Pickers */}
      <FormRow>
        <div className="form-group">
          <label className="form-label" htmlFor="theme-primary-color">Primary Color</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input id="theme-primary-color" type="color" value={primary}
              onChange={e => { setPrimary(e.target.value); toast('Color preview updated'); }}
              style={{ width: 44, height: 36, border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', padding: 2 }} />
            <input className="form-input" value={primary} readOnly style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="theme-accent-color">Accent Color (Gold)</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input id="theme-accent-color" type="color" value={accent}
              onChange={e => { setAccent(e.target.value); toast('Accent color updated'); }}
              style={{ width: 44, height: 36, border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', padding: 2 }} />
            <input className="form-input" value={accent} readOnly style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
          </div>
        </div>
      </FormRow>

      {/* Font Size */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" htmlFor="theme-font-size">
          Base Font Size — <strong>{fontSize}px</strong>
        </label>
        <input
          id="theme-font-size"
          type="range" min={12} max={18} step={1}
          value={fontSize}
          onChange={e => setFontSize(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--primary)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          <span>12px (Small)</span><span>18px (Large)</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button id="theme-reset-btn" className="btn btn-outline btn-sm"
          onClick={() => { setTheme('light'); setPrimary('#0B1F4D'); setAccent('#C9A227'); setFontSize(14); toast.success('Theme reset to defaults'); }}>
          <RefreshCw size={13} /> Reset Defaults
        </button>
        <button id="theme-save-btn" className="btn btn-gold btn-sm"
          onClick={() => toast.success('Theme preferences saved!')}>
          <Save size={13} /> Save Theme
        </button>
      </div>
    </SectionCard>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function Settings() {
  const [activeSection, setActiveSection] = useState('company');

  const renderSection = () => {
    switch (activeSection) {
      case 'company':      return <CompanyProfile />;
      case 'users':        return <UsersRoles />;
      case 'email':        return <EmailSettings />;
      case 'pdf':          return <PDFTemplates />;
      case 'storage':      return <StorageSettings />;
      case 'backup':       return <BackupSettings />;
      case 'integrations': return <IntegrationsSettings />;
      case 'security':     return <SecuritySettings />;
      case 'theme':        return <ThemeSettings />;
      default:             return <CompanyProfile />;
    }
  };

  const activeLabel = NAV_SECTIONS.find(s => s.id === activeSection)?.label || 'Settings';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account, team, and system preferences</p>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="settings-layout">
        {/* Left Nav */}
        <div className="settings-nav card" style={{ padding: '0.75rem', alignSelf: 'flex-start', position: 'sticky', top: 80 }}>
          {NAV_SECTIONS.map(section => {
            const IconComp = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                id={`settings-nav-${section.id}`}
                className={`settings-nav-item${isActive ? ' active' : ''}`}
                onClick={() => setActiveSection(section.id)}
                style={{ width: '100%', textAlign: 'left', border: 'none' }}
              >
                <IconComp size={15} style={{ flexShrink: 0 }} />
                {section.label}
                {isActive && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
              </button>
            );
          })}
        </div>

        {/* Right Content */}
        <div className="settings-content">
          <AnimatePresence mode="wait">
            <div key={activeSection}>
              {renderSection()}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
