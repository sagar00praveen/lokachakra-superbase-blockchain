import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};

export const DashboardProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentRole, setCurrentRole] = useState(null); // 'hr', 'it', 'candidate', 'admin'
    const [user, setUser] = useState(null);

    // Check for saved session on mount
    useEffect(() => {
        const savedRole = localStorage.getItem('userRole');
        const savedUser = localStorage.getItem('userData');
        if (savedRole && savedUser) {
            setCurrentRole(savedRole);
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
    }, []);

    const login = (role, userData) => {
        setCurrentRole(role);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    const logout = () => {
        setCurrentRole(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <DashboardContext.Provider value={{
            activeTab,
            setActiveTab,
            sidebarOpen,
            toggleSidebar,
            user,
            setUser,
            isAuthenticated,
            currentRole,
            login,
            logout
        }}>
            {children}
        </DashboardContext.Provider>
    );
};
