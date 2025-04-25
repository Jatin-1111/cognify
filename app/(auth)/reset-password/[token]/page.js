'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Lock, Loader2, CheckCircle2, ArrowLeft, Info } from 'lucide-react'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { cn } from "@/lib/utils"

// Utility components
const LabelInputContainer = ({
    children,
    className,
    delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: delay,
                ease: [0.22, 1, 0.36, 1]
            }}
            className={cn("flex flex-col space-y-2 w-full", className)}
        >
            {children}
        </motion.div>
    );
};

const BottomGradient = () => {
    return (
        <>
            <span
                className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <span
                className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

// Shimmer effect animation for the button
const ShimmerButton = ({ children, className, isLoading, delay = 0, ...props }) => {
    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: delay,
                ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
                "relative group/btn overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 w-full text-white rounded-xl h-11 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-all duration-300",
                isLoading ? "opacity-70 cursor-not-allowed" : "",
                className
            )}
            disabled={isLoading}
            {...props}
        >
            <div className="relative z-10 flex items-center justify-center">
                {children}
            </div>
            <div className="absolute inset-0 z-0 w-full translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 group-hover/btn:translate-x-[100%] group-hover/btn:opacity-100" />
            <BottomGradient />
        </motion.button>
    );
};

// FadeInUp animation component
const FadeInUp = ({ children, delay = 0, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: delay,
                ease: [0.22, 1, 0.36, 1]
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

const ResetPassword = ({ params }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isValidating, setIsValidating] = useState(true)
    const [isValidToken, setIsValidToken] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
        general: ''
    })

    const router = useRouter()
    const { token } = params

    // Validate token on component mount
    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/validate-reset-token/${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || 'Invalid or expired token')
                }

                setIsValidToken(true)
            } catch (error) {
                console.error('Token validation error:', error)
                setErrors(prev => ({
                    ...prev,
                    general: error.message || 'Invalid or expired token'
                }))
            } finally {
                setIsValidating(false)
            }
        }

        validateToken()
    }, [token])

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
        const { name, value } = e.target
        
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        e.preventDefault()

        const newErrors = {
            password: validatePassword(formData.password),
            confirmPassword: validateConfirmPassword(formData.confirmPassword),
            general: ''
        }

        if (Object.values(newErrors).some(error => error)) {
            setErrors(newErrors)
            return
        }

        setIsLoading(true)
        setErrors({ password: '', confirmPassword: '', general: '' })

        try {
            const response = await fetch('http://localhost:5000/api/user/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password: formData.password
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password')
            }

            setSuccess(true)
        } catch (error) {
            console.error('Password reset error:', error)
            setErrors(prev => ({
                ...prev,
                general: error.message || 'An unexpected error occurred'
            }))
        } finally {
            setIsLoading(false)
        }
    }

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

    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950">
                <div className="flex flex-col items-center justify-center p-8">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">Validating Reset Link</h2>
                    <p className="text-neutral-400 text-center">Please wait while we validate your password reset link...</p>
                </div>
            </div>
        )
    }

    if (!isValidToken && !isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-[0_0_15px_rgba(0,0,0,0.2)] bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800"
                >
                    <div className="text-center py-6">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Info className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Invalid or Expired Link</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            The password reset link is invalid or has expired.
                        </p>
                        <Link
                            href="/forgot-password"
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Request New Link
                        </Link>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-[0_0_15px_rgba(0,0,0,0.2)] bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800"
            >
                <Link href="/login" className="inline-flex items-center text-sm text-neutral-500 hover:text-blue-500 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                </Link>

                {success ? (
                    <div className="text-center py-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </motion.div>

                        <h2 className="text-2xl font-bold mb-2">Password Reset Successful</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Your password has been successfully reset.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                ) : (
                    <>
                        <FadeInUp delay={0.1}>
                            <div className="text-center mb-8">
                                <h2 className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-1">
                                    Reset Your Password
                                </h2>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                                    Create a new password for your account
                                </p>
                            </div>
                        </FadeInUp>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Password Field */}
                            <LabelInputContainer delay={0.2}>
                                <Label htmlFor="password" className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                                    New Password
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Create a strong password"
                                        className="h-11 w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black px-10 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 group-hover:border-blue-400 dark:group-hover:border-blue-600 dark:placeholder:text-neutral-500"
                                    />
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
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
                                                    className={`h-1 w-full rounded-full transition-colors ${index < passwordStrength ? getPasswordStrengthColor() : 'bg-neutral-200 dark:bg-neutral-700'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                                            <Info size={12} />
                                            Password must be at least 8 characters with uppercase, number, and special character
                                        </p>
                                    </div>
                                )}
                                <AnimatePresence>
                                    {errors.password && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-red-500 text-xs mt-1"
                                        >
                                            {errors.password}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </LabelInputContainer>

                            {/* Confirm Password Field */}
                            <LabelInputContainer delay={0.3}>
                                <Label htmlFor="confirmPassword" className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                                    Confirm New Password
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm your password"
                                        className="h-11 w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black px-10 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 group-hover:border-blue-400 dark:group-hover:border-blue-600 dark:placeholder:text-neutral-500"
                                    />
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
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
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-red-500 text-xs mt-1"
                                        >
                                            {errors.confirmPassword}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </LabelInputContainer>

                            {/* General Error Message */}
                            <AnimatePresence>
                                {errors.general && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
                                    >
                                        <p className="text-red-600 dark:text-red-400 text-sm text-center">{errors.general}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <ShimmerButton
                                type="submit"
                                isLoading={isLoading}
                                delay={0.4}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Resetting password...</span>
                                    </div>
                                ) : (
                                    <span>Reset Password</span>
                                )}
                            </ShimmerButton>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    )
}

export default ResetPassword