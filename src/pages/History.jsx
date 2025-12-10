import React, { useState, useEffect } from 'react';
import { Trash2, Download, Calendar, HardDrive, Video } from 'lucide-react';
import { parseSizeToMB, formatSize } from '../utils/downloader';
import toast from 'react-hot-toast';
import EmptyState from '../components/EmptyState';

const History = () => {
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('downloadHistory');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('downloadHistory', JSON.stringify(history));
    }, [history]);

    const handleDelete = (index) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setHistory((prev) => prev.filter((_, i) => i !== index));
            toast.success('Item deleted from history');
        }
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all download history?')) {
            setHistory([]);
            toast.success('All history cleared');
        }
    };

    const totalSizeMB = history.reduce((acc, item) => {
        return acc + parseSizeToMB(item.size);
    }, 0);

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Download History</h1>
                <p className="text-gray-600 dark:text-gray-400">View and manage your downloaded videos</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Download size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{history.length}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Total Downloads</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <HardDrive size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatSize(totalSizeMB)}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Total Size</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <button
                        onClick={handleClearAll}
                        disabled={history.length === 0}
                        className="w-full h-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash2 size={20} />
                        Clear All History
                    </button>
                </div>
            </div>

            {/* History List */}
            {history.length === 0 ? (
                <EmptyState
                    icon={Video}
                    title="No Download History"
                    description="Your download history will appear here once you start downloading videos. Try downloading a video from the Dashboard!"
                />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Video</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Platform</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Quality</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {history.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0">
                                                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.duration || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                                                {item.platform}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                                                {item.quality}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                                            {item.size}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <Calendar size={14} />
                                                {new Date(item.downloadedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(index)}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors font-medium"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
