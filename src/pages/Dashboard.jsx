import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import {
  UserPlus, FileText, Upload, Bell, TrendingUp, TrendingDown,
  Users, Shield, IndianRupee, AlertTriangle, CheckCircle2,
  Lightbulb, ArrowUpRight, Clock, RefreshCw, ChevronRight,
} from 'lucide-react';
import {
  customers, renewals, revenueData, policyDistribution, kpis,
} from '../data/mockData';

/* ── Helpers ─────────────────────────────────────────────── */
const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const today = new Date();
const greeting = (() => {
  const h = today.getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
})();

const renewalUrgencyColor = (days) => {
  if (days <= 2)  return 'var(--danger)';
  if (days <= 7)  return 'var(--warning)';
  if (days <= 30) return 'var(--info)';
  return 'var(--text-muted)';
};
const renewalUrgencyBg = (days) => {
  if (days <= 2)  return 'var(--danger-bg)';
  if (days <= 7)  return 'var(--warning-bg)';
  if (days <= 30) return 'var(--info-bg)';
  return 'var(--bg-secondary)';
};

const AI_SUGGESTIONS = [
  { id: 'ai-1', text: 'Send renewal reminders to Anita Desai & Sunita Verma — policies expire in under 2 days.', priority: 'high' },
  { id: 'ai-2', text: 'Deepak Rao has an overdue payment of ₹22,000. Initiate a follow-up call today.', priority: 'high' },
  { id: 'ai-3', text: 'June revenue is ₹4.2L — 10.5% above target. Great month! Review top-performing policies.', priority: 'info' },
  { id: 'ai-4', text: 'Vikram Singh\'s Life policy expires Jun 29. Cross-sell a Health plan during renewal.', priority: 'medium' },
];

const POLICY_COLORS = { Vehicle: '#0B1F4D', Health: '#C9A227', Life: '#10B981', Other: '#94A3B8' };

/* ── Custom Tooltip for Revenue Chart ────────────────────── */
function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '0.75rem 1rem',
      boxShadow: 'var(--shadow-lg)', fontSize: '0.8rem',
    }}>
      <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: '0.2rem 0', fontWeight: 600 }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
}

/* ── Custom Pie Label ─────────────────────────────────────── */
function CustomPieLegend({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', paddingLeft: '0.5rem' }}>
      {data.map((entry) => (
        <div key={entry.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: entry.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{entry.name}</span>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

/* ── Avatar chip ─────────────────────────────────────────── */
function AvatarChip({ name, size = 36 }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#0B1F4D', '#2952a3', '#C9A227', '#10B981', '#3B82F6', '#8B5CF6'];
  const color  = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontSize: size < 36 ? '0.65rem' : '0.78rem',
      fontWeight: 700, flexShrink: 0,
    }}>{initials}</div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate();

  const recentCustomers  = useMemo(() => [...customers].slice(0, 5), []);
  const upcomingRenewals = useMemo(() => [...renewals].sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 5), []);

  /* KPI data */
  const KPI_CARDS = [
    {
      id: 'kpi-customers',
      icon: Users,
      iconBg: 'rgba(11,31,77,0.1)',
      iconColor: 'var(--primary)',
      label: 'Total Customers',
      value: kpis.totalCustomers,
      delta: `+${kpis.newThisMonth} this month`,
      deltaDir: 'up',
    },
    {
      id: 'kpi-policies',
      icon: Shield,
      iconBg: 'rgba(59,130,246,0.1)',
      iconColor: 'var(--info)',
      label: 'Active Policies',
      value: kpis.activePolicies,
      delta: `${kpis.expiringThisMonth} expiring soon`,
      deltaDir: 'warn',
    },
    {
      id: 'kpi-revenue',
      icon: IndianRupee,
      iconBg: 'rgba(16,185,129,0.1)',
      iconColor: 'var(--success)',
      label: 'Revenue This Month',
      value: fmt(kpis.revenueThisMonth),
      delta: '+12% vs last month',
      deltaDir: 'up',
    },
    {
      id: 'kpi-payments',
      icon: AlertTriangle,
      iconBg: 'rgba(239,68,68,0.1)',
      iconColor: 'var(--danger)',
      label: 'Pending Payments',
      value: `${kpis.pendingPayments} payments`,
      delta: `${fmt(kpis.overdueAmount)} pending`,
      deltaDir: 'down',
    },
    {
      id: 'kpi-collection',
      icon: TrendingUp,
      iconBg: 'rgba(16,185,129,0.1)',
      iconColor: 'var(--success)',
      label: 'Collection Rate',
      value: `${kpis.collectionRate}%`,
      delta: 'Industry avg 85%',
      deltaDir: 'up',
    },
  ];

  const QUICK_ACTIONS = [
    { id: 'qa-add-customer',    label: 'Add Customer',    icon: UserPlus,  color: '#0B1F4D', bg: 'rgba(11,31,77,0.08)',    path: '/customers/add' },
    { id: 'qa-gen-policy',      label: 'Generate Policy', icon: FileText,  color: '#C9A227', bg: 'rgba(201,162,39,0.1)',   path: '/policies/create' },
    { id: 'qa-upload-pdf',      label: 'Upload PDF',      icon: Upload,    color: '#3B82F6', bg: 'rgba(59,130,246,0.1)',   path: '/ai-import' },
    { id: 'qa-send-reminder',   label: 'Send Reminder',   icon: Bell,      color: '#10B981', bg: 'rgba(16,185,129,0.1)',   path: '/renewals' },
  ];

  return (
    <div id="dashboard-page" className="page-wrapper animate-fade-in">

      {/* ── PAGE HEADER ───────────────────────────────────── */}
      <div className="page-header" id="dashboard-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 className="page-title">
              {greeting}, Harsidh 👋
            </h1>
            <span id="dashboard-owner-badge" className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
              Owner
            </span>
          </div>
          <p className="page-subtitle">
            {format(today, 'EEEE, d MMMM yyyy')} · Here's what's happening with your business today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button id="dashboard-refresh-btn" className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button id="dashboard-analytics-btn" className="btn btn-primary btn-sm" onClick={() => navigate('/analytics')}>
            <TrendingUp size={14} /> Analytics
          </button>
        </div>
      </div>

      {/* ── QUICK ACTIONS ─────────────────────────────────── */}
      <div id="quick-actions-row" style={{ display: 'flex', gap: '0.875rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {QUICK_ACTIONS.map((qa) => (
          <button
            key={qa.id}
            id={qa.id}
            onClick={() => navigate(qa.path)}
            style={{
              flex: '1 1 140px', display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: '12px', padding: '0.875rem 1.125rem',
              cursor: 'pointer', transition: 'all 0.2s ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = qa.color + '40'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: qa.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <qa.icon size={18} color={qa.color} />
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              {qa.label}
            </span>
          </button>
        ))}
      </div>

      {/* ── KPI CARDS ─────────────────────────────────────── */}
      <div id="kpi-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {KPI_CARDS.map((k) => (
          <div key={k.id} id={k.id} className="kpi-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <p className="kpi-label" style={{ marginBottom: '0.25rem' }}>{k.label}</p>
              <div className="kpi-icon" style={{ background: k.iconBg }}>
                <k.icon size={20} color={k.iconColor} />
              </div>
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className={`kpi-delta ${k.deltaDir === 'up' ? 'up' : k.deltaDir === 'down' ? 'down' : ''}`}
              style={k.deltaDir === 'warn' ? { color: 'var(--warning)' } : {}}>
              {k.deltaDir === 'up'   && <TrendingUp  size={13} />}
              {k.deltaDir === 'down' && <TrendingDown size={13} />}
              {k.deltaDir === 'warn' && <AlertTriangle size={13} />}
              {k.delta}
            </div>
          </div>
        ))}
      </div>

      {/* ── CHARTS ROW ───────────────────────────────────── */}
      <div id="charts-row" style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

        {/* Revenue Bar Chart */}
        <div id="revenue-chart-card" className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Monthly Revenue</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Jan – Jun 2026 · Revenue vs Target</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: '12px', height: '4px', background: 'var(--primary)', borderRadius: '2px', display: 'inline-block' }} />
                Revenue
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: '12px', height: '4px', background: 'var(--gold)', borderRadius: '2px', display: 'inline-block' }} />
                Target
              </span>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={v => `₹${(v/1000).toFixed(0)}K`}
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={false} tickLine={false} width={52}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="var(--primary)" radius={[5,5,0,0]} maxBarSize={36} />
                <Line
                  type="monotone" dataKey="target" name="Target"
                  stroke="var(--gold)" strokeWidth={2.5}
                  dot={{ fill: 'var(--gold)', r: 4, strokeWidth: 0 }}
                  strokeDasharray="0"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Policy Distribution Pie */}
        <div id="policy-dist-card" className="card">
          <div className="card-header" style={{ paddingBottom: '1rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Policy Distribution</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>By policy type · 142 active</p>
          </div>
          <div className="card-body" style={{ paddingTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={policyDistribution}
                  cx="50%" cy="50%"
                  innerRadius={48} outerRadius={76}
                  paddingAngle={3} dataKey="value"
                  startAngle={90} endAngle={-270}
                >
                  {policyDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v}%`, '']}
                  contentStyle={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '8px', fontSize: '0.8rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <CustomPieLegend data={policyDistribution} />
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ───────────────────────────────────── */}
      <div id="dashboard-bottom-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>

        {/* Recent Customers */}
        <div id="recent-customers-card" className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Recent Customers</h3>
            <button
              id="view-all-customers-btn"
              onClick={() => navigate('/customers')}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.78rem', color: 'var(--primary-lighter)', padding: '0.25rem 0.5rem' }}
            >
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="card-body" style={{ paddingTop: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {recentCustomers.map((c, i) => (
              <div
                key={c.id}
                id={`recent-customer-${c.id}`}
                onClick={() => navigate(`/customers/${c.id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.625rem 0.75rem', borderRadius: '9px',
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <AvatarChip name={c.name} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{c.policyType} · {c.city}</p>
                </div>
                <span className={`badge ${
                  c.status === 'Active'   ? 'badge-success' :
                  c.status === 'Expiring' ? 'badge-warning' : 'badge-danger'
                }`} style={{ fontSize: '0.65rem', flexShrink: 0 }}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div id="upcoming-renewals-card" className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Upcoming Renewals</h3>
            <button
              id="view-all-renewals-btn"
              onClick={() => navigate('/renewals')}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.78rem', color: 'var(--primary-lighter)', padding: '0.25rem 0.5rem' }}
            >
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="card-body" style={{ paddingTop: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {upcomingRenewals.map((r) => (
              <div
                key={r.id}
                id={`renewal-item-${r.id}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.625rem 0.75rem', borderRadius: '9px',
                  border: '1px solid var(--border)', transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: renewalUrgencyBg(r.daysLeft), display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Clock size={16} color={renewalUrgencyColor(r.daysLeft)} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.customer}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{r.type} · {format(new Date(r.expiryDate), 'd MMM yyyy')}</p>
                </div>
                <div style={{
                  background: renewalUrgencyBg(r.daysLeft),
                  color: renewalUrgencyColor(r.daysLeft),
                  fontSize: '0.7rem', fontWeight: 700,
                  padding: '0.2rem 0.5rem', borderRadius: '6px', flexShrink: 0,
                  textAlign: 'center', minWidth: '40px',
                }}>
                  {r.daysLeft === 0 ? 'TODAY' : `${r.daysLeft}d`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div id="ai-suggestions-card" className="card" style={{ background: 'linear-gradient(180deg, var(--surface) 0%, rgba(11,31,77,0.02) 100%)' }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', paddingBottom: '0.75rem' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(201,162,39,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lightbulb size={16} color="var(--gold)" />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>AI Suggestions</h3>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Smart insights for today</p>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {AI_SUGGESTIONS.map((s) => (
              <div
                key={s.id}
                id={s.id}
                style={{
                  display: 'flex', gap: '0.625rem', alignItems: 'flex-start',
                  padding: '0.75rem', borderRadius: '9px',
                  background: s.priority === 'high' ? 'var(--danger-bg)' :
                               s.priority === 'medium' ? 'var(--warning-bg)' : 'var(--info-bg)',
                  border: `1px solid ${
                    s.priority === 'high'   ? 'rgba(239,68,68,0.15)' :
                    s.priority === 'medium' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)'
                  }`,
                }}
              >
                <Lightbulb
                  size={14}
                  color={s.priority === 'high' ? 'var(--danger)' : s.priority === 'medium' ? 'var(--warning)' : 'var(--info)'}
                  style={{ flexShrink: 0, marginTop: '1px' }}
                />
                <p style={{
                  fontSize: '0.79rem', lineHeight: 1.45, margin: 0,
                  color: s.priority === 'high' ? 'var(--danger-text)' :
                         s.priority === 'medium' ? 'var(--warning-text)' : 'var(--info-text)',
                }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
