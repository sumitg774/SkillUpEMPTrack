import React from 'react';
import { Github, Twitter, Linkedin, Mail, ExternalLink, ShieldCheck, Heart, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={footerStyle}>
            <div className="container" style={contentStyle}>
                <div style={gridStyle}>
                    {/* Brand Section */}
                    <div style={brandSection}>
                        <h2 style={logoStyle}>SkillUp <span className="text-gradient">Elite</span></h2>
                        <p style={descriptionStyle}>
                            Empowering developers with AI-driven career tools and certifications.
                            Build, Learn, and Lead with confidence.
                        </p>
                        <div style={socialLinks}>
                            <a href="#" style={socialIcon}><Twitter size={18} /></a>
                            <a href="#" style={socialIcon}><Github size={18} /></a>
                            <a href="#" style={socialIcon}><Linkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div style={linksSection}>
                        <h4 style={sectionTitle}>Contact Us</h4>
                        <ul style={listStyle}>
                            <li><a href="mailto:support@skillup.com" style={linkItem}><Mail size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> support@skillup.com</a></li>
                            <li><a href="tel:+1234567890" style={linkItem}><Phone size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> +1 (234) 567-890</a></li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div style={linksSection}>
                        <h4 style={sectionTitle}>Explore</h4>
                        <ul style={listStyle}>
                            <li><a href="/" style={linkItem}>Certifications</a></li>
                            <li><a href="/roadmap" style={linkItem}>Roadmaps</a></li>
                            <li><a href="/resume" style={linkItem}>Resume Builder</a></li>
                            <li><a href="/leaderboard" style={linkItem}>Leaderboard</a></li>
                        </ul>
                    </div>
                </div>

                <div style={bottomBar}>
                    <p style={copyright}>
                        © {new Date().getFullYear()} SkillUp Platform. Made with <Heart size={12} color="#ff4d4d" fill="#ff4d4d" /> for developers.
                    </p>
                    <div style={legalLinks}>
                        <a href="#" style={legalItem}>Privacy Policy</a>
                        <a href="#" style={legalItem}>Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const footerStyle = {
    background: '#0a0a0c',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    padding: '4rem 0 2rem 0',
    marginTop: '5rem',
    color: 'white',
    zIndex: 10
};

const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 1fr',
    gap: '3rem',
    marginBottom: '4rem'
};

const brandSection = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
};

const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: '900',
    margin: 0,
    letterSpacing: '-0.02em'
};

const descriptionStyle = {
    fontSize: '0.9rem',
    color: '#888',
    lineHeight: '1.6',
    margin: 0
};

const socialLinks = {
    display: 'flex',
    gap: '1rem'
};

const socialIcon = {
    color: '#666',
    transition: 'color 0.3s',
    textDecoration: 'none'
};

const adSection = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
};

const adLabel = {
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#444',
    letterSpacing: '0.1em'
};

const adPlaceholder = {
    height: '100px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '1rem'
};

const adButton = {
    marginTop: '8px',
    fontSize: '0.7rem',
    background: 'var(--color-secondary)',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
};

const linksSection = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
};

const sectionTitle = {
    fontSize: '0.9rem',
    fontWeight: '800',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'white'
};

const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
};

const linkItem = {
    fontSize: '0.9rem',
    color: '#888',
    textDecoration: 'none',
    transition: 'color 0.2s'
};

const bottomBar = {
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
};

const copyright = {
    fontSize: '0.85rem',
    color: '#555',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
};

const legalLinks = {
    display: 'flex',
    gap: '1.5rem'
};

const legalItem = {
    fontSize: '0.85rem',
    color: '#555',
    textDecoration: 'none'
};
