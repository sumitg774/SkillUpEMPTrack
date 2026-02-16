import React, { useState } from 'react';
import { User, Mail, Lock, CheckCircle, Database, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        company: 'SkillUp Corp',
        department: ''
    });
    const [step, setStep] = useState(1); // 1: Form, 2: Simulating "Excel Write", 3: Success
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth(); // We'll use login to auto-login after signup
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate sending data to Excel/Database
        setTimeout(() => {
            setStep(2);

            // Simulate processing time
            setTimeout(async () => {
                setStep(3);
                setLoading(false);

                // Add user to our mock DB
                register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    company: formData.company,
                    department: formData.department,
                    role: 'employee'
                });

                // Auto-login logic (simulated)
                // Ideally your AuthContext handles registration too, but for this demo 
                // we will just assume success and redirect to login or dashboard
                setTimeout(() => {
                    navigate('/login');
                }, 2000);

            }, 2000);
        }, 1500);
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>

                {step === 1 && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h1>
                            <p style={{ color: 'var(--color-text-muted)' }}>Your details will be verified against our employee database.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@company.com"
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Company</label>
                                <input
                                    type="text"
                                    name="company"
                                    required
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Company Name"
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                />
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Department</label>
                                <select
                                    name="department"
                                    required
                                    value={formData.department}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                >
                                    <option value="" style={{ background: '#111' }}>Select Department</option>
                                    <option value="Engineering" style={{ background: '#111' }}>Engineering</option>
                                    <option value="HR" style={{ background: '#111' }}>HR</option>
                                    <option value="Marketing" style={{ background: '#111' }}>Marketing</option>
                                    <option value="Sales" style={{ background: '#111' }}>Sales</option>
                                    <option value="Design" style={{ background: '#111' }}>Design</option>
                                </select>
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                {loading ? 'Processing...' : 'Register'}
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Login here</Link>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <Database size={64} className="text-secondary" style={{ marginBottom: '1.5rem', color: 'var(--color-secondary)' }} />
                        <h2 style={{ marginBottom: '1rem' }}>Updating Database...</h2>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: '60%', height: '100%', background: 'var(--color-secondary)', animation: 'progress 2s infinite' }}></div>
                        </div>
                        <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Securely writing user record to central Excel sheet.</p>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <CheckCircle size={64} color="var(--color-success)" style={{ marginBottom: '1.5rem' }} />
                        <h2 style={{ marginBottom: '1rem' }}>Registration Successful</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>Your account has been created and verified.</p>
                        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Redirecting to login...</div>
                    </div>
                )}

            </div>
        </div>
    );
}
