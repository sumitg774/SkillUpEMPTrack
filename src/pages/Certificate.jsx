import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, CheckCircle, Download, Share2 } from 'lucide-react';
import { assessmentData } from '../data/assessmentData';
import Confetti from 'react-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveCertificate } from '../utils/certificateManager';

import { useAuth } from '../components/AuthContext';

export default function Certificate() {
    const { certId } = useParams();
    const { user } = useAuth(); // Get User
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const data = assessmentData[certId] || { title: 'Unknown Certification' };
    const certRef = useRef(null);

    const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);

        // Save certificate to local storage for THIS user
        if (assessmentData[certId] && user) {
            saveCertificate(user.email, {
                id: certId,
                title: data.title,
                score: 100 // Mock score
            });
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [certId, data.title]);

    const handleDownload = async () => {
        if (!certRef.current) return;

        try {
            const canvas = await html2canvas(certRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape, A4
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${data.title.replace(/\s+/g, '_')} _Certificate.pdf`);
        } catch (err) {
            console.error("PDF generation failed", err);
            alert("Could not download PDF. Please try again.");
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center', marginBottom: '2rem' }}
            >
                <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', marginBottom: '1rem', color: '#10b981' }}>
                    <CheckCircle size={48} />
                </div>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Assessment Passed!</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>You have successfully earned your certification.</p>
            </motion.div>

            {/* Certificate Frame */}
            <motion.div
                ref={certRef}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                style={{
                    width: '100%', maxWidth: '800px',
                    background: 'white', color: '#1e293b',
                    padding: '4rem', borderRadius: '4px',
                    position: 'relative',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    border: '8px double #cbd5e1',
                    textAlign: 'center'
                }}
            >
                {/* Decorative corner */}
                <div style={{ position: 'absolute', top: '20px', left: '20px', width: '40px', height: '40px', borderTop: '4px solid #0f172a', borderLeft: '4px solid #0f172a' }}></div>
                <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '40px', height: '40px', borderBottom: '4px solid #0f172a', borderRight: '4px solid #0f172a' }}></div>

                <div style={{ marginBottom: '3rem' }}>
                    <Award size={64} color="#0f172a" style={{ opacity: 0.8 }} />
                </div>

                <h2 style={{ fontSize: '3.5rem', fontFamily: 'serif', marginBottom: '1rem', letterSpacing: '-1px' }}>Certificate of Competency</h2>
                <div style={{ width: '100px', height: '4px', background: '#0f172a', margin: '0 auto 3rem' }}></div>

                <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontStyle: 'italic', color: '#64748b' }}>This certifies that</p>

                <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', fontFamily: 'cursive' }}>{user ? user.name : 'Valued User'}</h3>

                <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#64748b' }}>has successfully passed the assessment for</p>

                <h4 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '4rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{data.title}</h4>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', padding: '0 2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ borderBottom: '1px solid #94a3b8', width: '200px', marginBottom: '0.5rem' }}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_sample.svg" alt="signature" style={{ height: '40px', opacity: 0.6 }} />
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>CEO, SkillUp Platforms</div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#0f172a' }}>{date}</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Date Issued</div>
                    </div>
                </div>

                {/* Badge */}
                <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', opacity: 0.1 }}>
                    <Award size={150} />
                </div>
            </motion.div>

            {/* Actions */}
            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                <button onClick={handleDownload} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Download size={18} /> Download PDF
                </button>
                <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Share2 size={18} /> Share to LinkedIn
                </button>
                <Link to="/" className="btn-outline">
                    Browse More Certifications
                </Link>
            </div>

        </div>
    );
}
