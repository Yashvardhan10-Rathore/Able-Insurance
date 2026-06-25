import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, FileText, Car, Upload, CreditCard, CheckCircle,
  ArrowLeft, ArrowRight, X, CloudUpload, Users,
  Phone, Mail, Briefcase, Calendar, Shield, Heart,
  AlertCircle, Banknote, Hash, Building,
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ── Step config ─────────────────────────────────────────── */
const STEPS = [
  { label: 'Personal Info',  icon: User },
  { label: 'Policy Info',    icon: FileText },
  { label: 'Vehicle Info',   icon: Car },
  { label: 'Documents',      icon: Upload },
  { label: 'Payment',        icon: CreditCard },
  { label: 'Review',         icon: CheckCircle },
];

/* ── DocDropzone ─────────────────────────────────────────── */
function DocDropzone({ id, label, required, onFileDrop, fileValue }) {
  const onDrop = useCallback((accepted) => {
    if (accepted.length) onFileDrop(accepted[0]);
  }, [onFileDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
  });

  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
        {label}{required && <span style={{ color: 'var(--danger)' }}> *</span>}
      </label>
      <div
        {...getRootProps()}
        id={id}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
        style={{ padding: fileValue ? '1rem 1.25rem' : '1.25rem', cursor: 'pointer' }}
      >
        <input {...getInputProps()} />
        {fileValue ? (
          <div className="flex items-center gap-3">
            <div style={{
              width: 36, height: 36, borderRadius: 6, background: 'rgba(11,31,77,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <FileText size={18} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{fileValue.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {(fileValue.size / 1024).toFixed(1)} KB · Click to replace
              </div>
            </div>
            <CheckCircle size={18} color="var(--success)" style={{ marginLeft: 'auto' }} />
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <CloudUpload size={24} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {isDragActive ? 'Drop it here!' : 'Drag & drop or click to upload'}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>PDF, PNG or JPG up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── ReviewField ─────────────────────────────────────────── */
function ReviewField({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

/* ── ReviewSection ───────────────────────────────────────── */
function ReviewSection({ title, icon: Icon, color, children }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={14} color={color} />
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
      </div>
      <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
        <div className="grid grid-2 gap-4">{children}</div>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function AddCustomer() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '', lastName: '', dob: '', gender: '',
      mobile: '', altMobile: '', email: '', occupation: '',
      policyType: 'Vehicle', insurer: '', policyNumber: '',
      startDate: '', expiryDate: '', sumAssured: '', premium: '',
      vehicleNumber: '', make: '', model: '', year: '', variant: '',
      chassisNo: '', engineNo: '', color: '',
      paymentMode: 'Online', amountPaid: '', paymentDate: '', receiptNumber: '', pendingAmount: '',
    },
  });

  const policyType = watch('policyType');
  const allValues = getValues();

  /* Step validation fields */
  const stepFields = [
    ['firstName', 'lastName', 'dob', 'gender', 'mobile', 'email'],
    ['policyType', 'insurer', 'policyNumber', 'startDate', 'expiryDate', 'premium'],
    policyType === 'Vehicle' ? ['vehicleNumber', 'make', 'model', 'year'] : [],
    [],
    ['paymentMode', 'amountPaid', 'paymentDate'],
    [],
  ];

  const handleNext = async () => {
    const fields = stepFields[step];
    const valid = fields.length === 0 || await trigger(fields);
    if (valid) setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const handlePrev = () => setStep((s) => Math.max(0, s - 1));

  const onSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    toast.success('Customer added successfully!', { duration: 4000 });
    navigate('/customers');
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <button
            id="add-customer-back"
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: '0.5rem' }}
            onClick={() => navigate('/customers')}
          >
            <ArrowLeft size={16} /> Back to Customers
          </button>
          <h1 className="page-title">Add New Customer</h1>
          <p className="page-subtitle">Fill in the details to onboard a new customer</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem', background: 'var(--bg-secondary)',
          borderRadius: 8, fontSize: '0.8rem', color: 'var(--text-muted)',
        }}>
          <Users size={15} /> Step {step + 1} of {STEPS.length}
        </div>
      </div>

      {/* Step Indicator */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
        <div className="step-indicator">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isCompleted = i < step;
            const isActive = i === step;
            return (
              <React.Fragment key={s.label}>
                <div className="step-item" style={{ flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div
                    id={`step-circle-${i}`}
                    className={`step-circle ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}
                    style={{ cursor: isCompleted ? 'pointer' : 'default' }}
                    onClick={() => isCompleted && setStep(i)}
                  >
                    {isCompleted ? <CheckCircle size={14} /> : <Icon size={13} />}
                  </div>
                  <div className={`step-label ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}>
                    {s.label}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`step-line ${isCompleted ? 'completed' : ''}`}
                    style={{ marginBottom: '1.2rem' }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Step Title Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          {React.createElement(STEPS[step].icon, { size: 18, color: 'var(--primary)' })}
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{STEPS[step].label}</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              style={{ padding: '1.75rem 1.5rem' }}
            >

              {/* ── STEP 0: Personal Info ────────────────── */}
              {step === 0 && (
                <div className="grid grid-2 gap-4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="firstName">First Name <span>*</span></label>
                    <input
                      id="firstName"
                      className={`form-input ${errors.firstName ? 'error' : ''}`}
                      placeholder="Rahul"
                      {...register('firstName', { required: 'First name is required' })}
                    />
                    {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="lastName">Last Name <span>*</span></label>
                    <input
                      id="lastName"
                      className={`form-input ${errors.lastName ? 'error' : ''}`}
                      placeholder="Patel"
                      {...register('lastName', { required: 'Last name is required' })}
                    />
                    {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="dob">Date of Birth <span>*</span></label>
                    <input
                      id="dob"
                      type="date"
                      className={`form-input ${errors.dob ? 'error' : ''}`}
                      {...register('dob', { required: 'Date of birth is required' })}
                    />
                    {errors.dob && <span className="form-error">{errors.dob.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="gender">Gender <span>*</span></label>
                    <select
                      id="gender"
                      className={`form-select ${errors.gender ? 'error' : ''}`}
                      {...register('gender', { required: 'Gender is required' })}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="form-error">{errors.gender.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="mobile">Mobile Number <span>*</span></label>
                    <div className="input-icon-wrapper">
                      <Phone size={15} className="input-icon" />
                      <input
                        id="mobile"
                        className={`form-input ${errors.mobile ? 'error' : ''}`}
                        placeholder="9876543210"
                        maxLength={10}
                        {...register('mobile', {
                          required: 'Mobile is required',
                          pattern: { value: /^\d{10}$/, message: 'Enter valid 10-digit mobile' },
                        })}
                      />
                    </div>
                    {errors.mobile && <span className="form-error">{errors.mobile.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="altMobile">Alternate Mobile</label>
                    <div className="input-icon-wrapper">
                      <Phone size={15} className="input-icon" />
                      <input
                        id="altMobile"
                        className="form-input"
                        placeholder="Optional"
                        maxLength={10}
                        {...register('altMobile')}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address <span>*</span></label>
                    <div className="input-icon-wrapper">
                      <Mail size={15} className="input-icon" />
                      <input
                        id="email"
                        type="email"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="rahul@email.com"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                        })}
                      />
                    </div>
                    {errors.email && <span className="form-error">{errors.email.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="occupation">Occupation</label>
                    <div className="input-icon-wrapper">
                      <Briefcase size={15} className="input-icon" />
                      <input
                        id="occupation"
                        className="form-input"
                        placeholder="e.g. Business Owner"
                        {...register('occupation')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 1: Policy Info ──────────────────── */}
              {step === 1 && (
                <div className="grid grid-2 gap-4">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Policy Type <span>*</span></label>
                    <div className="flex gap-3">
                      {[
                        { value: 'Vehicle', icon: Car, label: 'Vehicle Insurance' },
                        { value: 'Health',  icon: Heart, label: 'Health Insurance' },
                        { value: 'Life',    icon: Shield, label: 'Life Insurance' },
                      ].map(({ value, icon: Icon, label }) => {
                        const checked = watch('policyType') === value;
                        return (
                          <label
                            key={value}
                            htmlFor={`policyType-${value}`}
                            style={{
                              flex: 1, border: `2px solid ${checked ? 'var(--primary)' : 'var(--border)'}`,
                              borderRadius: 8, padding: '0.875rem', cursor: 'pointer',
                              background: checked ? 'rgba(11,31,77,0.04)' : 'var(--surface)',
                              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 10,
                            }}
                          >
                            <input
                              type="radio"
                              id={`policyType-${value}`}
                              value={value}
                              style={{ display: 'none' }}
                              {...register('policyType', { required: true })}
                            />
                            <div style={{
                              width: 36, height: 36, borderRadius: 6,
                              background: checked ? 'var(--primary)' : 'var(--bg-secondary)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <Icon size={18} color={checked ? 'white' : 'var(--text-muted)'} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: checked ? 'var(--primary)' : 'var(--text-primary)' }}>{label}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="insurer">Insurance Company <span>*</span></label>
                    <div className="input-icon-wrapper">
                      <Building size={15} className="input-icon" />
                      <input
                        id="insurer"
                        className={`form-input ${errors.insurer ? 'error' : ''}`}
                        placeholder="e.g. HDFC ERGO"
                        {...register('insurer', { required: 'Insurer is required' })}
                      />
                    </div>
                    {errors.insurer && <span className="form-error">{errors.insurer.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="policyNumber">Policy Number <span>*</span></label>
                    <div className="input-icon-wrapper">
                      <Hash size={15} className="input-icon" />
                      <input
                        id="policyNumber"
                        className={`form-input ${errors.policyNumber ? 'error' : ''}`}
                        placeholder="e.g. POL-2025-001"
                        {...register('policyNumber', { required: 'Policy number is required' })}
                      />
                    </div>
                    {errors.policyNumber && <span className="form-error">{errors.policyNumber.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="startDate">Start Date <span>*</span></label>
                    <div className="input-icon-wrapper">
                      <Calendar size={15} className="input-icon" />
                      <input
                        id="startDate"
                        type="date"
                        className={`form-input ${errors.startDate ? 'error' : ''}`}
                        {...register('startDate', { required: 'Start date is required' })}
                      />
                    </div>
                    {errors.startDate && <span className="form-error">{errors.startDate.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="expiryDate">Expiry Date <span>*</span></label>
                    <div className="input-icon-wrapper">
                      <Calendar size={15} className="input-icon" />
                      <input
                        id="expiryDate"
                        type="date"
                        className={`form-input ${errors.expiryDate ? 'error' : ''}`}
                        {...register('expiryDate', { required: 'Expiry date is required' })}
                      />
                    </div>
                    {errors.expiryDate && <span className="form-error">{errors.expiryDate.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="sumAssured">Sum Assured (₹)</label>
                    <div className="input-icon-wrapper">
                      <Banknote size={15} className="input-icon" />
                      <input
                        id="sumAssured"
                        type="number"
                        className="form-input"
                        placeholder="e.g. 500000"
                        {...register('sumAssured')}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="premium">Annual Premium (₹) <span>*</span></label>
                    <div className="input-icon-wrapper">
                      <Banknote size={15} className="input-icon" />
                      <input
                        id="premium"
                        type="number"
                        className={`form-input ${errors.premium ? 'error' : ''}`}
                        placeholder="e.g. 18500"
                        {...register('premium', { required: 'Premium is required', min: { value: 1, message: 'Must be positive' } })}
                      />
                    </div>
                    {errors.premium && <span className="form-error">{errors.premium.message}</span>}
                  </div>
                </div>
              )}

              {/* ── STEP 2: Vehicle Info ─────────────────── */}
              {step === 2 && (
                policyType !== 'Vehicle' ? (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '3rem', textAlign: 'center', gap: '1rem',
                  }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Car size={28} color="var(--text-muted)" />
                    </div>
                    <h3 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Not Applicable</h3>
                    <p style={{ color: 'var(--text-muted)', maxWidth: 360, fontSize: '0.875rem' }}>
                      Vehicle information is only required for Vehicle insurance policies.
                      Since you've selected <strong>{policyType}</strong> insurance, you can skip this step.
                    </p>
                    <div className="badge badge-muted" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                      {policyType === 'Health' ? <Heart size={14} /> : <Shield size={14} />}
                      {policyType} Insurance — No vehicle data needed
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-2 gap-4">
                    <div className="form-group">
                      <label className="form-label" htmlFor="vehicleNumber">Vehicle Number <span>*</span></label>
                      <input
                        id="vehicleNumber"
                        className={`form-input ${errors.vehicleNumber ? 'error' : ''}`}
                        placeholder="GJ05AB1234"
                        style={{ textTransform: 'uppercase' }}
                        {...register('vehicleNumber', { required: policyType === 'Vehicle' ? 'Vehicle number is required' : false })}
                      />
                      {errors.vehicleNumber && <span className="form-error">{errors.vehicleNumber.message}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="make">Make <span>*</span></label>
                      <input
                        id="make"
                        className={`form-input ${errors.make ? 'error' : ''}`}
                        placeholder="e.g. Maruti Suzuki"
                        {...register('make', { required: policyType === 'Vehicle' ? 'Make is required' : false })}
                      />
                      {errors.make && <span className="form-error">{errors.make.message}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="model">Model <span>*</span></label>
                      <input
                        id="model"
                        className={`form-input ${errors.model ? 'error' : ''}`}
                        placeholder="e.g. Swift Dzire"
                        {...register('model', { required: policyType === 'Vehicle' ? 'Model is required' : false })}
                      />
                      {errors.model && <span className="form-error">{errors.model.message}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="year">Year <span>*</span></label>
                      <input
                        id="year"
                        type="number"
                        className={`form-input ${errors.year ? 'error' : ''}`}
                        placeholder="2020"
                        min="1980"
                        max={new Date().getFullYear()}
                        {...register('year', { required: policyType === 'Vehicle' ? 'Year is required' : false })}
                      />
                      {errors.year && <span className="form-error">{errors.year.message}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="variant">Variant</label>
                      <input
                        id="variant"
                        className="form-input"
                        placeholder="e.g. ZXi AMT"
                        {...register('variant')}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="vColor">Color</label>
                      <input
                        id="vColor"
                        className="form-input"
                        placeholder="e.g. Arctic White"
                        {...register('color')}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="chassisNo">Chassis Number</label>
                      <input
                        id="chassisNo"
                        className="form-input"
                        placeholder="17-digit VIN"
                        style={{ fontFamily: 'monospace' }}
                        {...register('chassisNo')}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="engineNo">Engine Number</label>
                      <input
                        id="engineNo"
                        className="form-input"
                        placeholder="Engine No."
                        style={{ fontFamily: 'monospace' }}
                        {...register('engineNo')}
                      />
                    </div>
                  </div>
                )
              )}

              {/* ── STEP 3: Documents ────────────────────── */}
              {step === 3 && (
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Upload supporting documents. You can also add these later from the customer profile.
                  </p>
                  <div className="grid grid-2 gap-4">
                    {[
                      { id: 'doc-rc', label: 'RC Book', key: 'rcBook', required: policyType === 'Vehicle' },
                      { id: 'doc-dl', label: 'Driving License', key: 'drivingLicense', required: policyType === 'Vehicle' },
                      { id: 'doc-aadhaar', label: 'Aadhaar Card', key: 'aadhaar', required: true },
                      { id: 'doc-prev-policy', label: 'Previous Policy', key: 'prevPolicy', required: false },
                    ].map(({ id, label, key, required }) => (
                      <DocDropzone
                        key={id}
                        id={id}
                        label={label}
                        required={required}
                        fileValue={files[key]}
                        onFileDrop={(file) => setFiles((prev) => ({ ...prev, [key]: file }))}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 4: Payment ──────────────────────── */}
              {step === 4 && (
                <div className="grid grid-2 gap-4">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Payment Mode <span>*</span></label>
                    <div className="flex gap-3">
                      {['Cash', 'Online', 'Cheque'].map((mode) => {
                        const checked = watch('paymentMode') === mode;
                        return (
                          <label
                            key={mode}
                            htmlFor={`payMode-${mode}`}
                            style={{
                              flex: 1, border: `2px solid ${checked ? 'var(--primary)' : 'var(--border)'}`,
                              borderRadius: 8, padding: '0.75rem', cursor: 'pointer',
                              background: checked ? 'rgba(11,31,77,0.04)' : 'var(--surface)',
                              textAlign: 'center', fontSize: '0.875rem', fontWeight: checked ? 700 : 500,
                              color: checked ? 'var(--primary)' : 'var(--text-secondary)',
                              transition: 'all 0.2s',
                            }}
                          >
                            <input
                              type="radio"
                              id={`payMode-${mode}`}
                              value={mode}
                              style={{ display: 'none' }}
                              {...register('paymentMode')}
                            />
                            {mode}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="amountPaid">Amount Paid (₹) <span>*</span></label>
                    <div className="input-icon-wrapper">
                      <Banknote size={15} className="input-icon" />
                      <input
                        id="amountPaid"
                        type="number"
                        className={`form-input ${errors.amountPaid ? 'error' : ''}`}
                        placeholder="e.g. 18500"
                        {...register('amountPaid', { required: 'Amount paid is required', min: { value: 0, message: 'Must be non-negative' } })}
                      />
                    </div>
                    {errors.amountPaid && <span className="form-error">{errors.amountPaid.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="paymentDate">Payment Date <span>*</span></label>
                    <div className="input-icon-wrapper">
                      <Calendar size={15} className="input-icon" />
                      <input
                        id="paymentDate"
                        type="date"
                        className={`form-input ${errors.paymentDate ? 'error' : ''}`}
                        {...register('paymentDate', { required: 'Payment date is required' })}
                      />
                    </div>
                    {errors.paymentDate && <span className="form-error">{errors.paymentDate.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="receiptNumber">Receipt Number</label>
                    <div className="input-icon-wrapper">
                      <Hash size={15} className="input-icon" />
                      <input
                        id="receiptNumber"
                        className="form-input"
                        placeholder="RCT-001"
                        {...register('receiptNumber')}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="pendingAmount">Pending Amount (₹)</label>
                    <div className="input-icon-wrapper">
                      <Banknote size={15} className="input-icon" />
                      <input
                        id="pendingAmount"
                        type="number"
                        className="form-input"
                        placeholder="0"
                        {...register('pendingAmount')}
                      />
                    </div>
                    <span className="form-hint">Leave 0 if fully paid</span>
                  </div>
                </div>
              )}

              {/* ── STEP 5: Review ───────────────────────── */}
              {step === 5 && (
                <div>
                  <div style={{
                    padding: '1rem 1.25rem', background: 'rgba(16,185,129,0.07)',
                    border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8,
                    display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem',
                  }}>
                    <CheckCircle size={18} color="var(--success)" />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--success-text)' }}>
                        Review &amp; Submit
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Please verify all details before submitting.
                      </div>
                    </div>
                  </div>

                  <ReviewSection title="Personal Information" icon={User} color="var(--primary)">
                    <ReviewField label="Full Name" value={`${allValues.firstName} ${allValues.lastName}`} />
                    <ReviewField label="Date of Birth" value={allValues.dob} />
                    <ReviewField label="Gender" value={allValues.gender} />
                    <ReviewField label="Occupation" value={allValues.occupation || '—'} />
                    <ReviewField label="Mobile" value={allValues.mobile} />
                    <ReviewField label="Email" value={allValues.email} />
                  </ReviewSection>

                  <ReviewSection title="Policy Information" icon={FileText} color="var(--gold-dark)">
                    <ReviewField label="Policy Type" value={allValues.policyType} />
                    <ReviewField label="Insurer" value={allValues.insurer} />
                    <ReviewField label="Policy Number" value={allValues.policyNumber} />
                    <ReviewField label="Start Date" value={allValues.startDate} />
                    <ReviewField label="Expiry Date" value={allValues.expiryDate} />
                    <ReviewField label="Premium" value={allValues.premium ? `₹${Number(allValues.premium).toLocaleString('en-IN')}` : '—'} />
                  </ReviewSection>

                  {policyType === 'Vehicle' && (
                    <ReviewSection title="Vehicle Information" icon={Car} color="var(--info)">
                      <ReviewField label="Vehicle Number" value={allValues.vehicleNumber} />
                      <ReviewField label="Make & Model" value={`${allValues.make} ${allValues.model}`} />
                      <ReviewField label="Year" value={allValues.year} />
                      <ReviewField label="Variant" value={allValues.variant || '—'} />
                      <ReviewField label="Chassis No." value={allValues.chassisNo || '—'} />
                      <ReviewField label="Engine No." value={allValues.engineNo || '—'} />
                    </ReviewSection>
                  )}

                  <ReviewSection title="Payment Details" icon={CreditCard} color="var(--success)">
                    <ReviewField label="Payment Mode" value={allValues.paymentMode} />
                    <ReviewField label="Amount Paid" value={allValues.amountPaid ? `₹${Number(allValues.amountPaid).toLocaleString('en-IN')}` : '—'} />
                    <ReviewField label="Payment Date" value={allValues.paymentDate} />
                    <ReviewField label="Receipt No." value={allValues.receiptNumber || '—'} />
                    <ReviewField label="Pending Amount" value={allValues.pendingAmount ? `₹${Number(allValues.pendingAmount).toLocaleString('en-IN')}` : '₹0'} />
                  </ReviewSection>

                  {/* Documents summary */}
                  {Object.keys(files).length > 0 && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Upload size={14} color="var(--info)" />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Uploaded Documents</span>
                      </div>
                      <div style={{ padding: '0.875rem 1rem', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                        {Object.entries(files).map(([key, file]) => (
                          <div key={key} className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                            <CheckCircle size={14} color="var(--success)" />
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Footer */}
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--bg-secondary)',
          }}>
            <button
              id="prev-step-btn"
              type="button"
              className="btn btn-outline"
              onClick={handlePrev}
              disabled={step === 0}
            >
              <ArrowLeft size={16} /> Previous
            </button>
            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === step ? 20 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: i < step ? 'var(--success)' : i === step ? 'var(--primary)' : 'var(--border)',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>
            {step < STEPS.length - 1 ? (
              <button
                id="next-step-btn"
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button
                id="submit-customer-btn"
                type="submit"
                className="btn btn-gold"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="spinner" style={{ width: 16, height: 16 }} />
                    Saving…
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} /> Submit Customer
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
