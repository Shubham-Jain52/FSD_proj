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
            
            // Note: Our API AuthResponseDto currently only returns token and role.
            // Using a mocked patientId until backend sends it natively
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
        <div style={{ maxWidth: '400px', margin: '100px auto', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
