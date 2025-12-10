import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Moon, Sun, Download } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
    const { user, profile, login, logout } = useAuth();

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
                            <Download className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            <span className="font-bold text-xl text-gray-800 dark:text-white">Clip it</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {profile ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{profile.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{profile.email}</span>
                                </div>
                                <img
                                    src={profile.picture}
                                    alt="Profile"
                                    className="h-8 w-8 rounded-full border-2 border-blue-500"
                                />
                                <button
                                    onClick={logout}
                                    className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => login()}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                            >
                                <User size={18} />
                                <span>Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
