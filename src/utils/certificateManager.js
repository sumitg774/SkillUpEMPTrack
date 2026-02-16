
const getStorageKey = (userId) => `user_certificates_${userId}`;

export const getCertificates = (userId) => {
    if (!userId) return [];
    return JSON.parse(localStorage.getItem(getStorageKey(userId)) || '[]');
};

export const saveCertificate = (userId, certData) => {
    if (!userId) return;
    const certs = getCertificates(userId);
    // Prevent duplicates
    if (!certs.some(c => c.id === certData.id)) {
        certs.push({
            ...certData,
            dateEarned: new Date().toISOString()
        });
        localStorage.setItem(getStorageKey(userId), JSON.stringify(certs));
    }
};
