import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UrlInput from '../components/UrlInput';
import MediaPreview from '../components/MediaPreview';
import { mockFetchMediaInfo, parseSizeToMB, formatSize } from '../utils/downloader';
import { Play, Download, HardDrive, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [media, setMedia] = useState(null);
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('downloadHistory');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('downloadHistory', JSON.stringify(history));
    }, [history]);

    const handleUrlSubmit = async (url) => {
        setLoading(true);
        setMedia(null);
        try {
            const data = await mockFetchMediaInfo(url);
            setMedia(data);
        } catch (error) {
            console.error(error);

            // Show more specific error messages
            let errorMsg = 'Failed to fetch media info. ';
            if (error.message.includes('Network Error') || error.message.includes('ERR_CONNECTION_REFUSED')) {
                errorMsg = 'Backend server is not running. Please start the server first.';
            } else if (error.message.includes('private') || error.message.includes('login')) {
                errorMsg = 'This content is private or requires login. Try a public post.';
            } else if (url.includes('instagram.com')) {
                errorMsg = 'Instagram often blocks automated downloads. Try using a public post or different platform.';
            } else {
                errorMsg = 'Please try again or use a different platform.';
            }

            toast.error(errorMsg, { duration: 4000 });
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadComplete = (downloadedMedia) => {
        setHistory((prev) => [downloadedMedia, ...prev]);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area (Left 2/3) */}
            <div className="lg:col-span-2 space-y-8">

                {/* Hero Section */}
                <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl min-h-[350px] flex flex-col justify-center p-8 md:p-12 transition-colors duration-300">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 z-0"></div>

                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Download <span className="text-blue-600 dark:text-blue-400">Videos</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-lg">
                            Paste your link below to save videos from TikTok, Instagram, YouTube, Facebook, and Twitter in high quality.
                        </p>

                        <UrlInput onUrlSubmit={handleUrlSubmit} isLoading={loading} />
                    </div>
                </div>

                {/* Media Preview Area */}
                {media && (
                    <div className="animate-fadeIn">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Play className="text-blue-600" size={20} /> Ready to Download
                        </h2>
                        <MediaPreview media={media} onDownloadComplete={handleDownloadComplete} />
                    </div>
                )}

                {/* Recent Downloads Grid */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Downloads</h2>
                        <Link
                            to="/history"
                            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loading && !media ? (
                            // Show skeleton cards while loading
                            Array.from({ length: 4 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))
                        ) : history.length > 0 ? (
                            history.slice(0, 4).map((item, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group">
                                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-900">
                                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                                            {item.platform}
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-bold">
                                            {item.quality}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate mb-1">{item.title}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <span>{item.size}</span>
                                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                                        <span>{new Date(item.downloadedAt).toLocaleDateString()}</span>
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2">
                                <EmptyState
                                    icon={Video}
                                    title="No Downloads Yet"
                                    description="Start by pasting a video link above to download your first video!"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar Right (Stats & Top Lists) */}
            <div className="space-y-6">
                {/* Stats Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Overview</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Download size={24} />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{history.length}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Total Downloads</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <HardDrive size={24} />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {formatSize(history.reduce((acc, item) => acc + parseSizeToMB(item.size), 0))}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Data Saved</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Supported Apps */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Supported Apps</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'YouTube', url: 'https://youtube.com', logo: 'https://logo.clearbit.com/youtube.com' },
                            { name: 'TikTok', url: 'https://tiktok.com', logo: 'https://logo.clearbit.com/tiktok.com' },
                            { name: 'Instagram', url: 'https://instagram.com', logo: 'https://logo.clearbit.com/instagram.com' },
                            { name: 'Facebook', url: 'https://facebook.com', logo: 'https://logo.clearbit.com/facebook.com' },
                            { name: 'Twitter', url: 'https://twitter.com', logo: 'https://logo.clearbit.com/twitter.com' },
                            { name: 'Reddit', url: 'https://reddit.com', logo: 'https://logo.clearbit.com/reddit.com' },
                            { name: 'Vimeo', url: 'https://vimeo.com', logo: 'https://logo.clearbit.com/vimeo.com' }
                        ].map((platform, i) => (
                            <a
                                key={platform.name}
                                href={platform.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
                            >
                                <span className="text-xl font-bold text-gray-300 dark:text-gray-600 group-hover:text-blue-600 transition-colors">0{i + 1}</span>
                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 overflow-hidden flex items-center justify-center p-1.5 border border-gray-100 dark:border-gray-600">
                                    <img
                                        src={platform.logo}
                                        alt={platform.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${platform.name}&background=random&size=128`;
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 dark:text-white">{platform.name}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Video & Audio</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
