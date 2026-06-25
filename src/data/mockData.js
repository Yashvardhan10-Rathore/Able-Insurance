// ── Mock Data for Able Insurance Management System ──────────────

export const currentUser = {
  id: 'USR001',
  name: 'Harsidh Panseriya',
  email: 'harsidh.panseriya@ableinsurance.com',
  role: 'owner',
  avatar: 'HP',
  company: 'Able Insurance',
};

export const customers = [
  { id: 'CLI1001', name: 'Rahul Patel',   mobile: '9876543210', email: 'rahul.patel@email.com',   policyType: 'Vehicle',  renewalDate: '2026-07-15', status: 'Active',   premium: 18500, city: 'Ahmedabad', state: 'Gujarat', vehicle: 'GJ05AB1234', policies: 2 },
  { id: 'CLI1002', name: 'Priya Shah',    mobile: '9865432109', email: 'priya.shah@email.com',    policyType: 'Health',   renewalDate: '2026-08-22', status: 'Active',   premium: 24000, city: 'Surat',     state: 'Gujarat', vehicle: null,         policies: 1 },
  { id: 'CLI1003', name: 'Vikram Singh',  mobile: '9854321098', email: 'vikram.singh@email.com',  policyType: 'Life',     renewalDate: '2026-06-30', status: 'Expiring', premium: 36000, city: 'Vadodara',  state: 'Gujarat', vehicle: null,         policies: 1 },
  { id: 'CLI1004', name: 'Anita Desai',   mobile: '9843210987', email: 'anita.desai@email.com',   policyType: 'Vehicle',  renewalDate: '2026-06-27', status: 'Expiring', premium: 12000, city: 'Rajkot',    state: 'Gujarat', vehicle: 'GJ03CD5678', policies: 1 },
  { id: 'CLI1005', name: 'Suresh Kumar',  mobile: '9832109876', email: 'suresh.kumar@email.com',  policyType: 'Health',   renewalDate: '2026-09-10', status: 'Active',   premium: 30000, city: 'Mumbai',    state: 'Maharashtra', vehicle: null,   policies: 2 },
  { id: 'CLI1006', name: 'Meena Joshi',   mobile: '9821098765', email: 'meena.joshi@email.com',   policyType: 'Vehicle',  renewalDate: '2026-05-15', status: 'Expired',  premium: 15000, city: 'Pune',      state: 'Maharashtra', vehicle: 'MH12EF9012', policies: 1 },
  { id: 'CLI1007', name: 'Ravi Thakur',   mobile: '9810987654', email: 'ravi.thakur@email.com',   policyType: 'Life',     renewalDate: '2026-10-01', status: 'Active',   premium: 48000, city: 'Jaipur',    state: 'Rajasthan', vehicle: null,      policies: 1 },
  { id: 'CLI1008', name: 'Kavita Mehta',  mobile: '9809876543', email: 'kavita.mehta@email.com',  policyType: 'Vehicle',  renewalDate: '2026-11-20', status: 'Active',   premium: 20000, city: 'Ahmedabad', state: 'Gujarat', vehicle: 'GJ01GH3456', policies: 1 },
  { id: 'CLI1009', name: 'Deepak Rao',    mobile: '9898765432', email: 'deepak.rao@email.com',    policyType: 'Health',   renewalDate: '2026-07-05', status: 'Active',   premium: 22000, city: 'Bangalore', state: 'Karnataka', vehicle: null,     policies: 2 },
  { id: 'CLI1010', name: 'Sunita Verma',  mobile: '9887654321', email: 'sunita.verma@email.com',  policyType: 'Vehicle',  renewalDate: '2026-06-25', status: 'Expiring', premium: 14500, city: 'Delhi',     state: 'Delhi',     vehicle: 'DL01IJ7890', policies: 1 },
  { id: 'CLI1011', name: 'Aakash Nair',   mobile: '9876543211', email: 'aakash.nair@email.com',   policyType: 'Life',     renewalDate: '2026-12-15', status: 'Active',   premium: 55000, city: 'Kochi',     state: 'Kerala',    vehicle: null,       policies: 1 },
  { id: 'CLI1012', name: 'Pooja Agarwal', mobile: '9865432100', email: 'pooja.agarwal@email.com', policyType: 'Vehicle',  renewalDate: '2026-04-10', status: 'Expired',  premium: 16000, city: 'Lucknow',   state: 'UP',        vehicle: 'UP32KL1234', policies: 1 },
];

export const policies = [
  { id: 'POL-2024-001', customerId: 'CLI1001', customer: 'Rahul Patel',   type: 'Vehicle',  startDate: '2025-07-15', expiryDate: '2026-07-14', premium: 18500, status: 'Active',  vehicle: 'GJ05AB1234', insurer: 'HDFC ERGO' },
  { id: 'POL-2024-002', customerId: 'CLI1002', customer: 'Priya Shah',    type: 'Health',   startDate: '2025-08-22', expiryDate: '2026-08-21', premium: 24000, status: 'Active',  vehicle: null,          insurer: 'Star Health' },
  { id: 'POL-2024-003', customerId: 'CLI1003', customer: 'Vikram Singh',  type: 'Life',     startDate: '2020-06-30', expiryDate: '2026-06-29', premium: 36000, status: 'Expiring',vehicle: null,          insurer: 'LIC India' },
  { id: 'POL-2024-004', customerId: 'CLI1004', customer: 'Anita Desai',   type: 'Vehicle',  startDate: '2025-06-27', expiryDate: '2026-06-26', premium: 12000, status: 'Expiring',vehicle: 'GJ03CD5678',  insurer: 'Bajaj Allianz' },
  { id: 'POL-2024-005', customerId: 'CLI1005', customer: 'Suresh Kumar',  type: 'Health',   startDate: '2025-09-10', expiryDate: '2026-09-09', premium: 30000, status: 'Active',  vehicle: null,          insurer: 'Niva Bupa' },
  { id: 'POL-2024-006', customerId: 'CLI1006', customer: 'Meena Joshi',   type: 'Vehicle',  startDate: '2024-05-15', expiryDate: '2025-05-14', premium: 15000, status: 'Expired', vehicle: 'MH12EF9012',  insurer: 'ICICI Lombard' },
  { id: 'POL-2024-007', customerId: 'CLI1007', customer: 'Ravi Thakur',   type: 'Life',     startDate: '2025-10-01', expiryDate: '2026-09-30', premium: 48000, status: 'Active',  vehicle: null,          insurer: 'SBI Life' },
  { id: 'POL-2024-008', customerId: 'CLI1008', customer: 'Kavita Mehta',  type: 'Vehicle',  startDate: '2025-11-20', expiryDate: '2026-11-19', premium: 20000, status: 'Active',  vehicle: 'GJ01GH3456',  insurer: 'New India' },
  { id: 'POL-2024-009', customerId: 'CLI1009', customer: 'Deepak Rao',    type: 'Health',   startDate: '2025-07-05', expiryDate: '2026-07-04', premium: 22000, status: 'Active',  vehicle: null,          insurer: 'Max Bupa' },
  { id: 'POL-2024-010', customerId: 'CLI1010', customer: 'Sunita Verma',  type: 'Vehicle',  startDate: '2025-06-25', expiryDate: '2026-06-24', premium: 14500, status: 'Expiring',vehicle: 'DL01IJ7890',  insurer: 'HDFC ERGO' },
  { id: 'POL-2024-011', customerId: 'CLI1012', customer: 'Pooja Agarwal', type: 'Vehicle',  startDate: '2024-04-10', expiryDate: '2025-04-09', premium: 16000, status: 'Expired', vehicle: 'UP32KL1234',  insurer: 'Reliance GI' },
  { id: 'POL-2024-012', customerId: 'CLI1011', customer: 'Aakash Nair',   type: 'Life',     startDate: '2025-12-15', expiryDate: '2026-12-14', premium: 55000, status: 'Active',  vehicle: null,          insurer: 'Max Life' },
];

export const payments = [
  { id: 'PAY001', customer: 'Rahul Patel',   policy: 'POL-2024-001', premium: 18500, paid: 18500, pending: 0,     dueDate: '2026-07-15', status: 'Paid' },
  { id: 'PAY002', customer: 'Priya Shah',    policy: 'POL-2024-002', premium: 24000, paid: 12000, pending: 12000, dueDate: '2026-07-01', status: 'Partial' },
  { id: 'PAY003', customer: 'Vikram Singh',  policy: 'POL-2024-003', premium: 36000, paid: 0,     pending: 36000, dueDate: '2026-06-30', status: 'Overdue' },
  { id: 'PAY004', customer: 'Anita Desai',   policy: 'POL-2024-004', premium: 12000, paid: 12000, pending: 0,     dueDate: '2026-06-27', status: 'Paid' },
  { id: 'PAY005', customer: 'Suresh Kumar',  policy: 'POL-2024-005', premium: 30000, paid: 15000, pending: 15000, dueDate: '2026-07-10', status: 'Partial' },
  { id: 'PAY006', customer: 'Ravi Thakur',   policy: 'POL-2024-007', premium: 48000, paid: 48000, pending: 0,     dueDate: '2026-10-01', status: 'Paid' },
  { id: 'PAY007', customer: 'Kavita Mehta',  policy: 'POL-2024-008', premium: 20000, paid: 20000, pending: 0,     dueDate: '2026-11-20', status: 'Paid' },
  { id: 'PAY008', customer: 'Deepak Rao',    policy: 'POL-2024-009', premium: 22000, paid: 0,     pending: 22000, dueDate: '2026-06-28', status: 'Overdue' },
  { id: 'PAY009', customer: 'Sunita Verma',  policy: 'POL-2024-010', premium: 14500, paid: 14500, pending: 0,     dueDate: '2026-06-25', status: 'Paid' },
  { id: 'PAY010', customer: 'Aakash Nair',   policy: 'POL-2024-012', premium: 55000, paid: 27500, pending: 27500, dueDate: '2026-07-15', status: 'Partial' },
];

export const renewals = [
  { id: 'REN001', customer: 'Sunita Verma',  policy: 'POL-2024-010', type: 'Vehicle', expiryDate: '2026-06-24', daysLeft: 0,  status: 'Sent',    mobile: '9887654321' },
  { id: 'REN002', customer: 'Anita Desai',   policy: 'POL-2024-004', type: 'Vehicle', expiryDate: '2026-06-26', daysLeft: 2,  status: 'Sent',    mobile: '9843210987' },
  { id: 'REN003', customer: 'Vikram Singh',  policy: 'POL-2024-003', type: 'Life',    expiryDate: '2026-06-29', daysLeft: 5,  status: 'Pending', mobile: '9854321098' },
  { id: 'REN004', customer: 'Rahul Patel',   policy: 'POL-2024-001', type: 'Vehicle', expiryDate: '2026-07-14', daysLeft: 20, status: 'Pending', mobile: '9876543210' },
  { id: 'REN005', customer: 'Deepak Rao',    policy: 'POL-2024-009', type: 'Health',  expiryDate: '2026-07-04', daysLeft: 10, status: 'Sent',    mobile: '9898765432' },
  { id: 'REN006', customer: 'Priya Shah',    policy: 'POL-2024-002', type: 'Health',  expiryDate: '2026-08-21', daysLeft: 58, status: 'Pending', mobile: '9865432109' },
  { id: 'REN007', customer: 'Suresh Kumar',  policy: 'POL-2024-005', type: 'Health',  expiryDate: '2026-09-09', daysLeft: 77, status: 'Pending', mobile: '9832109876' },
];

export const documents = [
  { id: 'DOC001', name: 'POL-2024-001_Rahul_Vehicle.pdf',   customer: 'Rahul Patel',  policy: 'POL-2024-001', type: 'Vehicle', size: '245 KB', uploadDate: '2025-07-15', category: 'Policy' },
  { id: 'DOC002', name: 'POL-2024-002_Priya_Health.pdf',    customer: 'Priya Shah',   policy: 'POL-2024-002', type: 'Health',  size: '312 KB', uploadDate: '2025-08-22', category: 'Policy' },
  { id: 'DOC003', name: 'CLI1001_RC_Book.pdf',               customer: 'Rahul Patel',  policy: 'POL-2024-001', type: 'RC',      size: '189 KB', uploadDate: '2025-07-14', category: 'Vehicle' },
  { id: 'DOC004', name: 'POL-2024-003_Vikram_Life.pdf',     customer: 'Vikram Singh', policy: 'POL-2024-003', type: 'Life',    size: '428 KB', uploadDate: '2020-06-30', category: 'Policy' },
  { id: 'DOC005', name: 'CLI1002_Health_Report.pdf',         customer: 'Priya Shah',   policy: 'POL-2024-002', type: 'Health',  size: '1.2 MB', uploadDate: '2025-08-20', category: 'Health' },
  { id: 'DOC006', name: 'POL-2024-007_Ravi_Life.pdf',       customer: 'Ravi Thakur',  policy: 'POL-2024-007', type: 'Life',    size: '356 KB', uploadDate: '2025-10-01', category: 'Policy' },
  { id: 'DOC007', name: 'CLI1004_DL_Copy.pdf',               customer: 'Anita Desai',  policy: 'POL-2024-004', type: 'DL',      size: '156 KB', uploadDate: '2025-06-26', category: 'Vehicle' },
  { id: 'DOC008', name: 'POL-2024-008_Kavita_Vehicle.pdf',  customer: 'Kavita Mehta', policy: 'POL-2024-008', type: 'Vehicle', size: '278 KB', uploadDate: '2025-11-20', category: 'Policy' },
];

export const notifications = [
  { id: 'N001', type: 'renewal',  title: 'Policy Expiring Today',         message: 'Sunita Verma - Vehicle policy (POL-2024-010) expires today.', time: '2 min ago',   read: false, priority: 'high' },
  { id: 'N002', type: 'payment',  title: 'Overdue Payment Alert',         message: 'Deepak Rao has an overdue payment of ₹22,000 for POL-2024-009.', time: '15 min ago', read: false, priority: 'high' },
  { id: 'N003', type: 'renewal',  title: 'Policy Expiring in 2 Days',     message: 'Anita Desai - Vehicle policy (POL-2024-004) expires on Jun 26.', time: '1 hr ago',   read: false, priority: 'high' },
  { id: 'N004', type: 'payment',  title: 'Overdue Payment - Vikram Singh',message: 'Life policy premium of ₹36,000 is overdue since Jun 30.', time: '2 hr ago',   read: true,  priority: 'medium' },
  { id: 'N005', type: 'system',   title: 'New Customer Added',            message: 'Aakash Nair was added as a new customer by Agent Priya.', time: '3 hr ago',   read: true,  priority: 'low' },
  { id: 'N006', type: 'renewal',  title: 'Renewal Reminder Sent',         message: 'Reminder sent to Rahul Patel for vehicle policy renewal.', time: '5 hr ago',   read: true,  priority: 'low' },
  { id: 'N007', type: 'email',    title: 'Policy PDF Emailed',            message: 'Policy document emailed to suresh.kumar@email.com successfully.', time: '1 day ago',  read: true,  priority: 'low' },
  { id: 'N008', type: 'system',   title: 'Backup Completed',              message: 'Daily data backup completed successfully at 2:00 AM.', time: '1 day ago',  read: true,  priority: 'low' },
];

export const revenueData = [
  { month: 'Jan', revenue: 285000, target: 300000, policies: 18 },
  { month: 'Feb', revenue: 312000, target: 300000, policies: 22 },
  { month: 'Mar', revenue: 298000, target: 310000, policies: 20 },
  { month: 'Apr', revenue: 345000, target: 320000, policies: 25 },
  { month: 'May', revenue: 378000, target: 350000, policies: 28 },
  { month: 'Jun', revenue: 420000, target: 380000, policies: 31 },
];

export const policyDistribution = [
  { name: 'Vehicle',  value: 45, color: '#0B1F4D' },
  { name: 'Health',   value: 30, color: '#C9A227' },
  { name: 'Life',     value: 20, color: '#10B981' },
  { name: 'Other',    value: 5,  color: '#94A3B8' },
];

export const customerGrowth = [
  { month: 'Jan', new: 12, total: 65 },
  { month: 'Feb', new: 18, total: 83 },
  { month: 'Mar', new: 15, total: 98 },
  { month: 'Apr', new: 22, total: 120 },
  { month: 'May', new: 19, total: 139 },
  { month: 'Jun', new: 28, total: 167 },
];

export const collectionData = [
  { month: 'Jan', collected: 240000, pending: 45000 },
  { month: 'Feb', collected: 280000, pending: 32000 },
  { month: 'Mar', collected: 265000, pending: 33000 },
  { month: 'Apr', collected: 310000, pending: 35000 },
  { month: 'May', collected: 340000, pending: 38000 },
  { month: 'Jun', collected: 375000, pending: 45000 },
];

export const agents = [
  { id: 'AGT001', name: 'Priya Menon',    role: 'agent',      email: 'priya@ableinsurance.com',   customers: 45, policies: 52, status: 'Active' },
  { id: 'AGT002', name: 'Rohan Gupta',    role: 'agent',      email: 'rohan@ableinsurance.com',   customers: 38, policies: 44, status: 'Active' },
  { id: 'AGT003', name: 'Neha Pillai',    role: 'accountant', email: 'neha@ableinsurance.com',    customers: 0,  policies: 0,  status: 'Active' },
  { id: 'AGT004', name: 'Karan Bhatia',   role: 'agent',      email: 'karan@ableinsurance.com',   customers: 29, policies: 31, status: 'Inactive' },
  { id: 'AGT005', name: 'Harsidh Panseriya',   role: 'owner',      email: 'harsidh@ableinsurance.com',   customers: 55, policies: 64, status: 'Active' },
];

export const kpis = {
  totalCustomers: 167,
  activePolicies: 142,
  expiringThisMonth: 8,
  revenueThisMonth: 420000,
  pendingPayments: 12,
  overdueAmount: 83500,
  collectionRate: 91,
  newThisMonth: 28,
};
