'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Plus, Trash2, DollarSign, Clock } from 'lucide-react'

export default function CreateCoursePage() {
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        level: 'beginner',
        prerequisites: [],
        sections: []
    })

    const handleAddSection = () => {
        setCourseData(prev => ({
            ...prev,
            sections: [...prev.sections, { title: '', lessons: [] }]
        }))
    }

    const handleAddLesson = (sectionIndex) => {
        setCourseData(prev => {
            const newSections = [...prev.sections]
            newSections[sectionIndex].lessons.push({
                title: '',
                type: 'video',
                content: '',
                duration: ''
            })
            return { ...prev, sections: newSections }
        })
    }

    return (
        <div className="min-h-screen bg-neutral-950 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-white mb-8">Create New Course</h1>

                <div className="space-y-8">
                    {/* Course Basic Info */}
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Course Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Course Title
                                </label>
                                <input
                                    type="text"
                                    value={courseData.title}
                                    onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-3 bg-neutral-800/50 rounded-lg border border-neutral-700 
                    text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter course title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={courseData.description}
                                    onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-neutral-800/50 rounded-lg border border-neutral-700 
                    text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe your course"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Price (USD)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={courseData.price}
                                            onChange={(e) => setCourseData(prev => ({ ...prev, price: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 rounded-lg border border-neutral-700 
                        text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="29.99"
                                        />
                                        <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Level
                                    </label>
                                    <select
                                        value={courseData.level}
                                        onChange={(e) => setCourseData(prev => ({ ...prev, level: e.target.value }))}
                                        className="w-full px-4 py-3 bg-neutral-800/50 rounded-lg border border-neutral-700 
                      text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course Content */}
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">Course Content</h2>
                            <button
                                onClick={handleAddSection}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                  text-white rounded-lg transition-colors"
                            >
                                <Plus size={20} />
                                Add Section
                            </button>
                        </div>

                        <div className="space-y-6">
                            {courseData.sections.map((section, sIndex) => (
                                <div key={sIndex} className="border border-neutral-800 rounded-lg p-4">
                                    <input
                                        type="text"
                                        value={section.title}
                                        onChange={(e) => {
                                            const newSections = [...courseData.sections]
                                            newSections[sIndex].title = e.target.value
                                            setCourseData(prev => ({ ...prev, sections: newSections }))
                                        }}
                                        className="w-full px-4 py-2 bg-neutral-800/50 rounded-lg border border-neutral-700 
                      text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Section Title"
                                    />

                                    <div className="mt-4 space-y-4">
                                        {section.lessons.map((lesson, lIndex) => (
                                            <div key={lIndex} className="flex gap-4 items-start">
                                                <input
                                                    type="text"
                                                    value={lesson.title}
                                                    onChange={(e) => {
                                                        const newSections = [...courseData.sections]
                                                        newSections[sIndex].lessons[lIndex].title = e.target.value
                                                        setCourseData(prev => ({ ...prev, sections: newSections }))
                                                    }}
                                                    className="flex-1 px-4 py-2 bg-neutral-800/50 rounded-lg border border-neutral-700 
                            text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Lesson Title"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newSections = [...courseData.sections]
                                                        newSections[sIndex].lessons.splice(lIndex, 1)
                                                        setCourseData(prev => ({ ...prev, sections: newSections }))
                                                    }}
                                                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => handleAddLesson(sIndex)}
                                            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 
                        text-white rounded-lg transition-colors text-sm"
                                        >
                                            <Plus size={16} />
                                            Add Lesson
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg 
              transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                        Publish Course
                    </motion.button>
                </div>
            </div>
        </div>
    )
}