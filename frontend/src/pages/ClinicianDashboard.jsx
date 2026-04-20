import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ClinicianDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedPatientId, setExpandedPatientId] = useState(null);
    const navigate = useNavigate();

    const fetchPatientsAndScores = async () => {
        try {
            const res = await api.get('/api/clinician/patients');
            const patientData = res.data;

            const enrichedPatients = await Promise.all(
                patientData.map(async (patient) => {
                    let latestMood = null;
                    let journals = [];
                    try {
                        const journalRes = await api.get(`/api/journals/patient/${patient.id}`);
                        journals = journalRes.data;
                        if (journals && journals.length > 0) {
                            latestMood = journals[0].moodScore;
                        }
                    } catch (e) {
                        // Backend failed or fallback.
                    }
                    return { ...patient, latestMood, journals };
                })
            );

            enrichedPatients.sort((a, b) => {
                const isAWarning = a.latestMood !== null && a.latestMood <= 4;
                const isBWarning = b.latestMood !== null && b.latestMood <= 4;

                if (isAWarning && !isBWarning) return -1;
                if (!isAWarning && isBWarning) return 1;
                return 0;
            });

            setPatients(enrichedPatients);
        } catch (err) {
            // Fail silently on fetching lists.
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatientsAndScores();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const toggleExpand = (patientId) => {
        setExpandedPatientId(expandedPatientId === patientId ? null : patientId);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Clinician Dashboard</h2>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading patient data...</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {patients.map(patient => {
                        const isWarning = patient.latestMood !== null && patient.latestMood <= 4;
                        const isExpanded = expandedPatientId === patient.id;

                        return (
                            <div key={patient.id} className={`glass-card ${isWarning ? 'warning-card' : ''}`} style={{ padding: '0' }}>
                                <div 
                                    onClick={() => toggleExpand(patient.id)}
                                    style={{ 
                                        padding: '25px', 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>Patient: {patient.username}</h3>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Patient ID: {patient.id}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        {isWarning ? (
                                            <div className="warning-badge">
                                                ⚠️ ATTENTION: {patient.latestMood}/10
                                            </div>
                                        ) : (
                                            <div className="success-badge">
                                                {patient.latestMood !== null ? `Stable: ${patient.latestMood}/10` : 'No Data'}
                                            </div>
                                        )}
                                        <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600' }}>
                                            {isExpanded ? 'Collapse Details ▲' : 'View Journal Details ▼'}
                                        </div>
                                    </div>
                                </div>
                                
                                {isExpanded && (
                                    <div style={{ 
                                        padding: '25px', 
                                        borderTop: '1px solid rgba(255,255,255,0.1)', 
                                        backgroundColor: 'rgba(255,255,255,0.02)' 
                                    }}>
                                        <h4 style={{ fontSize: '1rem', marginBottom: '20px', color: 'var(--accent)' }}>Patient History</h4>
                                        {patient.journals && patient.journals.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                {patient.journals.map(journal => (
                                                    <div key={journal.id} className="journal-entry">
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Mood Score: {journal.moodScore}/10</span>
                                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(journal.timestamp).toLocaleString()}</span>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{journal.entryText}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', textAlign: 'center' }}>No journal entries recorded by this patient.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {patients.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No patients registered in the system.</p>}
                </div>
            )}
        </div>
    );
};

export default ClinicianDashboard;
