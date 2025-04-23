'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import { useAuth } from '@/app/hooks/useAuth'
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

    const { login } = useAuth()
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
            const result = await login(formData.email.trim(), formData.password)

            if (!result.success) {
                setErrors(prev => ({
                    ...prev,
                    general: result.error || 'Login failed'
                }))
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                general: error.message || 'An unexpected error occurred'
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-[0_0_15px_rgba(0,0,0,0.2)] bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800"
            >
                <FadeInUp delay={0.1}>
                    <div className="text-center mb-2">
                        <h2 className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-1">
                            Welcome Back
                        </h2>
                        <p className="text-neutral-600 text-sm max-w-sm mx-auto dark:text-neutral-400">
                            Continue your learning journey with Cognify
                        </p>
                    </div>
                </FadeInUp>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <LabelInputContainer delay={0.2}>
                        <Label htmlFor="email" className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                            Email Address
                        </Label>
                        <div className="relative group">
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="yourname@example.com"
                                className="h-11 w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black px-10 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 group-hover:border-blue-400 dark:group-hover:border-blue-600 dark:placeholder:text-neutral-500"
                            />
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <AnimatePresence>
                            {errors.email && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-red-500 text-xs mt-1"
                                >
                                    {errors.email}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </LabelInputContainer>

                    {/* Password Field */}
                    <LabelInputContainer delay={0.3}>
                        <div className="flex justify-between">
                            <Label htmlFor="password" className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                                Password
                            </Label>
                            <Link
                                href="/forgot-password"
                                className="text-xs text-blue-500 hover:text-blue-600 transition-colors font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative group">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
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

                    {/* Remember Me */}
                    <FadeInUp delay={0.4}>
                        <div className="flex items-center">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleRememberMe}
                                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 border-neutral-300 dark:border-neutral-700 rounded"
                                />
                                <label htmlFor="rememberMe" className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    Keep me signed in
                                </label>
                            </div>
                        </div>
                    </FadeInUp>

                    {/* Error Message */}
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
                        delay={0.5}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </ShimmerButton>

                    <FadeInUp delay={0.6}>
                        <div className="relative flex items-center justify-center my-4">
                            <div className="absolute w-full border-t border-neutral-300 dark:border-neutral-700"></div>
                            <div className="relative bg-white dark:bg-black px-4 text-sm text-neutral-500 dark:text-neutral-400">
                                or continue with
                            </div>
                        </div>
                    </FadeInUp>

                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-4">
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative group/btn flex space-x-2 items-center justify-center px-4 h-11 text-neutral-700 dark:text-neutral-300 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all duration-200"
                        >
                            <IconBrandGithub className="h-5 w-5" />
                            <span className="text-sm font-medium">GitHub</span>
                            <BottomGradient />
                        </motion.button>

                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative group/btn flex space-x-2 items-center justify-center px-4 h-11 text-neutral-700 dark:text-neutral-300 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all duration-200"
                        >
                            <IconBrandGoogle className="h-5 w-5" />
                            <span className="text-sm font-medium">Google</span>
                            <BottomGradient />
                        </motion.button>
                    </div>

                    {/* Sign Up Link */}
                    <FadeInUp delay={0.8}>
                        <div className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-4">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/signup"
                                className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                Create one here
                            </Link>
                        </div>
                    </FadeInUp>
                </form>
            </motion.div>
        </div>
    )
}

export default Login