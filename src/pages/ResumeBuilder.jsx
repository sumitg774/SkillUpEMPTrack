import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Download, User, Mail, Phone, MapPin, Briefcase,
    GraduationCap, Award, Plus, Trash2, Layout, Sparkles,
    CheckCircle, Linkedin, Github, Languages as LangIcon, Code, Zap, Gem,
    ChevronUp, ChevronDown, Globe, Twitter, Link as LinkIcon, ExternalLink,
    Smartphone, Chrome, Cpu, Pencil, Rocket, Upload, FileDown, X
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { reviewResumeAI, parseResumeAI } from '../utils/aiGenerator';
import { useAuth } from '../components/AuthContext';

export default function ResumeBuilder() {
    const [template, setTemplate] = useState('elite');
    const [isReviewing, setIsReviewing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importModal, setImportModal] = useState(false);
    const [rawResumeText, setRawResumeText] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [aiFeedback, setAiFeedback] = useState(null);
    const resumeRef = useRef();
    const { user, saveResume, getResume } = useAuth();

    // State
    const defaultPersonal = {
        fullName: 'John Doe',
        role: 'Senior Software Architect',
        email: 'john.doe@example.com',
        phone: '+1 234 567 890',
        location: 'San Francisco, CA',
        summary: 'A results-driven professional with over 8 years of experience in building scalable web applications and leading high-performance teams. Expert in modern JavaScript frameworks and cloud architecture.',
        customLinks: [
            { type: 'linkedin', url: 'linkedin.com/in/johndoe' },
            { type: 'github', url: 'github.com/johndoe' }
        ]
    };

    const [personalInfo, setPersonalInfo] = useState(defaultPersonal);

    const [sectionOrder, setSectionOrder] = useState(['projects', 'experience', 'skills', 'education', 'achievements', 'languages']);
    const [sectionTitles, setSectionTitles] = useState({
        projects: 'PROJECTS',
        experience: 'EXPERIENCE',
        skills: 'TECHNICAL SKILLS',
        education: 'EDUCATION',
        achievements: 'HONORS & AWARDS',
        languages: 'LANGUAGES'
    });
    const [experience, setExperience] = useState([
        { id: 1, company: 'Tech Solutions Inc.', role: 'Senior Developer', duration: '2021 - Present', desc: 'Leading the development of a flagship cloud platform, improving deployment efficiency by 40%.' }
    ]);
    const [projects, setProjects] = useState([
        { id: 1, title: 'Quantum E-commerce', duration: '2023', stack: 'React, Node.js, AWS', desc: 'Built a high-performance e-commerce engine handling 10k+ concurrent users.' }
    ]);
    const [education, setEducation] = useState([
        { id: 1, school: 'Global Technical University', degree: 'B.S. in Computer Science', year: '2018' }
    ]);
    const [skills, setSkills] = useState([
        { name: 'Full Stack Development', level: 90 },
        { name: 'Cloud Architecture', level: 85 },
        { name: 'System Design', level: 80 }
    ]);
    const [achievements, setAchievements] = useState([
        { id: 1, title: 'Excellence in Engineering Award 2023' }
    ]);
    const [languages, setLanguages] = useState([
        { name: 'English', label: 'Native' },
        { name: 'Spanish', label: 'Professional' }
    ]);
    const [dayLife, setDayLife] = useState([
        { activity: 'Strategic Planning', percentage: 40 },
        { activity: 'Core Development', percentage: 40 },
        { activity: 'Mentorship', percentage: 20 }
    ]);
    const [customSections, setCustomSections] = useState([]);

    useEffect(() => {
        const savedData = getResume();
        if (savedData && savedData.personalInfo?.fullName) {
            setPersonalInfo({ ...defaultPersonal, ...savedData.personalInfo, customLinks: savedData.personalInfo.customLinks || defaultPersonal.customLinks });
            setExperience(savedData.experience || []);
            setEducation(savedData.education || []);
            setSkills(savedData.skills || []);
            setAchievements(savedData.achievements || []);
            setProjects(savedData.projects || []);
            setLanguages(savedData.languages || []);
            setDayLife(savedData.dayLife || []);
            setCustomSections(savedData.customSections || []);
            if (savedData.sectionTitles) setSectionTitles(savedData.sectionTitles);
            if (savedData.sectionOrder) setSectionOrder(savedData.sectionOrder);
            if (savedData.template) setTemplate(savedData.template);
        }
    }, []);

    const moveSection = (index, direction) => {
        const newOrder = [...sectionOrder];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newOrder.length) return;
        [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
        setSectionOrder(newOrder);
    };

    const handlePersonalInfo = (e) => setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });

    const addItem = (type) => {
        if (type === 'exp') setExperience([...experience, { id: Date.now(), company: '', role: '', duration: '', desc: '' }]);
        if (type === 'proj') setProjects([...projects, { id: Date.now(), title: '', duration: '', stack: '', desc: '' }]);
        if (type === 'edu') setEducation([...education, { id: Date.now(), school: '', degree: '', year: '' }]);
        if (type === 'skill') setSkills([...skills, { name: '', level: 50 }]);
        if (type === 'ach') setAchievements([...achievements, { id: Date.now(), title: '' }]);
        if (type === 'lang') setLanguages([...languages, { name: '', label: '' }]);
        if (type === 'link') setPersonalInfo({ ...personalInfo, customLinks: [...personalInfo.customLinks, { type: 'link', url: '' }] });
        if (type === 'custom_sec') {
            const newId = `custom_${Date.now()}`;
            setCustomSections([...customSections, { id: newId, title: 'New Section', content: '' }]);
            setSectionOrder([...sectionOrder, newId]);
        }
    };

    const removeItem = (type, index) => {
        if (type === 'exp') setExperience(experience.filter((_, i) => i !== index));
        if (type === 'proj') setProjects(projects.filter((_, i) => i !== index));
        if (type === 'edu') setEducation(education.filter((_, i) => i !== index));
        if (type === 'skill') setSkills(skills.filter((_, i) => i !== index));
        if (type === 'ach') setAchievements(achievements.filter((_, i) => i !== index));
        if (type === 'lang') setLanguages(languages.filter((_, i) => i !== index));
        if (type === 'link') setPersonalInfo({ ...personalInfo, customLinks: personalInfo.customLinks.filter((_, i) => i !== index) });
        if (type.startsWith('custom_')) {
            setCustomSections(customSections.filter(s => s.id !== type));
            setSectionOrder(sectionOrder.filter(s => s !== type));
        }
    };

    const updateItem = (type, index, field, value) => {
        if (type === 'link') {
            const newLinks = [...personalInfo.customLinks];
            newLinks[index][field] = value;
            setPersonalInfo({ ...personalInfo, customLinks: newLinks });
            return;
        }
        if (type === 'section_title') {
            setSectionTitles({ ...sectionTitles, [index]: value });
            return;
        }
        if (type.startsWith('custom_')) {
            const newCustom = [...customSections];
            const secIdx = newCustom.findIndex(s => s.id === type);
            if (secIdx > -1) {
                newCustom[secIdx][field] = value;
                setCustomSections(newCustom);
            }
            return;
        }
        const updateMap = {
            exp: [experience, setExperience],
            proj: [projects, setProjects],
            edu: [education, setEducation],
            skill: [skills, setSkills],
            ach: [achievements, setAchievements],
            lang: [languages, setLanguages]
        };
        const [data, setter] = updateMap[type];
        const newData = [...data];
        newData[index][field] = value;
        setter(newData);
    };

    const handleSave = () => {
        setIsSaving(true);
        saveResume({ personalInfo, experience, education, skills, achievements, projects, languages, dayLife, sectionOrder, template, customSections, sectionTitles });
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 800);
    };

    const handleExportJSON = () => {
        const data = { personalInfo, experience, education, skills, achievements, projects, languages, dayLife, sectionOrder, template, customSections, sectionTitles };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Resume_Backup_${personalInfo.fullName.replace(/\s+/g, '_')}.json`;
        a.click();
    };

    const handleImportJSON = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.personalInfo) setPersonalInfo(data.personalInfo);
                if (data.experience) setExperience(data.experience);
                if (data.projects) setProjects(data.projects);
                if (data.education) setEducation(data.education);
                if (data.skills) setSkills(data.skills);
                if (data.achievements) setAchievements(data.achievements);
                if (data.languages) setLanguages(data.languages);
                if (data.sectionTitles) setSectionTitles(data.sectionTitles);
                if (data.sectionOrder) setSectionOrder(data.sectionOrder);
                if (data.customSections) setCustomSections(data.customSections);
                if (data.template) setTemplate(data.template);
                setImportModal(false);
            } catch (err) {
                alert("Invalid JSON file");
            }
        };
        reader.readAsText(file);
    };

    const handleAIImport = async () => {
        if (!rawResumeText.trim()) return;
        setIsImporting(true);
        try {
            const extracted = await parseResumeAI(rawResumeText);
            if (extracted.personalInfo) setPersonalInfo({ ...personalInfo, ...extracted.personalInfo, customLinks: personalInfo.customLinks });
            if (extracted.experience) setExperience(extracted.experience);
            if (extracted.projects) setProjects(extracted.projects);
            if (extracted.education) setEducation(extracted.education);
            if (extracted.skills) setSkills(extracted.skills);
            if (extracted.achievements) setAchievements(extracted.achievements);
            if (extracted.languages) setLanguages(extracted.languages);
            setImportModal(false);
            setRawResumeText('');
        } catch (err) {
            alert("AI Parsing failed. Try again with cleaner text.");
        } finally {
            setIsImporting(false);
        }
    };

    const downloadPDF = async () => {
        const element = resumeRef.current;
        const canvas = await html2canvas(element, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    };

    const getLinkIcon = (type, size = 12) => {
        switch (type) {
            case 'linkedin': return <Linkedin size={size} />;
            case 'github': return <Github size={size} />;
            case 'portfolio': return <Globe size={size} />;
            case 'twitter': return <Twitter size={size} />;
            case 'email': return <Mail size={size} />;
            case 'phone': return <Phone size={size} />;
            default: return <LinkIcon size={size} />;
        }
    };

    const renderHeaderLinks = (color = '#444') => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.4rem', fontSize: '0.8rem', color }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Mail size={12} /> {personalInfo.email}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Phone size={12} /> {personalInfo.phone}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={12} /> {personalInfo.location}</span>
            {personalInfo.customLinks.map((link, idx) => (
                <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {getLinkIcon(link.type)} {link.url}
                </span>
            ))}
        </div>
    );

    const renderSection = (type, theme = 'elite') => {
        const borderStyle = theme === 'elite' ? '1.5px solid #1a1a1a' : '2px solid #3b82f6';
        if (type === 'projects') return (
            <ExecutiveSection title={sectionTitles.projects.toUpperCase()} border={borderStyle}>
                {projects.map(p => (
                    <div key={p.id} style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}><span>{p.title}</span><span style={{ color: '#666', fontSize: '0.85rem' }}>{p.duration}</span></div>
                        <div style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: '600', marginBottom: '0.2rem' }}>{p.stack}</div>
                        <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.4' }}>{p.desc}</p>
                    </div>
                ))}
            </ExecutiveSection>
        );
        if (type === 'experience' && experience.length > 0) return (
            <ExecutiveSection title={sectionTitles.experience.toUpperCase()} border={borderStyle}>
                {experience.map(exp => (
                    <div key={exp.id} style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}><span>{exp.company}</span><span style={{ color: '#666', fontSize: '0.85rem' }}>{exp.duration}</span></div>
                        <div style={{ fontWeight: '600', color: '#444', fontSize: '0.9rem' }}>{exp.role}</div>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.2rem', color: '#333' }}>{exp.desc}</p>
                    </div>
                ))}
            </ExecutiveSection>
        );
        if (type === 'skills') return (
            <ExecutiveSection title={sectionTitles.skills.toUpperCase()} border={borderStyle}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {skills.map(s => <span key={s.name} style={{ background: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>{s.name}</span>)}
                </div>
            </ExecutiveSection>
        );
        if (type === 'education') return (
            <ExecutiveSection title={sectionTitles.education.toUpperCase()} border={borderStyle}>
                {education.map(edu => <div key={edu.id} style={{ marginBottom: '0.3rem' }}><b>{edu.school}</b> · <span style={{ fontSize: '0.9rem' }}>{edu.degree} ({edu.year})</span></div>)}
            </ExecutiveSection>
        );
        if (type === 'achievements') return (
            <ExecutiveSection title={sectionTitles.achievements.toUpperCase()} border={borderStyle}>
                {achievements.map(ach => <div key={ach.id} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.2rem' }}><Award size={12} color="#3b82f6" /> <span style={{ fontSize: '0.9rem' }}>{ach.title}</span></div>)}
            </ExecutiveSection>
        );
        if (type === 'languages') return (
            <ExecutiveSection title={sectionTitles.languages.toUpperCase()} border={borderStyle}>
                <div style={{ display: 'flex', gap: '1.2rem' }}>{languages.map(l => <div key={l.name} style={{ fontSize: '0.9rem' }}><b>{l.name}</b>: {l.label}</div>)}</div>
            </ExecutiveSection>
        );
        if (type.startsWith('custom_')) {
            const sec = customSections.find(s => s.id === type);
            if (!sec) return null;
            return (
                <ExecutiveSection title={sec.title.toUpperCase()} border={borderStyle}>
                    <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{sec.content}</p>
                </ExecutiveSection>
            );
        }
        return null;
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
            <AnimatePresence>
                {importModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', width: '100%', maxWidth: '600px', padding: '2.5rem', position: 'relative' }}>
                            <button onClick={() => setImportModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white' }}>Elite Data Hub</h2>
                            <p style={{ color: '#aaa', marginBottom: '2rem', fontSize: '0.95rem' }}>Fast-track your resume building by importing existing data.</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                    <Upload size={32} color="#3b82f6" style={{ marginBottom: '1rem' }} />
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>JSON Backup</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>Upload a .json file from a previous export.</p>
                                    <label className="btn-outline" style={{ display: 'inline-flex', cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                        Choose File <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
                                    </label>
                                </div>
                                <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)', textAlign: 'center' }}>
                                    <Sparkles size={32} color="#3b82f6" style={{ marginBottom: '1rem' }} />
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>AI Text Parse</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>Paste your old resume text & let AI do the work.</p>
                                    <button onClick={() => document.getElementById('ai-text-area').scrollIntoView()} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Start AI Sync</button>
                                </div>
                            </div>

                            <div id="ai-text-area" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'block', marginBottom: '0.5rem' }}>Paste Resume Text (Ctrl+A & Ctrl+C from any PDF/Doc)</label>
                                <textarea
                                    value={rawResumeText}
                                    onChange={(e) => setRawResumeText(e.target.value)}
                                    placeholder="Paste your existing resume content here... AI will extract your experience, skills, and data."
                                    style={{ width: '100%', height: '150px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', color: 'white', fontSize: '0.9rem', marginBottom: '1rem', resize: 'none' }}
                                />
                                <button onClick={handleAIImport} disabled={isImporting || !rawResumeText} className="btn-primary" style={{ width: '100%', height: '50px', fontSize: '1rem' }}>
                                    {isImporting ? <><Sparkles size={18} className="animate-spin" /> Analyzing Text...</> : 'Sync Data with AI'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>
                        The <span className="text-gradient">Elite</span> Studio
                    </h1>
                    <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.5rem', maxWidth: '700px' }}>
                        {[
                            { id: 'elite', name: 'Elite Screen', icon: <Gem size={14} /> },
                            { id: 'pro_executive', name: 'Elite II (Pro)', icon: <Briefcase size={14} /> },
                            { id: 'modern_compact', name: 'Elite III (Compact)', icon: <Layout size={14} /> },
                            { id: 'minimal_bold', name: 'Elite IV (Bold)', icon: <Sparkles size={14} /> }
                        ].map(t => (
                            <button key={t.id} onClick={() => setTemplate(t.id)} className={`chip ${template === t.id ? 'active' : ''}`} style={{ padding: '0.6rem 1rem', borderRadius: '12px', background: template === t.id ? 'var(--color-secondary)' : 'rgba(255,255,255,0.03)', color: template === t.id ? 'black' : 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold' }}>
                                {t.icon} {t.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <AnimatePresence>{saveSuccess && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: 'var(--color-success)', fontSize: '0.8rem' }}><CheckCircle size={14} /> Synced</motion.span>}</AnimatePresence>
                    <button onClick={() => setImportModal(true)} className="btn-outline" style={{ borderColor: 'rgba(59, 130, 246, 0.4)', color: '#3b82f6' }}><Upload size={14} /> Import Data</button>
                    <button onClick={handleExportJSON} className="btn-outline" title="Download JSON Backup"><FileDown size={14} /> Backup</button>
                    <button onClick={handleSave} disabled={isSaving} className="btn-outline"><Layout size={14} /> {isSaving ? 'Saving...' : 'Draft'}</button>
                    <button onClick={downloadPDF} className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}><Download size={16} /> Export PDF</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '500px 1fr', gap: '2rem' }}>
                <div style={{ maxHeight: '85vh', overflowY: 'auto', paddingRight: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Section title="Header Design" icon={<User size={18} />}>
                        <InputField label="Profile Name" name="fullName" value={personalInfo.fullName} onChange={handlePersonalInfo} />
                        <InputField label="Headline/Role" name="role" value={personalInfo.role} onChange={handlePersonalInfo} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <InputField label="Phone" name="phone" value={personalInfo.phone} onChange={handlePersonalInfo} />
                            <InputField label="Location" name="location" value={personalInfo.location} onChange={handlePersonalInfo} />
                        </div>
                        <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>Email & Social Links</label>
                        <InputField label="Email Address" name="email" value={personalInfo.email} onChange={handlePersonalInfo} />

                        {personalInfo.customLinks.map((link, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem', alignItems: 'flex-start' }}>
                                <select value={link.type} onChange={(e) => updateItem('link', i, 'type', e.target.value)} style={{ ...inputStyle, width: '120px' }}>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="github">GitHub</option>
                                    <option value="portfolio">Portfolio</option>
                                    <option value="twitter">Twitter</option>
                                    <option value="link">Other Link</option>
                                </select>
                                <div style={{ flex: 1 }}>
                                    <input placeholder="Link URL (e.g. github.com/user)" value={link.url} onChange={(e) => updateItem('link', i, 'url', e.target.value)} style={inputStyle} />
                                </div>
                                <button onClick={() => removeItem('link', i)} style={{ padding: '0.7rem', color: '#ef4444', background: 'none', border: 'none' }}><Trash2 size={16} /></button>
                            </div>
                        ))}
                        <button onClick={() => addItem('link')} className="btn-add-item"><Plus size={14} /> Add Social/Link</button>

                        <InputField label="Professional Summary" name="summary" value={personalInfo.summary} onChange={handlePersonalInfo} isTextarea />
                    </Section>

                    {sectionOrder.map((sec, idx) => (
                        <div key={sec} style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', right: '1rem', top: '1.2rem', display: 'flex', gap: '0.3rem', zIndex: 10 }}>
                                <button onClick={() => moveSection(idx, -1)} className="btn-move"><ChevronUp size={14} /></button>
                                <button onClick={() => moveSection(idx, 1)} className="btn-move"><ChevronDown size={14} /></button>
                            </div>
                            {sec === 'projects' && (
                                <Section title="Lead Projects" icon={<Code size={18} />}>
                                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
                                        <InputField label="Section Name" value={sectionTitles.projects} onChange={(e) => updateItem('section_title', 'projects', null, e.target.value)} />
                                    </div>
                                    {projects.map((p, i) => (
                                        <div key={p.id} className="edit-card">
                                            <button onClick={() => removeItem('proj', i)} className="btn-delete"><Trash2 size={14} /></button>
                                            <InputField label="Project Title" value={p.title} onChange={(e) => updateItem('proj', i, 'title', e.target.value)} />
                                            <InputField label="Tech Stack" value={p.stack} onChange={(e) => updateItem('proj', i, 'stack', e.target.value)} />
                                            <InputField label="Duration" value={p.duration} onChange={(e) => updateItem('proj', i, 'duration', e.target.value)} />
                                            <InputField label="Brief Description" value={p.desc} onChange={(e) => updateItem('proj', i, 'desc', e.target.value)} isTextarea />
                                        </div>
                                    ))}
                                    <button onClick={() => addItem('proj')} className="btn-add-item"><Plus size={16} /> Add New Project</button>
                                </Section>
                            )}
                            {sec === 'experience' && (
                                <Section title="Work Experience" icon={<Briefcase size={18} />}>
                                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
                                        <InputField label="Section Name" value={sectionTitles.experience} onChange={(e) => updateItem('section_title', 'experience', null, e.target.value)} />
                                    </div>
                                    {experience.map((exp, i) => (
                                        <div key={exp.id} className="edit-card">
                                            <button onClick={() => removeItem('exp', i)} className="btn-delete"><Trash2 size={14} /></button>
                                            <InputField label="Company Name" value={exp.company} onChange={(e) => updateItem('exp', i, 'company', e.target.value)} />
                                            <InputField label="Role / Designation" value={exp.role} onChange={(e) => updateItem('exp', i, 'role', e.target.value)} />
                                            <InputField label="Duration" value={exp.duration} onChange={(e) => updateItem('exp', i, 'duration', e.target.value)} />
                                            <InputField label="Key Responsibilities" value={exp.desc} onChange={(e) => updateItem('exp', i, 'desc', e.target.value)} isTextarea />
                                        </div>
                                    ))}
                                    <button onClick={() => addItem('exp')} className="btn-add-item"><Plus size={16} /> Add Experience</button>
                                </Section>
                            )}
                            {sec === 'skills' && (
                                <Section title="Skills & Expertise" icon={<Zap size={18} />}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <InputField label="Section Name" value={sectionTitles.skills} onChange={(e) => updateItem('section_title', 'skills', null, e.target.value)} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                        {skills.map((s, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                                <input placeholder="Skill name" value={s.name} onChange={(e) => updateItem('skill', i, 'name', e.target.value)} style={inputStyle} />
                                                <button onClick={() => removeItem('skill', i)} style={{ color: '#ef4444', background: 'none', border: 'none' }}><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => addItem('skill')} className="btn-add-item" style={{ marginTop: '1rem' }}><Plus size={16} /> Add Skill</button>
                                </Section>
                            )}
                            {sec === 'education' && (
                                <Section title="Education" icon={<GraduationCap size={18} />}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <InputField label="Section Name" value={sectionTitles.education} onChange={(e) => updateItem('section_title', 'education', null, e.target.value)} />
                                    </div>
                                    {education.map((edu, i) => (
                                        <div key={edu.id} className="edit-card">
                                            <InputField label="Institution" value={edu.school} onChange={(e) => updateItem('edu', i, 'school', e.target.value)} />
                                            <InputField label="Degree/Course" value={edu.degree} onChange={(e) => updateItem('edu', i, 'degree', e.target.value)} />
                                            <InputField label="Year of Completion" value={edu.year} onChange={(e) => updateItem('edu', i, 'year', e.target.value)} />
                                        </div>
                                    ))}
                                    <button onClick={() => addItem('edu')} className="btn-add-item"><Plus size={16} /> Add Education</button>
                                </Section>
                            )}
                            {sec === 'achievements' && (
                                <Section title="Honors & Achievements" icon={<Award size={18} />}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <InputField label="Section Name" value={sectionTitles.achievements} onChange={(e) => updateItem('section_title', 'achievements', null, e.target.value)} />
                                    </div>
                                    {achievements.map((ach, i) => (
                                        <div key={ach.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                                            <input placeholder="Achievement detail" value={ach.title} onChange={(e) => updateItem('ach', i, 'title', e.target.value)} style={inputStyle} />
                                            <button onClick={() => removeItem('ach', i)} style={{ color: '#ef4444', background: 'none', border: 'none' }}><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => addItem('ach')} className="btn-add-item"><Plus size={16} /> Add Achievement</button>
                                </Section>
                            )}
                            {sec === 'languages' && (
                                <Section title="Languages" icon={<LangIcon size={18} />}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <InputField label="Section Name" value={sectionTitles.languages} onChange={(e) => updateItem('section_title', 'languages', null, e.target.value)} />
                                    </div>
                                    {languages.map((l, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                                            <input placeholder="Language" value={l.name} onChange={(e) => updateItem('lang', i, 'name', e.target.value)} style={inputStyle} />
                                            <input placeholder="Proficiency" value={l.label} onChange={(e) => updateItem('lang', i, 'label', e.target.value)} style={inputStyle} />
                                            <button onClick={() => removeItem('lang', i)} style={{ color: '#ef4444', background: 'none', border: 'none' }}><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => addItem('lang')} className="btn-add-item"><Plus size={16} /> Add Language</button>
                                </Section>
                            )}
                            {sec.startsWith('custom_') && (
                                <Section title="Custom Section" icon={<Pencil size={18} />}>
                                    <div className="edit-card">
                                        <button onClick={() => removeItem(sec)} className="btn-delete"><Trash2 size={14} /></button>
                                        <InputField label="Section Name" value={customSections.find(s => s.id === sec)?.title || ''} onChange={(e) => updateItem(sec, 0, 'title', e.target.value)} />
                                        <InputField label="Section Content" value={customSections.find(s => s.id === sec)?.content || ''} onChange={(e) => updateItem(sec, 0, 'content', e.target.value)} isTextarea />
                                    </div>
                                </Section>
                            )}
                        </div>
                    ))}
                    <button onClick={() => addItem('custom_sec')} className="btn-add-item" style={{ borderStyle: 'solid', background: 'var(--color-secondary', color: 'black', height: '60px', fontSize: '1.1rem' }}>
                        <Plus size={20} /> Add New Section (Certifications, Volunteer, etc.)
                    </button>
                </div>

                <div style={{ position: 'sticky', top: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <div ref={resumeRef} style={{ width: '210mm', minHeight: '297mm', background: 'white', color: '#1a1a1a', padding: '15mm', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', transform: 'scale(0.55)', transformOrigin: 'top center', fontFamily: '"Inter", sans-serif' }}>

                        {template === 'elite' && (
                            <>
                                <div style={{ borderBottom: '3px solid #1a1a1a', paddingBottom: '1rem', marginBottom: '1.2rem' }}>
                                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: '#1a1a1a', letterSpacing: '-0.02em' }}>{personalInfo.fullName}</h1>
                                    <div style={{ color: '#3b82f6', fontWeight: '700', fontSize: '1.1rem', marginTop: '2px' }}>{personalInfo.role}</div>
                                    {renderHeaderLinks()}
                                </div>
                                <div style={{ marginBottom: '1.5rem', fontSize: '0.92rem', lineHeight: '1.5', color: '#333' }}>{personalInfo.summary}</div>
                                {sectionOrder.map(type => <div key={type}>{renderSection(type)}</div>)}
                            </>
                        )}

                        {template === 'pro_executive' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                <div style={{ borderBottom: '5px solid #1a1a1a', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                                    <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#1a1a1a', margin: 0, textTransform: 'uppercase' }}>{personalInfo.fullName}</h1>
                                    <div style={{ background: '#1a1a1a', color: 'white', display: 'inline-block', padding: '0.3rem 0.8rem', fontWeight: '700', marginTop: '0.5rem', borderRadius: '4px' }}>{personalInfo.role}</div>
                                    <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>{renderHeaderLinks()}</div>
                                </div>
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '0.8rem', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Professional Profile</h3>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#333' }}>{personalInfo.summary}</p>
                                </div>
                                {sectionOrder.map(type => <div key={type} style={{ marginBottom: '2rem' }}>{renderSection(type, 'elite')}</div>)}
                            </div>
                        )}

                        {template === 'modern_compact' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '15mm', margin: '-5mm', padding: '5mm', minHeight: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ borderBottom: '3px solid #3b82f6', paddingBottom: '1rem' }}>
                                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>{personalInfo.fullName}</h1>
                                        <div style={{ color: '#3b82f6', fontWeight: '700', fontSize: '1.1rem' }}>{personalInfo.role}</div>
                                        <div style={{ marginTop: '0.8rem' }}>{renderHeaderLinks()}</div>
                                    </div>
                                    <div style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>{personalInfo.summary}</div>
                                    {sectionOrder.filter(s => ['projects', 'experience'].includes(s)).map(type => <div key={type}>{renderSection(type)}</div>)}
                                </div>
                                <div style={{ background: '#f8fafc', padding: '8mm', borderRadius: '15px', borderLeft: '1px solid #e2e8f0' }}>
                                    {sectionOrder.filter(s => !['projects', 'experience'].includes(s)).map(type => <div key={type} style={{ marginBottom: '1.5rem' }}>{renderSection(type)}</div>)}
                                </div>
                            </div>
                        )}

                        {template === 'minimal_bold' && (
                            <div style={{ padding: '5mm' }}>
                                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1a1a1a', margin: 0, letterSpacing: '-0.04em' }}>{personalInfo.fullName}</h1>
                                    <p style={{ fontSize: '1.2rem', color: '#666', fontWeight: '600', margin: '0.5rem 0 1.5rem' }}>{personalInfo.role}</p>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>{renderHeaderLinks()}</div>
                                </div>
                                <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                                    <div style={{ borderLeft: '4px solid #1a1a1a', paddingLeft: '2rem', marginBottom: '3rem' }}>
                                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#333', fontStyle: 'italic' }}>"{personalInfo.summary}"</p>
                                    </div>
                                    {sectionOrder.map(type => <div key={type} style={{ marginBottom: '2.5rem' }}>{renderSection(type, 'elite')}</div>)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                .btn-add-item {
                    width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px dashed rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.02); color: white; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; gap: 0.6rem; font-weight: 600; transition: all 0.3s;
                }
                .btn-add-item:hover { background: rgba(255,255,255,0.05); border-color: var(--color-secondary); color: var(--color-secondary); }
                .edit-card { position: relative; padding: 1.2rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; marginBottom: 1.2rem; }
                .btn-delete { position: absolute; top: 0.8rem; right: 0.8rem; color: #ef4444; background: none; border: none; cursor: pointer; opacity: 0.6; transition: 0.2s; }
                .btn-delete:hover { opacity: 1; transform: scale(1.1); }
                .btn-move { background: rgba(255,255,255,0.05); color: white; border: none; borderRadius: 4px; cursor: pointer; padding: 4px; display: flex; align-items: center; transition: 0.2s; }
                .btn-move:hover { background: rgba(255,255,255,0.15); color: var(--color-secondary); }
            `}</style>
        </div>
    );
}

function Section({ title, icon, children }) {
    return (
        <div className="glass-card" style={{ padding: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem', margin: 0, fontWeight: '700' }}>{icon} {title}</h3>
            </div>
            {children}
        </div>
    );
}

function ExecutiveSection({ title, children, border }) {
    return (
        <div style={{ marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: '800', borderBottom: border || '1.5px solid #1a1a1a', paddingBottom: '0.2rem', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>{title}</h3>
            {children}
        </div>
    );
}

function ResumeSection({ title, children, themeColor }) {
    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '900', color: themeColor, borderBottom: `2px solid ${themeColor}`, paddingBottom: '0.3rem', marginBottom: '0.8rem' }}>{title}</h3>
            {children}
        </div>
    );
}

function InputField({ label, name, value, onChange, isTextarea = false }) {
    const Component = isTextarea ? 'textarea' : 'input';
    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', opacity: 0.5, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
            <Component name={name} value={value} onChange={onChange} style={{ ...inputStyle, minHeight: isTextarea ? '100px' : 'auto', lineHeight: '1.5' }} />
        </div>
    );
}

const inputStyle = {
    width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', outline: 'none', fontSize: '0.9rem', transition: 'all 0.3s'
};


