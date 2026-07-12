import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import { AppProvider, useApp } from './context/AppContext';
import DashboardLayout from './layout/DashboardLayout';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Allocation from './pages/Allocation';
import AllocationRequests from './pages/AllocationRequests';
import Assets from "./pages/Assets";
import AssetDetails from "./pages/AssetDetails";
import Notifications from './pages/Notifications';
import Maintenance from './pages/Maintenance';
import Audit from './pages/Audit';
import Reports from "./pages/Reports";

const ProtectedRoute = ({ children }) => {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [count, setCount] = useState(0)

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
          ></Route>
          <Route path="dashboard" element={<Dashboard />} />
           <Route path="allocation" element={<Allocation />} />
            <Route path="allocation-requests" element={<AllocationRequests />} />
            <Route path="assets" element={<Assets />}/>
            <Route path="assets" element={<AssetDetails />} />    
             <Route path="maintenance" element={<Maintenance />} />
            <Route path="audit" element={<Audit />} />
            <Route path="reports" element={<Reports />} /> 
            <Route path="notifications" element={<Notifications />} />
                  
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

