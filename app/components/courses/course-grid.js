'use client'
import React from 'react'
import CourseCard from './course-card'

const MOCK_COURSES = [
    {
        id: 1,
        title: "Introduction to Web Development",
        description: "Learn the fundamentals of web development with HTML, CSS, and JavaScript.",
        duration: "8 weeks",
        level: "Beginner",
        enrolled: 1234,
        rating: 4.8,
        image: "/images/web-dev.jpg"
    },
    // Add more mock courses as needed
]

export default function CourseGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_COURSES.map(course => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    )
}