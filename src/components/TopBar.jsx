import React, { useState } from 'react';
import { Bell, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const TopBar = () => {
    const { profile, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [imageError, setImageError] = useState(false);

    return (
        <div className="flex items-center justify-between py-6 px-8 mb-4">
            {/* App Title or Welcome Message */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome back{profile ? `, ${profile.name.split(' ')[0]}` : ''}!
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ready to download your favorite content</p>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {profile && (
                    <div className="hidden md:flex items-center gap-3 bg-white dark:bg-gray-800 py-2 px-4 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                        {!imageError && profile.picture ? (
                            <img
                                src={profile.picture}
                                alt="Profile"
                                className="w-8 h-8 rounded-full border border-blue-500"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm border border-blue-500">
                                {profile.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                            </div>
                        )}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {profile.name}
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-3 bg-white dark:bg-gray-800 rounded-full text-gray-500 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors shadow-sm border border-gray-100 dark:border-gray-700"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        onClick={logout}
                        className="p-3 bg-white dark:bg-gray-800 rounded-full text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm border border-gray-100 dark:border-gray-700"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                    <button className="p-3 bg-white dark:bg-gray-800 rounded-full text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative shadow-sm border border-gray-100 dark:border-gray-700">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
