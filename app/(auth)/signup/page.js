'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import useAuth from '@/app/components/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Loader2, Info, Phone } from 'lucide-react'

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })

    const { setAuth } = useAuth() // Add this
    const router = useRouter() // Add this

    const validateUsername = (username) => {
        if (!username) return 'Username is required'
        if (username.length < 3) return 'Username must be at least 3 characters long'
        if (username.length > 30) return 'Username cannot exceed 30 characters'
        return ''
    }

    const validatePhone = (phone) => {
        if (!phone) return 'Phone number is required'
        if (!/^[\d\s+-]+$/.test(phone)) return 'Please provide a valid phone number'
        return ''
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email) return 'Email is required'
        if (!emailRegex.test(email)) return 'Please enter a valid email'
        return ''
    }

    const checkPasswordStrength = (password) => {
        let strength = 0
        if (password.length >= 8) strength += 1
        if (/[A-Z]/.test(password)) strength += 1
        if (/[0-9]/.test(password)) strength += 1
        if (/[^A-Za-z0-9]/.test(password)) strength += 1
        return strength
    }

    const validatePassword = (password) => {
        if (!password) return 'Password is required'
        if (password.length < 8) return 'Password must be at least 8 characters'
        if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
        if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
        if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character'
        return ''
    }

    const validateConfirmPassword = (confirmPassword) => {
        if (!confirmPassword) return 'Please confirm your password'
        if (confirmPassword !== formData.password) return 'Passwords do not match'
        return ''
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        const newValue = type === 'checkbox' ? checked : value

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }))

        if (name in errors) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }

        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            username: validateUsername(formData.username),
            email: validateEmail(formData.email),
            phone: validatePhone(formData.phone),
            password: validatePassword(formData.password),
            confirmPassword: validateConfirmPassword(formData.confirmPassword),
        };

        if (Object.values(newErrors).some(error => error)) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/user/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    password: formData.password,
                }),
            });

            const responseData = await response.json();

            if (!response.ok || !responseData.success) {
                throw new Error(responseData.message || "Registration failed");
            }

            // Update auth context with user data
            setAuth({
                user: responseData.data,
                accessToken: responseData.token
            });

            // Redirect to dashboard or home
            router.push("/");
        }
        catch (error) {
            setErrors(prev => ({
                ...prev,
                general: error.message || 'An error occurred during registration'
            }));
        } finally {
            setIsLoading(false);
        }
    };
    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0: return 'bg-red-500'
            case 1: return 'bg-orange-500'
            case 2: return 'bg-yellow-500'
            case 3: return 'bg-blue-500'
            case 4: return 'bg-green-500'
            default: return 'bg-neutral-700'
        }
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md px-4 py-8"
            >
                <div className="relative bg-neutral-900/50 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-neutral-800">
                    <div className="text-center mb-8">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-3xl font-display font-bold text-white mb-2"
                        >
                            Create Account
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-neutral-400"
                        >
                            Join us and start your learning journey
                        </motion.p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 rounded-lg border border-neutral-700 
                                        text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                        outline-none transition-all"
                                    placeholder="Enter your email"
                                />
                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                            </div>
                            <AnimatePresence>
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-500 text-sm mt-1"
                                    >
                                        {errors.email}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 rounded-lg border border-neutral-700 
                text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                outline-none transition-all"
                                    placeholder="Choose a username"
                                />
                                <User className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                            </div>
                            <AnimatePresence>
                                {errors.username && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-500 text-sm mt-1"
                                    >
                                        {errors.username}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 rounded-lg border border-neutral-700 
                text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                outline-none transition-all"
                                    placeholder="Enter your phone number"
                                />
                                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                            </div>
                            <AnimatePresence>
                                {errors.phone && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-500 text-sm mt-1"
                                    >
                                        {errors.phone}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 bg-neutral-800/50 rounded-lg border border-neutral-700 
                                        text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                        outline-none transition-all"
                                    placeholder="Create a password"
                                />
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-400 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[...Array(4)].map((_, index) => (
                                            <div
                                                key={index}
                                                className={`h-1 w-full rounded-full transition-colors ${index < passwordStrength ? getPasswordStrengthColor() : 'bg-neutral-700'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-neutral-500 flex items-center gap-1">
                                        <Info size={12} />
                                        Password must be at least 8 characters with uppercase, number, and special character
                                    </p>
                                </div>
                            )}
                            <AnimatePresence>
                                {errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-500 text-sm mt-1"
                                    >
                                        {errors.password}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 bg-neutral-800/50 rounded-lg border border-neutral-700 
                                        text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                        outline-none transition-all"
                                    placeholder="Confirm your password"
                                />
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-400 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <AnimatePresence>
                                {errors.confirmPassword && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-500 text-sm mt-1"
                                    >
                                        {errors.confirmPassword}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg 
                                transition-colors duration-300 flex items-center justify-center space-x-2 
                                disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <span>Create Account</span>
                            )}
                        </motion.button>

                        {/* Sign In Link */}
                        <div className="text-center text-sm text-neutral-400 mt-6">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                Sign in here
                            </Link>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUp;