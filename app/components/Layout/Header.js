'use client'
import Link from 'next/link'
import React, { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Menu, X, ChevronDown, User, BookOpen, Code, Star, Lightbulb } from 'lucide-react'
import useAuth from '../hooks/useAuth'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const { auth } = useAuth()
    const menuRef = useRef(null)

    const navItems = [
        {
            title: 'Explore',
            icon: BookOpen,
            sections: [
                {
                    title: 'Popular Courses',
                    items: [
                        { name: 'React Mastery', description: 'Build modern web apps', href: '/courses/react' },
                        { name: 'Python Pro', description: 'Master Python programming', href: '/courses/python' },
                        { name: 'Data Science', description: 'Analytics & visualization', href: '/courses/data-science' }
                    ]
                },
                {
                    title: 'Learning Paths',
                    items: [
                        { name: 'Web Developer', description: 'Full stack development', href: '/paths/web-dev' },
                        { name: 'AI Engineer', description: 'Machine learning & AI', href: '/paths/ai' },
                        { name: 'Cloud Expert', description: 'Cloud architecture', href: '/paths/cloud' }
                    ]
                }
            ]
        },
        {
            title: 'Resources',
            icon: Code,
            sections: [
                {
                    title: 'Developer Tools',
                    items: [
                        { name: 'Code Playground', description: 'Interactive coding environment', href: '/tools/playground' },
                        { name: 'Documentation', description: 'Guides & references', href: '/docs' },
                        { name: 'API References', description: 'API documentation', href: '/api-docs' }
                    ]
                }
            ]
        },
        {
            title: 'Community',
            icon: Star,
            sections: [
                {
                    title: 'Connect',
                    items: [
                        { name: 'Discussion Forums', description: 'Join the conversation', href: '/community/forums' },
                        { name: 'Study Groups', description: 'Learn together', href: '/community/groups' },
                        { name: 'Events', description: 'Workshops & meetups', href: '/events' }
                    ]
                }
            ]
        },
        {
            title: 'My Account',
            icon: User,
            sections: [
                {
                    title: 'Learning',
                    items: [
                        { name: 'My Courses', description: 'View your enrolled courses', href: '/dashboard/courses' },
                        { name: 'Progress', description: 'Track your learning', href: '/dashboard/progress' },
                        { name: 'Certificates', description: 'View your achievements', href: '/dashboard/certificates' }
                    ]
                }
            ]
        }
    ]

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveSection(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const menuVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 400, damping: 40 }
        }
    }

    return (
        <header
            className={`sticky w-full top-0 z-50 h-16 transition-all duration-300 py-7
                ${isScrolled ? 'bg-neutral-900 backdrop-blur-md shadow-sm' : 'bg-neutral-950'}`}
        >
            <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-full">
                    {/* Logo */}
                    <Link href="/">
                        <motion.div
                            className="flex items-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Lightbulb className={`w-8 h-8 ${isScrolled ? 'text-blue-600' : 'text-white'}`} />
                            <span className={`text-xl font-bold font-display ${isScrolled ? 'text-gray-200' : 'text-white'}`}>
                                Cognify
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8" ref={menuRef}>
                        {/* Main Nav Items */}
                        {navItems.map((item) => (
                            <div key={item.title} className="relative">
                                <button
                                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-full font-display
                                        ${isScrolled ? 'text-gray-200 hover:text-gray-900' : 'text-white/90 hover:text-white'}
                                        ${activeSection === item.title
                                            ? isScrolled ? 'bg-gray-100' : 'bg-white/10'
                                            : isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'}
                                        transition-all duration-200`}
                                    onClick={() => setActiveSection(activeSection === item.title ? null : item.title)}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{item.title}</span>
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform duration-200
                                            ${activeSection === item.title ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {activeSection === item.title && (
                                        <motion.div
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            variants={menuVariants}
                                            className="absolute top-full right-0 mt-2 w-screen max-w-md"
                                        >
                                            <div className="bg-gradient-to-b from-black/5 to-black backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-black">
                                                <div className="grid grid-cols-1 gap-4 p-4">
                                                    {item.sections.map((section) => (
                                                        <div key={section.title}>
                                                            <h3 className="text-sm font-semibold text-gray-400 mb-2">
                                                                {section.title}
                                                            </h3>
                                                            <div className="space-y-1">
                                                                {section.items.map((subItem) => (
                                                                    <Link
                                                                        key={subItem.name}
                                                                        href={subItem.href}
                                                                        onClick={() => setActiveSection(null)}
                                                                    >
                                                                        <motion.div
                                                                            className="block p-3 rounded-lg text-gray-100 hover:bg-gray-50 hover:text-neutral-950"
                                                                            whileHover={{ x: 4 }}
                                                                        >
                                                                            <div className="text-sm font-medium">
                                                                                {subItem.name}
                                                                            </div>
                                                                            <div className="text-xs mt-0.5">
                                                                                {subItem.description}
                                                                            </div>
                                                                        </motion.div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}

                        {/* Search */}
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-2 rounded-full transition-colors duration-200 
                                    ${isScrolled ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' :
                                        'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                <Search className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Sign In Button */}
                        {auth?.user ? (
                            // Logged in user menu
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveSection(activeSection === 'user' ? null : 'user')}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium
                    transition-all duration-200 shadow-sm font-display
                    ${isScrolled ?
                                            'bg-blue-600 hover:bg-blue-700 text-white' :
                                            'bg-white hover:bg-gray-50 text-blue-600'}`}
                                >
                                    <User className="w-4 h-4" />
                                    <span>{auth.user.username}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200
                    ${activeSection === 'user' ? 'rotate-180' : ''}`}
                                    />
                                </motion.button>

                                <AnimatePresence>
                                    {activeSection === 'user' && (
                                        <motion.div
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            variants={menuVariants}
                                            className="absolute top-full right-0 mt-2 w-64"
                                        >
                                            <div className="bg-gradient-to-b from-black/5 to-black backdrop-blur-lg rounded-2xl 
                            shadow-xl overflow-hidden border border-black">
                                                <div className="p-2">
                                                    <Link href="/dashboard"
                                                        className="block px-4 py-2 text-sm text-gray-100 hover:bg-gray-50 
                                        hover:text-neutral-950 rounded-lg"
                                                        onClick={() => setActiveSection(null)}
                                                    >
                                                        Dashboard
                                                    </Link>
                                                    <Link href="/profile"
                                                        className="block px-4 py-2 text-sm text-gray-100 hover:bg-gray-50 
                                        hover:text-neutral-950 rounded-lg"
                                                        onClick={() => setActiveSection(null)}
                                                    >
                                                        Profile Settings
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            // Add logout logic here
                                                            setActiveSection(null)
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-400 
                                        hover:bg-gray-50 hover:text-red-600 rounded-lg"
                                                    >
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            // Sign In Button for non-authenticated users
                            <Link href="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium
                    transition-all duration-200 shadow-sm font-display
                    ${isScrolled ?
                                            'bg-blue-600 hover:bg-blue-700 text-white' :
                                            'bg-white hover:bg-gray-50 text-blue-600'}`}
                                >
                                    <User className="w-4 h-4" />
                                    <span>Sign in</span>
                                </motion.button>
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden p-2 rounded-lg transition-colors duration-200
                            ${isScrolled ? 'text-gray-600' : 'text-white'}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-0 top-16 bg-white shadow-lg md:hidden"
                    >
                        <div className="p-6">
                            <nav className="space-y-6">
                                {navItems.map((item) => (
                                    <div key={item.title} className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <item.icon className="w-5 h-5 text-blue-600" />
                                            <span className="text-sm font-semibold text-gray-900">
                                                {item.title}
                                            </span>
                                        </div>
                                        <div className="ml-7 space-y-3">
                                            {item.sections.map((section) => (
                                                <div key={section.title}>
                                                    {section.items.map((subItem) => (
                                                        <Link
                                                            key={subItem.name}
                                                            href={subItem.href}
                                                            onClick={() => setIsMenuOpen(false)}
                                                        >
                                                            <div className="py-2 text-sm text-gray-600 hover:text-blue-600">
                                                                {subItem.name}
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {/* Conditional auth items */}
                                {auth?.user ? (
                                    <div className="border-t pt-4">
                                        <div className="space-y-3">
                                            <Link href="/dashboard"
                                                className="block py-2 text-sm text-gray-600 hover:text-blue-600"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                            <Link href="/profile"
                                                className="block py-2 text-sm text-gray-600 hover:text-blue-600"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Profile Settings
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    // Add logout logic here
                                                    setIsMenuOpen(false)
                                                }}
                                                className="w-full text-left py-2 text-sm text-red-600 hover:text-red-700"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-t pt-4">
                                        <Link href="/login"
                                            className="block py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </motion.div >
                )}
            </AnimatePresence >
        </header >
    )
}

export default Header