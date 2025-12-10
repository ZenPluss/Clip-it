import React, { useState } from 'react';
import { Search, Link as LinkIcon, X, ArrowRight } from 'lucide-react';
import { detectPlatform, validateUrl } from '../utils/downloader';

const UrlInput = ({ onUrlSubmit, isLoading }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url) return;

        if (!validateUrl(url)) {
            setError('Please enter a valid URL from a supported platform.');
            return;
        }

        setError('');
        onUrlSubmit(url);
    };

    const handleChange = (e) => {
        setUrl(e.target.value);
        if (error) setError('');
    };

    const clearInput = () => {
        setUrl('');
        setError('');
    };

    const platform = detectPlatform(url);

    return (
        <div className="w-full max-w-3xl">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="relative flex items-center">
                    <div className="absolute left-6 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <LinkIcon size={24} />
                    </div>
                    <input
                        type="text"
                        value={url}
                        onChange={handleChange}
                        placeholder="Paste your link here..."
                        className={`w-full pl-16 pr-32 py-5 rounded-2xl bg-white dark:bg-gray-800 border-2 text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 shadow-sm ${error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30'
                            : 'border-gray-200 dark:border-gray-700 focus:border-blue-600 focus:ring-blue-100 dark:focus:ring-blue-900/30'
                            }`}
                        disabled={isLoading}
                    />

                    {url && (
                        <button
                            type="button"
                            onClick={clearInput}
                            className="absolute right-36 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={!url || isLoading}
                        className={`absolute right-2 top-2 bottom-2 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center gap-2 ${!url || isLoading
                            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                            }`}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>Download</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </div>

                {error && (
                    <p className="absolute -bottom-8 left-4 text-sm text-red-500 font-medium animate-fadeIn">
                        {error}
                    </p>
                )}

                {platform && !error && (
                    <div className="absolute -bottom-8 right-4 text-xs font-bold text-blue-600 dark:text-blue-400 animate-fadeIn bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full uppercase tracking-wider">
                        Detected: {platform}
                    </div>
                )}
            </form>
        </div>
    );
};

export default UrlInput;
