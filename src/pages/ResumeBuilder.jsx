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
import * as pdfjsLib from 'pdfjs-dist';

// pdfjsLib.GlobalWorkerOptions.workerSrc will be set inside the handler to ensure local resolution

export default function ResumeBuilder() {
    const [template, setTemplate] = useState('elite');
    const [isReviewing, setIsReviewing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importModal, setImportModal] = useState(false);
    const [rawResumeText, setRawResumeText] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [aiFeedback, setAiFeedback] = useState(null);
    const [themeColor, setThemeColor] = useState('#3b82f6');
    const [fontFamily, setFontFamily] = useState("'Inter', sans-serif");
    const [bulletStyle, setBulletStyle] = useState('•');
    const [sectionGap, setSectionGap] = useState('1.2rem');
    const [pageMargin, setPageMargin] = useState('15mm');
    const [headerStyle, setHeaderStyle] = useState('standard');
    const [atsMode, setAtsMode] = useState(false);
    const [showIcons, setShowIcons] = useState(true);
    const [jobDescription, setJobDescription] = useState('');
    const [matchScore, setMatchScore] = useState(0);
    const resumeRef = useRef();
    const { user, saveResume, getResume } = useAuth();

    // State
    const defaultPersonal = {
        fullName: 'SUMIT KUMAR GUPTA',
        role: 'iOS Developer',
        email: 'sksumitkumar346@gmail.com',
        phone: '8986292042',
        location: 'Bengaluru',
        summary: 'iOS Developer with over 3+ years of experience in developing high-performance applications using Swift and SwiftUI. Skilled in collaborating with cross-functional teams to deliver effective software solutions. Proficient in project management tools like Jira and committed to integrating new technologies for process optimization.',
        customLinks: [
            { type: 'linkedin', url: 'linkedin.com/in/sumit-kumar-gupta-6a968b95' }
        ]
    };

    const defaultExperience = [
        {
            id: 1,
            company: 'Kibbcom India Private Limited',
            role: 'iOS Developer',
            duration: 'Jul 2022 - Present',
            location: 'Bengaluru',
            desc: 'Engineered and maintained high-performance iOS applications using Swift and SwiftUI.\nCollaborated with cross-functional teams to deliver effective software solutions.\nProficient in project management tools like Jira and version control with Git.',
            isBulleted: true,
            extraFields: []
        }
    ];

    const defaultProjects = [
        {
            id: 1,
            title: 'Zedbud - Community App',
            duration: '2023',
            stack: 'SwiftUI, Firebase, Cloud Messaging',
            desc: 'Developed a feature-rich community app with real-time notifications and feed updates.\nImplemented secure authentication and real-time database integration.',
            isBulleted: true,
            extraFields: []
        },
        {
            id: 2,
            title: 'CTEK - Hardware Interface',
            duration: '2022',
            stack: 'CoreBluetooth, SwiftUI',
            desc: 'Integrated hardware communication protocols using CoreBluetooth for seamless device interaction.',
            isBulleted: true,
            extraFields: []
        },
        {
            id: 3,
            title: 'TrackMyOffice',
            duration: '2022',
            stack: 'Swift, UIKit, SQL',
            desc: 'Internal office management tool for tracking tasks and employee productivity.',
            isBulleted: true,
            extraFields: []
        }
    ];

    const defaultEducation = [
        { id: 1, school: 'PES University', degree: 'Bachelor of Technology in Computer Science', year: '2022', extraFields: [{ label: 'Location', value: 'Bengaluru' }] }
    ];

    const defaultSkills = [
        { name: 'SwiftUI & Swift', level: 95 },
        { name: 'UIKit & MVC/MVVM', level: 90 },
        { name: 'Firebase & Cloud Services', level: 85 },
        { name: 'Core Data & SQL', level: 80 },
        { name: 'Git & Azure', level: 85 },
        { name: 'Jira & Agile', level: 90 }
    ];

    const defaultAchievements = [
        { id: 1, title: 'MERN Stack Development Certification' },
        { id: 2, title: 'Linux & Docker Proficiency' }
    ];

    const [personalInfo, setPersonalInfo] = useState(defaultPersonal);

    const [sectionOrder, setSectionOrder] = useState(['experience', 'projects', 'skills', 'education', 'achievements', 'languages']);
    const [sectionTitles, setSectionTitles] = useState({
        projects: 'KEY PROJECTS',
        experience: 'PROFESSIONAL EXPERIENCE',
        skills: 'CORE SKILLS',
        education: 'EDUCATION',
        achievements: 'CERTIFICATIONS & AWARDS',
        languages: 'LANGUAGES'
    });
    const [experience, setExperience] = useState(defaultExperience);
    const [projects, setProjects] = useState(defaultProjects);
    const [education, setEducation] = useState(defaultEducation);
    const [skills, setSkills] = useState(defaultSkills);
    const [achievements, setAchievements] = useState(defaultAchievements);
    const [languages, setLanguages] = useState([
        { name: 'English', label: 'Fluent' },
        { name: 'Hindi', label: 'Native' }
    ]);
    const [customSections, setCustomSections] = useState([]);

    const restoreMyProfile = () => {
        setPersonalInfo(defaultPersonal);
        setExperience(defaultExperience);
        setProjects(defaultProjects);
        setEducation(defaultEducation);
        setSkills(defaultSkills);
        setAchievements(defaultAchievements);
        setImportModal(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    };

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
            setCustomSections(savedData.customSections || []);
            if (savedData.sectionTitles) setSectionTitles(savedData.sectionTitles);
            if (savedData.template) setTemplate(savedData.template);
            if (savedData.themeColor) setThemeColor(savedData.themeColor);
            if (savedData.fontFamily) setFontFamily(savedData.fontFamily);
            if (savedData.bulletStyle) setBulletStyle(savedData.bulletStyle);
            if (savedData.sectionGap) setSectionGap(savedData.sectionGap);
            if (savedData.pageMargin) setPageMargin(savedData.pageMargin);
            if (savedData.headerStyle) setHeaderStyle(savedData.headerStyle);
            if (savedData.atsMode !== undefined) setAtsMode(savedData.atsMode);
            if (savedData.showIcons !== undefined) setShowIcons(savedData.showIcons);
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
        if (type === 'exp') setExperience([...experience, { id: Date.now(), company: '', role: '', duration: '', desc: '', location: '', extraFields: [], isBulleted: true }]);
        if (type === 'proj') setProjects([...projects, { id: Date.now(), title: '', duration: '', stack: '', desc: '', extraFields: [], isBulleted: true }]);
        if (type === 'edu') setEducation([...education, { id: Date.now(), school: '', degree: '', year: '', extraFields: [] }]);
        if (type === 'skill') setSkills([...skills, { name: '', level: 50 }]);
        if (type === 'ach') setAchievements([...achievements, { id: Date.now(), title: '' }]);
        if (type === 'lang') setLanguages([...languages, { name: '', label: '' }]);
        if (type === 'link') setPersonalInfo({ ...personalInfo, customLinks: [...personalInfo.customLinks, { type: 'link', url: '' }] });
        if (type === 'custom_sec') {
            const newId = `custom_${Date.now()}`;
            setCustomSections([...customSections, { id: newId, title: 'New Section', content: '', isBulleted: false }]);
            setSectionOrder([...sectionOrder, newId]);
        }
    };

    const addExtraField = (type, index) => {
        const updateMap = { exp: [experience, setExperience], proj: [projects, setProjects], edu: [education, setEducation] };
        const [data, setter] = updateMap[type];
        const newData = [...data];
        if (!newData[index].extraFields) newData[index].extraFields = [];
        newData[index].extraFields.push({ label: '', value: '' });
        setter(newData);
    };

    const updateExtraField = (type, itemIdx, fieldIdx, key, val) => {
        const updateMap = { exp: [experience, setExperience], proj: [projects, setProjects], edu: [education, setEducation] };
        const [data, setter] = updateMap[type];
        const newData = [...data];
        newData[itemIdx].extraFields[fieldIdx][key] = val;
        setter(newData);
    };

    const removeExtraField = (type, itemIdx, fieldIdx) => {
        const updateMap = { exp: [experience, setExperience], proj: [projects, setProjects], edu: [education, setEducation] };
        const [data, setter] = updateMap[type];
        const newData = [...data];
        newData[itemIdx].extraFields.splice(fieldIdx, 1);
        setter(newData);
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
        saveResume({
            personalInfo, experience, education, skills, achievements, projects, languages,
            sectionOrder, template, customSections, sectionTitles,
            themeColor, fontFamily, bulletStyle, sectionGap,
            pageMargin, headerStyle, atsMode, showIcons
        });
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 800);
    };

    const handleExportJSON = () => {
        const data = {
            personalInfo, experience, education, skills, achievements, projects, languages,
            sectionOrder, template, customSections, sectionTitles,
            themeColor, fontFamily, bulletStyle, sectionGap, pageMargin, headerStyle, atsMode, showIcons
        };
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
                if (data.themeColor) setThemeColor(data.themeColor);
                if (data.fontFamily) setFontFamily(data.fontFamily);
                if (data.bulletStyle) setBulletStyle(data.bulletStyle);
                if (data.sectionGap) setSectionGap(data.sectionGap);
                if (data.pageMargin) setPageMargin(data.pageMargin);
                if (data.headerStyle) setHeaderStyle(data.headerStyle);
                if (data.atsMode !== undefined) setAtsMode(data.atsMode);
                if (data.showIcons !== undefined) setShowIcons(data.showIcons);
                setImportModal(false);
            } catch (err) {
                alert("Invalid JSON file");
            }
        };
        reader.readAsText(file);
    };

    const calculateMatch = () => {
        if (!jobDescription.trim()) return setMatchScore(0);
        const keywords = jobDescription.toLowerCase().match(/\b(\w+)\b/g);
        const resumeContent = JSON.stringify({ personalInfo, experience, projects, skills }).toLowerCase();
        let matchCount = 0;
        const uniqueKeywords = [...new Set(keywords)].filter(w => w.length > 3);
        uniqueKeywords.forEach(word => { if (resumeContent.includes(word)) matchCount++; });
        setMatchScore(Math.round((matchCount / uniqueKeywords.length) * 100));
    };

    const handleAIImport = async () => {
        if (!rawResumeText.trim()) return;
        setIsImporting(true);
        try {
            const result = await parseResumeAI(rawResumeText);
            if (result) {
                if (result.personalInfo) setPersonalInfo({ ...defaultPersonal, ...result.personalInfo });
                if (result.experience) setExperience(result.experience);
                if (result.education) setEducation(result.education);
                if (result.skills) setSkills(result.skills);
                if (result.projects) setProjects(result.projects);
                if (result.achievements) setAchievements(result.achievements);
                if (result.languages) setLanguages(result.languages);
                setImportModal(false);
                setRawResumeText('');
            }
        } catch (error) {
            console.error('AI Import failed:', error);
        } finally {
            setIsImporting(false);
        }
    };

    const handleImportPDF = async (e) => {
        const file = e.target.files[0];
        if (!file || file.type !== 'application/pdf') return;

        setIsImporting(true);
        try {
            // Set local worker explicitly before any operations
            pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
                'pdfjs-dist/build/pdf.worker.mjs',
                import.meta.url
            ).toString();

            const reader = new FileReader();
            reader.onload = async function () {
                try {
                    const typedarray = new Uint8Array(this.result);
                    const pdf = await pdfjsLib.getDocument({
                        data: typedarray,
                        useWorkerFetch: false,
                        isEvalSupported: false
                    }).promise;
                    let fullText = "";

                    if (pdf.numPages === 0) {
                        throw new Error("The PDF document has no pages.");
                    }

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        // Using includeMarkedContent for deeper text recovery in complex/tagged PDFs
                        const textContent = await page.getTextContent({ includeMarkedContent: true });

                        const items = textContent.items.sort((a, b) => {
                            const yDiff = b.transform[5] - a.transform[5];
                            if (Math.abs(yDiff) > 3) return yDiff;
                            return a.transform[4] - b.transform[4];
                        });

                        const pageText = items.map(item => item.str).join(" ");
                        fullText += pageText + "\n";
                    }

                    if (!fullText.trim() || fullText.replace(/\s/g, '').length < 20) {
                        throw new Error("No readable text found. This PDF might be a scanned image or protected.");
                    }

                    setRawResumeText(fullText);

                    // Directly trigger AI parse
                    const result = await parseResumeAI(fullText);
                    if (result) {
                        if (result.personalInfo) setPersonalInfo({ ...defaultPersonal, ...result.personalInfo });
                        if (result.experience) setExperience(result.experience);
                        if (result.education) setEducation(result.education);
                        if (result.skills) setSkills(result.skills);
                        if (result.projects) setProjects(result.projects);
                        if (result.achievements) setAchievements(result.achievements);
                        if (result.languages) setLanguages(result.languages);
                        setImportModal(false);
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 3000);
                    } else {
                        alert("AI was unable to parse the PDF text. You can still manually edit the text in the 'AI Text Parse' box below.");
                    }
                } catch (err) {
                    console.error('Inner PDF processing error:', err);
                    alert("Unable to read text from this PDF. It might be a scanned image (flat photo) or have security locks.\n\nRedirecting you to the AI Text Parser so you can paste the text manually.");
                    // Scroll to the text area so they can paste
                    setTimeout(() => {
                        const area = document.getElementById('ai-text-area');
                        if (area) area.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                } finally {
                    setIsImporting(false);
                }
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('PDF reader error:', error);
            alert("Failed to read PDF file.");
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

    const renderDescription = (text, isBulleted, style = {}) => {
        if (!text) return null;
        if (isBulleted) {
            const points = text.split('\n').filter(p => p.trim() !== '');
            return (
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.4rem', marginBottom: 0, fontSize: 'inherit', listStyleType: 'none', ...style }}>
                    {points.map((p, i) => (
                        <li key={i} style={{ marginBottom: '0.2rem', lineHeight: '1.4', display: 'flex', gap: '0.5rem' }}>
                            {showIcons && <span style={{ color: atsMode ? '#1a1a1a' : themeColor, flexShrink: 0 }}>{bulletStyle}</span>}
                            {!showIcons && <span style={{ flexShrink: 0 }}>•</span>}
                            <span>{p.trim().replace(/^[-•*]\s*/, '')}</span>
                        </li>
                    ))}
                </ul>
            );
        }
        return <div style={{ whiteSpace: 'pre-wrap', ...style }}>{text}</div>;
    };

    const renderHeaderLinks = (color = '#444') => {
        const iconSize = 12;
        const links = [
            { icon: <Mail size={iconSize} />, val: personalInfo.email, show: true },
            { icon: <Phone size={iconSize} />, val: personalInfo.phone, show: true },
            { icon: <MapPin size={iconSize} />, val: personalInfo.location, show: true },
            ...personalInfo.customLinks.map(l => ({ icon: getLinkIcon(l.type), val: l.url, show: true }))
        ];

        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.4rem', fontSize: '0.8rem', color, justifyContent: headerStyle === 'centered' ? 'center' : 'flex-start' }}>
                {links.map((link, idx) => (
                    <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {(showIcons && !atsMode) && link.icon} {link.val}
                    </span>
                ))}
            </div>
        );
    };

    const renderSection = (type, theme = 'elite') => {
        const borderStyle = theme === 'elite' ? `1.5px solid ${atsMode ? '#1a1a1a' : themeColor}` : `2px solid ${atsMode ? '#1a1a1a' : themeColor}`;
        if (type === 'projects') return (
            <ExecutiveSection title={sectionTitles.projects.toUpperCase()} border={borderStyle}>
                {projects.map(p => (
                    <div key={p.id} style={{ marginBottom: sectionGap }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}><span>{p.title}</span><span style={{ color: '#666', fontSize: '0.85rem' }}>{p.duration}</span></div>
                        <div style={{ fontSize: '0.85rem', color: atsMode ? '#000' : themeColor, fontWeight: '600', marginBottom: '0.2rem' }}>{p.stack}</div>
                        {p.extraFields?.length > 0 && (
                            <div style={{ fontSize: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '0.2rem', color: '#666' }}>
                                {p.extraFields.map((f, idx) => (f.label || f.value) && <span key={idx}><b>{f.label}:</b> {f.value}</span>)}
                            </div>
                        )}
                        {renderDescription(p.desc, p.isBulleted, { fontSize: '0.9rem', color: '#333' })}
                    </div>
                ))}
            </ExecutiveSection>
        );
        if (type === 'experience' && experience.length > 0) return (
            <ExecutiveSection title={sectionTitles.experience.toUpperCase()} border={borderStyle}>
                {experience.map(exp => (
                    <div key={exp.id} style={{ marginBottom: sectionGap }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}><span>{exp.company}</span><span style={{ color: '#666', fontSize: '0.85rem' }}>{exp.duration}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: '600', color: '#444', fontSize: '0.9rem' }}>{exp.role}</div>
                            {exp.location && <div style={{ fontSize: '0.8rem', color: '#888' }}><MapPin size={10} /> {exp.location}</div>}
                        </div>
                        {exp.extraFields?.length > 0 && (
                            <div style={{ fontSize: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.8rem', margin: '0.2rem 0', color: '#666' }}>
                                {exp.extraFields.map((f, idx) => (f.label || f.value) && <span key={idx}><b>{f.label}:</b> {f.value}</span>)}
                            </div>
                        )}
                        {renderDescription(exp.desc, exp.isBulleted, { fontSize: '0.9rem', marginTop: '0.2rem', color: '#333' })}
                    </div>
                ))}
            </ExecutiveSection>
        );
        if (type === 'skills') return (
            <ExecutiveSection title={sectionTitles.skills.toUpperCase()} border={borderStyle}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {skills.map(s => <span key={s.name} style={{ border: atsMode ? '1px solid #ddd' : `1px solid ${themeColor}20`, background: atsMode ? 'none' : `${themeColor}08`, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', color: '#333' }}>{s.name}</span>)}
                </div>
            </ExecutiveSection>
        );
        if (type === 'education') return (
            <ExecutiveSection title={sectionTitles.education.toUpperCase()} border={borderStyle}>
                {education.map(edu => (
                    <div key={edu.id} style={{ marginBottom: sectionGap }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                            <span>{edu.school}</span>
                            <span style={{ color: '#666', fontSize: '0.85rem' }}>{edu.year}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#444' }}>{edu.degree}</div>
                        {edu.extraFields?.length > 0 && (
                            <div style={{ fontSize: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.2rem', color: '#666' }}>
                                {edu.extraFields.map((f, idx) => (f.label || f.value) && <span key={idx}><b>{f.label}:</b> {f.value}</span>)}
                            </div>
                        )}
                    </div>
                ))}
            </ExecutiveSection>
        );
        if (type === 'achievements') return (
            <ExecutiveSection title={sectionTitles.achievements.toUpperCase()} border={borderStyle}>
                {achievements.map(ach => <div key={ach.id} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.2rem' }}>{(showIcons && !atsMode) && <Award size={12} color={themeColor} />} <span style={{ fontSize: '0.9rem' }}>{ach.title}</span></div>)}
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
                <div style={{ marginBottom: sectionGap }}>
                    <ExecutiveSection title={sec.title.toUpperCase()} border={borderStyle}>
                        {renderDescription(sec.content, sec.isBulleted, { fontSize: '0.9rem', color: '#333' })}
                    </ExecutiveSection>
                </div>
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

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                    <Upload size={32} color="#3b82f6" style={{ marginBottom: '1rem' }} />
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>Direct PDF</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>Upload your PDF resume directly.</p>
                                    <label className="btn-outline" style={{ display: 'inline-flex', cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}>
                                        {isImporting ? 'Processing...' : 'Choose PDF'}
                                        <input type="file" accept=".pdf" onChange={handleImportPDF} style={{ display: 'none' }} disabled={isImporting} />
                                    </label>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                    <FileText size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>JSON Sync</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>Import from .json backup file.</p>
                                    <label className="btn-outline" style={{ display: 'inline-flex', cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}>
                                        Browse JSON <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
                                    </label>
                                </div>
                                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.3)', textAlign: 'center' }}>
                                    <User size={32} color="#3b82f6" style={{ marginBottom: '1rem' }} />
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>Restore My Profile</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>Instant pre-fill with your iOS Dev data.</p>
                                    <button onClick={restoreMyProfile} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', width: '100%' }}>Magic Pre-fill</button>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <span style={{ background: '#1a1f2e', padding: '0 1rem', fontSize: '0.7rem', color: '#666', zIndex: 1, position: 'relative' }}>OR USE AI POWERED TEXT PARSING</span>
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginTop: '-10px' }}></div>
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

            <div className="builder-header">
                <div className="builder-title-section">
                    <h1 className="builder-main-title">
                        The <span className="text-gradient">Elite</span> Studio
                    </h1>
                    <div className="template-chips">
                        {[
                            { id: 'elite', name: 'Elite', icon: <Gem size={12} /> },
                            { id: 'pro_executive', name: 'Pro', icon: <Briefcase size={12} /> },
                            { id: 'modern_compact', name: 'Modern', icon: <Layout size={12} /> },
                            { id: 'minimal_bold', name: 'Bold', icon: <Sparkles size={12} /> }
                        ].map(t => (
                            <button key={t.id} onClick={() => setTemplate(t.id)} className={`chip ${template === t.id ? 'active' : ''}`}>
                                {t.icon} {t.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="builder-actions">
                    <AnimatePresence>{saveSuccess && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: 'var(--color-success)', fontSize: '0.7rem' }}><CheckCircle size={12} /> Synced</motion.span>}</AnimatePresence>
                    <div className="action-btn-group">
                        <button onClick={() => setImportModal(true)} className="btn-outline btn-sm" style={{ color: '#3b82f6' }}><Upload size={12} /> Import</button>
                        <button onClick={handleExportJSON} className="btn-outline btn-sm"><FileDown size={12} /></button>
                        <button onClick={handleSave} disabled={isSaving} className="btn-outline btn-sm">{isSaving ? '...' : <Layout size={12} />}</button>
                        <button onClick={downloadPDF} className="btn-primary btn-sm"><Download size={14} /> PDF</button>
                    </div>
                </div>
            </div>

            <div className="resume-builder-grid">
                <div className="editor-sidebar">
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

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '600', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Professional Summary</label>
                            <div className="format-toggle">
                                <button onClick={() => setPersonalInfo({ ...personalInfo, isSummaryBulleted: false })} className={`toggle-btn ${!personalInfo.isSummaryBulleted ? 'active' : ''}`}>Simple</button>
                                <button onClick={() => setPersonalInfo({ ...personalInfo, isSummaryBulleted: true })} className={`toggle-btn ${personalInfo.isSummaryBulleted ? 'active' : ''}`}>Points</button>
                            </div>
                        </div>
                        <InputField value={personalInfo.summary} onChange={handlePersonalInfo} name="summary" isTextarea placeholder={personalInfo.isSummaryBulleted ? "Enter each point on a new line..." : "Briefly describe your professional background..."} />
                    </Section>

                    <Section title="Theme & Style" icon={<Sparkles size={18} />}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', opacity: 0.5, marginBottom: '0.8rem', textTransform: 'uppercase' }}>Accent Color</label>
                            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#1a1a1a'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setThemeColor(color)}
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', background: color, border: themeColor === color ? '2px solid white' : 'none', cursor: 'pointer', outline: themeColor === color ? '2px solid #3b82f6' : 'none' }}
                                    />
                                ))}
                                <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer' }} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', opacity: 0.5, marginBottom: '0.8rem', textTransform: 'uppercase' }}>Body Font</label>
                            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} style={inputStyle}>
                                <option value="'Inter', sans-serif">Modern (Inter)</option>
                                <option value="'Roboto', sans-serif">Clean (Roboto)</option>
                                <option value="'Playfair Display', serif">Elegant (Playfair)</option>
                                <option value="'Merriweather', serif">Bookish (Merriweather)</option>
                                <option value="'Fira Code', monospace">Tech (Fira Code)</option>
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button onClick={() => setShowIcons(!showIcons)} className={`btn-outline btn-sm ${!showIcons ? 'active' : ''}`} style={{ width: '100%', borderColor: !showIcons ? themeColor : 'rgba(255,255,255,0.1)' }}>
                                {showIcons ? <CheckCircle size={14} /> : <X size={14} />} Show Icons
                            </button>
                            <button onClick={() => setBulletStyle(bulletStyle === '•' ? '✓' : bulletStyle === '✓' ? '→' : bulletStyle === '→' ? '★' : '•')} className="btn-outline btn-sm" style={{ width: '100%' }}>
                                <span style={{ color: themeColor, marginRight: '4px' }}>{bulletStyle}</span> Cycle Bullet
                            </button>
                        </div>
                    </Section>

                    <Section title="ATS & Power Tools" icon={<Rocket size={18} />}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#3b82f6' }}>ATS Safety Mode</h4>
                                <div style={{ position: 'relative', width: '40px', height: '20px', background: atsMode ? '#3b82f6' : '#333', borderRadius: '10px', cursor: 'pointer', transition: '0.3s' }} onClick={() => setAtsMode(!atsMode)}>
                                    <div style={{ position: 'absolute', top: '2px', left: atsMode ? '22px' : '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: '0.3s' }} />
                                </div>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#aaa', margin: 0 }}>Ensures standard fonts, no complex visuals, and high parsing compatibility.</p>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', opacity: 0.5, marginBottom: '0.8rem', textTransform: 'uppercase' }}>Job Description Matcher</label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste Job Description here to check keywords..."
                                style={{ ...inputStyle, height: '80px', fontSize: '0.8rem', marginBottom: '1rem' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button onClick={calculateMatch} className="btn-primary btn-sm" style={{ height: '32px' }}>Check Match</button>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: matchScore > 70 ? '#10b981' : matchScore > 40 ? '#f59e0b' : '#ef4444' }}>{matchScore}%</div>
                                    <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>RESUME MATCH</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                            <h4 style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.8rem' }}>ATS Audit Checklist</h4>
                            <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', color: personalInfo.email ? '#10b981' : '#ef4444' }}><CheckCircle size={14} /> Contact Details Present</div>
                                <div style={{ display: 'flex', gap: '0.5rem', color: skills.length > 5 ? '#10b981' : '#f59e0b' }}><CheckCircle size={14} /> Skills Optimization ({skills.length})</div>
                                <div style={{ display: 'flex', gap: '0.5rem', color: atsMode ? '#10b981' : '#f59e0b' }}><Sparkles size={14} /> {atsMode ? 'ATS Safe Mode Active' : 'Scan Safety: Medium'}</div>
                            </div>
                        </div>
                    </Section>

                    <Section title="Advanced Layout" icon={<Layout size={18} />}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', opacity: 0.5, marginBottom: '0.8rem', textTransform: 'uppercase' }}>Header Variant</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <button onClick={() => setHeaderStyle('standard')} className={`btn-outline btn-sm ${headerStyle === 'standard' ? 'active' : ''}`}>Left Aligned</button>
                                <button onClick={() => setHeaderStyle('centered')} className={`btn-outline btn-sm ${headerStyle === 'centered' ? 'active' : ''}`}>Centered</button>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', opacity: 0.5, marginBottom: '0.8rem', textTransform: 'uppercase' }}>Page Margins</label>
                            <select value={pageMargin} onChange={(e) => setPageMargin(e.target.value)} style={inputStyle}>
                                <option value="5mm">Zero (5mm)</option>
                                <option value="10mm">Tight (10mm)</option>
                                <option value="15mm">Standard (15mm)</option>
                                <option value="25mm">Wide (25mm)</option>
                            </select>
                        </div>
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

                                            <div style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
                                                <div style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Extra Fields (e.g. GitHub Link)</div>
                                                {p.extraFields?.map((f, idx) => (
                                                    <div key={idx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                                        <input placeholder="Label" value={f.label} onChange={(e) => updateExtraField('proj', i, idx, 'label', e.target.value)} style={{ ...inputStyle, padding: '0.4rem' }} />
                                                        <input placeholder="Value" value={f.value} onChange={(e) => updateExtraField('proj', i, idx, 'value', e.target.value)} style={{ ...inputStyle, padding: '0.4rem' }} />
                                                        <button onClick={() => removeExtraField('proj', i, idx)} style={{ color: '#ef4444', background: 'none' }}><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => addExtraField('proj', i)} className="btn-outline btn-sm" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>+ Field</button>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: '600', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                                                <div className="format-toggle">
                                                    <button onClick={() => updateItem('proj', i, 'isBulleted', false)} className={`toggle-btn ${!p.isBulleted ? 'active' : ''}`}>Simple</button>
                                                    <button onClick={() => updateItem('proj', i, 'isBulleted', true)} className={`toggle-btn ${p.isBulleted ? 'active' : ''}`}>Points</button>
                                                </div>
                                            </div>
                                            <InputField value={p.desc} onChange={(e) => updateItem('proj', i, 'desc', e.target.value)} isTextarea placeholder={p.isBulleted ? "Enter each point on a new line..." : "Enter a simple paragraph..."} />
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
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                                <InputField label="Duration" value={exp.duration} onChange={(e) => updateItem('exp', i, 'duration', e.target.value)} />
                                                <InputField label="Location" value={exp.location} onChange={(e) => updateItem('exp', i, 'location', e.target.value)} />
                                            </div>

                                            <div style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
                                                <div style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Extra Details (e.g. Supervisor)</div>
                                                {exp.extraFields?.map((f, idx) => (
                                                    <div key={idx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                                        <input placeholder="Label" value={f.label} onChange={(e) => updateExtraField('exp', i, idx, 'label', e.target.value)} style={{ ...inputStyle, padding: '0.4rem' }} />
                                                        <input placeholder="Value" value={f.value} onChange={(e) => updateExtraField('exp', i, idx, 'value', e.target.value)} style={{ ...inputStyle, padding: '0.4rem' }} />
                                                        <button onClick={() => removeExtraField('exp', i, idx)} style={{ color: '#ef4444', background: 'none' }}><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => addExtraField('exp', i)} className="btn-outline btn-sm" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>+ Field</button>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: '600', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Responsibilities</label>
                                                <div className="format-toggle">
                                                    <button onClick={() => updateItem('exp', i, 'isBulleted', false)} className={`toggle-btn ${!exp.isBulleted ? 'active' : ''}`}>Simple</button>
                                                    <button onClick={() => updateItem('exp', i, 'isBulleted', true)} className={`toggle-btn ${exp.isBulleted ? 'active' : ''}`}>Points</button>
                                                </div>
                                            </div>
                                            <InputField value={exp.desc} onChange={(e) => updateItem('exp', i, 'desc', e.target.value)} isTextarea placeholder={exp.isBulleted ? "Enter each responsibility on a new line..." : "Enter a simple paragraph..."} />
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
                                            <button onClick={() => removeItem('edu', i)} className="btn-delete"><Trash2 size={14} /></button>
                                            <InputField label="Institution" value={edu.school} onChange={(e) => updateItem('edu', i, 'school', e.target.value)} />
                                            <InputField label="Degree/Course" value={edu.degree} onChange={(e) => updateItem('edu', i, 'degree', e.target.value)} />
                                            <InputField label="Year of Completion" value={edu.year} onChange={(e) => updateItem('edu', i, 'year', e.target.value)} />

                                            <div style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Extra Info (e.g. GPA, Honors)</div>
                                                {edu.extraFields?.map((f, idx) => (
                                                    <div key={idx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                                        <input placeholder="Label (GPA)" value={f.label} onChange={(e) => updateExtraField('edu', i, idx, 'label', e.target.value)} style={{ ...inputStyle, padding: '0.4rem' }} />
                                                        <input placeholder="Value (3.9/4.0)" value={f.value} onChange={(e) => updateExtraField('edu', i, idx, 'value', e.target.value)} style={{ ...inputStyle, padding: '0.4rem' }} />
                                                        <button onClick={() => removeExtraField('edu', i, idx)} style={{ color: '#ef4444', background: 'none' }}><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => addExtraField('edu', i)} className="btn-outline btn-sm" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>+ Field</button>
                                            </div>
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: '600', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Content</label>
                                            <div className="format-toggle">
                                                <button onClick={() => updateItem(sec, 0, 'isBulleted', false)} className={`toggle-btn ${!customSections.find(s => s.id === sec)?.isBulleted ? 'active' : ''}`}>Simple</button>
                                                <button onClick={() => updateItem(sec, 0, 'isBulleted', true)} className={`toggle-btn ${customSections.find(s => s.id === sec)?.isBulleted ? 'active' : ''}`}>Points</button>
                                            </div>
                                        </div>
                                        <InputField value={customSections.find(s => s.id === sec)?.content || ''} onChange={(e) => updateItem(sec, 0, 'content', e.target.value)} isTextarea placeholder={customSections.find(s => s.id === sec)?.isBulleted ? "Enter each point on a new line..." : "Enter a simple paragraph..."} />
                                    </div>
                                </Section>
                            )}
                        </div>
                    ))}
                    <button onClick={() => addItem('custom_sec')} className="btn-add-item btn-custom-add">
                        <Plus size={20} /> Add New Section (Certifications, Volunteer, etc.)
                    </button>
                </div>

                <div className="preview-container">
                    <div ref={resumeRef} className={`resume-paper template-${template}`} style={{ fontFamily: atsMode ? "'Inter', sans-serif" : fontFamily, padding: pageMargin }}>

                        {template === 'elite' && (
                            <>
                                <div style={{ borderBottom: `3px solid ${atsMode ? '#1a1a1a' : themeColor}`, paddingBottom: '1rem', marginBottom: '1.2rem', textAlign: headerStyle === 'centered' ? 'center' : 'left' }}>
                                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: '#1a1a1a', letterSpacing: '-0.02em' }}>{personalInfo.fullName}</h1>
                                    <div style={{ color: atsMode ? '#000' : themeColor, fontWeight: '700', fontSize: '1.1rem', marginTop: '2px' }}>{personalInfo.role}</div>
                                    {renderHeaderLinks(atsMode ? '#000' : '#444')}
                                </div>
                                {renderDescription(personalInfo.summary, personalInfo.isSummaryBulleted, { marginBottom: '1.5rem', fontSize: '0.92rem', lineHeight: '1.5', color: '#333' })}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
                                    {sectionOrder.map(type => <div key={type}>{renderSection(type)}</div>)}
                                </div>
                            </>
                        )}

                        {template === 'pro_executive' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', textAlign: headerStyle === 'centered' ? 'center' : 'left' }}>
                                <div style={{ borderBottom: `5px solid ${atsMode ? '#1a1a1a' : themeColor}`, paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                                    <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#1a1a1a', margin: 0, textTransform: 'uppercase' }}>{personalInfo.fullName}</h1>
                                    <div style={{ background: atsMode ? '#1a1a1a' : themeColor, color: 'white', display: 'inline-block', padding: '0.3rem 0.8rem', fontWeight: '700', marginTop: '0.5rem', borderRadius: '4px' }}>{personalInfo.role}</div>
                                    <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>{renderHeaderLinks(atsMode ? '#000' : '#444')}</div>
                                </div>
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '0.8rem', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Professional Profile</h3>
                                    {renderDescription(personalInfo.summary, personalInfo.isSummaryBulleted, { fontSize: '1.1rem', lineHeight: '1.6', color: '#333' })}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
                                    {sectionOrder.map(type => <div key={type}>{renderSection(type, 'elite')}</div>)}
                                </div>
                            </div>
                        )}

                        {template === 'modern_compact' && (
                            <div style={{ display: 'grid', gridTemplateColumns: atsMode ? '1fr' : '1fr 240px', gap: '15mm', margin: atsMode ? '0' : '-5mm', padding: atsMode ? '0' : '5mm', minHeight: '100%', border: atsMode ? 'none' : 'none' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
                                    <div style={{ borderBottom: `3px solid ${atsMode ? '#1a1a1a' : themeColor}`, paddingBottom: '1rem', textAlign: headerStyle === 'centered' ? 'center' : 'left' }}>
                                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>{personalInfo.fullName}</h1>
                                        <div style={{ color: atsMode ? '#000' : themeColor, fontWeight: '700', fontSize: '1.1rem' }}>{personalInfo.role}</div>
                                        <div style={{ marginTop: '0.8rem' }}>{renderHeaderLinks(atsMode ? '#000' : '#444')}</div>
                                    </div>
                                    <div style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>{renderDescription(personalInfo.summary, personalInfo.isSummaryBulleted)}</div>
                                    {sectionOrder.filter(s => ['projects', 'experience'].includes(s)).map(type => <div key={type}>{renderSection(type)}</div>)}
                                    {atsMode && sectionOrder.filter(s => !['projects', 'experience'].includes(s)).map(type => <div key={type}>{renderSection(type)}</div>)}
                                </div>
                                {!atsMode && (
                                    <div style={{ background: `${themeColor}05`, padding: '8mm', borderRadius: '15px', borderLeft: `1px solid ${themeColor}20` }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
                                            {sectionOrder.filter(s => !['projects', 'experience'].includes(s)).map(type => <div key={type}>{renderSection(type)}</div>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {template === 'minimal_bold' && (
                            <div style={{ padding: atsMode ? '0' : '5mm' }}>
                                <div style={{ textAlign: headerStyle === 'centered' ? 'center' : 'left', marginBottom: '3rem' }}>
                                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1a1a1a', margin: 0, letterSpacing: '-0.04em' }}>{personalInfo.fullName}</h1>
                                    <p style={{ fontSize: '1.2rem', color: '#666', fontWeight: '600', margin: '0.5rem 0 1.5rem' }}>{personalInfo.role}</p>
                                    <div style={{ display: 'flex', justifyContent: headerStyle === 'centered' ? 'center' : 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>{renderHeaderLinks(atsMode ? '#000' : '#444')}</div>
                                </div>
                                <div style={{ maxWidth: atsMode ? '100%' : '850px', margin: headerStyle === 'centered' ? '0 auto' : '0' }}>
                                    <div style={{ borderLeft: `4px solid ${atsMode ? '#1a1a1a' : themeColor}`, paddingLeft: '2rem', marginBottom: '3rem' }}>
                                        {renderDescription(personalInfo.summary, personalInfo.isSummaryBulleted, { fontSize: '1.1rem', lineHeight: '1.6', color: '#333', fontStyle: atsMode ? 'normal' : 'italic' })}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
                                        {sectionOrder.map(type => <div key={type}>{renderSection(type, 'elite')}</div>)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Mobile Jump to Preview FAB */}
            <button
                onClick={() => document.querySelector('.preview-container')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary jump-to-preview-mobile"
                style={{
                    position: 'fixed', bottom: '2rem', right: '1.5rem', borderRadius: '50%', width: '56px', height: '56px',
                    display: 'none', alignItems: 'center', justifyContent: 'center', zIndex: 100, boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                    padding: 0
                }}
            >
                <Layout size={24} />
            </button>

            <style>{`
                .builder-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap; }
                .builder-main-title { font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; }
                .template-chips { display: flex; gap: 0.6rem; overflow-x: auto; padding-bottom: 0.5rem; max-width: 100%; }
                .chip { padding: 0.5rem 0.8rem; border-radius: 10px; background: rgba(255,255,255,0.03); color: white; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; font-size: 0.85rem; }
                .chip.active { background: var(--color-secondary); color: black; font-weight: bold; border-color: var(--color-secondary); }
                .builder-actions { display: flex; gap: 0.8rem; align-items: center; }
                .action-btn-group { display: flex; gap: 0.5rem; }
                .btn-sm { padding: 0.5rem 0.8rem; font-size: 0.8rem; }
                
                .resume-builder-grid {
                    display: grid;
                    grid-template-columns: 500px 1fr;
                    gap: 2rem;
                }
                .editor-sidebar {
                    max-height: 85vh;
                    overflow-y: auto;
                    padding-right: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .preview-container {
                    position: sticky;
                    top: 2rem;
                    display: flex;
                    justify-content: center;
                    height: fit-content;
                    overflow: visible;
                }
                .resume-paper {
                    width: 210mm;
                    min-height: 297mm;
                    background: white;
                    color: #1a1a1a;
                    padding: 15mm;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                    transform: scale(0.6);
                    transform-origin: top center;
                    font-family: "Inter", sans-serif;
                }
                .btn-add-item {
                    width: 100%; padding: 0.8rem; border-radius: 10px; border: 2px dashed rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.02); color: white; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; gap: 0.6rem; font-weight: 600; transition: all 0.3s;
                }
                .btn-add-item:hover { background: rgba(255,255,255,0.05); border-color: var(--color-secondary); color: var(--color-secondary); }
                .edit-card { position: relative; padding: 1.2rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; margin-bottom: 1.2rem; }
                .btn-delete { position: absolute; top: 0.8rem; right: 0.8rem; color: #ef4444; background: none; border: none; cursor: pointer; opacity: 0.6; transition: 0.2s; }
                .btn-delete:hover { opacity: 1; transform: scale(1.1); }
                .btn-move { background: rgba(255,255,255,0.05); color: white; border: none; border-radius: 4px; cursor: pointer; padding: 4px; display: flex; align-items: center; transition: 0.2s; }
                .btn-move:hover { background: rgba(255,255,255,0.15); color: var(--color-secondary); }

                .format-toggle { display: flex; background: rgba(255,255,255,0.05); border-radius: 6px; padding: 2px; }
                .toggle-btn { padding: 0.2rem 0.6rem; font-size: 0.7rem; border: none; background: none; color: #666; cursor: pointer; border-radius: 4px; transition: 0.2s; font-weight: 600; }
                .toggle-btn.active { background: var(--color-secondary); color: black; }
                .toggle-btn:not(.active):hover { color: white; background: rgba(255,255,255,0.05); }

                .ats-audit-card { background: rgba(0,0,0,0.2); border-radius: 12px; padding: 1rem; margin-top: 1rem; }
                .btn-outline.active { background: var(--color-secondary); color: black; border-color: var(--color-secondary); }

                .btn-custom-add { 
                    border-style: solid; background: var(--color-secondary); color: black; height: 60px; font-size: 1.1rem; margin-top: 1rem;
                }

                @media (max-width: 1200px) {
                    .resume-paper { transform: scale(0.5); }
                }

                @media (max-width: 1024px) {
                    .builder-header { flex-direction: column; align-items: flex-start; }
                    .builder-actions { width: 100%; justify-content: space-between; }
                    .resume-builder-grid {
                        grid-template-columns: 1fr;
                    }
                    .editor-sidebar {
                        max-height: none;
                        overflow-y: visible;
                    }
                    .preview-container {
                        position: relative;
                        top: 0;
                        overflow-x: auto;
                        padding-bottom: 2rem;
                        justify-content: center;
                    }
                    .resume-paper {
                        transform: scale(0.5);
                        margin: 0 auto;
                        transform-origin: top center;
                    }
                }

                @media (max-width: 768px) {
                    .builder-main-title { font-size: 1.8rem; }
                    .btn-custom-add { height: 50px; font-size: 0.95rem; }
                    .resume-paper {
                        transform: scale(0.45); /* Better width for mobile */
                        margin: 0 auto;
                        transform-origin: top center;
                    }
                    .preview-container {
                        height: 500px;
                        margin-top: 2rem;
                        padding: 1rem 0;
                        overflow: hidden;
                        background: rgba(255,255,255,0.02);
                        border: 1px solid rgba(255,255,255,0.05);
                        border-radius: 16px;
                    }
                    .btn-add-item {
                        padding: 0.6rem !important;
                        font-size: 0.9rem !important;
                    }
                    .preview-label-mobile {
                        display: block;
                        text-align: center;
                        color: var(--color-text-muted);
                        font-size: 0.8rem;
                        margin-bottom: 1rem;
                        font-weight: bold;
                        text-transform: uppercase;
                        letter-spacing: 0.1em;
                    }
                    .jump-to-preview-mobile {
                        display: flex !important;
                    }
                }
            `}</style>
            <div className="preview-label-mobile" style={{ display: 'none' }}>Live Preview</div>
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

function InputField({ label, name, value, onChange, isTextarea = false, placeholder = "" }) {
    const Component = isTextarea ? 'textarea' : 'input';
    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', opacity: 0.5, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
            <Component name={name} value={value} onChange={onChange} placeholder={placeholder} style={{ ...inputStyle, minHeight: isTextarea ? '100px' : 'auto', lineHeight: '1.5' }} />
        </div>
    );
}

const inputStyle = {
    width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', outline: 'none', fontSize: '0.9rem', transition: 'all 0.3s'
};


