'use client'
import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Star, Clock, ArrowRight, TrendingUp, BookOpen, Users, ShoppingBag } from 'lucide-react'
import { Cover } from '../ui/cover'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const FeaturedCoursesSection = () => {
    // Sample featured courses data
    const featuredCourses = useMemo(() => [
        {
            id: 1,
            title: "Advanced React & Redux: Build Enterprise Applications",
            instructor: "Sarah Johnson",
            instructorRole: "Senior Frontend Engineer",
            rating: 4.9,
            reviews: 2547,
            students: 45892,
            price: 89.99,
            originalPrice: 129.99,
            duration: "24 hours",
            level: "Intermediate",
            category: "Web Development",
            trending: true,
            tags: ["React", "Redux", "JavaScript"],
            lastUpdated: "August 2024"
        },
        {
            id: 2,
            title: "Machine Learning & Deep Neural Networks: The Complete Guide",
            instructor: "Michael Chen",
            instructorRole: "AI Research Scientist",
            rating: 4.8,
            reviews: 1856,
            students: 32451,
            price: 79.99,
            originalPrice: 99.99,
            duration: "18 hours",
            level: "Beginner",
            category: "AI & Machine Learning",
            trending: true,
            tags: ["Python", "TensorFlow", "Neural Networks"],
            lastUpdated: "September 2024"
        },
        {
            id: 3,
            title: "AWS Solutions Architect Professional Certification",
            instructor: "David Wilson",
            instructorRole: "Cloud Architect",
            rating: 4.9,
            reviews: 3421,
            students: 28743,
            price: 94.99,
            originalPrice: 149.99,
            duration: "32 hours",
            level: "Advanced",
            category: "Cloud Computing",
            trending: false,
            tags: ["AWS", "Cloud", "DevOps"],
            lastUpdated: "July 2024"
        },
        {
            id: 4,
            title: "iOS 18 App Development: SwiftUI Masterclass",
            instructor: "Emma Davis",
            instructorRole: "iOS Developer",
            rating: 4.7,
            reviews: 1248,
            students: 18965,
            price: 84.99,
            originalPrice: 119.99,
            duration: "20 hours",
            level: "Intermediate",
            category: "Mobile Development",
            trending: false,
            tags: ["Swift", "iOS", "SwiftUI"],
            lastUpdated: "October 2024"
        }
    ], [])

    const [activeCategory, setActiveCategory] = useState('All')

    const categories = useMemo(() => [
        'All', 'Web Development', 'AI & Machine Learning', 'Cloud Computing', 'Mobile Development'
    ], [])

    // Filter courses based on active category
    const filteredCourses = useMemo(() => {
        if (activeCategory === 'All') return featuredCourses
        return featuredCourses.filter(course => course.category === activeCategory)
    }, [featuredCourses, activeCategory])

    // GSAP Animation References
    const sectionRef = useRef(null)
    const headerRef = useRef(null)
    const cardsRef = useRef(null)
    const categoryRef = useRef(null)
    const ctaRef = useRef(null)

    // Create an array to store individual card refs
    const cardElements = useRef([])

    // Set up card ref callback function
    const setCardRef = (el, index) => {
        cardElements.current[index] = el
    }

    // Initialize GSAP animations
    useEffect(() => {
        // Safety check - make sure we're in browser environment
        if (typeof window === 'undefined' || !sectionRef.current) return

        // Make sure everything is visible first (fallback)
        gsap.set([headerRef.current, categoryRef.current, cardsRef.current, ctaRef.current], {
            opacity: 1,
            clearProps: "all"
        })

        try {
            // Header animation
            gsap.fromTo(headerRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
            )

            // Category tabs animation
            if (categoryRef.current && categoryRef.current.children) {
                gsap.fromTo(categoryRef.current.children,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.1,
                        duration: 0.6,
                        ease: "power2.out"
                    }
                )
            }

            // Cards staggered animation
            if (cardElements.current.length > 0) {
                gsap.fromTo(cardElements.current,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.15,
                        duration: 0.8,
                        ease: "power3.out",
                        delay: 0.2
                    }
                )
            }

            // CTA button animation
            gsap.fromTo(ctaRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "back.out(1.5)",
                    delay: 0.5
                }
            )

            // Card hover animations setup
            cardElements.current.forEach((card) => {
                if (!card) return

                const cardImage = card.querySelector('.card-image')
                const cardContent = card.querySelector('.card-content')
                const cardCta = card.querySelector('.card-cta')
                const cardBadge = card.querySelector('.card-badge')

                // Create hover animation
                card.addEventListener('mouseenter', () => {
                    gsap.to(cardImage, { scale: 1.08, duration: 0.5, ease: "power2.out" })
                    gsap.to(cardContent, { y: -5, duration: 0.3, ease: "power2.out" })
                    gsap.to(cardCta, {
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power2.out"
                    })
                    if (cardBadge) {
                        gsap.to(cardBadge, { scale: 1.1, duration: 0.3, ease: "power2.out" })
                    }
                })

                card.addEventListener('mouseleave', () => {
                    gsap.to(cardImage, { scale: 1, duration: 0.5, ease: "power2.out" })
                    gsap.to(cardContent, { y: 0, duration: 0.3, ease: "power2.out" })
                    gsap.to(cardCta, {
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: '#60a5fa',
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    })
                    if (cardBadge) {
                        gsap.to(cardBadge, { scale: 1, duration: 0.3, ease: "power2.out" })
                    }
                })
            })
        } catch (error) {
            console.error("GSAP animation error:", error)
            // Ensure everything is visible if animations fail
            gsap.set([headerRef.current, categoryRef.current, cardsRef.current, ctaRef.current, ...cardElements.current], {
                opacity: 1,
                y: 0,
                clearProps: "all"
            })
        }

        // Cleanup GSAP animations on component unmount
        return () => {
            if (ScrollTrigger && typeof ScrollTrigger.getAll === 'function') {
                ScrollTrigger.getAll().forEach(trigger => trigger.kill())
            }
        }
    }, [filteredCourses])

    return (
        <div ref={sectionRef} className="w-full bg-neutral-950 py-24 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm">Featured Courses</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Discover Our Top-Rated Courses
                    </h2>

                    <p className="text-neutral-400 text-lg mb-10">
                        Expand your skills with our most popular and highly-rated courses.
                        Start your journey to mastery today.
                    </p>

                    {/* Category Tabs */}
                    <div ref={categoryRef} className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                  ${activeCategory === category
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-500/20'
                                        : 'border border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Courses Grid */}
                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredCourses.map((course, index) => (
                        <div
                            key={course.id}
                            ref={(el) => setCardRef(el, index)}
                            className="bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 
                         hover:shadow-xl transition-all duration-500 group"
                            style={{
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                                height: "100%"
                            }}
                        >
                            {/* Course Image with Overlay */}
                            <div className="relative h-56 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/30 via-transparent to-neutral-900 z-10"></div>
                                <img
                                    src="/api/placeholder/600/400"
                                    alt={course.title}
                                    className="card-image w-full h-full object-cover"
                                />
                                {course.trending && (
                                    <div className="card-badge absolute top-3 left-3 z-20 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-medium shadow-lg shadow-blue-500/30">
                                        <TrendingUp className="w-3 h-3" />
                                        <span>Trending</span>
                                    </div>
                                )}
                                <div className="absolute bottom-3 left-3 z-20 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-900/80 text-neutral-300 text-xs font-medium backdrop-blur-sm">
                                    {course.level}
                                </div>
                            </div>

                            {/* Course Content */}
                            <div className="card-content p-6 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-medium text-blue-400">{course.category}</span>
                                    <div className="flex items-center bg-neutral-800/50 rounded-full px-2 py-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-medium text-white ml-1">{course.rating}</span>
                                        <span className="text-xs text-neutral-500 ml-1">({course.reviews})</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
                                    {course.title}
                                </h3>

                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                                        <Users className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{course.instructor}</p>
                                        <p className="text-xs text-neutral-500">{course.instructorRole}</p>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {course.tags.map(tag => (
                                        <span key={tag} className="text-xs bg-neutral-800/50 text-neutral-400 rounded-full px-2 py-1">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mb-4 text-neutral-400 text-sm">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        <span>{(course.students).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-neutral-800/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xl font-bold text-white">${course.price}</span>
                                            {course.originalPrice && (
                                                <span className="text-sm text-neutral-500 line-through ml-2">${course.originalPrice}</span>
                                            )}
                                        </div>
                                        <button
                                            className="card-cta inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 transition-colors duration-300"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            <span className="text-sm font-medium">Enroll</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div ref={ctaRef} className="text-center mt-12">
                    <button
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-medium 
                       shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300"
                    >
                        <span>View All Courses</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default React.memo(FeaturedCoursesSection)