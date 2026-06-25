import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Grid, List, Search, Eye, Download, Trash2,
  Folder, FolderOpen, ChevronRight, X, HardDrive, AlertCircle,
  Filter, Plus, File, CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { documents, customers, policies } from '../data/mockData';

/* ─── helpers ───────────────────────────────────────────────── */
const categoryColor = {
  Policy:  { bg: 'var(--info-bg)',    text: 'var(--info-text)',    cls: 'badge-info' },
  Vehicle: { bg: 'var(--warning-bg)', text: 'var(--warning-text)', cls: 'badge-warning' },
  Health:  { bg: 'var(--success-bg)', text: 'var(--success-text)', cls: 'badge-success' },
  Life:    { bg: 'rgba(201,162,39,0.12)', text: 'var(--gold-dark)', cls: 'badge-gold' },
  RC:      { bg: 'var(--bg-secondary)', text: 'var(--text-secondary)', cls: 'badge-muted' },
  DL:      { bg: 'var(--bg-secondary)', text: 'var(--text-secondary)', cls: 'badge-muted' },
};

const folderTree = [
  { id: 'all',      label: 'All Documents', icon: Folder, count: 8,  children: [] },
  {
    id: 'policies', label: 'Policies',        icon: Folder, count: 5,
    children: [
      { id: 'vehicle', label: 'Vehicle', icon: Folder, count: 3, children: [] },
      { id: 'health',  label: 'Health',  icon: Folder, count: 1, children: [] },
      { id: 'life',    label: 'Life',    icon: Folder, count: 1, children: [] },
    ],
  },
  { id: 'customer', label: 'Customer Docs', icon: Folder, count: 3,  children: [] },
  { id: 'rc',       label: 'RC Books',      icon: Folder, count: 1,  children: [] },
  { id: 'reports',  label: 'Reports',       icon: Folder, count: 0,  children: [] },
];

const folderFilter = (folderId, doc) => {
  if (folderId === 'all')      return true;
  if (folderId === 'policies') return doc.category === 'Policy';
  if (folderId === 'vehicle')  return doc.type === 'Vehicle';
  if (folderId === 'health')   return doc.type === 'Health';
  if (folderId === 'life')     return doc.type === 'Life';
  if (folderId === 'customer') return ['RC','DL'].includes(doc.type);
  if (folderId === 'rc')       return doc.type === 'RC';
  if (folderId === 'reports')  return false;
  return true;
};

/* ─── Upload Modal ───────────────────────────────────────────── */
function UploadModal({ onClose }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile]         = useState(null);
  const [fields, setFields]     = useState({ customer: '', policy: '', category: 'Policy', docType: '' });
  const [uploading, setUploading] = useState(false);
  const [done, setDone]           = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => { setUploading(false); setDone(true); }, 2000);
    setTimeout(() => { onClose(); }, 3200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal modal-lg"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-title flex items-center gap-2">
            <Upload size={18} style={{ color: 'var(--gold)' }} />
            Upload Document
          </span>
          <button id="upload-modal-close" className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          {/* Dropzone */}
          <div
            id="upload-dropzone"
            className={`dropzone${dragOver ? ' active' : ''}`}
            style={{ marginBottom: '1.25rem' }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input-hidden').click()}
          >
            <input
              id="file-input-hidden"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={e => setFile(e.target.files[0])}
            />
            {file ? (
              <div className="flex items-center justify-center gap-3 flex-col">
                <div style={{ width: 48, height: 48, background: 'var(--danger-bg)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-semi text-sm" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <span className="badge badge-success">File ready</span>
              </div>
            ) : (
              <>
                <Upload size={36} style={{ color: 'var(--gold)', margin: '0 auto 0.75rem' }} />
                <p className="font-semi text-sm" style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Drag & drop your file here
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  or click to browse
                </p>
                <span className="chip">PDF • JPG • PNG</span>
              </>
            )}
          </div>

          {/* Form fields */}
          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="upload-customer">Customer <span>*</span></label>
              <select
                id="upload-customer"
                className="form-select"
                value={fields.customer}
                onChange={e => setFields(p => ({ ...p, customer: e.target.value }))}
              >
                <option value="">Select customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="upload-policy">Policy Number</label>
              <select
                id="upload-policy"
                className="form-select"
                value={fields.policy}
                onChange={e => setFields(p => ({ ...p, policy: e.target.value }))}
              >
                <option value="">Select policy</option>
                {policies.map(p => <option key={p.id} value={p.id}>{p.id}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="upload-category">Category <span>*</span></label>
              <select
                id="upload-category"
                className="form-select"
                value={fields.category}
                onChange={e => setFields(p => ({ ...p, category: e.target.value }))}
              >
                <option>Policy</option>
                <option>Vehicle</option>
                <option>Health</option>
                <option>Life</option>
                <option>RC Books</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="upload-doctype">Document Type</label>
              <input
                id="upload-doctype"
                className="form-input"
                placeholder="e.g. Policy Certificate"
                value={fields.docType}
                onChange={e => setFields(p => ({ ...p, docType: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button id="upload-cancel-btn" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button
            id="upload-submit-btn"
            className="btn btn-gold"
            onClick={handleUpload}
            disabled={!file || uploading || done}
          >
            {done ? (
              <><CheckCircle size={16} /> Uploaded!</>
            ) : uploading ? (
              <><div className="spinner" style={{ width: 16, height: 16, borderTopColor: 'var(--primary)' }} /> Uploading...</>
            ) : (
              <><Upload size={16} /> Upload Document</>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Folder Tree Node ───────────────────────────────────────── */
function FolderNode({ node, depth = 0, activeFolder, onSelect }) {
  const [open, setOpen] = useState(depth === 0);
  const isActive = activeFolder === node.id;
  const hasChildren = node.children?.length > 0;
  const Icon = isActive ? FolderOpen : Folder;

  return (
    <div>
      <div
        id={`folder-${node.id}`}
        onClick={() => { onSelect(node.id); if (hasChildren) setOpen(o => !o); }}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.625rem',
          paddingLeft: `${0.625 + depth * 1.25}rem`,
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          background: isActive ? 'rgba(11,31,77,0.08)' : 'transparent',
          color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
          fontWeight: isActive ? 600 : 500,
          fontSize: '0.85rem',
          transition: 'all 0.15s',
          userSelect: 'none',
          marginBottom: 2,
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
      >
        {hasChildren && (
          <ChevronRight
            size={12}
            style={{
              flexShrink: 0,
              transition: 'transform 0.2s',
              transform: open ? 'rotate(90deg)' : 'none',
              color: 'var(--text-muted)',
            }}
          />
        )}
        {!hasChildren && <span style={{ width: 12, flexShrink: 0 }} />}
        <Icon size={15} style={{ flexShrink: 0, color: isActive ? 'var(--primary)' : 'var(--gold)' }} />
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.label}</span>
        <span style={{
          fontSize: '0.7rem', fontWeight: 700, minWidth: 20, textAlign: 'center',
          background: isActive ? 'var(--primary)' : 'var(--bg-secondary)',
          color: isActive ? 'white' : 'var(--text-muted)',
          borderRadius: 'var(--radius-full)', padding: '0 6px', lineHeight: '18px',
        }}>{node.count}</span>
      </div>
      {hasChildren && open && (
        <div>
          {node.children.map(child => (
            <FolderNode key={child.id} node={child} depth={depth + 1} activeFolder={activeFolder} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Delete Confirmation ────────────────────────────────────── */
function DeleteModal({ doc, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal"
        style={{ maxWidth: 420 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-title" style={{ color: 'var(--danger)' }}>Delete Document</span>
          <button id="delete-modal-close" className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="flex items-center gap-3" style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--danger-bg)', borderRadius: 'var(--radius-sm)' }}>
            <AlertCircle size={20} style={{ color: 'var(--danger)', flexShrink: 0 }} />
            <p className="text-sm" style={{ color: 'var(--danger-text)' }}>
              This action cannot be undone. <strong>{doc?.name}</strong> will be permanently deleted.
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button id="delete-cancel-btn" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button id="delete-confirm-btn" className="btn btn-danger" onClick={onConfirm}>Delete File</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function Documents() {
  const [viewMode, setViewMode]       = useState('grid');
  const [activeFolder, setActiveFolder] = useState('all');
  const [search, setSearch]           = useState('');
  const [catFilter, setCatFilter]     = useState('');
  const [custFilter, setCustFilter]   = useState('');
  const [showUpload, setShowUpload]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [docList, setDocList]         = useState(documents);
  const [page, setPage]               = useState(1);
  const PER_PAGE = 8;

  const filtered = useMemo(() => {
    return docList.filter(d => {
      const matchFolder = folderFilter(activeFolder, d);
      const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase())
        || d.customer.toLowerCase().includes(search.toLowerCase());
      const matchCat = !catFilter || d.category === catFilter;
      const matchCust = !custFilter || d.customer === custFilter;
      return matchFolder && matchSearch && matchCat && matchCust;
    });
  }, [docList, activeFolder, search, catFilter, custFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = () => {
    setDocList(prev => prev.filter(d => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const uniqueCustomers = [...new Set(documents.map(d => d.customer))];

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const typeBadgeCls = (type) => {
    const map = { Vehicle: 'badge-warning', Health: 'badge-success', Life: 'badge-gold', Policy: 'badge-info', RC: 'badge-muted', DL: 'badge-muted' };
    return map[type] || 'badge-muted';
  };

  return (
    <div className="animate-fade-in">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">Manage policy documents, RC books and customer files</p>
        </div>
        <button id="open-upload-modal-btn" className="btn btn-gold" onClick={() => setShowUpload(true)}>
          <Upload size={16} /> Upload Document
        </button>
      </div>

      {/* ── Storage Bar ── */}
      <div className="card card-body" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
          <div className="flex items-center gap-2">
            <HardDrive size={16} style={{ color: 'var(--primary)' }} />
            <span className="text-sm font-semi">Storage Usage</span>
          </div>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>2.8 GB</strong> of 10 GB used
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: '28%', background: 'linear-gradient(90deg, var(--primary), var(--primary-lighter))' }}
          />
        </div>
        <div className="flex items-center gap-4" style={{ marginTop: '0.5rem' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginRight: 4 }} />
            PDFs: 2.1 GB
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', marginRight: 4 }} />
            Images: 0.7 GB
          </span>
          <span className="text-xs" style={{ color: 'var(--success)', marginLeft: 'auto' }}>72% free</span>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>

        {/* ── LEFT SIDEBAR: Folder Tree ── */}
        <div className="card" style={{ width: '22%', flexShrink: 0, padding: '1rem' }}>
          <p className="section-title" style={{ marginBottom: '0.625rem' }}>Folders</p>
          {folderTree.map(node => (
            <FolderNode
              key={node.id}
              node={node}
              activeFolder={activeFolder}
              onSelect={(id) => { setActiveFolder(id); setPage(1); }}
            />
          ))}
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Filter Bar */}
          <div className="filter-bar" style={{ marginBottom: '1rem' }}>
            <div className="input-icon-wrapper" style={{ flex: 1, minWidth: 200 }}>
              <Search size={15} className="input-icon" />
              <input
                id="doc-search"
                className="form-input"
                placeholder="Search documents or customers..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select
              id="doc-cat-filter"
              className="form-select"
              style={{ width: 160 }}
              value={catFilter}
              onChange={e => { setCatFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Categories</option>
              <option>Policy</option>
              <option>Vehicle</option>
              <option>Health</option>
            </select>
            <select
              id="doc-cust-filter"
              className="form-select"
              style={{ width: 180 }}
              value={custFilter}
              onChange={e => { setCustFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Customers</option>
              {uniqueCustomers.map(c => <option key={c}>{c}</option>)}
            </select>

            {/* View Toggle */}
            <div className="flex" style={{ gap: 4, background: 'var(--bg-secondary)', padding: 4, borderRadius: 'var(--radius-sm)' }}>
              <button
                id="view-grid-btn"
                className={`btn btn-sm btn-icon${viewMode === 'grid' ? ' btn-primary' : ' btn-ghost'}`}
                style={{ padding: '0.375rem' }}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <Grid size={15} />
              </button>
              <button
                id="view-table-btn"
                className={`btn btn-sm btn-icon${viewMode === 'table' ? ' btn-primary' : ' btn-ghost'}`}
                style={{ padding: '0.375rem' }}
                onClick={() => setViewMode('table')}
                title="Table view"
              >
                <List size={15} />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between" style={{ marginBottom: '0.875rem' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> document{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* ── GRID VIEW ── */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' && (
              <motion.div
                key="grid"
                className="grid grid-4"
                style={{ gap: '1rem' }}
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {paginated.length === 0 ? (
                  <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                    <div className="empty-state-icon"><File size={28} /></div>
                    <h3>No documents found</h3>
                    <p>Try adjusting your filters or upload a new document.</p>
                    <button className="btn btn-gold" onClick={() => setShowUpload(true)}>
                      <Plus size={16} /> Upload Document
                    </button>
                  </div>
                ) : paginated.map(doc => (
                  <motion.div key={doc.id} variants={cardVariants} className="doc-card card-hover">
                    <div className="flex items-center justify-between">
                      <div className="doc-icon">
                        <FileText size={20} />
                      </div>
                      <span className={`badge ${typeBadgeCls(doc.type)}`}>{doc.type}</span>
                    </div>
                    <div>
                      <p
                        className="text-sm font-semi truncate"
                        title={doc.name}
                        style={{ color: 'var(--text-primary)', marginBottom: '0.2rem' }}
                      >
                        {doc.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{doc.customer}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)', marginTop: 2 }}>{doc.policy}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {format(new Date(doc.uploadDate), 'dd MMM yyyy')}
                      </span>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{doc.size}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.625rem' }}>
                      <button
                        id={`preview-${doc.id}`}
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Preview"
                        style={{ flex: 1 }}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        id={`download-${doc.id}`}
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Download"
                        style={{ flex: 1 }}
                      >
                        <Download size={14} />
                      </button>
                      <button
                        id={`delete-${doc.id}`}
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Delete"
                        style={{ flex: 1, color: 'var(--danger)' }}
                        onClick={() => setDeleteTarget(doc)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ── TABLE VIEW ── */}
            {viewMode === 'table' && (
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="table-wrapper"
              >
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Customer</th>
                      <th>Policy</th>
                      <th>Type</th>
                      <th>Upload Date</th>
                      <th>Size</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                          No documents found
                        </td>
                      </tr>
                    ) : paginated.map((doc, i) => (
                      <motion.tr
                        key={doc.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="doc-icon" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                              <FileText size={15} />
                            </div>
                            <span className="text-sm font-medium truncate" style={{ maxWidth: 180 }} title={doc.name}>
                              {doc.name}
                            </span>
                          </div>
                        </td>
                        <td className="text-sm" style={{ color: 'var(--text-secondary)' }}>{doc.customer}</td>
                        <td className="text-sm" style={{ color: 'var(--text-muted)' }}>{doc.policy}</td>
                        <td><span className={`badge ${typeBadgeCls(doc.type)}`}>{doc.type}</span></td>
                        <td className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {format(new Date(doc.uploadDate), 'dd MMM yyyy')}
                        </td>
                        <td className="text-sm" style={{ color: 'var(--text-secondary)' }}>{doc.size}</td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button id={`tbl-preview-${doc.id}`} className="btn btn-ghost btn-icon btn-sm" title="Preview">
                              <Eye size={14} />
                            </button>
                            <button id={`tbl-download-${doc.id}`} className="btn btn-ghost btn-icon btn-sm" title="Download">
                              <Download size={14} />
                            </button>
                            <button
                              id={`tbl-delete-${doc.id}`}
                              className="btn btn-ghost btn-icon btn-sm"
                              title="Delete"
                              style={{ color: 'var(--danger)' }}
                              onClick={() => setDeleteTarget(doc)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <span>Page {page} of {totalPages} — {filtered.length} documents</span>
                    <div className="pagination-btns">
                      <button id="page-prev-btn" className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          id={`page-${i + 1}-btn`}
                          className={`page-btn${page === i + 1 ? ' active' : ''}`}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button id="page-next-btn" className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid pagination */}
          {viewMode === 'grid' && totalPages > 1 && (
            <div className="pagination" style={{ background: 'transparent', border: 'none', marginTop: '1rem' }}>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Page {page} of {totalPages}
              </span>
              <div className="pagination-btns">
                <button id="grid-page-prev" className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    id={`grid-page-${i + 1}`}
                    className={`page-btn${page === i + 1 ? ' active' : ''}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button id="grid-page-next" className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
        {deleteTarget && (
          <DeleteModal
            doc={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
