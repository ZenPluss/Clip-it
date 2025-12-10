import React from 'react';
import { Clock, FileVideo, Trash2, ExternalLink } from 'lucide-react';

const DownloadHistory = ({ history, onClearHistory }) => {
    if (!history || history.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-100 dark:border-gray-700">
                <div className="bg-gray-50 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-gray-400 dark:text-gray-500" size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No downloads yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Your download history will appear here.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Clock size={18} />
                    Recent Downloads
                </h3>
                <button
                    onClick={onClearHistory}
                    className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                    <Trash2 size={14} />
                    Clear History
                </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {history.map((item, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-900 flex-shrink-0 overflow-hidden">
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                                {item.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                    {item.platform}
                                </span>
                                <span>{item.quality}</span>
                                <span>{item.size}</span>
                                <span>{new Date(item.downloadedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <a
                            href={item.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <ExternalLink size={18} />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DownloadHistory;
