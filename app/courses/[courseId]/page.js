'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Clock, Star, Users, Play, CheckCircle, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import ProgressBar from '@/app/components/courses/progress-bar';

export default function CourseDetailsPage({ params }) {
    const router = useRouter();
    const { courseId } = params;

    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchCourseData = async () => {
            setIsLoading(true);
            try {
                // In a real app, you would call your API
                // For now, using static mock data
                await new Promise(resolve => setTimeout(resolve, 800));

                setCourse({
                    id: courseId,
                    title: 'Advanced React Architecture and Patterns',
                    description: 'Master advanced React techniques and architectural patterns to build scalable and maintainable applications.',
                    fullDescription: `<p>This comprehensive course will take you beyond the basics of React and teach you the advanced patterns and architecture needed to build enterprise-grade applications. You'll learn state management strategies, code organization techniques, performance optimization, and much more.</p>
          <p>Designed for intermediate and advanced developers who are already familiar with React fundamentals, this course will elevate your skills to the professional level with real-world applications and challenges.</p>`,
                    thumbnail: '/api/placeholder/1200/600',
                    instructor: 'Sarah Williams',
                    instructorRole: 'Senior Frontend Engineer at TechCorp',
                    instructorAvatar: '/api/placeholder/64/64',
                    duration: '10 hours',
                    level: 'Advanced',
                    rating: 4.9,
                    reviewCount: 387,
                    progress: 30,
                    enrolled: 1780,
                    lastUpdated: 'March 2025',
                    topics: ['Component Patterns', 'Advanced Hooks', 'State Management', 'Performance Optimization', 'Testing Strategies'],
                    prerequisites: ['Basic React knowledge', 'JavaScript ES6+', 'Understanding of component lifecycle'],
                    lessons: [
                        {
                            id: '1',
                            title: 'Course Introduction and Overview',
                            duration: '12 min',
                            completed: true,
                            type: 'video'
                        },
                        {
                            id: '2',
                            title: 'Component Composition Patterns',
                            duration: '45 min',
                            completed: true,
                            type: 'video'
                        },
                        {
                            id: '3',
                            title: 'Advanced Hook Patterns',
                            duration: '58 min',
                            completed: false,
                            type: 'video'
                        },
                        {
                            id: '4',
                            title: 'Custom Hook Development',
                            duration: '52 min',
                            completed: false,
                            type: 'video'
                        },
                        {
                            id: '5',
                            title: 'Context API and State Management',
                            duration: '63 min',
                            completed: false,
                            type: 'video'
                        },
                        {
                            id: '6',
                            title: 'Performance Optimization Techniques',
                            duration: '70 min',
                            completed: false,
                            type: 'video'
                        },
                        {
                            id: '7',
                            title: 'Advanced Testing Strategies',
                            duration: '55 min',
                            completed: false,
                            type: 'video'
                        },
                        {
                            id: '8',
                            title: 'Final Project: Building a Complex Application',
                            duration: '120 min',
                            completed: false,
                            type: 'project'
                        }
                    ]
                });
            } catch (error) {
                console.error('Failed to load course:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    const startCourse = () => {
        // Find first incomplete lesson or start from the beginning
        if (course?.lessons) {
            const nextLesson = course.lessons.find(lesson => !lesson.completed) || course.lessons[0];
            router.push(`/courses/${courseId}/lesson/${nextLesson.id}`);
        }
    };

    const continueLesson = () => {
        if (course?.lessons) {
            // Find first incomplete lesson
            const nextLesson = course.lessons.find(lesson => !lesson.completed);
            if (nextLesson) {
                router.push(`/courses/${courseId}/lesson/${nextLesson.id}`);
            } else {
                // All lessons completed, go to first lesson
                router.push(`/courses/${courseId}/lesson/${course.lessons[0].id}`);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white">
                <div className="container mx-auto px-4 py-16 max-w-7xl">
                    <div className="text-center py-16">
                        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
                        <p className="text-neutral-400 mb-8">The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                        <Link
                            href="/courses"
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Browse Courses
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const {
        title,
        description,
        fullDescription,
        thumbnail,
        instructor,
        instructorRole,
        instructorAvatar,
        duration,
        level,
        rating,
        reviewCount,
        topics,
        prerequisites,
        lessons,
        progress,
        enrolled,
        lastUpdated
    } = course;

    const totalLessons = lessons?.length || 0;
    const completedLessons = lessons?.filter(lesson => lesson.completed)?.length || 0;

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Back button */}
                <Link
                    href="/courses"
                    className="inline-flex items-center text-neutral-400 hover:text-white mb-8"
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back to Courses
                </Link>

                {/* Course header */}
                <div className="relative rounded-xl overflow-hidden mb-8">
                    <div className="aspect-[21/9] relative">
                        <Image
                            src={thumbnail}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                                    {level}
                                </span>
                                <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-sm font-medium">
                                    Updated {lastUpdated}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
                            <p className="text-neutral-300 text-lg mb-6">{description}</p>

                            <div className="flex flex-wrap items-center gap-5 text-sm text-neutral-400">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={18} />
                                    <span>{duration}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users size={18} />
                                    <span>{enrolled.toLocaleString()} students</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Star size={18} className="text-yellow-500" />
                                    <span className="text-white">{rating}</span>
                                    <span>({reviewCount} reviews)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column: Course details */}
                    <div className="lg:col-span-2">
                        {/* Tabs */}
                        <div className="border-b border-neutral-800 mb-8">
                            <div className="flex overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`px-6 py-4 font-medium whitespace-nowrap ${activeTab === 'overview'
                                        ? 'border-b-2 border-blue-500 text-blue-400'
                                        : 'text-neutral-400 hover:text-white'
                                        }`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('curriculum')}
                                    className={`px-6 py-4 font-medium whitespace-nowrap ${activeTab === 'curriculum'
                                        ? 'border-b-2 border-blue-500 text-blue-400'
                                        : 'text-neutral-400 hover:text-white'
                                        }`}
                                >
                                    Curriculum
                                </button>
                                <button
                                    onClick={() => setActiveTab('instructor')}
                                    className={`px-6 py-4 font-medium whitespace-nowrap ${activeTab === 'instructor'
                                        ? 'border-b-2 border-blue-500 text-blue-400'
                                        : 'text-neutral-400 hover:text-white'
                                        }`}
                                >
                                    Instructor
                                </button>
                            </div>
                        </div>

                        {/* Tab content */}
                        <div className="mb-12">
                            {activeTab === 'overview' && (
                                <div>
                                    <div className="prose prose-invert max-w-none mb-8">
                                        <div dangerouslySetInnerHTML={{ __html: fullDescription }} />
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold mb-4">What You&apos;ll Learn</h3>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {topics.map((topic, index) => (
                                                <li key={index} className="flex items-start">
                                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                                    <span>{topic}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-4">Prerequisites</h3>
                                        <ul className="space-y-2">
                                            {prerequisites.map((prerequisite, index) => (
                                                <li key={index} className="flex items-start">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-neutral-500 mt-2 mr-3"></div>
                                                    <span>{prerequisite}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'curriculum' && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-semibold">Course Content</h3>
                                        <div className="text-sm text-neutral-400">
                                            {completedLessons} / {totalLessons} lessons completed
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <ProgressBar progress={Math.floor((completedLessons / totalLessons) * 100)} />
                                    </div>

                                    <div className="space-y-3">
                                        {lessons.map((lesson, index) => (
                                            <div
                                                key={lesson.id}
                                                className="bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden"
                                            >
                                                <div className="flex items-center p-4">
                                                    <div className="mr-4 h-10 w-10 flex-shrink-0">
                                                        {lesson.completed ? (
                                                            <div className="bg-green-500/20 text-green-500 rounded-full h-full w-full flex items-center justify-center">
                                                                <CheckCircle className="h-5 w-5" />
                                                            </div>
                                                        ) : (
                                                            <div className="bg-neutral-800 text-neutral-400 rounded-full h-full w-full flex items-center justify-center">
                                                                {lesson.type === 'video' ? (
                                                                    <Play className="h-5 w-5" />
                                                                ) : (
                                                                    <BookOpen className="h-5 w-5" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-grow">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-medium">
                                                                {index + 1}. {lesson.title}
                                                            </h4>
                                                            <span className="text-sm text-neutral-400">{lesson.duration}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="px-4 py-3 border-t border-neutral-800 flex justify-end">
                                                    <button
                                                        onClick={() => router.push(`/courses/${courseId}/lesson/${lesson.id}`)}
                                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
                                                    >
                                                        {lesson.completed ? 'Review Lesson' : 'Start Lesson'}
                                                        <ArrowRight className="h-4 w-4 ml-1" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'instructor' && (
                                <div>
                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="h-20 w-20 rounded-full overflow-hidden relative">
                                            <Image
                                                src={instructorAvatar}
                                                alt={instructor}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold">{instructor}</h3>
                                            <p className="text-neutral-400">{instructorRole}</p>
                                        </div>
                                    </div>

                                    <div className="prose prose-invert max-w-none">
                                        <p>
                                            Sarah Williams is a senior frontend engineer with over 8 years of experience building
                                            complex web applications. She specializes in React architecture and has worked with
                                            numerous Fortune 500 companies to improve their frontend development practices.
                                        </p>
                                        <p>
                                            Her teaching approach focuses on real-world applications and best practices that
                                            you can immediately apply to your own projects. She is passionate about helping
                                            developers build maintainable, scalable, and performant applications.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right column: Course sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden sticky top-8">
                            {/* Progress info */}
                            {progress > 0 && (
                                <div className="p-6 border-b border-neutral-800">
                                    <h3 className="font-semibold mb-2">Your Progress</h3>
                                    <ProgressBar progress={progress} />
                                    <div className="mt-4">
                                        <button
                                            onClick={continueLesson}
                                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                                        >
                                            Continue Learning
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Course details */}
                            <div className="p-6">
                                {progress === 0 ? (
                                    <button
                                        onClick={startCourse}
                                        className="w-full py-3 mb-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                                    >
                                        Start Learning
                                    </button>
                                ) : null}

                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <BookOpen className="h-5 w-5 text-neutral-400 mr-3" />
                                        <div>
                                            <div className="text-sm text-neutral-400">Lessons</div>
                                            <div>{totalLessons} lessons</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Clock className="h-5 w-5 text-neutral-400 mr-3" />
                                        <div>
                                            <div className="text-sm text-neutral-400">Duration</div>
                                            <div>{duration}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Users className="h-5 w-5 text-neutral-400 mr-3" />
                                        <div>
                                            <div className="text-sm text-neutral-400">Enrolled</div>
                                            <div>{enrolled.toLocaleString()} students</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Star className="h-5 w-5 text-yellow-500 mr-3" />
                                        <div>
                                            <div className="text-sm text-neutral-400">Rating</div>
                                            <div>{rating} ({reviewCount} reviews)</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-neutral-800">
                                    <h3 className="font-semibold mb-4">Share This Course</h3>
                                    <div className="flex gap-3">
                                        <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                            </svg>
                                        </button>
                                        <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                            </svg>
                                        </button>
                                        <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M18.335 18.339H15.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.2 1.778 3.2 4.091v4.715zM7.003 8.575a1.546 1.546 0 01-1.548-1.549 1.548 1.548 0 111.547 1.549zm1.336 9.764H5.666V9.75H8.34v8.589zM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
