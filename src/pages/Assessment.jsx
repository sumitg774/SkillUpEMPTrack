import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, Code, ChevronRight, ChevronLeft } from 'lucide-react';
import { assessmentData } from '../data/assessmentData';
import { useAuth } from '../components/AuthContext';

export default function Assessment() {
    const { certId } = useParams();
    const navigate = useNavigate();
    const data = assessmentData[certId];
    const { earnCertificate } = useAuth();

    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(60 * 30); // 30 mins default
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!data) return <div className="container" style={{ paddingTop: '2rem' }}>Assessment not found.</div>;

    const handleAnswer = (val) => {
        setAnswers(prev => ({ ...prev, [currentQ]: val }));
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate grading and passing
        setTimeout(() => {
            earnCertificate(certId, 92); // Mock score of 92 for demonstration
            navigate(`/certificate/${certId}`);
        }, 2000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const question = data.questions[currentQ];

    return (
        <div className="container" style={{ paddingTop: '2rem', maxWidth: '1000px' }}>

            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', padding: '1rem 2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{data.title} Assessment</h2>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Question {currentQ + 1} of {data.questions.length}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold', color: timeLeft < 300 ? '#ef4444' : 'white' }}>
                    <Clock size={20} /> {formatTime(timeLeft)}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>

                {/* Question Area */}
                <div className="glass-card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        {question.id}. {question.question}
                    </h3>

                    {question.type === 'mcq' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {question.options.map((opt, idx) => (
                                <label key={idx} style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    padding: '1rem', borderRadius: '8px',
                                    background: answers[currentQ] === idx ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                    border: answers[currentQ] === idx ? '1px solid #3b82f6' : '1px solid transparent',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}>
                                    <input
                                        type="radio"
                                        name={`q-${currentQ}`}
                                        checked={answers[currentQ] === idx}
                                        onChange={() => handleAnswer(idx)}
                                        style={{ accentColor: '#3b82f6' }}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    )}

                    {question.type === 'code' && (
                        <div>
                            <div style={{ marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Python 3</div>
                            <textarea
                                value={answers[currentQ] || question.starterCode}
                                onChange={(e) => handleAnswer(e.target.value)}
                                style={{
                                    width: '100%', height: '300px',
                                    background: '#0f172a', color: '#e2e8f0',
                                    fontFamily: 'monospace', padding: '1rem',
                                    borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                                    fontSize: '0.9rem', lineHeight: '1.5', resize: 'none'
                                }}
                                spellCheck="false"
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                        <button
                            disabled={currentQ === 0}
                            onClick={() => setCurrentQ(prev => prev - 1)}
                            className="btn-outline"
                            style={{ opacity: currentQ === 0 ? 0.5 : 1 }}
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>

                        {currentQ < data.questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentQ(prev => prev + 1)}
                                className="btn-primary"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="btn-primary"
                                style={{ background: 'var(--color-success)' }}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Test'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Question Map</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                            {data.questions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQ(idx)}
                                    style={{
                                        width: '100%', aspectRatio: '1', borderRadius: '4px', border: 'none',
                                        background: idx === currentQ ? 'white' : answers[idx] !== undefined ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                        color: idx === currentQ ? 'black' : 'white',
                                        fontWeight: 'bold', cursor: 'pointer'
                                    }}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card" style={{ border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', color: '#eab308' }}>
                            <AlertTriangle size={20} />
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Proctoring Enabled</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', lineHeight: '1.4' }}>
                            Do not switch tabs or minimize the browser. Doing so will result in immediate termination of the test.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
