import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Bell, Search } from 'lucide-react';
import styles from './MainLayout.module.css';

const MainLayout = () => {
    const { user } = useAuth();

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <div className={styles.searchContainer}>
                        <Search size={18} className={styles.searchIcon} />
                        <input type="text" placeholder="Search candidates, employees..." className={styles.searchInput} />
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.iconBtn}>
                            <Bell size={20} />
                            <span className={styles.badge}>3</span>
                        </button>
                        <div className={styles.userProfile}>
                            <div className={styles.avatar}>{user?.name?.charAt(0) || 'U'}</div>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{user?.name || 'User'}</span>
                                <span className={styles.userRole}>{user?.role?.replace('_', ' ') || 'Guest'}</span>
                            </div>
                        </div>
                    </div>
                </header>
                <div className={styles.scrollArea}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
