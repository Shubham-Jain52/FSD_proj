import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const PatientDashboard = () => {
    const [entryText, setEntryText] = useState('');
    const [moodScore, setMoodScore] = useState(5);
    const [journals, setJournals] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const patientId = localStorage.getItem('patientId') || "1";

    const fetchJournals = async () => {
        try {
            const res = await api.get(`/api/journals/patient/${patientId}`);
            setJournals(res.data);
        } catch (err) {
            // Fails silently for MVP
        }
    };

    useEffect(() => {
        fetchJournals();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!entryText.trim()) {
            setError("Journal entry cannot be empty.");
            return;
        }
        setError("");
        
        try {
            await api.post('/api/journals', { 
                patientId: parseInt(patientId, 10), 
                entryText, 
                moodScore: parseInt(moodScore, 10) 
            });
            setEntryText('');
            setMoodScore(5);
            fetchJournals();
        } catch (err) {
            setError('Failed to submit journal. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Patient Dashboard</h2>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </header>

            <section className="glass-card">
                <h3 style={{ marginBottom: '20px' }}>Submit New Journal Entry</h3>
                {error && (
                    <div style={{ 
                        color: '#fff', 
                        backgroundColor: 'var(--danger)', 
                        padding: '12px', 
                        borderRadius: '12px', 
                        marginBottom: '20px',
                        fontSize: '0.9rem' 
                    }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                        <label>How are you feeling? (1-10): <span style={{ color: 'var(--accent)', fontWeight: '700' }}>{moodScore}</span></label>
                        <input 
                            type="range" 
                            min="1" max="10" 
                            value={moodScore} 
                            onChange={(e) => setMoodScore(e.target.value)} 
                            style={{ 
                                width: '100%', 
                                cursor: 'pointer',
                                accentColor: 'var(--accent)'
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Journal Text</label>
                        <textarea 
                            value={entryText} 
                            onChange={(e) => setEntryText(e.target.value)} 
                            rows="4"
                            placeholder="Share your thoughts..."
                        />
                    </div>
                    <button type="submit" className="btn-premium">
                        Submit Entry
                    </button>
                </form>
            </section>

            <section className="glass-card">
                <h3 style={{ marginBottom: '20px' }}>Past Entries</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {journals.map((journal) => (
                        <div key={journal.id} className="journal-entry">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                                <span className="success-badge">Mood: {journal.moodScore}/10</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    {new Date(journal.timestamp).toLocaleDateString()} at {new Date(journal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p style={{ margin: 0, lineHeight: '1.6', color: 'rgba(255,255,255,0.9)' }}>{journal.entryText}</p>
                        </div>
                    ))}
                    {journals.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No entries found yet.</p>}
                </div>
            </section>
        </div>
    );
};

export default PatientDashboard;
