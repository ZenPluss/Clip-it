import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Download, Shield, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto mb-16">
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <img
                        src="/logo.png"
                        alt="Clip it!"
                        className="w-24 h-24 object-contain animate-bounce-slow"
                    />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                    Download Videos from
                    <span className="block text-blue-600 dark:text-blue-400">Any Platform</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                    Save your favorite videos from TikTok, Instagram, YouTube, Facebook, and Twitter in high quality.
                </p>

                {!user ? (
                    <button
                        onClick={() => login()}
                        className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all mx-auto"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                        Sign in with Google
                    </button>
                ) : (
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Go to Dashboard
                        <Download size={20} />
                    </Link>
                )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
                        <Zap className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Fast Downloads</h3>
                    <p className="text-gray-600 dark:text-gray-400">Download videos instantly with our optimized servers.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-4">
                        <Shield className="text-purple-600 dark:text-purple-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">HD Quality</h3>
                    <p className="text-gray-600 dark:text-gray-400">Choose from multiple quality options including HD.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-4">
                        <Download className="text-green-600 dark:text-green-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Multiple Platforms</h3>
                    <p className="text-gray-600 dark:text-gray-400">Support for TikTok, Instagram, YouTube, and more.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
