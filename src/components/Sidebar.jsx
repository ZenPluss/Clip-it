import React from 'react';
import { Home, LayoutDashboard, History, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = user
        ? [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
            { icon: History, label: 'History', path: '/history' },
        ]
        : [
            { icon: Home, label: 'Home', path: '/' },
        ];

    return (
        <div className="fixed left-0 top-0 h-full w-20 md:w-24 bg-white dark:bg-gray-800 flex flex-col items-center py-8 z-50 border-r border-gray-200 dark:border-gray-700 rounded-r-3xl shadow-xl transition-colors duration-300">
            {/* Logo */}
            <div className="mb-12 p-2">
                <img
                    src="/logo.png"
                    alt="Clip it!"
                    className="w-14 h-14 object-contain"
                />
            </div>

            {/* Menu */}
            <div className="flex-1 flex flex-col gap-8 w-full px-4">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`relative group flex items-center justify-center w-full aspect-square rounded-2xl transition-all duration-300 ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                                }`}
                        >
                            <item.icon size={24} />
                            {isActive && (
                                <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" />
                            )}

                            {/* Tooltip */}
                            <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Logout */}
            {user && (
                <div className="mt-auto px-4 w-full">
                    <button
                        onClick={logout}
                        className="flex items-center justify-center w-full aspect-square rounded-2xl text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={24} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
