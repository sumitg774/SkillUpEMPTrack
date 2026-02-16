import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, Key, Shield, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import './Navbar.css';

export default function Navbar({ onOpenKeyModal }) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Hide navbar on login/signup pages
    if (['/login', '/signup'].includes(location.pathname)) return null;

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className={`navbar ${isMenuOpen ? 'menu-open' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="logo" onClick={closeMenu}>
                    <BookOpen className="logo-icon" />
                    <span className="logo-text">SkillUp</span>
                    <span className="badge-corp">Corp</span>
                </Link>

                <div className={`nav-menu ${isMenuOpen ? 'show' : ''}`}>
                    <div className="nav-links">
                        <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>Certifications</Link>
                        <Link to="/my-certificates" className={`nav-link ${isActive('/my-certificates')}`} onClick={closeMenu}>My Certificates</Link>
                        <Link to="/roadmap" className={`nav-link ${isActive('/roadmap')}`} onClick={closeMenu}>Interview Prep</Link>
                        <Link to="/resume" className={`nav-link ${isActive('/resume')}`} onClick={closeMenu}>Resume/CV</Link>
                        <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard')}`} onClick={closeMenu}>Leaderboard</Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className={`nav-link ${isActive('/admin')}`} style={{ color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }} onClick={closeMenu}>
                                <Shield size={14} /> Admin Panel
                            </Link>
                        )}
                    </div>

                    <div className="nav-actions">
                        {user ? (
                            <>
                                <div className="user-profile">
                                    <div className="avatar">{user.name ? user.name.charAt(0) : 'U'}</div>
                                    <span>{user.name || 'User'}</span>
                                </div>
                                <button onClick={() => { logout(); closeMenu(); }} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }} onClick={closeMenu}>Login</Link>
                        )}
                        <button onClick={() => { onOpenKeyModal(); closeMenu(); }} className="btn-outline-icon" title="Set API Key">
                            <Key size={16} />
                        </button>
                    </div>
                </div>

                <button className="mobile-menu-btn" onClick={toggleMenu}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
}
