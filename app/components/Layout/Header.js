'use client'
import Link from 'next/link'
import React, { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Search, Menu, X, ChevronDown, User, BookOpen, Code, Star, Lightbulb } from 'lucide-react'
import { useAuth } from '@/app/hooks/useAuth'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState(null)
    const [visible, setVisible] = useState(true)
    const { user, logout, isAuthenticated } = useAuth()
    const menuRef = useRef(null)
    const { scrollYProgress } = useScroll()

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

    // Floating navigation logic
    useMotionValueEvent(scrollYProgress, "change", (current) => {
        if (typeof current === "number") {
            let direction = current - scrollYProgress.getPrevious();

            if (scrollYProgress.get() < 0.05) {
                setVisible(true); // Always show at top of page
            } else {
                if (direction < 0) {
                    setVisible(true); // Show when scrolling up
                } else {
                    setVisible(false); // Hide when scrolling down
                }
            }
        }
    });

    // Handle dropdown hover
    const handleMouseEnter = (title) => {
        setActiveSection(title);
    };

    const handleMouseLeave = () => {
        setActiveSection(null);
    };

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
        <AnimatePresence mode="wait">
            <motion.header
                initial={{ opacity: 0, y: -100 }}
                animate={{
                    opacity: visible ? 1 : 0,
                    y: visible ? 0 : -100
                }}
                transition={{ duration: 0.3 }}
                className="fixed w-full top-4 inset-x-0 z-50 mx-auto"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="flex items-center justify-between h-full py-4 px-6 rounded-full backdrop-blur-lg bg-neutral-950/80 border border-neutral-800/50 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                    >
                        {/* Logo */}
                        <Link href="/">
                            <motion.div
                                className="flex items-center space-x-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Lightbulb className="w-6 h-6 text-blue-400" />
                                <span className="text-lg font-bold font-display text-white">
                                    Cognify
                                </span>
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6" ref={menuRef}>
                            {/* Main Nav Items */}
                            {navItems.map((item) => (
                                <div
                                    key={item.title}
                                    className="relative"
                                    onMouseEnter={() => handleMouseEnter(item.title)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div
                                        className={`flex items-center space-x-1.5 px-3 py-2 rounded-full font-display
                                            text-white/90 hover:text-white
                                            ${activeSection === item.title
                                                ? 'bg-white/10'
                                                : 'hover:bg-white/10'}
                                            transition-all duration-200`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{item.title}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform duration-200
                                                ${activeSection === item.title ? 'rotate-180' : ''}`}
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {activeSection === item.title && (
                                            <motion.div
                                                initial="hidden"
                                                animate="visible"
                                                exit="hidden"
                                                variants={menuVariants}
                                                className="absolute top-full right-0 mt-2 w-screen max-w-md"
                                            >
                                                <div className="bg-gradient-to-b from-neutral-900/90 to-neutral-950/95 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-neutral-800/50">
                                                    <div className="grid grid-cols-1 gap-4 p-4">
                                                        {item.sections.map((section) => (
                                                            <div key={section.title}>
                                                                <h3 className="text-sm font-semibold text-blue-400 mb-2">
                                                                    {section.title}
                                                                </h3>
                                                                <div className="space-y-1">
                                                                    {section.items.map((subItem) => (
                                                                        <Link
                                                                            key={subItem.name}
                                                                            href={subItem.href}
                                                                        >
                                                                            <motion.div
                                                                                className="block p-3 rounded-lg text-gray-300 hover:bg-neutral-800 hover:text-white"
                                                                                whileHover={{ x: 4 }}
                                                                            >
                                                                                <div className="text-sm font-medium">
                                                                                    {subItem.name}
                                                                                </div>
                                                                                <div className="text-xs mt-0.5 text-gray-400">
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
                                    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
                                >
                                    <Search className="w-5 h-5" />
                                </motion.button>
                            </div>

                            {/* Sign In Button */}
                            {isAuthenticated ? (
                                // Logged in user menu
                                <div
                                    className="relative"
                                    onMouseEnter={() => handleMouseEnter('user')}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-full font-medium
                                            bg-blue-500 hover:bg-blue-600 text-white
                                            transition-all duration-200 shadow-sm font-display"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>{user.name}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200
                                            ${activeSection === 'user' ? 'rotate-180' : ''}`}
                                        />
                                    </motion.div>

                                    <AnimatePresence>
                                        {activeSection === 'user' && (
                                            <motion.div
                                                initial="hidden"
                                                animate="visible"
                                                exit="hidden"
                                                variants={menuVariants}
                                                className="absolute top-full right-0 mt-2 w-64"
                                            >
                                                <div className="bg-gradient-to-b from-neutral-900/90 to-neutral-950/95 backdrop-blur-xl rounded-2xl 
                                                    shadow-xl overflow-hidden border border-neutral-800/50">
                                                    <div className="p-2">
                                                        <Link href="/dashboard"
                                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-neutral-800 
                                                                hover:text-white rounded-lg"
                                                        >
                                                            Dashboard
                                                        </Link>
                                                        <Link href="/profile"
                                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-neutral-800 
                                                                hover:text-white rounded-lg"
                                                        >
                                                            Profile Settings
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                logout();
                                                            }}
                                                            className="w-full text-left px-4 py-2 text-sm text-red-400 
                                                                hover:bg-neutral-800 hover:text-red-300 rounded-lg"
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
                                        className="relative flex items-center space-x-2 px-4 py-2 rounded-full font-medium
                                            bg-blue-500 hover:bg-blue-600 text-white
                                            transition-all duration-200 shadow-sm font-display"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Sign in</span>
                                        <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-400 to-transparent h-px" />
                                    </motion.button>
                                </Link>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-lg text-white transition-colors duration-200 hover:bg-white/10"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </motion.div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed inset-x-0 top-20 bg-neutral-950/95 backdrop-blur-xl shadow-lg md:hidden border-b border-neutral-800/50 mx-4 rounded-2xl overflow-hidden"
                        >
                            <div className="p-6">
                                <nav className="space-y-6">
                                    {navItems.map((item) => (
                                        <div key={item.title} className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <item.icon className="w-5 h-5 text-blue-400" />
                                                <span className="text-sm font-semibold text-white">
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
                                                                <div className="py-2 text-sm text-gray-400 hover:text-blue-400">
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
                                    {isAuthenticated ? (
                                        <div className="border-t border-neutral-800 pt-4">
                                            <div className="space-y-3">
                                                <Link href="/dashboard"
                                                    className="block py-2 text-sm text-gray-400 hover:text-blue-400"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    Dashboard
                                                </Link>
                                                <Link href="/profile"
                                                    className="block py-2 text-sm text-gray-400 hover:text-blue-400"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    Profile Settings
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setIsMenuOpen(false)
                                                    }}
                                                    className="w-full text-left py-2 text-sm text-red-400 hover:text-red-300"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-t border-neutral-800 pt-4">
                                            <Link href="/login"
                                                className="block py-2 text-sm text-blue-400 hover:text-blue-300 font-medium"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Sign In
                                            </Link>
                                        </div>
                                    )}
                                </nav>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </AnimatePresence>
    )
}

export default Header