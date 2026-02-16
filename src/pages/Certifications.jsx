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
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
                    {user?.company ? `${user.company} Learning` : 'Get Certified'} <span className="text-gradient">Portal</span>
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Upskill your team with industry-standard certification assessments. Earn verified credentials to advance your career.
                </p>
            </div>

            {/* Search Bar */}
            <div style={{ maxWidth: '600px', margin: '0 auto 3rem', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                    type="text"
                    placeholder="Search for a skill (e.g. Python, React)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' }}
                />
            </div>

            {/* Certification Cards Grid */}
            <div className="cert-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {filteredCerts.map((cert) => (
                    <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        className="glass-card"
                        style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: cert.color
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{cert.title}</h3>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{
                                        background: `rgba(${parseInt(cert.color.slice(1, 3), 16)}, ${parseInt(cert.color.slice(3, 5), 16)}, ${parseInt(cert.color.slice(5, 7), 16)}, 0.1)`,
                                        color: cert.color,
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600'
                                    }}>
                                        {cert.difficulty}
                                    </span>
                                    {cert.recommended && (
                                        <span style={{
                                            background: 'rgba(234, 179, 8, 0.1)',
                                            color: '#eab308',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                            border: '1px solid rgba(234, 179, 8, 0.2)'
                                        }}>
                                            <Star size={12} fill="#eab308" /> Company Pick
                                        </span>
                                    )}
                                </div>
                            </div>
                            <ShieldCheck size={32} color={cert.color} />
                        </div>

                        <div style={{ flex: 1 }}>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={16} /> {cert.timeLimit}
                            </p>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Skills Covered:</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {cert.skills.map(skill => (
                                        <span key={skill} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                            <Link to={`/prepare/${cert.id}`} className="btn-outline" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none', display: 'flex' }}>
                                Prepare
                            </Link>
                            <Link to={`/assessment/${cert.id}`} className="btn-primary" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none', display: 'flex' }}>
                                Get Certified
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
            <style>{`
                @media (max-width: 768px) {
                    h1 { font-size: 2.2rem !important; }
                    p { font-size: 1rem !important; }
                    .cert-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .glass-card {
                        padding: 1.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
