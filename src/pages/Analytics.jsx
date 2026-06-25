import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  TrendingUp, Users, Shield, Percent, Download,
  Calendar, ArrowUpRight, BarChart2, Star
} from 'lucide-react';
import {
  revenueData,
  policyDistribution,
  customerGrowth,
  collectionData,
  kpis,
  customers,
} from '../data/mockData';

/* ─── Extra analytics data derived / extended ────────────────── */
const monthlyRenewals = [
  { month: 'Jan', renewals: 8 },
  { month: 'Feb', renewals: 11 },
  { month: 'Mar', renewals: 7 },
  { month: 'Apr', renewals: 14 },
  { month: 'May', renewals: 9 },
  { month: 'Jun', renewals: 12 },
];

const insuranceTypeRevenue = [
  { type: 'Vehicle', revenue: 920000 },
  { type: 'Health',  revenue: 610000 },
  { type: 'Life',    revenue: 508000 },
];

const topCustomers = customers
  .sort((a, b) => b.premium - a.premium)
  .slice(0, 5)
  .map((c, i) => ({ ...c, rank: i + 1 }));

const formatINR = (n) => '₹' + Number(n).toLocaleString('en-IN');
const formatLakh = (n) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  return formatINR(n);
};

/* ─── Color palette ──────────────────────────────────────────── */
const COLORS = {
  primary:   '#0B1F4D',
  gold:      '#C9A227',
  success:   '#10B981',
  info:      '#3B82F6',
  muted:     '#94A3B8',
  light:     '#E2E8F0',
};

/* ─── Custom Tooltip ─────────────────────────────────────────── */
function ChartTooltip({ active, payload, label, prefix = '₹', isCurrency = true }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '0.625rem 0.875rem',
      boxShadow: 'var(--shadow-md)',
      fontSize: '0.8rem',
    }}>
      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>{label}</div>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: entry.color }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, display: 'inline-block' }} />
          <span style={{ color: 'var(--text-secondary)' }}>{entry.name}:</span>
          <strong>{isCurrency ? formatLakh(entry.value) : entry.value}</strong>
        </div>
      ))}
    </div>
  );
}

/* ─── Custom Pie Legend ──────────────────────────────────────── */
function PieLegend({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
      {data.map((d) => (
        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.78rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, display: 'inline-block' }} />
          <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
          <strong style={{ color: 'var(--text-primary)' }}>{d.value}%</strong>
        </div>
      ))}
    </div>
  );
}

/* ─── Card with header ───────────────────────────────────────── */
function ChartCard({ title, subtitle, children, style }) {
  return (
    <div className="card" style={{ overflow: 'hidden', ...style }}>
      <div className="card-header">
        <div className="flex justify-between items-center" style={{ marginBottom: '0.25rem' }}>
          <div>
            <div className="font-semi text-sm" style={{ color: 'var(--text-primary)' }}>{title}</div>
            {subtitle && <div className="text-xs" style={{ color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
          </div>
          <BarChart2 size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
      <div style={{ padding: '0.75rem 1rem 1.25rem' }}>
        {children}
      </div>
    </div>
  );
}

const DATE_RANGES = ['This Month', 'This Quarter', 'This Year'];

/* ─── Main Component ─────────────────────────────────────────── */
export default function Analytics() {
  const [dateRange, setDateRange] = useState('This Month');

  const kpiCards = [
    {
      label: 'Total Revenue',
      value: '₹20.38L',
      icon: TrendingUp,
      bg: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
      iconBg: 'rgba(255,255,255,0.15)',
      iconColor: 'white',
      textColor: 'white',
      delta: '+12.4%',
      deltaDir: 'up',
    },
    {
      label: 'Total Customers',
      value: kpis.totalCustomers,
      icon: Users,
      bg: 'var(--surface)',
      iconBg: 'rgba(201,162,39,0.12)',
      iconColor: 'var(--gold-dark)',
      textColor: 'var(--text-primary)',
      delta: '+28 this month',
      deltaDir: 'up',
    },
    {
      label: 'Active Policies',
      value: kpis.activePolicies,
      icon: Shield,
      bg: 'var(--surface)',
      iconBg: 'rgba(16,185,129,0.12)',
      iconColor: 'var(--success)',
      textColor: 'var(--text-primary)',
      delta: '+8 this month',
      deltaDir: 'up',
    },
    {
      label: 'Collection Rate',
      value: `${kpis.collectionRate}%`,
      icon: Percent,
      bg: 'var(--surface)',
      iconBg: 'rgba(59,130,246,0.12)',
      iconColor: 'var(--info)',
      textColor: 'var(--text-primary)',
      delta: '+3.1% vs last',
      deltaDir: 'up',
    },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics &amp; Reports</h1>
          <p className="page-subtitle">Business intelligence and performance insights</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date Range Selector */}
          <div className="flex" style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: 3, gap: 2 }}>
            {DATE_RANGES.map((r) => (
              <button
                key={r}
                id={`range-${r.replace(/\s+/g, '-').toLowerCase()}`}
                className="btn btn-sm"
                style={{
                  background: dateRange === r ? 'var(--surface)' : 'transparent',
                  color: dateRange === r ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: dateRange === r ? 700 : 500,
                  boxShadow: dateRange === r ? 'var(--shadow-xs)' : 'none',
                  border: 'none',
                }}
                onClick={() => setDateRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <button id="export-report-btn" className="btn btn-gold">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-4 gap-4" style={{ marginBottom: '1.5rem' }}>
        {kpiCards.map((k, i) => (
          <motion.div
            key={k.label}
            className="kpi-card"
            style={{ background: k.bg, border: k.bg.includes('gradient') ? 'none' : undefined }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <div className="flex justify-between items-center">
              <p className="kpi-label" style={{ color: k.textColor === 'white' ? 'rgba(255,255,255,0.7)' : undefined }}>{k.label}</p>
              <div className="kpi-icon" style={{ background: k.iconBg }}>
                <k.icon size={20} color={k.iconColor} />
              </div>
            </div>
            <div className="kpi-value" style={{ color: k.textColor }}>{k.value}</div>
            <div className="kpi-delta up" style={{ color: k.textColor === 'white' ? 'rgba(255,255,255,0.8)' : undefined }}>
              <ArrowUpRight size={13} /> {k.delta}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts Grid 2×2 ── */}
      <div className="grid grid-2 gap-4" style={{ marginBottom: '1.25rem' }}>
        {/* 1. Revenue Growth – AreaChart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <ChartCard title="Revenue Growth" subtitle="Monthly revenue vs last 6 months">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS.primary} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS.gold} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={COLORS.gold} stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={50} />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.78rem' }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={COLORS.primary} strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ r: 3, fill: COLORS.primary }} />
                <Area type="monotone" dataKey="target"  name="Target"  stroke={COLORS.gold}    strokeWidth={2}   fill="url(#targetGrad)"  strokeDasharray="4 3" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* 2. Policy Distribution – Donut PieChart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <ChartCard title="Policy Distribution" subtitle="Breakdown by insurance type">
            <ResponsiveContainer width="100%" height={195}>
              <PieChart>
                <Pie
                  data={policyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {policyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--surface)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    fontSize: '0.8rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <PieLegend data={policyDistribution} />
          </ChartCard>
        </motion.div>

        {/* 3. Customer Growth – LineChart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.29 }}>
          <ChartCard title="Customer Growth" subtitle="New customers acquired per month">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={customerGrowth} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={35} />
                <Tooltip content={<ChartTooltip isCurrency={false} />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.78rem' }} />
                <Line type="monotone" dataKey="new"   name="New Customers" stroke={COLORS.gold}    strokeWidth={2.5} dot={{ r: 4, fill: COLORS.gold }}    activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="total" name="Total Base"    stroke={COLORS.primary} strokeWidth={2}   dot={{ r: 3, fill: COLORS.primary }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* 4. Collection Performance – BarChart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
          <ChartCard title="Collection Performance" subtitle="Collected vs pending amounts monthly">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={collectionData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barSize={16} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={50} />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.78rem' }} />
                <Bar dataKey="collected" name="Collected" fill={COLORS.success} radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending"   name="Pending"   fill={COLORS.gold}    radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>
      </div>

      {/* ── Second Row – 2 Wide Charts ── */}
      <div className="grid grid-2 gap-4" style={{ marginBottom: '1.5rem' }}>
        {/* 5. Monthly Renewals – BarChart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.43 }}>
          <ChartCard title="Monthly Renewals" subtitle="Number of policies renewed per month">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyRenewals} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip
                  formatter={(v) => [v, 'Renewals']}
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: '0.8rem' }}
                />
                <Bar dataKey="renewals" name="Renewals" radius={[5, 5, 0, 0]}>
                  {monthlyRenewals.map((_, index) => (
                    <Cell key={index} fill={index === monthlyRenewals.length - 1 ? COLORS.gold : COLORS.primary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* 6. Insurance Type Revenue – Horizontal BarChart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <ChartCard title="Revenue by Insurance Type" subtitle="Total premium collected by category">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={insuranceTypeRevenue}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
                barSize={22}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="type" tick={{ fontSize: 12, fill: 'var(--text-secondary)', fontWeight: 600 }} axisLine={false} tickLine={false} width={55} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="revenue" name="Revenue" radius={[0, 5, 5, 0]}>
                  <Cell fill={COLORS.primary} />
                  <Cell fill={COLORS.gold} />
                  <Cell fill={COLORS.success} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Mini stats below the chart */}
            <div className="flex gap-3" style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
              {insuranceTypeRevenue.map((t, i) => {
                const colors = [COLORS.primary, COLORS.gold, COLORS.success];
                return (
                  <div key={t.type} style={{ flex: 1, textAlign: 'center' }}>
                    <div className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: 2 }}>{t.type}</div>
                    <div className="text-sm font-semi" style={{ color: colors[i] }}>{formatLakh(t.revenue)}</div>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </motion.div>
      </div>

      {/* ── Top Customers Table ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.57 }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-header" style={{ paddingBottom: '0.5rem' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semi text-sm" style={{ color: 'var(--text-primary)' }}>Top Customers by Premium</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)', marginTop: 2 }}>Highest value policyholders</div>
              </div>
              <Star size={16} style={{ color: 'var(--gold)' }} />
            </div>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Customer</th>
                  <th>City</th>
                  <th>Policy Type</th>
                  <th>Policies</th>
                  <th>Total Premium</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div
                        style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: c.rank === 1 ? 'rgba(201,162,39,0.15)' : c.rank === 2 ? 'var(--bg-secondary)' : 'var(--bg)',
                          border: `2px solid ${c.rank === 1 ? 'var(--gold)' : c.rank === 2 ? 'var(--border)' : 'var(--border-light)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 700,
                          color: c.rank === 1 ? 'var(--gold-dark)' : 'var(--text-secondary)',
                        }}
                      >
                        {c.rank}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.7rem' }}>
                          {c.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semi text-sm">{c.name}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c.city}</td>
                    <td>
                      <span className={`badge ${c.policyType === 'Life' ? 'badge-gold' : c.policyType === 'Health' ? 'badge-success' : 'badge-info'}`}>
                        {c.policyType}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-primary">{c.policies} {c.policies === 1 ? 'policy' : 'policies'}</span>
                    </td>
                    <td>
                      <div className="font-semi" style={{ color: 'var(--primary)' }}>{formatINR(c.premium)}</div>
                      <div className="progress-bar" style={{ marginTop: '0.375rem', width: 100 }}>
                        <div
                          className="progress-fill"
                          style={{ width: `${(c.premium / topCustomers[0].premium) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${c.status === 'Active' ? 'badge-success' : c.status === 'Expiring' ? 'badge-warning' : 'badge-danger'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
