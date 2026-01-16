import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage on mount
        const storedUserId = localStorage.getItem('user_id');
        const storedEmail = localStorage.getItem('user_email');

        if (storedUserId && storedEmail) {
            setUser({
                id: parseInt(storedUserId),
                email: storedEmail
            });
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user_id', userData.id.toString());
        localStorage.setItem('user_email', userData.email);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
