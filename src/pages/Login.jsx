import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Shield, TrendingUp, Zap, BarChart2, CheckCircle } from 'lucide-react';

const ROLES = [
  { label: 'Owner',      email: 'harsidh@ableinsurance.com',  color: '#C9A227' },
  { label: 'Agent',      email: 'priya@ableinsurance.com',  color: '#0B1F4D' },
  { label: 'Accountant', email: 'neha@ableinsurance.com',   color: '#10B981' },
];

const FEATURES = [
  { icon: Shield,     text: 'Manage 500+ Policies' },
  { icon: Zap,        text: 'AI-Powered Automation' },
  { icon: BarChart2,  text: 'Real-time Analytics' },
];

/* ── Inline SVG Shield Illustration ─────────────────────── */
function ShieldIllustration() {
  return (
    <svg
      id="login-shield-svg"
      width="160"
      height="180"
      viewBox="0 0 160 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 16px 48px rgba(0,0,0,0.35))' }}
    >
      {/* Outer glow ring */}
      <ellipse cx="80" cy="90" rx="72" ry="76" fill="rgba(201,162,39,0.07)" />

      {/* Shield body */}
      <path
        d="M80 12 L138 36 L138 90 C138 126 110 156 80 168 C50 156 22 126 22 90 L22 36 Z"
        fill="url(#shieldGrad)"
        stroke="rgba(201,162,39,0.5)"
        strokeWidth="2"
      />

      {/* Shield inner panel */}
      <path
        d="M80 28 L124 48 L124 90 C124 118 104 142 80 152 C56 142 36 118 36 90 L36 48 Z"
        fill="rgba(255,255,255,0.07)"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />

      {/* Lock body */}
      <rect x="60" y="88" width="40" height="32" rx="6" fill="rgba(201,162,39,0.9)" />

      {/* Lock shackle */}
      <path
        d="M68 88 L68 78 C68 68 92 68 92 78 L92 88"
        stroke="rgba(201,162,39,0.9)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Keyhole */}
      <circle cx="80" cy="101" r="5" fill="rgba(11,31,77,0.8)" />
      <rect x="78" y="104" width="4" height="8" rx="1" fill="rgba(11,31,77,0.8)" />

      {/* Star sparkles */}
      <circle cx="32" cy="50" r="3" fill="rgba(201,162,39,0.6)" />
      <circle cx="128" cy="44" r="2" fill="rgba(201,162,39,0.4)" />
      <circle cx="140" cy="110" r="4" fill="rgba(201,162,39,0.3)" />
      <circle cx="20" cy="120" r="2.5" fill="rgba(201,162,39,0.5)" />
      <circle cx="46" cy="160" r="2" fill="rgba(201,162,39,0.4)" />

      {/* Checkmark badge */}
      <circle cx="120" cy="60" r="14" fill="#10B981" />
      <path d="M113 60 L118 65 L127 55" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      <defs>
        <linearGradient id="shieldGrad" x1="22" y1="12" x2="138" y2="168" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a3a7a" />
          <stop offset="100%" stopColor="#07163a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState(0);
  const [email,        setEmail]        = useState(ROLES[0].email);
  const [password,     setPassword]     = useState('');
  const [showPass,     setShowPass]     = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');

  const handleRoleSelect = (idx) => {
    setSelectedRole(idx);
    setEmail(ROLES[idx].email);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required.'); return; }
    if (!password.trim()) { setError('Password is required.'); return; }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-page" style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ── LEFT PANEL ─────────────────────────────────────── */}
      <div id="login-left-panel" style={{
        flex: '0 0 48%',
        background: 'linear-gradient(145deg, var(--primary-dark) 0%, var(--primary) 45%, var(--primary-lighter) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 3.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />

        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'rgba(201,162,39,0.06)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '240px', height: '240px', borderRadius: '50%',
          background: 'rgba(201,162,39,0.05)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', maxWidth: '400px', textAlign: 'center' }}>

          {/* Shield illustration */}
          <div style={{ animation: 'slideUp 0.6s cubic-bezier(0.4,0,0.2,1)' }}>
            <ShieldIllustration />
          </div>

          {/* Logo + Brand */}
          <div style={{ animation: 'slideUp 0.7s cubic-bezier(0.4,0,0.2,1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'var(--gold)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 900, fontSize: '1.4rem',
                color: 'var(--primary)', boxShadow: '0 4px 20px rgba(201,162,39,0.4)',
              }}>
                A
              </div>
              <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
                Able Insurance
              </h1>
            </div>
            <p style={{ color: 'var(--gold)', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.02em', margin: 0 }}>
              Securing Today, Protecting Tomorrow
            </p>
          </div>

          {/* Feature bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', width: '100%', animation: 'slideUp 0.8s cubic-bezier(0.4,0,0.2,1)' }}>
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px', padding: '0.75rem 1rem',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(201,162,39,0.2)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={18} color="var(--gold)" />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontWeight: 500 }}>{text}</span>
                <CheckCircle size={16} color="var(--gold)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: '0', width: '100%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', overflow: 'hidden',
            animation: 'slideUp 0.9s cubic-bezier(0.4,0,0.2,1)',
          }}>
            {[
              { value: '167', label: 'Customers' },
              { value: '142', label: 'Active Policies' },
              { value: '98%', label: 'Collection Rate' },
            ].map((stat, i) => (
              <div key={i} style={{
                flex: 1, padding: '0.875rem 0.5rem', textAlign: 'center',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{ color: 'var(--gold)', fontSize: '1.25rem', fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem', marginTop: '0.25rem', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────── */}
      <div id="login-right-panel" style={{
        flex: 1,
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>

        <div id="login-card" style={{
          background: 'var(--surface)',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '440px',
          animation: 'slideUp 0.5s cubic-bezier(0.4,0,0.2,1)',
        }}>

          {/* Card header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
              Welcome Back 👋
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.375rem' }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Role chips */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Sign in as
            </p>
            <div id="role-selector" style={{ display: 'flex', gap: '0.5rem' }}>
              {ROLES.map((r, i) => (
                <button
                  key={r.label}
                  id={`role-chip-${r.label.toLowerCase()}`}
                  onClick={() => handleRoleSelect(i)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: selectedRole === i
                      ? `2px solid ${r.color}`
                      : '2px solid var(--border)',
                    background: selectedRole === i
                      ? (r.color === '#C9A227' ? 'rgba(201,162,39,0.1)' : r.color === '#10B981' ? 'rgba(16,185,129,0.1)' : 'rgba(11,31,77,0.08)')
                      : 'var(--surface)',
                    color: selectedRole === i ? r.color : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Login form */}
          <form id="login-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>

            {/* Email */}
            <div className="form-group">
              <label id="email-label" className="form-label" htmlFor="login-email">
                Email Address
              </label>
              <div className="input-icon-wrapper">
                <span className="input-icon"><Mail size={16} /></span>
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  placeholder="you@ableinsurance.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label id="password-label" className="form-label" htmlFor="login-password">
                Password
              </label>
              <div className="input-icon-wrapper">
                <span className="input-icon"><Lock size={16} /></span>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  autoComplete="current-password"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  id="toggle-password-btn"
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPass(s => !s)}
                  style={{ background: 'none', border: 'none', padding: 0, pointerEvents: 'auto' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label id="remember-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <input
                  id="remember-me-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                Remember me
              </label>
              <button
                id="forgot-password-btn"
                type="button"
                style={{ background: 'none', border: 'none', color: 'var(--primary-lighter)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Forgot password?
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div id="login-error-msg" style={{
                background: 'var(--danger-bg)', color: 'var(--danger-text)',
                border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px',
                padding: '0.625rem 0.875rem', fontSize: '0.85rem', fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: '0.25rem', height: '48px', fontSize: '0.95rem', borderRadius: '10px' }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '18px', height: '18px', border: '2.5px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite', display: 'inline-block',
                  }} />
                  Signing in...
                </>
              ) : 'Sign In to Dashboard'}
            </button>

          </form>

          {/* SSL badge */}
          <div id="ssl-badge" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', marginTop: '1.5rem', paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)',
          }}>
            <Shield size={14} color="var(--success)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Secure 256-bit SSL encryption
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
