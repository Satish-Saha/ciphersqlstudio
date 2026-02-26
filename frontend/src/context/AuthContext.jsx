import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('cipher_token');
        const userData = localStorage.getItem('cipher_user');
        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const loginUser = (token, userData) => {
        localStorage.setItem('cipher_token', token);
        localStorage.setItem('cipher_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('cipher_token');
        localStorage.removeItem('cipher_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, logout, isLoggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
