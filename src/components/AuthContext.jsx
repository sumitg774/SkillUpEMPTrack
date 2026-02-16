import React, { createContext, useState, useContext, useEffect } from 'react';
import Papa from 'papaparse';

const AuthContext = createContext(null);

// MOCK DATA for demonstration until you connect your real sheet
const DEMO_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTqX7d7X9Z8M5X5B_3_2_1/pub?output=csv'; // This is a placeholder
// In the real version, we will fetch the live Google Sheet CSV

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const [mockDB, setMockDB] = useState(() => {
        const savedDB = localStorage.getItem('skillup_users_db');
        return savedDB ? JSON.parse(savedDB) : [
            { email: 'admin@skillup.com', password: 'admin', name: 'Admin User', role: 'admin', company: 'SkillUp Corp', department: 'HR' },
            { email: 'sumit@gmail.com', password: 'qwerty', name: 'Sumit Gupta', role: 'employee', company: 'SkillUp Corp', department: 'Engineering' },
            { email: 'demo@skillup.com', password: '123', name: 'Demo User', role: 'employee', company: 'SkillUp Corp', department: 'Design' }
        ];
    });

    const [globalCertificates, setGlobalCertificates] = useState(() => {
        const saved = localStorage.getItem('skillup_global_certs');
        return saved ? JSON.parse(saved) : [
            { userEmail: 'sumit@gmail.com', certId: 'python-basic', date: '2024-03-15', score: 95 },
            { userEmail: 'demo@skillup.com', certId: 'react-basic', date: '2024-03-10', score: 88 }
        ];
    });

    const [userResumes, setUserResumes] = useState(() => {
        const saved = localStorage.getItem('skillup_user_resumes');
        return saved ? JSON.parse(saved) : {};
    });

    // Save DB whenever it changes
    useEffect(() => {
        localStorage.setItem('skillup_users_db', JSON.stringify(mockDB));
    }, [mockDB]);

    useEffect(() => {
        localStorage.setItem('skillup_global_certs', JSON.stringify(globalCertificates));
    }, [globalCertificates]);

    useEffect(() => {
        localStorage.setItem('skillup_user_resumes', JSON.stringify(userResumes));
    }, [userResumes]);

    useEffect(() => {
        const savedUser = localStorage.getItem('skillup_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const earnCertificate = (certId, score) => {
        if (!user) return;
        const newCert = {
            userEmail: user.email,
            userName: user.name,
            department: user.department,
            certId,
            score,
            date: new Date().toISOString().split('T')[0]
        };
        setGlobalCertificates(prev => [...prev, newCert]);

        // Also update local user certs for convenience
        const localCerts = JSON.parse(localStorage.getItem('user_certificates') || '[]');
        if (!localCerts.includes(certId)) {
            localStorage.setItem('user_certificates', JSON.stringify([...localCerts, certId]));
        }
    };

    const saveResume = (resumeData) => {
        if (!user) return;
        setUserResumes(prev => ({
            ...prev,
            [user.email]: resumeData
        }));
    };

    const getResume = () => {
        if (!user) return null;
        const defaultData = {
            personalInfo: { fullName: '', email: '', phone: '', location: '', summary: '', role: '', philosophy: '', linkedin: '', github: '', portfolio: '' },
            experience: [],
            education: [],
            skills: [],
            achievements: [],
            projects: [],
            languages: [],
            dayLife: []
        };
        return { ...defaultData, ...userResumes[user.email] };
    };

    const login = async (email, password) => {
        setLoading(true);
        return new Promise((resolve, reject) => {
            // SIMULATION: In a real app, we would fetch(YOUR_GOOGLE_SHEET_CSV_URL)
            // For now, I will simulate it nicely.

            setTimeout(() => {
                const validUser = mockDB.find(u => u.email === email && u.password === password);

                if (validUser) {
                    setUser(validUser);
                    localStorage.setItem('skillup_user', JSON.stringify(validUser));
                    resolve(validUser);
                } else {
                    reject(new Error('Invalid credentials. Please contact your administrator.'));
                }
                setLoading(false);
            }, 1000);
        });
    };

    const register = (newUser) => {
        // In a real app with Excel, this would POST to the sheet
        // Here we just update our local mock DB so they can login
        setMockDB(prev => [...prev, newUser]);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('skillup_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading, mockDB, globalCertificates, earnCertificate, saveResume, getResume }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
