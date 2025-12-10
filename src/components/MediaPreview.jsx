import React, { useState } from 'react';
import { Download, Play, FileVideo, Music, Image as ImageIcon, Check } from 'lucide-react';
import { mockDownloadMedia } from '../utils/downloader';
import toast from 'react-hot-toast';

const MediaPreview = ({ media, onDownloadComplete }) => {
    const [downloading, setDownloading] = useState(false);
    const [selectedQuality, setSelectedQuality] = useState('HD');
    const [progress, setProgress] = useState(0);

    const handleDownload = async () => {
        setDownloading(true);
        setProgress(0);

        // Simulate progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        await mockDownloadMedia(media, selectedQuality);

        clearInterval(interval);
        setProgress(100);

        setTimeout(() => {
            setDownloading(false);
            toast.success('Download completed successfully!');
            onDownloadComplete({ ...media, quality: selectedQuality, downloadedAt: new Date().toISOString() });
        }, 500);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 animate-fadeIn mt-8 max-w-2xl mx-auto">
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 group">
                        <img
                            src={media.thumbnail}
                            alt={media.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                <Play size={20} className="text-gray-900 ml-1" />
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {media.duration}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {media.platform}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{media.size}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-4">
                                {media.title}
                            </h3>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Quality:</label>
                                <div className="flex flex-wrap gap-2">
                                    {media.quality.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => setSelectedQuality(q)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedQuality === q
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className={`mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 ${downloading
                                ? 'bg-blue-500 cursor-wait'
                                : progress === 100
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                }`}
                        >
                            {downloading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Downloading {progress}%</span>
                                </>
                            ) : progress === 100 ? (
                                <>
                                    <Check size={20} />
                                    <span>Downloaded!</span>
                                </>
                            ) : (
                                <>
                                    <Download size={20} />
                                    <span>Download {selectedQuality}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {downloading && (
                <div className="h-1 bg-gray-100 dark:bg-gray-700 w-full">
                    <div
                        className="h-full bg-blue-500 transition-all duration-200 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default MediaPreview;
