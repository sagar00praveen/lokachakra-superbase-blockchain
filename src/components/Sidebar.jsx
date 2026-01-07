import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, FileText, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <div className={styles.logo}>HR</div>
                <span className={styles.brandName}>Nexus</span>
            </div>

            <nav className={styles.nav}>
                <NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                {(user.role === 'HR' || user.role === 'ADMIN') && (
                    <>
                        <NavLink to="/recruitment" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                            <Briefcase size={20} />
                            <span>Recruitment</span>
                        </NavLink>
                        <NavLink to="/employees" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                            <Users size={20} />
                            <span>Employees</span>
                        </NavLink>
                        <NavLink to="/hrops" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                            <FileText size={20} />
                            <span>HR Ops</span>
                        </NavLink>
                    </>
                )}

                <NavLink to="/profile" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                    <UserCircle size={20} />
                    <span>My Profile</span>
                </NavLink>
            </nav>

            <div className={styles.footer}>
                <button className={styles.logoutBtn} onClick={logout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
