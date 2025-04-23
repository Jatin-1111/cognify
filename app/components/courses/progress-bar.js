import React from 'react';

const ProgressBar = ({
    progress,
    showPercentage = true,
    height = 'h-2',
    color = 'bg-blue-500',
    backgroundColor = 'bg-neutral-800',
    text = '',
    className = '',
}) => {
    // Ensure progress is between 0 and 100
    const validProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className={`w-full ${className}`}>
            {(text || showPercentage) && (
                <div className="flex justify-between text-xs mb-1">
                    {text && <span className="text-neutral-400">{text}</span>}
                    {showPercentage && <span className="text-neutral-400">{validProgress}%</span>}
                </div>
            )}
            <div className={`w-full ${backgroundColor} rounded-full ${height}`}>
                <div
                    className={`${color} ${height} rounded-full transition-all duration-300 ease-in-out`}
                    style={{ width: `${validProgress}%` }}
                    role="progressbar"
                    aria-valuenow={validProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                />
            </div>
        </div>
    );
};

export default ProgressBar;