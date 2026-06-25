import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';

// Lazy load all pages
const Login          = lazy(() => import('./pages/Login'));
const Dashboard      = lazy(() => import('./pages/Dashboard'));
const Customers      = lazy(() => import('./pages/Customers'));
const CustomerProfile= lazy(() => import('./pages/CustomerProfile'));
const AddCustomer    = lazy(() => import('./pages/AddCustomer'));
const Policies       = lazy(() => import('./pages/Policies'));
const PolicyCreate   = lazy(() => import('./pages/PolicyCreate'));
const PDFGeneration  = lazy(() => import('./pages/PDFGeneration'));
const Documents      = lazy(() => import('./pages/Documents'));
const AIImport       = lazy(() => import('./pages/AIImport'));
const Payments       = lazy(() => import('./pages/Payments'));
const Renewals       = lazy(() => import('./pages/Renewals'));
const Analytics      = lazy(() => import('./pages/Analytics'));
const AIAssistant    = lazy(() => import('./pages/AIAssistant'));
const Notifications  = lazy(() => import('./pages/Notifications'));
const Settings       = lazy(() => import('./pages/Settings'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '60vh', flexDirection: 'column', gap: '1rem'
    }}>
      <div style={{
        width: 40, height: 40, border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite'
      }} />
      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading...</span>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </AppLayout>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? <Navigate to="/dashboard" replace /> : (
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          )
        }
      />
      <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/customers"    element={<ProtectedRoute><Customers /></ProtectedRoute>} />
      <Route path="/customers/add"element={<ProtectedRoute><AddCustomer /></ProtectedRoute>} />
      <Route path="/customers/:id"element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />
      <Route path="/policies"     element={<ProtectedRoute><Policies /></ProtectedRoute>} />
      <Route path="/policies/create" element={<ProtectedRoute><PolicyCreate /></ProtectedRoute>} />
      <Route path="/pdf-generation"  element={<ProtectedRoute><PDFGeneration /></ProtectedRoute>} />
      <Route path="/documents"    element={<ProtectedRoute><Documents /></ProtectedRoute>} />
      <Route path="/ai-import"    element={<ProtectedRoute><AIImport /></ProtectedRoute>} />
      <Route path="/payments"     element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      <Route path="/renewals"     element={<ProtectedRoute><Renewals /></ProtectedRoute>} />
      <Route path="/analytics"    element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
      <Route path="/notifications"element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/settings"     element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*"             element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontSize: '0.875rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
              },
              success: { iconTheme: { primary: '#10B981', secondary: 'white' } },
              error:   { iconTheme: { primary: '#EF4444', secondary: 'white' } },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
