import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Search, Map as MapIcon, ChevronRight, Clock, Star, Sparkles, AlertCircle, BookOpen } from 'lucide-react';
import { generateRoadmapAI } from '../utils/aiGenerator';

export default function InterviewRoadmap() {
    const [role, setRole] = useState('');
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await generateRoadmapAI(role);
            setRoadmap(data);
        } catch (err) {
            setError(err.message === "API Key missing" ? "Please set your Gemini API Key in the settings first." : "Failed to generate roadmap. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
                    AI Career <span className="text-gradient">Architect</span>
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Tell us your target role, and our AI will build a personalized step-by-step interview preparation roadmap for you.
                </p>
            </div>

            {/* Role Input */}
            <div className="glass-card roadmap-search-card" style={{ maxWidth: '800px', margin: '0 auto 4rem', padding: '2rem' }}>
                <form onSubmit={handleGenerate} className="roadmap-form">
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Compass className="text-primary" size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="e.g. Senior Frontend Engineer, Data Scientist, Product Manager..."
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1.1rem', outline: 'none' }}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary roadmap-submit-btn">
                        {loading ? 'Generating...' : <><Sparkles size={18} /> Design Roadmap</>}
                    </button>
                </form>

                {error && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <AlertCircle size={18} /> {error}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {roadmap && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', justifyContent: 'center' }}>
                            <div style={{ width: '40px', height: '1px', background: 'var(--color-primary)' }}></div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <MapIcon className="text-secondary" /> Roadmap for {roadmap.role}
                            </h2>
                            <div style={{ width: '40px', height: '1px', background: 'var(--color-primary)' }}></div>
                        </div>

                        <div className="roadmap-container" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
                            {/* Vertical Line */}
                            <div className="roadmap-line" style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', width: '2px', background: 'linear-gradient(to bottom, var(--color-primary), var(--color-secondary))', opacity: 0.3 }}></div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                {roadmap.steps.map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        style={{ position: 'relative', paddingLeft: '60px' }}
                                        className="roadmap-step"
                                    >
                                        {/* Dot */}
                                        <div className="roadmap-dot" style={{
                                            position: 'absolute', left: '10px', top: '0', width: '22px', height: '22px',
                                            borderRadius: '50%', background: 'var(--color-background)', border: '4px solid var(--color-primary)',
                                            zIndex: 2, boxShadow: '0 0 15px var(--color-primary)'
                                        }}></div>

                                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
                                                <div>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Phase {idx + 1}</span>
                                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginTop: '0.2rem' }}>{step.phase}</h3>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <span style={{ padding: '0.3rem 0.75rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <Clock size={14} /> {step.estimatedTime}
                                                    </span>
                                                    <span style={{
                                                        padding: '0.3rem 0.75rem', borderRadius: '6px',
                                                        background: step.importance === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                        color: step.importance === 'High' ? '#ef4444' : '#10b981',
                                                        fontSize: '0.8rem', fontWeight: 'bold'
                                                    }}>
                                                        {step.importance} Priority
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                                {step.topics.map((topic, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-secondary)' }}></div>
                                                        <span style={{ fontSize: '0.95rem' }}>{topic}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
                                                <button className="btn-outline" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <BookOpen size={14} /> Start Learning <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {!roadmap && !loading && (
                <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.5 }}>
                    <Compass size={64} style={{ marginBottom: '1.5rem' }} />
                    <h3>Enter a role above to begin your journey.</h3>
                </div>
            )}
            <style>{`
                .roadmap-form {
                    display: flex;
                    gap: 1rem;
                }
                .roadmap-submit-btn {
                    padding: 0 2rem;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                @media (max-width: 768px) {
                    .roadmap-form {
                        flex-direction: column;
                    }
                    .roadmap-submit-btn {
                        width: 100%;
                        justify-content: center;
                        padding: 1rem;
                    }
                    .roadmap-search-card {
                        padding: 1.25rem !important;
                        margin-bottom: 2rem !important;
                    }
                    .roadmap-container {
                        padding-left: 30px !important;
                    }
                    .roadmap-line {
                        left: 10px !important;
                    }
                    .roadmap-dot {
                        left: 0px !important;
                    }
                    .roadmap-step {
                        padding-left: 30px !important;
                    }
                    .roadmap-step h3 { font-size: 1.2rem !important; }
                    h1 { font-size: 1.8rem !important; }
                    h2 { font-size: 1.4rem !important; }
                    p { font-size: 1rem !important; }
                }
            `}</style>
        </div>
    );
}
