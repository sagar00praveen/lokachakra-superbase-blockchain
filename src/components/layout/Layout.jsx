import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <Sidebar />
            <Header />
            <main className="pl-64 p-8">
                <div className="container mx-auto max-w-7xl animate-fade-in-up">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
