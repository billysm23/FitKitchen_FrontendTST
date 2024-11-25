const SESSION_CONFIG = {
    SESSION_EXPIRY: 24 * 60 * 60 * 1000,
    SESSION_KEY: 'user_session'
};

export const sessionManager = {
    setSession(token, user) {
        const session = {
            token,
            user,
            isActive: true,
            createdAt: new Date().getTime(),
            expiresAt: new Date().getTime() + SESSION_CONFIG.SESSION_EXPIRY,
            lastActivity: new Date().getTime()
        };
        localStorage.setItem(SESSION_CONFIG.SESSION_KEY, JSON.stringify(session));
    },

    getSession() {
        try {
            const sessionStr = localStorage.getItem(SESSION_CONFIG.SESSION_KEY);
            if (!sessionStr) return null;

            const session = JSON.parse(sessionStr);
            const now = new Date().getTime();

            // Cek expired
            if (now > session.expiresAt || !session.isActive) {
                this.clearSession();
                return null;
            }

            // Update lastActivity
            session.lastActivity = now;
            localStorage.setItem(SESSION_CONFIG.SESSION_KEY, JSON.stringify(session));

            return session;
        } catch (error) {
            console.error('Session parse error:', error);
            this.clearSession();
            return null;
        }
    },

    clearSession() {
        localStorage.removeItem(SESSION_CONFIG.SESSION_KEY);
    },

    isSessionValid() {
        return !!this.getSession();
    },

    updateSessionExpiry() {
        const session = this.getSession();
        if (session) {
            session.expiresAt = new Date().getTime() + SESSION_CONFIG.SESSION_EXPIRY;
            session.lastActivity = new Date().getTime();
            localStorage.setItem(SESSION_CONFIG.SESSION_KEY, JSON.stringify(session));
        }
    },

    getSessionInfo() {
        const session = this.getSession();
        if (!session) return null;

        return {
            user: session.user,
            createdAt: new Date(session.createdAt),
            expiresAt: new Date(session.expiry),
            remainingTime: session.expiry - new Date().getTime()
        };
    }
};