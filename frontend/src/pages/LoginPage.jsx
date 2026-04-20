import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await api.post('/api/auth/login', { username, password });
            const { token, role } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            if(role === 'PATIENT') {
                localStorage.setItem('patientId', '1'); 
            }

            if (role === 'PATIENT') {
                navigate('/patient-dashboard');
            } else if (role === 'CLINICIAN') {
                navigate('/clinician-dashboard');
            }
        } catch (err) {
            setError('Invalid credentials or server error.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Welcome Back</h2>
                {error && <p style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            placeholder="Enter your username"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter your password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-premium" style={{ marginTop: '10px' }}>
                        Sign In
                    </button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Mental Health Early Warning System
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
