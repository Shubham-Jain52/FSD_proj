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
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Patient Dashboard</h2>
                <button onClick={handleLogout} style={{ padding: '8px 12px', cursor: 'pointer' }}>Logout</button>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3>Submit New Journal Entry</h3>
                {error && <div style={{ color: 'white', backgroundColor: '#dc3545', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label>How are you feeling? (1-10): <span style={{ fontWeight: 'bold' }}>{moodScore}</span></label>
                        <input 
                            type="range" 
                            min="1" max="10" 
                            value={moodScore} 
                            onChange={(e) => setMoodScore(e.target.value)} 
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>Journal Text:</label>
                        <textarea 
                            value={entryText} 
                            onChange={(e) => setEntryText(e.target.value)} 
                            rows="4"
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Submit Entry
                    </button>
                </form>
            </div>

            <div>
                <h3>Past Entries</h3>
                {journals.map((journal) => (
                    <div key={journal.id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold' }}>Mood: {journal.moodScore}/10</span>
                            <span style={{ color: '#666', fontSize: '0.9em' }}>{new Date(journal.timestamp).toLocaleString()}</span>
                        </div>
                        <p style={{ margin: 0 }}>{journal.entryText}</p>
                    </div>
                ))}
                {journals.length === 0 && <p>No entries found.</p>}
            </div>
        </div>
    );
};

export default PatientDashboard;
