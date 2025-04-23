'use client';

import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Check if user is already logged in on page load
    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const res = await fetch('https://validebackend.onrender.com/api/user/check-auth', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.user) {
                        setUser(data.user);
                    } else {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Failed to check authentication status:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    // Register user
    const register = async (username, email, password, phone, role) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('https://validebackend.onrender.com/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, phone, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Auto login after successful registration
            await login(email, password);

            return { success: true };
        } catch (error) {
            setError(error.message);
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    // Login user
    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('https://validebackend.onrender.com/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            setUser(data.user);
            setLoading(false);
            router.push('/');
            return { success: true };
        } catch (error) {
            setError(error.message);
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    // Logout user
    const logout = async () => {
        try {
            const res = await fetch('https://validebackend.onrender.com/api/user/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('Logout failed');
            }

            setUser(null);
            router.push('/');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                register,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;