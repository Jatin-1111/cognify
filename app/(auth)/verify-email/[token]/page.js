'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'

const EmailVerification = ({ params }) => {
    const [isVerifying, setIsVerifying] = useState(true)
    const [verificationStatus, setVerificationStatus] = useState({
        success: false,
        message: '',
    })
    const router = useRouter()
    const { token } = params

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/verify-email/${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || 'Email verification failed')
                }

                // Set verification success
                setVerificationStatus({
                    success: true,
                    message: data.message || 'Your email has been successfully verified!'
                })

                // Auto-redirect to login after successful verification (3 seconds delay)
                setTimeout(() => {
                    router.push('/login')
                }, 3000)
            } catch (error) {
                console.error('Email verification error:', error)
                setVerificationStatus({
                    success: false,
                    message: error.message || 'Email verification failed. Please try again.'
                })
            } finally {
                setIsVerifying(false)
            }
        }

        verifyEmail()
    }, [token, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-[0_0_15px_rgba(0,0,0,0.2)] bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800"
            >
                {isVerifying ? (
                    <div className="text-center py-10">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-2">Verifying Your Email</h2>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Please wait while we verify your email address...
                        </p>
                    </div>
                ) : verificationStatus.success ? (
                    <div className="text-center py-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </motion.div>

                        <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            {verificationStatus.message}
                        </p>
                        <p className="text-sm text-neutral-500 mb-6">
                            You will be redirected to the login page in a few seconds...
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Continue to Login
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <XCircle className="w-10 h-10 text-red-500" />
                        </motion.div>

                        <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            {verificationStatus.message}
                        </p>
                        <div className="space-y-3">
                            <Link
                                href="/login"
                                className="inline-block w-full px-6 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                            >
                                Back to Login
                            </Link>
                            <Link
                                href="/signup"
                                className="inline-block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create New Account
                            </Link>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default EmailVerification