import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>

          
        </Routes>
      </BrowserRouter>

      {/* Global Toast Alert Notifications */}
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
