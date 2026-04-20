import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/PatientDashboard';
import ClinicianDashboard from './pages/ClinicianDashboard';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <div style={{ fontFamily: 'sans-serif', margin: '0 auto', maxWidth: '800px', padding: '20px' }}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route 
                        path="/patient-dashboard" 
                        element={
                            <ProtectedRoute requiredRole="PATIENT">
                                <PatientDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/clinician-dashboard" 
                        element={
                            <ProtectedRoute requiredRole="CLINICIAN">
                                <ClinicianDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
