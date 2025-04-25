'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { EnvelopeOpen, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/app/hooks/useAuth'

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
            className={`relative group/btn overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 w-full text-white rounded-xl h-11 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-all duration-300 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                } ${className}`}
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

const VerificationPending = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const { resendVerificationEmail } = useAuth()

    const handleResendVerification = async (e) => {
        e.preventDefault()

        if (!email) {
            setError('Please enter your email address')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const result = await resendVerificationEmail(email)

            if (result.success) {
                setSuccess(true)
            } else {
                setError(result.error || 'Failed to resend verification email')
            }
        } catch (error) {
            setError('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
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

                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <EnvelopeOpen className="w-10 h-10 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                        We&apos;ve sent a verification link to your email address.
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Please check your inbox and click the link to verify your account.
                    </p>
                </div>

                <div className="border-t border-b border-neutral-200 dark:border-neutral-800 py-6 mb-6">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                        Didn&apos;t receive the email? Check your spam folder or request a new verification link below.
                    </p>

                    {success ? (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                            <div className="flex items-center">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                                <p className="text-green-600 dark:text-green-400 text-sm">
                                    Verification email sent successfully. Please check your inbox.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleResendVerification} className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setError('')
                                    }}
                                    placeholder="Enter your email address"
                                    className="h-11 w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black px-4 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-blue-400 dark:hover:border-blue-600 dark:placeholder:text-neutral-500"
                                    required
                                />
                                {error && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <ShimmerButton
                                type="submit"
                                isLoading={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Sending...</span>
                                    </div>
                                ) : (
                                    <span>Resend Verification Email</span>
                                )}
                            </ShimmerButton>
                        </form>
                    )}
                </div>

                <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                    Already verified your email?{' '}
                    <Link
                        href="/login"
                        className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 font-medium transition-colors"
                    >
                        Sign in here
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}

export default VerificationPending