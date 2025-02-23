'use client'
import React from 'react'
import { Star, Clock, Users, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CourseCard({ course }) {
    return (
        <Link href={`/courses/${course.id}`}>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-700 transition-all">
                <div className="aspect-video bg-neutral-800 relative">
                    <Image
                        src="/api/placeholder/400/225"
                        alt={course.title}
                        fill
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-neutral-900/90 px-2 py-1 rounded text-sm text-white">
                        {course.level}
                    </div>
                </div>

                <div className="p-5">
                    <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                    <p className="text-neutral-400 text-sm mb-4">{course.description}</p>

                    <div className="flex items-center gap-4 text-sm text-neutral-400">
                        <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span>{course.enrolled.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star size={16} className="text-yellow-500" />
                            <span>{course.rating}</span>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-4 border-t border-neutral-800 flex justify-between items-center">
                    <span className="text-blue-400 font-medium">Learn More</span>
                    <ChevronRight size={20} className="text-blue-400" />
                </div>
            </div>
        </Link>
    )
}