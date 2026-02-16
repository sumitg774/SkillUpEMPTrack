import React, { useState, useEffect } from 'react';
import { X, Key, Check } from 'lucide-react';

export default function APIKeyModal({ isOpen, onClose }) {
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) setApiKey(storedKey);
    }, [isOpen]);

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <X size={24} />
                </button>

                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Key color="var(--color-primary)" /> Set API Key
                </h2>

                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                    To generate real-time study materials and questions, please enter your Google Gemini API Key.
                </p>

                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', marginBottom: '1.5rem', outline: 'none' }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} className="btn-outline">Cancel</button>
                    <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Check size={18} /> Save Key
                    </button>
                </div>
            </div>
        </div>
    );
}
