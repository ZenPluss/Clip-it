import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans transition-colors duration-300">
            <Sidebar />

            <div className="pl-20 md:pl-24 min-h-screen flex flex-col">
                <TopBar />
                <main className="flex-grow px-8 pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
