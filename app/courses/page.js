'use client'
import React from 'react'
import CourseGrid from '@/app/components/courses/course-grid'

export default function CoursesPage() {
    return (
        <div className="min-h-screen bg-neutral-950 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-white mb-8">Available Courses</h1>
                <CourseGrid />
            </div>
        </div>
    )
}