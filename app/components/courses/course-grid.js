import React from 'react';
import CourseCard from './course-card';
import { BookOpen } from 'lucide-react';

const CourseGrid = ({ courses, title, emptyMessage = "No courses found" }) => {
    return (
        <div className="w-full">
            {title && (
                <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
            )}

            {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="h-full">
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen className="h-16 w-16 text-neutral-600 mb-4" />
                    <p className="text-neutral-400">{emptyMessage}</p>
                </div>
            )}
        </div>
    );
};

export default CourseGrid;