import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/user';

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (data: User) => void;
    logout: () => void;
    updateUser: (data: User) => void;
}

const STORAGE_KEY = 'waifuCardUser';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): User | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as User) : null;
    } catch (error) {
        console.warn('Unable to parse stored auth user', error);
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUser(readStoredUser());
        setLoading(false);
    }, []);

    const persistUser = useCallback((data: User | null) => {
        setUser(data);
        if (data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const login = useCallback((data: User) => persistUser(data), [persistUser]);
    const logout = useCallback(() => persistUser(null), [persistUser]);
    const updateUser = useCallback((data: User) => persistUser(data), [persistUser]);

    const value = useMemo<AuthContextValue>(() => ({
        user,
        loading,
        login,
        logout,
        updateUser,
    }), [user, loading, login, logout, updateUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
