import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, Key, Shield } from 'lucide-react';
import { useAuth } from './AuthContext';
import './Navbar.css';

export default function Navbar({ onOpenKeyModal }) {
    const location = useLocation();
    const { user, logout } = useAuth();

    // Hide navbar on login/signup pages
    if (['/login', '/signup'].includes(location.pathname)) return null;

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo">
                    <BookOpen className="logo-icon" />
                    <span className="logo-text">SkillUp</span>
                    <span style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem', background: 'var(--color-secondary)', borderRadius: '4px', marginLeft: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Corp</span>
                </Link>

                <div className="nav-links">
                    <Link to="/" className={`nav-link ${isActive('/')}`}>Certifications</Link>
                    <Link to="/my-certificates" className={`nav-link ${isActive('/my-certificates')}`}>My Certificates</Link>
                    <Link to="/roadmap" className={`nav-link ${isActive('/roadmap')}`}>Interview Prep</Link>
                    <Link to="/resume" className={`nav-link ${isActive('/resume')}`}>Resume/CV</Link>
                    <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard')}`}>Leaderboard</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin" className={`nav-link ${isActive('/admin')}`} style={{ color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
                            <button onClick={logout} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', marginLeft: '1rem' }}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Login</Link>
                    )}
                    <button onClick={onOpenKeyModal} className="btn-outline" style={{ marginLeft: '1rem', padding: '0.5rem', display: 'flex', alignItems: 'center' }} title="Set API Key">
                        <Key size={16} />
                    </button>
                </div>

                <button className="mobile-menu-btn">
                    <Menu size={24} />
                </button>
            </div>
        </nav>
    );
}
