import React, { useState } from 'react';
import { Users, Award, TrendingUp, Search, Filter, Download, Briefcase, ChevronRight } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const { mockDB, globalCertificates } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');

    // Stats calculations
    const totalEmployees = mockDB.length;
    const totalCerts = globalCertificates.length;
    const departments = ['All', ...new Set(mockDB.map(u => u.department || 'Unassigned'))];

    const filteredEmployees = mockDB.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
        return matchesSearch && matchesDept;
    });

    const getCertsForUser = (email) => {
        return globalCertificates.filter(c => c.userEmail === email);
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '2.5rem' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Management Console</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                            Monitor employee progress and certification compliance across SkillUp Corp.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <StatCard icon={<Users color="#3b82f6" />} label="Total Employees" value={totalEmployees} trend="+12% this month" />
                    <StatCard icon={<Award color="#10b981" />} label="Certifications Issued" value={totalCerts} trend="+5 this week" />
                    <StatCard icon={<Briefcase color="#f59e0b" />} label="Active Learning Paths" value="8" trend="Stable" />
                    <StatCard icon={<TrendingUp color="#8b5cf6" />} label="Compliance Rate" value="74%" trend="+2.4%" />
                </div>

                {/* Filters & Table */}
                <div className="glass-card" style={{ padding: '0' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div className="admin-filter-bar" style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
                            <div className="admin-filter-search" style={{ position: 'relative', flex: 1 }}>
                                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                                />
                            </div>
                            <select
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                                style={{ padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                                className="admin-filter-select"
                            >
                                {departments.map(dept => <option key={dept} value={dept} style={{ background: '#111' }}>{dept}</option>)}
                            </select>
                        </div>
                        <button className="btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Download size={16} /> Export CSV
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '1rem 1.5rem' }}>Employee</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>Department</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>Certifications</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>Latest Activity</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((emp, idx) => {
                                    const userCerts = getCertsForUser(emp.email);
                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="table-row-hover">
                                            <td style={{ padding: '1.2rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                        {emp.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600' }}>{emp.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{emp.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem' }}>
                                                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>
                                                    {emp.department || 'N/A'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem' }}>
                                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                    {userCerts.length > 0 ? userCerts.map((c, i) => (
                                                        <div key={i} title={c.certId} style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-secondary)' }}></div>
                                                    )) : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>None</span>}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem', fontSize: '0.9rem' }}>
                                                {userCerts.length > 0 ? userCerts[userCerts.length - 1].date : 'Never'}
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: emp.role === 'admin' ? 'var(--color-secondary)' : '#10b981' }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: emp.role === 'admin' ? 'var(--color-secondary)' : '#10b981' }}></div>
                                                    {emp.role === 'admin' ? 'Manager' : 'Active'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem' }}>
                                                <button style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                                    <ChevronRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
            <style>{`
                @media (max-width: 768px) {
                    h1 { font-size: 1.8rem !important; }
                    p { font-size: 1rem !important; }
                    .admin-filter-bar {
                        min-width: 0 !important;
                        flex-direction: column !important;
                    }
                    .admin-filter-search {
                        width: 100% !important;
                    }
                    .admin-filter-select {
                        width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
}

function StatCard({ icon, label, value, trend }) {
    return (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    {icon}
                </div>
                <div style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: trend.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', color: trend.startsWith('+') ? '#10b981' : 'var(--color-text-muted)' }}>
                    {trend}
                </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{label}</div>
        </div>
    );
}
