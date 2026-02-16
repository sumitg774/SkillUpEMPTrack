import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, CheckCircle, ChevronRight, Code, Sparkles, Loader } from 'lucide-react';
import { assessmentData as realData } from '../data/assessmentData';
import { generateStudyGuideAI, generatePracticeQuestionsAI } from '../utils/aiGenerator';

// Keeps local mock content but allows overwriting with AI
const initialPrepContent = {
    'python-basic': {
        title: 'Python (Basic) Preparation',
        syllabus: [
            'Basic Syntax & Variables',
            'Data Types (Lists, Tuples, Dictionaries)',
            'Control Flow (If/Else, Loops)',
            'Functions & Scope',
            'String Manipulation'
        ],
        guides: [], // Initially empty or minimal
        practice: []
    },
    'react-basic': {
        title: 'React (Basic) Preparation',
        syllabus: [
            'JSX Syntax',
            'Components (Functional vs Class)',
            'Props & State',
            'Hooks (useState, useEffect)',
            'Event Handling'
        ],
        guides: [], // Initially empty or minimal
        practice: []
    }
};

export default function Prepare() {
    const { certId } = useParams();
    // Find title from existing data, fallback to ID
    const title = realData[certId]?.title || certId;

    const [content, setContent] = useState({
        syllabus: ['Core Concepts', 'Advanced Topics', 'Best Practices'],
        guides: [],
        practice: []
    });

    const [activeTab, setActiveTab] = useState('syllabus');
    const [loadingAI, setLoadingAI] = useState(false);

    // Reset content when certId changes
    useEffect(() => {
        const initialData = initialPrepContent[certId];
        setContent({
            syllabus: initialData?.syllabus || ['Core Concepts', 'Advanced Topics', 'Best Practices'],
            guides: initialData?.guides || [],
            practice: initialData?.practice || []
        });
        setActiveTab('syllabus');
    }, [certId]);

    const handleGenerateAI = async () => {
        setLoadingAI(true);
        try {
            if (activeTab === 'guides') {
                const result = await generateStudyGuideAI(title);
                setContent(prev => ({ ...prev, guides: result.guides }));
            } else if (activeTab === 'practice') {
                const result = await generatePracticeQuestionsAI(title);
                setContent(prev => ({ ...prev, practice: result }));
            }
        } catch (err) {
            console.error("AI generation failed:", err);
            alert("Failed to generate content. Please check your API Key in the settings (top right).");
        }
        setLoadingAI(false);
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>&larr; Back to Certifications</Link>
                <h1 style={{ marginTop: '1rem', fontSize: '2.5rem' }}>{title}</h1>
            </div>

            <div className="prep-layout">
                {/* Sidebar Tabs */}
                <div className="prep-sidebar">
                    <div className="glass-card prep-tabs-card" style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                            onClick={() => setActiveTab('syllabus')}
                            className={activeTab === 'syllabus' ? 'btn-primary' : 'btn-outline'}
                            style={{ justifyContent: 'flex-start', border: activeTab !== 'syllabus' ? 'none' : '' }}
                        >
                            <BookOpen size={18} style={{ marginRight: '0.5rem' }} /> Syllabus
                        </button>
                        <button
                            onClick={() => setActiveTab('guides')}
                            className={activeTab === 'guides' ? 'btn-primary' : 'btn-outline'}
                            style={{ justifyContent: 'flex-start', border: activeTab !== 'guides' ? 'none' : '' }}
                        >
                            <Code size={18} style={{ marginRight: '0.5rem' }} /> Study Guides
                        </button>
                        <button
                            onClick={() => setActiveTab('practice')}
                            className={activeTab === 'practice' ? 'btn-primary' : 'btn-outline'}
                            style={{ justifyContent: 'flex-start', border: activeTab !== 'practice' ? 'none' : '' }}
                        >
                            <CheckCircle size={18} style={{ marginRight: '0.5rem' }} /> Practice
                        </button>
                    </div>

                    <div className="prep-actions">
                        {(activeTab === 'guides' || activeTab === 'practice') && (
                            <button
                                onClick={handleGenerateAI}
                                disabled={loadingAI}
                                className="btn-outline"
                                style={{ width: '100%', justifyContent: 'center', textAlign: 'center', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: '#8b5cf6', color: '#8b5cf6' }}
                            >
                                {loadingAI ? <Loader size={18} className="spin" /> : <Sparkles size={18} />}
                                {loadingAI ? 'Generating...' : 'Generate with AI'}
                            </button>
                        )}

                        <Link to={`/assessment/${certId}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center', textAlign: 'center', textDecoration: 'none', display: 'flex' }}>
                            Ready? Take Test &rarr;
                        </Link>
                    </div>
                </div>

                {/* Content Area */}
                <div className="prep-content">
                    <div className="glass-card" style={{ padding: '2rem', minHeight: '500px' }}>

                        {activeTab === 'syllabus' && (
                            <div>
                                <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Topics Covered in {title}</h2>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {content.syllabus.map((topic, i) => (
                                        <li key={i} style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '8px', height: '8px', background: 'var(--color-primary)', borderRadius: '50%' }}></div>
                                            <span style={{ fontSize: '1.1rem' }}>{topic}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === 'guides' && (
                            <div>
                                <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Quick Study Notes</h2>
                                {content.guides.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>Click "Generate with AI" to create a custom study guide!</p>}
                                {content.guides.map((guide, i) => (
                                    <div key={i} style={{ marginBottom: '2rem' }}>
                                        <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{guide.title}</h3>
                                        <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{guide.content}</p>
                                        {guide.code && (
                                            <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
                                                {guide.code}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'practice' && (
                            <div>
                                <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Practice Questions</h2>
                                {content.practice.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>Click "Generate with AI" to create practice questions!</p>}
                                {content.practice.map((item, i) => (
                                    <div key={i} style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px' }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Q: {item.q}</p>
                                        <details>
                                            <summary style={{ cursor: 'pointer', color: 'var(--color-primary)' }}>Show Answer</summary>
                                            <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', color: '#10b981' }}>
                                                {item.a}
                                            </div>
                                        </details>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>
            <style>{`
                .prep-layout {
                    display: flex;
                    gap: 2rem;
                }
                .prep-sidebar {
                    flex: 0 0 250px;
                }
                .prep-actions {
                    margin-top: 2rem;
                }
                .prep-content {
                    flex: 1;
                }
                @media (max-width: 768px) {
                    .prep-layout {
                        flex-direction: column;
                        gap: 1.5rem;
                    }
                    .prep-sidebar {
                        flex: none;
                        width: 100%;
                    }
                    .prep-tabs-card {
                        flex-direction: row !important;
                        overflow-x: auto;
                        padding: 0.25rem !important;
                    }
                    .prep-tabs-card button {
                        flex: 1;
                        white-space: nowrap;
                        padding: 0.6rem 1rem !important;
                        font-size: 0.85rem !important;
                    }
                    .prep-actions {
                        margin-top: 1rem;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 1rem;
                    }
                    .prep-actions button, .prep-actions a {
                        margin-bottom: 0 !important;
                    }
                    h1 { font-size: 1.8rem !important; }
                    .glass-card { padding: 1.25rem !important; }
                }
            `}</style>
        </div>
    );
}
