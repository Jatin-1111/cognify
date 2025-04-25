'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Loader2, Info, Phone, BookOpen, GraduationCap } from 'lucide-react'
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import useAuth from '@/app/hooks/useAuth'
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
                ease: [0.22, 1, 0.36, 1]  // Cubic bezier for smooth entrance
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        role: 'student', // Default role is student
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        phone: '',
        role: '',
        password: '',
        confirmPassword: '',
        general: ''
    })

    const { register } = useAuth()
    const router = useRouter()

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

    const validateRole = (role) => {
        if (!role) return 'Please select a role'
        if (!['student', 'teacher'].includes(role)) return 'Invalid role selected'
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

    const handleRoleChange = (role) => {
        setFormData(prev => ({
            ...prev,
            role
        }));

        if ('role' in errors) {
            setErrors(prev => ({
                ...prev,
                role: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            username: validateUsername(formData.username),
            email: validateEmail(formData.email),
            phone: validatePhone(formData.phone),
            role: validateRole(formData.role),
            password: validatePassword(formData.password),
            confirmPassword: validateConfirmPassword(formData.confirmPassword),
            general: ''
        };

        if (Object.values(newErrors).some(error => error)) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            // Use the register function from your auth context
            const { success, error } = await register(
                formData.username.trim(),
                formData.email.trim(),
                formData.password,
                formData.phone.trim(),
                formData.role
            );

            if (!success) {
                throw new Error(error || "Registration failed");
            }
        }
        catch (error) {
            let errorMessage = error.message || 'An error occurred during registration';

            if (errorMessage.includes('Email already exists')) {
                errorMessage = 'This email is already registered. Please use a different email or try logging in.';
            }

            setErrors(prev => ({
                ...prev,
                general: errorMessage
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950 py-32">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-[0_0_15px_rgba(0,0,0,0.2)] bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800"
            >
                <FadeInUp delay={0.1}>
                    <div className="text-center mb-6">
                        <h2 className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-1">
                            Create Account
                        </h2>
                        <p className="text-neutral-600 text-sm max-w-sm mx-auto dark:text-neutral-400">
                            Join us and start your learning journey
                        </p>
                    </div>
                </FadeInUp>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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
                                placeholder="your@email.com"
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

                    {/* Username Field */}
                    <LabelInputContainer delay={0.3}>
                        <Label htmlFor="username" className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                            Username
                        </Label>
                        <div className="relative group">
                            <Input
                                id="username"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Choose a username"
                                className="h-11 w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black px-10 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 group-hover:border-blue-400 dark:group-hover:border-blue-600 dark:placeholder:text-neutral-500"
                            />
                            <User className="absolute left-3 top-3 h-5 w-5 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <AnimatePresence>
                            {errors.username && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-red-500 text-xs mt-1"
                                >
                                    {errors.username}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </LabelInputContainer>

                    {/* Phone Field */}
                    <LabelInputContainer delay={0.4}>
                        <Label htmlFor="phone" className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                            Phone Number
                        </Label>
                        <div className="relative group">
                            <Input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter your phone number"
                                className="h-11 w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black px-10 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 group-hover:border-blue-400 dark:group-hover:border-blue-600 dark:placeholder:text-neutral-500"
                            />
                            <Phone className="absolute left-3 top-3 h-5 w-5 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <AnimatePresence>
                            {errors.phone && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-red-500 text-xs mt-1"
                                >
                                    {errors.phone}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </LabelInputContainer>

                    {/* Role Selection Field */}
                    <LabelInputContainer delay={0.45}>
                        <Label className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                            I want to
                        </Label>
                        <div className="grid grid-cols-2 gap-4 mt-1">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleRoleChange('student')}
                                className={`relative cursor-pointer rounded-xl border ${formData.role === 'student'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black hover:bg-neutral-50 dark:hover:bg-neutral-900'
                                    } p-4 transition-all`}
                            >
                                <div className="flex flex-col items-center justify-center text-center">
                                    <GraduationCap className={`h-8 w-8 mb-2 ${formData.role === 'student'
                                        ? 'text-blue-500'
                                        : 'text-neutral-500 dark:text-neutral-400'
                                        }`} />
                                    <p className={`font-medium ${formData.role === 'student'
                                        ? 'text-blue-700 dark:text-blue-400'
                                        : 'text-neutral-700 dark:text-neutral-300'
                                        }`}>
                                        Study Courses
                                    </p>
                                    <p className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">
                                        Join as a student
                                    </p>
                                </div>
                                {formData.role === 'student' && (
                                    <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-blue-500"></div>
                                )}
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleRoleChange('teacher')}
                                className={`relative cursor-pointer rounded-xl border ${formData.role === 'teacher'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black hover:bg-neutral-50 dark:hover:bg-neutral-900'
                                    } p-4 transition-all`}
                            >
                                <div className="flex flex-col items-center justify-center text-center">
                                    <BookOpen className={`h-8 w-8 mb-2 ${formData.role === 'teacher'
                                        ? 'text-blue-500'
                                        : 'text-neutral-500 dark:text-neutral-400'
                                        }`} />
                                    <p className={`font-medium ${formData.role === 'teacher'
                                        ? 'text-blue-700 dark:text-blue-400'
                                        : 'text-neutral-700 dark:text-neutral-300'
                                        }`}>
                                        Create Courses
                                    </p>
                                    <p className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">
                                        Join as a teacher
                                    </p>
                                </div>
                                {formData.role === 'teacher' && (
                                    <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-blue-500"></div>
                                )}
                            </motion.div>
                        </div>
                        <AnimatePresence>
                            {errors.role && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-red-500 text-xs mt-1"
                                >
                                    {errors.role}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </LabelInputContainer>

                    {/* Password Field */}
                    <LabelInputContainer delay={0.5}>
                        <Label htmlFor="password" className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                            Password
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
                    <LabelInputContainer delay={0.6}>
                        <Label htmlFor="confirmPassword" className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                            Confirm Password
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
                        delay={0.7}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Creating account...</span>
                            </div>
                        ) : (
                            <span>Create Account</span>
                        )}
                    </ShimmerButton>

                    <FadeInUp delay={0.8}>
                        <div className="relative flex items-center justify-center my-4">
                            <div className="absolute w-full border-t border-neutral-300 dark:border-neutral-700"></div>
                            <div className="relative bg-white dark:bg-black px-4 text-sm text-neutral-500 dark:text-neutral-400">
                                or sign up with
                            </div>
                        </div>
                    </FadeInUp>

                    {/* Social Signup Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <FadeInUp delay={0.9}>
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative group/btn flex space-x-2 items-center justify-center px-4 h-11 text-neutral-700 dark:text-neutral-300 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all duration-200 w-full"
                            >
                                <IconBrandGithub className="h-5 w-5" />
                                <span className="text-sm font-medium">GitHub</span>
                                <BottomGradient />
                            </motion.button>
                        </FadeInUp>

                        <FadeInUp delay={1.0}>
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative group/btn flex space-x-2 items-center justify-center px-4 h-11 text-neutral-700 dark:text-neutral-300 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all duration-200 w-full"
                            >
                                <IconBrandGoogle className="h-5 w-5" />
                                <span className="text-sm font-medium">Google</span>
                                <BottomGradient />
                            </motion.button>
                        </FadeInUp>
                    </div>

                    {/* Sign In Link */}
                    <FadeInUp delay={1.1}>
                        <div className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-6">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                Sign in here
                            </Link>
                        </div>
                    </FadeInUp>
                </form>
            </motion.div>
        </div>
    );
};

export default SignUp;