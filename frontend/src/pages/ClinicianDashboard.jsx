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
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Clinician Dashboard</h2>
                <button onClick={handleLogout} style={{ padding: '8px 12px', cursor: 'pointer' }}>Logout</button>
            </div>

            {loading ? (
                <p>Loading patient data...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    {patients.map(patient => {
                        const isWarning = patient.latestMood !== null && patient.latestMood <= 4;
                        const isExpanded = expandedPatientId === patient.id;

                        return (
                            <div key={patient.id} style={{ 
                                border: isWarning ? '2px solid #dc3545' : '1px solid #ccc',
                                borderRadius: '8px',
                                backgroundColor: isWarning ? '#fff8f8' : '#fff',
                                overflow: 'hidden'
                            }}>
                                <div 
                                    onClick={() => toggleExpand(patient.id)}
                                    style={{ 
                                        padding: '15px', 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0' }}>Patient: {patient.username}</h3>
                                        <p style={{ margin: 0, color: '#555' }}>ID: {patient.id}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        {isWarning ? (
                                            <div style={{ 
                                                backgroundColor: '#dc3545', 
                                                color: '#fff', 
                                                padding: '8px 12px', 
                                                borderRadius: '20px',
                                                fontWeight: 'bold',
                                                display: 'inline-block'
                                            }}>
                                                ⚠️ EARLY WARNING: {patient.latestMood}/10
                                            </div>
                                        ) : (
                                            <div style={{ color: patient.latestMood !== null ? '#28a745' : '#888' }}>
                                                {patient.latestMood !== null ? `Stable (Latest: ${patient.latestMood}/10)` : 'No Data Yet'}
                                            </div>
                                        )}
                                        <div style={{ marginTop: '5px', fontSize: '0.8em', color: '#007bff' }}>
                                            {isExpanded ? 'Hide Entries ▲' : 'View All Entries ▼'}
                                        </div>
                                    </div>
                                </div>
                                
                                {isExpanded && (
                                    <div style={{ padding: '15px', borderTop: '1px solid #eee', backgroundColor: '#fafafa' }}>
                                        <h4 style={{ marginTop: 0 }}>Journal Entries</h4>
                                        {patient.journals && patient.journals.length > 0 ? (
                                            patient.journals.map(journal => (
                                                <div key={journal.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#fff' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                        <span style={{ fontWeight: 'bold' }}>Mood: {journal.moodScore}/10</span>
                                                        <span style={{ color: '#666', fontSize: '0.9em' }}>{new Date(journal.timestamp).toLocaleString()}</span>
                                                    </div>
                                                    <p style={{ margin: 0 }}>{journal.entryText}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ fontStyle: 'italic', color: '#666' }}>No journal entries recorded by this patient.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {patients.length === 0 && <p>No patients available in the system.</p>}
                </div>
            )}
        </div>
    );
};

export default ClinicianDashboard;
