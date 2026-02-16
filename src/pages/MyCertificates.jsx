import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, ExternalLink } from 'lucide-react';
import { getCertificates } from '../utils/certificateManager';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

export default function MyCertificates() {
    const [certs, setCerts] = useState([]);
    const { user } = useAuth(); // Get current user

    useEffect(() => {
        if (user) {
            setCerts(getCertificates(user.email));
        }
    }, [user]);

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Award color="var(--color-primary)" size={40} /> My Certificates
            </h1>

            {certs.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        You haven't earned any certificates yet.
                    </p>
                    <Link to="/" className="btn-primary">Browse Assessments</Link>
                </div>
            ) : (
                <div className="cert-grid-my" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {certs.map((cert) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card"
                            style={{ position: 'relative', overflow: 'hidden' }}
                        >
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--color-success)' }} />

                            <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>{cert.title}</h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                <Calendar size={16} /> Earned: {new Date(cert.dateEarned).toLocaleDateString()}
                            </div>

                            <Link to={`/certificate/${cert.id}`} className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                View Certificate <ExternalLink size={16} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
            <style>{`
                @media (max-width: 768px) {
                    h1 { font-size: 1.8rem !important; }
                    .cert-grid-my {
                        grid-template-columns: 1fr !important;
                    }
                    .glass-card { padding: 1.5rem !important; }
                }
            `}</style>
        </div>
    );
}
