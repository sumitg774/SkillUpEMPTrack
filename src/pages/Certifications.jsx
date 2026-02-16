import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Code, CheckCircle, Search, Clock, ShieldCheck, Star } from 'lucide-react';
import { useAuth } from '../components/AuthContext';

const certifications = [
    {
        id: 'python-basic',
        title: 'Python (Basic)',
        skills: ['Control Flow', 'Functions', 'Data Types'],
        timeLimit: '90 mins',
        difficulty: 'Easy',
        color: '#3b82f6',
        recommended: true
    },
    {
        id: 'javascript-intermediate',
        title: 'JavaScript (Intermediate)',
        skills: ['Design Patterns', 'Memory Management', 'Async/Await'],
        timeLimit: '120 mins',
        difficulty: 'Medium',
        color: '#eab308'
    },
    {
        id: 'react-basic',
        title: 'React (Basic)',
        skills: ['Components', 'Props & State', 'Lifecycle Methods'],
        timeLimit: '60 mins',
        difficulty: 'Easy',
        color: '#06b6d4',
        recommended: true
    },
    {
        id: 'problem-solving-advanced',
        title: 'Problem Solving (Advanced)',
        skills: ['Graphs', 'Dynamic Programming', 'Heaps'],
        timeLimit: '180 mins',
        difficulty: 'Hard',
        color: '#ef4444'
    },
    {
        id: 'sql-intermediate',
        title: 'SQL (Intermediate)',
        skills: ['Joins', 'Indexes', 'Subqueries'],
        timeLimit: '45 mins',
        difficulty: 'Medium',
        color: '#10b981'
    },
    {
        id: 'rest-api-intermediate',
        title: 'Rest API (Intermediate)',
        skills: ['HTTP Methods', 'Authentication', 'Rate Limiting'],
        timeLimit: '60 mins',
        difficulty: 'Medium',
        color: '#8b5cf6'
    }
];

export default function Certifications() {
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    const filteredCerts = certifications.filter(cert =>
        cert.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>

            {/* Header Section */}
            <div className="portal-header">
                <h1 className="portal-title">
                    {user?.company ? `${user.company} Learning` : 'Get Certified'} <span className="text-gradient">Portal</span>
                </h1>
                <p className="portal-subtitle">
                    Upskill your team with industry-standard certification assessments. Earn verified credentials to advance your career.
                </p>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <Search className="search-icon" />
                <input
                    type="text"
                    placeholder="Search for a skill (e.g. Python, React)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Certification Cards Grid */}
            <div className="cert-grid">
                {filteredCerts.map((cert) => (
                    <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        className="glass-card cert-card"
                    >
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: cert.color
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{cert.title}</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{
                                        background: `rgba(${parseInt(cert.color.slice(1, 3), 16)}, ${parseInt(cert.color.slice(3, 5), 16)}, ${parseInt(cert.color.slice(5, 7), 16)}, 0.1)`,
                                        color: cert.color,
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        {cert.difficulty}
                                    </span>
                                    {cert.recommended && (
                                        <span style={{
                                            background: 'rgba(234, 179, 8, 0.1)',
                                            color: '#eab308',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '999px',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.2rem',
                                            border: '1px solid rgba(234, 179, 8, 0.2)'
                                        }}>
                                            <Star size={10} fill="#eab308" /> Company Pick
                                        </span>
                                    )}
                                </div>
                            </div>
                            <ShieldCheck size={28} color={cert.color} />
                        </div>

                        <div style={{ flex: 1 }}>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                <Clock size={14} /> {cert.timeLimit}
                            </p>

                            <div style={{ marginBottom: '1.2rem' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Skills Covered:</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {cert.skills.map(skill => (
                                        <span key={skill} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <Link to={`/prepare/${cert.id}`} className="btn-outline" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none', display: 'flex', fontSize: '0.85rem' }}>
                                Prepare
                            </Link>
                            <Link to={`/assessment/${cert.id}`} className="btn-primary" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none', display: 'flex', fontSize: '0.85rem' }}>
                                Certify
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
            <style>{`
                .portal-header { text-align: center; margin-bottom: 4rem; }
                .portal-title { fontSize: 3rem; fontWeight: 800; marginBottom: 1rem; }
                .portal-subtitle { color: var(--color-text-muted); fontSize: 1.2rem; maxWidth: 600px; margin: 0 auto; }
                
                .search-container { max-width: 600px; margin: 0 auto 3rem; position: relative; }
                .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--color-text-muted); width: 18px; }
                .search-input { width: 100%; padding: 0.8rem 1rem 0.8rem 3rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); borderRadius: 12px; color: white; fontSize: 1rem; outline: none; }

                .cert-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
                .cert-card { display: flex; flexDirection: column; height: 100%; position: relative; overflow: hidden; padding: 2rem; }

                @media (max-width: 768px) {
                    .portal-header { margin-bottom: 2rem; }
                    .portal-title { font-size: 2rem; }
                    .portal-subtitle { font-size: 1rem; }
                    .search-container { margin-bottom: 2rem; }
                    .cert-grid { grid-template-columns: 1fr; gap: 1.5rem; }
                    .cert-card { padding: 1.5rem !important; }
                }
            `}</style>
        </div>
    );
}
