'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, BookOpen, ChevronRight } from 'lucide-react';
import CourseGrid from '@/app/components/courses/course-grid';
// import { fetchCourses } from '@/lib/api/courses';

export default function CoursesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');

    const levels = ['Beginner', 'Intermediate', 'Advanced'];

    useEffect(() => {
        const loadCourses = async () => {
            setIsLoading(true);
            try {
                // In a real app, you would fetch these from your API
                // For now, creating some mock data
                const mockCourses = [
                    {
                        id: '1',
                        title: 'JavaScript Fundamentals',
                        description: 'Learn the core concepts of JavaScript with practical examples and projects.',
                        thumbnail: '/api/placeholder/400/225',
                        instructor: 'Alex Johnson',
                        duration: '8 hours',
                        level: 'Beginner',
                        rating: 4.8,
                        progress: 65,
                        enrolled: 2540,
                        topics: ['Variables', 'Functions', 'Objects', 'DOM Manipulation']
                    },
                    {
                        id: '2',
                        title: 'Advanced React Patterns',
                        description: 'Master advanced React patterns including hooks, context, and performance optimization.',
                        thumbnail: '/api/placeholder/400/225',
                        instructor: 'Sarah Williams',
                        duration: '10 hours',
                        level: 'Advanced',
                        rating: 4.9,
                        progress: 30,
                        enrolled: 1780,
                        topics: ['Hooks', 'Context API', 'Render Props', 'Code Splitting']
                    },
                    {
                        id: '3',
                        title: 'Node.js Backend Development',
                        description: 'Build scalable backend services with Node.js, Express, and MongoDB.',
                        thumbnail: '/api/placeholder/400/225',
                        instructor: 'Michael Chen',
                        duration: '12 hours',
                        level: 'Intermediate',
                        rating: 4.7,
                        progress: 0,
                        enrolled: 3150,
                        topics: ['REST APIs', 'Authentication', 'Databases', 'Deployment']
                    },
                    {
                        id: '4',
                        title: 'CSS Mastery: Flexbox & Grid',
                        description: 'Create responsive layouts with modern CSS techniques like Flexbox and Grid.',
                        thumbnail: '/api/placeholder/400/225',
                        instructor: 'Emma Rodriguez',
                        duration: '6 hours',
                        level: 'Beginner',
                        rating: 4.6,
                        progress: 100,
                        enrolled: 4200,
                        topics: ['Flexbox', 'Grid', 'Responsive Design', 'CSS Variables']
                    },
                    {
                        id: '5',
                        title: 'Full-Stack Next.js Development',
                        description: 'Build complete web applications with Next.js, React, and serverless functions.',
                        thumbnail: '/api/placeholder/400/225',
                        instructor: 'David Kim',
                        duration: '15 hours',
                        level: 'Advanced',
                        rating: 4.9,
                        progress: 0,
                        enrolled: 2870,
                        topics: ['SSR', 'API Routes', 'Authentication', 'Deployment']
                    },
                    {
                        id: '6',
                        title: 'TypeScript for React Developers',
                        description: 'Add type safety to your React applications with TypeScript.',
                        thumbnail: '/api/placeholder/400/225',
                        instructor: 'Jessica Lee',
                        duration: '8 hours',
                        level: 'Intermediate',
                        rating: 4.8,
                        progress: 45,
                        enrolled: 2310,
                        topics: ['Types', 'Interfaces', 'Generics', 'Type Guards']
                    }
                ];

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 800));

                setCourses(mockCourses);
                setEnrolledCourses(mockCourses.filter(course => course.progress > 0));
            } catch (error) {
                console.error('Failed to load courses:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesFilter =
            filter === 'all' ||
            (filter === 'enrolled' && course.progress > 0) ||
            (filter === 'inProgress' && course.progress > 0 && course.progress < 100) ||
            (filter === 'completed' && course.progress === 100);

        const matchesSearch =
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLevel =
            selectedLevel === '' || course.level === selectedLevel;

        return matchesFilter && matchesSearch && matchesLevel;
    });

    return (
        <div className="min-h-screen bg-neutral-950 text-white py-16">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Page header with title and actions */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Courses</h1>
                            <p className="text-neutral-400">Expand your knowledge with our expert-led courses</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-neutral-500"
                                />
                                <Search className="h-5 w-5 text-neutral-500 absolute left-3 top-3" />
                            </div>

                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="py-2.5 px-4 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            >
                                <option value="">All Levels</option>
                                {levels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Filter tabs */}
                    <div className="mb-12">
                        <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-1">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-5 py-2.5 font-medium rounded-t-lg ${filter === 'all'
                                    ? 'border-b-2 border-blue-500 text-blue-400'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                                    }`}
                            >
                                All Courses
                            </button>
                            <button
                                onClick={() => setFilter('enrolled')}
                                className={`px-5 py-2.5 font-medium rounded-t-lg ${filter === 'enrolled'
                                    ? 'border-b-2 border-blue-500 text-blue-400'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                                    }`}
                            >
                                My Courses
                            </button>
                            <button
                                onClick={() => setFilter('inProgress')}
                                className={`px-5 py-2.5 font-medium rounded-t-lg ${filter === 'inProgress'
                                    ? 'border-b-2 border-blue-500 text-blue-400'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                                    }`}
                            >
                                In Progress
                            </button>
                            <button
                                onClick={() => setFilter('completed')}
                                className={`px-5 py-2.5 font-medium rounded-t-lg ${filter === 'completed'
                                    ? 'border-b-2 border-blue-500 text-blue-400'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                                    }`}
                            >
                                Completed
                            </button>
                        </div>
                    </div>

                    {/* Course content */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-32">
                            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {filter === 'all' && enrolledCourses.length > 0 && (
                                <div className="mb-16">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
                                        <button className="flex items-center text-blue-400 hover:text-blue-300">
                                            View all
                                            <ChevronRight className="h-5 w-5 ml-1" />
                                        </button>
                                    </div>
                                    <CourseGrid
                                        courses={enrolledCourses.slice(0, 3)}
                                        emptyMessage="You haven't enrolled in any courses yet."
                                    />
                                </div>
                            )}

                            <div>
                                {filter !== 'all' && (
                                    <h2 className="text-2xl font-bold text-white mb-6">
                                        {filter === 'enrolled' ? 'My Courses' :
                                            filter === 'inProgress' ? 'In Progress' : 'Completed Courses'}
                                    </h2>
                                )}

                                {filteredCourses.length > 0 ? (
                                    <CourseGrid
                                        courses={filteredCourses}
                                        emptyMessage={`No ${filter === 'all' ? '' : filter} courses found.`}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-neutral-800 bg-neutral-900/50">
                                        <BookOpen className="h-16 w-16 text-neutral-700 mb-4" />
                                        <h3 className="text-xl font-medium text-neutral-300 mb-2">No courses found</h3>
                                        <p className="text-neutral-500 max-w-md">
                                            {searchQuery ?
                                                `No results match your search "${searchQuery}"` :
                                                `No ${filter === 'all' ? '' : filter} courses found.`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}