import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ChevronLeft, ChevronRight, Check, ExternalLink } from 'lucide-react';
import ProgressBar from './progress-bar';

const LessonPlayer = ({ lesson, courseId, nextLessonId, prevLessonId, onComplete }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const { id, title, type, content, videoUrl, duration, resources } = lesson;

    useEffect(() => {
        // Simulate loading content
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [lesson]);

    useEffect(() => {
        // Reset state when lesson changes
        setIsLoading(true);
        setProgress(0);
        setIsCompleted(false);
    }, [lesson.id]);

    // Track progress for video content
    const handleTimeUpdate = (e) => {
        const video = e.target;
        if (video) {
            const percentage = Math.floor((video.currentTime / video.duration) * 100);
            setProgress(percentage);

            // Mark as completed if watched more than 90%
            if (percentage > 90 && !isCompleted) {
                setIsCompleted(true);
                onComplete && onComplete(id);
            }
        }
    };

    // Mark text content as completed after scrolling to bottom
    const handleScroll = (e) => {
        const element = e.target;
        const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

        if (isAtBottom && !isCompleted) {
            setIsCompleted(true);
            setProgress(100);
            onComplete && onComplete(id);
        } else {
            // Calculate scroll progress
            const scrollPercentage = Math.floor((element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100);
            setProgress(scrollPercentage);
        }
    };

    const navigateToLesson = (lessonId) => {
        if (lessonId) {
            router.push(`/courses/${courseId}/lesson/${lessonId}`);
        }
    };

    return (
        <div className="flex flex-col h-full bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
            {/* Lesson header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <div className="flex items-center text-sm text-neutral-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {duration}
                </div>
            </div>

            {/* Lesson content */}
            <div className="flex-grow relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {type === 'video' && videoUrl ? (
                            <div className="h-full">
                                <video
                                    className="w-full h-full object-contain bg-black"
                                    src={videoUrl}
                                    controls
                                    onTimeUpdate={handleTimeUpdate}
                                    onEnded={() => {
                                        setIsCompleted(true);
                                        setProgress(100);
                                        onComplete && onComplete(id);
                                    }}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ) : (
                            <div
                                className="p-6 overflow-y-auto h-full prose prose-invert max-w-none prose-headings:text-white prose-p:text-neutral-300 prose-a:text-blue-400"
                                onScroll={handleScroll}
                            >
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Progress bar */}
            <div className="p-4 border-t border-neutral-800">
                <ProgressBar
                    progress={progress}
                    text="Lesson progress"
                />
            </div>

            {/* Action buttons */}
            <div className="p-4 border-t border-neutral-800 flex justify-between">
                <button
                    onClick={() => navigateToLesson(prevLessonId)}
                    disabled={!prevLessonId}
                    className={`px-4 py-2 rounded flex items-center ${prevLessonId
                            ? 'text-neutral-300 hover:bg-neutral-800'
                            : 'text-neutral-700 cursor-not-allowed'
                        }`}
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Previous
                </button>

                {isCompleted && nextLessonId ? (
                    <button
                        onClick={() => navigateToLesson(nextLessonId)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
                    >
                        Next Lesson
                        <ChevronRight className="h-5 w-5 ml-1" />
                    </button>
                ) : isCompleted ? (
                    <button
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center"
                        onClick={() => router.push(`/courses/${courseId}`)}
                    >
                        Complete Course
                        <Check className="h-5 w-5 ml-1" />
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setIsCompleted(true);
                            setProgress(100);
                            onComplete && onComplete(id);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                        Mark as Complete
                    </button>
                )}
            </div>

            {/* Additional resources */}
            {resources && resources.length > 0 && (
                <div className="p-4 border-t border-neutral-800">
                    <h3 className="font-semibold mb-2 text-white">Additional Resources</h3>
                    <ul className="space-y-1">
                        {resources.map((resource, index) => (
                            <li key={index}>
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 flex items-center"
                                >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    {resource.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LessonPlayer;