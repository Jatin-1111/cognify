'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Loader2, Github } from 'lucide-react'
import Link from 'next/link'
import useAuth from '@/app/components/hooks/useAuth'
import { useRouter } from 'next/navigation'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    })
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: ''
    })

    const { setAuth } = useAuth()
    const router = useRouter()

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email) return 'Email is required'
        if (!emailRegex.test(email)) return 'Please enter a valid email'
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
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newErrors = {
            email: validateEmail(formData.email),
            password: !formData.password ? 'Password is required' : '',
            general: ''
        }

        if (Object.values(newErrors).some(error => error)) {
            setErrors(newErrors)
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('http://localhost:5000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: formData.email.trim(),
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Login failed')
            }

            // Update auth context with user data
            setAuth({
                user: data.data,
                accessToken: data.token
            })

            // Redirect to home page or dashboard
            router.push('/')

        } catch (error) {
            setErrors(prev => ({
                ...prev,
                general: error.message || 'Invalid email or password'
            }))
        } finally {
            setIsLoading(false)
        }
    }

    const handleRememberMe = (e) => {
        const { checked } = e.target
        setFormData(prev => ({
            ...prev,
            rememberMe: checked
        }))

        // Store the preference
        if (checked) {
            localStorage.setItem('rememberEmail', formData.email)
        } else {
            localStorage.removeItem('rememberEmail')
        }
    }

    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberEmail')
        if (rememberedEmail) {
            setFormData(prev => ({
                ...prev,
                email: rememberedEmail,
                rememberMe: true
            }))
        }
    }, [])

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md px-4 py-8"
            >
                <div className="relative bg-neutral-900/50 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-neutral-800">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-3xl font-display font-bold text-white mb-2"
                        >
                            Welcome Back
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-neutral-400"
                        >
                            Continue your learning journey
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

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-neutral-300">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 bg-neutral-800/50 rounded-lg border border-neutral-700 
                                        text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                        outline-none transition-all"
                                    placeholder="Enter your password"
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

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleRememberMe}
                                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-neutral-700 rounded bg-neutral-800"
                            />
                            <label className="ml-2 text-sm text-neutral-400">
                                Keep me signed in
                            </label>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {errors.general && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                                >
                                    <p className="text-red-500 text-sm text-center">{errors.general}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
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
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </motion.button>

                        {/* GitHub Sign In */}
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-4 rounded-lg 
                                transition-colors duration-300 flex items-center justify-center space-x-2 mt-4"
                        >
                            <Github className="h-5 w-5" />
                            <span>Sign in with GitHub</span>
                        </motion.button>

                        {/* Sign Up Link */}
                        <div className="text-center text-sm text-neutral-400 mt-6">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/signup"
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                Create one here
                            </Link>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default Login