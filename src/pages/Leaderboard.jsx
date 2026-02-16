import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { motion } from 'framer-motion';
import { Trophy, Medal, User, Star } from 'lucide-react';
import { getCertificates } from '../utils/certificateManager';

// Mock data for other users
const mockUsers = [
    { id: 1, name: 'Alice Chen', certs: 5, points: 2500, avatar: '#8b5cf6' },
    { id: 2, name: 'Bob Smith', certs: 4, points: 2000, avatar: '#ec4899' },
    { id: 3, name: 'Charlie Kim', certs: 3, points: 1500, avatar: '#06b6d4' },
    { id: 4, name: 'David Lee', certs: 3, points: 1450, avatar: '#10b981' },
    { id: 5, name: 'Eva Davis', certs: 2, points: 1000, avatar: '#eab308' },
];

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return; // Wait for user to load

        const myCerts = getCertificates(user.email); // Get certs for THIS user
        const myScore = myCerts.length * 500; // 500 points per cert

        const myself = {
            id: 'me',
            name: user.name, // Use real name
            certs: myCerts.length,
            points: myScore,
            avatar: 'var(--color-primary)',
            isMe: true
        };

        const allUsers = [...mockUsers, myself].sort((a, b) => b.points - a.points);
        setLeaderboard(allUsers);
    }, [user]);

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <Trophy size={48} color="#eab308" /> Leaderboard
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Top certified developers this week</p>
            </div>

            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '0' }}>
                {leaderboard.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            display: 'flex', alignItems: 'center', padding: '1.5rem',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: user.isMe ? 'rgba(139, 92, 246, 0.1)' : 'transparent'
                        }}
                    >
                        <div style={{ width: '40px', fontSize: '1.5rem', fontWeight: 'bold', color: index < 3 ? '#eab308' : 'var(--color-text-muted)', textAlign: 'center' }}>
                            {index + 1}
                        </div>

                        <div style={{ margin: '0 1.5rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: user.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                {user.name.charAt(0)}
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: user.isMe ? 'var(--color-primary)' : 'white' }}>
                                {user.name} {user.isMe && '(You)'}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Medal size={14} /> {user.certs} Certifications
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {user.points} <Star size={20} fill="#eab308" />
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>POINTS</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
