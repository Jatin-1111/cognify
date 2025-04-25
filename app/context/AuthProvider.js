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
                const res = await fetch('http://localhost:5000/api/user/check-auth', {
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
            const res = await fetch('http://localhost:5000/api/user/register', {
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

            // Redirect to verification pending page or login page
            router.push('/verification-pending');

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
            const res = await fetch('http://localhost:5000/api/user/login', {
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

    // Request password reset
    const requestPasswordReset = async (email) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:5000/api/user/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to send reset link');
            }

            setLoading(false);
            return { success: true, message: data.message };
        } catch (error) {
            setError(error.message);
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    // Reset password with token
    const resetPassword = async (token, password) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:5000/api/user/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setLoading(false);
            return { success: true, message: data.message };
        } catch (error) {
            setError(error.message);
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    // Validate reset token
    const validateResetToken = async (token) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:5000/api/user/validate-reset-token/${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Invalid or expired token');
            }

            setLoading(false);
            return { success: true, message: data.message };
        } catch (error) {
            setError(error.message);
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    // Resend verification email
    const resendVerificationEmail = async (email) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:5000/api/user/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to resend verification email');
            }

            setLoading(false);
            return { success: true, message: data.message };
        } catch (error) {
            setError(error.message);
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    // Logout user
    const logout = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/user/logout', {
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
                requestPasswordReset,
                resetPassword,
                validateResetToken,
                resendVerificationEmail,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;