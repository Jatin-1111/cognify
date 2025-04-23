'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Menu, X, List, Layers, Clock, CheckCircle, Play, ArrowLeft, Loader2 } from 'lucide-react';
import LessonPlayer from '@/components/courses/lesson-player';

export default function LessonPage({ params }) {
    const router = useRouter();
    const { courseId, lessonId } = params;

    const [course, setCourse] = useState(null);
    const [lesson, setLesson] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // In a real app, you would fetch from your API
                // For now, using static mock data
                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock course data
                const courseData = {
                    id: courseId,
                    title: 'Advanced React Architecture and Patterns',
                    thumbnail: '/api/placeholder/400/225',
                    lessons: [
                        {
                            id: '1',
                            title: 'Course Introduction and Overview',
                            duration: '12 min',
                            completed: true,
                            type: 'video',
                            videoUrl: 'https://example.com/videos/lesson1.mp4',
                            content: `
                <h1>Course Introduction and Overview</h1>
                <p>Welcome to Advanced React Architecture and Patterns! In this course, you'll learn how to build scalable, maintainable React applications using advanced patterns and best practices.</p>
                <h2>What You'll Learn</h2>
                <ul>
                  <li>Component composition patterns</li>
                  <li>Advanced hook patterns</li>
                  <li>State management strategies</li>
                  <li>Performance optimization techniques</li>
                  <li>Testing strategies</li>
                </ul>
                <p>This first lesson will provide an overview of the course structure and what to expect in each module.</p>
              `,
                            resources: [
                                { title: 'Course Slides', url: '#' },
                                { title: 'React Documentation', url: 'https://reactjs.org/docs/getting-started.html' }
                            ]
                        },
                        {
                            id: '2',
                            title: 'Component Composition Patterns',
                            duration: '45 min',
                            completed: true,
                            type: 'video',
                            videoUrl: 'https://example.com/videos/lesson2.mp4',
                            content: `
                <h1>Component Composition Patterns</h1>
                <p>In this lesson, we'll explore various ways to compose React components for maximum flexibility and reusability.</p>
                <h2>Topics Covered</h2>
                <ul>
                  <li>Compound components</li>
                  <li>Higher-order components</li>
                  <li>Render props pattern</li>
                  <li>Component composition vs inheritance</li>
                </ul>
              `,
                            resources: [
                                { title: 'Component Composition Examples', url: '#' }
                            ]
                        },
                        {
                            id: '3',
                            title: 'Advanced Hook Patterns',
                            duration: '58 min',
                            completed: false,
                            type: 'video',
                            videoUrl: 'https://example.com/videos/lesson3.mp4',
                            content: `
                <h1>Advanced Hook Patterns</h1>
                <p>React Hooks enable powerful patterns for state management and side effects. In this lesson, we'll explore advanced techniques.</p>
                <h2>Topics Covered</h2>
                <ul>
                  <li>Building custom hooks</li>
                  <li>Hook composition</li>
                  <li>Optimizing with useMemo and useCallback</li>
                  <li>Managing complex state with useReducer</li>
                </ul>
              `,
                            resources: [
                                { title: 'Advanced Hooks Examples', url: '#' },
                                { title: 'React Hooks API Reference', url: 'https://reactjs.org/docs/hooks-reference.html' }
                            ]
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
                };

                setCourse(courseData);

                // Find the current lesson
                const currentLesson = courseData.lessons.find(l => l.id === lessonId);
                if (currentLesson) {
                    setLesson(currentLesson);
                } else {
                    // If lesson not found, redirect to course page
                    router.push(`/courses/${courseId}`);
                }
            } catch (error) {
                console.error('Failed to load lesson:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (courseId && lessonId) {
            fetchData();
        }
    }, [courseId, lessonId, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!course || !lesson) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center py-16">
                        <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
                        <p className="text-neutral-400 mb-8">The lesson you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                        <Link
                            href={`/courses/${courseId}`}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Return to Course
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Find previous and next lessons
    const currentIndex = course.lessons.findIndex(l => l.id === lessonId);
    const prevLessonId = currentIndex > 0 ? course.lessons[currentIndex - 1].id : null;
    const nextLessonId = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1].id : null;

    const handleLessonComplete = async (completedLessonId) => {
        // In a real app, you would call an API to update lesson progress
        console.log(`Lesson ${completedLessonId} marked as complete`);

        // Update local state
        const updatedLessons = course.lessons.map(l =>
            l.id === completedLessonId ? { ...l, completed: true } : l
        );

        setCourse({ ...course, lessons: updatedLessons });
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
            {/* Top navigation */}
            <header className="bg-neutral-900 border-b border-neutral-800 py-3 px-4">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href={`/courses/${courseId}`} className="text-neutral-400 hover:text-white flex items-center mr-6">
                            <ArrowLeft className="h-5 w-5 mr-1" />
                            <span className="hidden sm:inline">Back to Course</span>
                        </Link>

                        <h1 className="text-lg font-medium truncate max-w-xs sm:max-w-md">
                            {course.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-neutral-400 hidden md:block">
                            Lesson {currentIndex + 1} of {course.lessons.length}
                        </span>

                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                        >
                            {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>

                        <button
                            className="hidden md:block p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                            onClick={() => setShowSidebar(!showSidebar)}
                        >
                            <List className="h-5 w-5" />
                            <span className="sr-only">Toggle lesson list</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-grow flex">
                {/* Main content area */}
                <main className={`flex-grow transition-all ${showSidebar ? 'md:mr-80' : ''}`}>
                    <div className="container mx-auto p-4 h-full max-w-5xl">
                        <LessonPlayer
                            lesson={lesson}
                            courseId={courseId}
                            nextLessonId={nextLessonId}
                            prevLessonId={prevLessonId}
                            onComplete={handleLessonComplete}
                        />
                    </div>
                </main>

                {/* Sidebar */}
                <aside className={`fixed top-0 right-0 h-full w-full md:w-80 bg-neutral-900 border-l border-neutral-800 z-30 transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : 'translate-x-full'
                    } md:translate-x-0 md:z-0 md:top-[57px] md:h-[calc(100vh-57px)] ${showSidebar ? 'md:translate-x-0' : 'md:translate-x-full'
                    }`}>
                    {/* Mobile close button */}
                    <div className="p-4 border-b border-neutral-800 flex justify-between items-center md:hidden">
                        <h2 className="font-semibold">Lesson Navigator</h2>
                        <button
                            onClick={() => setShowSidebar(false)}
                            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Course lessons */}
                    <div className="overflow-y-auto h-[calc(100%-60px)] md:h-full">
                        <div className="p-4 border-b border-neutral-800">
                            <h2 className="font-semibold text-lg mb-1">{course.title}</h2>
                            <p className="text-sm text-neutral-400">
                                {course.lessons.filter(l => l.completed).length} of {course.lessons.length} lessons completed
                            </p>
                        </div>

                        <div className="p-2">
                            {course.lessons.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`mb-1 rounded-lg ${item.id === lessonId ? 'bg-blue-500/20' : 'hover:bg-neutral-800'
                                        }`}
                                >
                                    <Link
                                        href={`/courses/${courseId}/lesson/${item.id}`}
                                        className="flex items-start p-3"
                                        onClick={() => setShowSidebar(false)}
                                    >
                                        <div className="mr-3 h-6 w-6 flex-shrink-0 mt-0.5">
                                            {item.completed ? (
                                                <div className="text-green-500">
                                                    <CheckCircle className="h-6 w-6" />
                                                </div>
                                            ) : (
                                                <div className="text-neutral-500">
                                                    {item.type === 'video' ? (
                                                        <Play className="h-6 w-6" />
                                                    ) : (
                                                        <Layers className="h-6 w-6" />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex items-start justify-between">
                                                <h3 className={`font-medium ${item.id === lessonId ? 'text-blue-400' : ''}`}>
                                                    {index + 1}. {item.title}
                                                </h3>
                                            </div>
                                            <div className="flex items-center mt-1 text-sm text-neutral-400">
                                                <Clock className="h-3.5 w-3.5 mr-1" />
                                                <span>{item.duration}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}