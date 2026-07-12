import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OrganizationSetup from './pages/OrganizationSetup';
import Assets from './pages/Assets';
import AssetDetails from './pages/AssetDetails';
import Allocation from './pages/Allocation';
import AllocationRequests from './pages/AllocationRequests';
import ResourceBooking from './pages/ResourceBooking';
import Maintenance from './pages/Maintenance';
import Audit from './pages/Audit';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
   
          <Route path="/" element={<LandingPage />} />
   
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            
            <Route path="organization-setup" element={<OrganizationSetup />} />
            <Route path="assets" element={<Assets />} />
            <Route path="assets/:tag" element={<AssetDetails />} />
            <Route path="allocation" element={<Allocation />} />
            <Route path="allocation-requests" element={<AllocationRequests />} />
            <Route path="resource-booking" element={<ResourceBooking />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="audit" element={<Audit />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-xs font-semibold rounded-xl text-slate-800 border border-slate-100 shadow-lg',
          duration: 3500,
          style: {
            padding: '12px 16px',
          },
        }}
      />
    </AppProvider>
  );
}

export default App;
