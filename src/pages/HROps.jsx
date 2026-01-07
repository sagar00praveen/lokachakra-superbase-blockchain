import React from 'react';
import { FileText, Bookmark, Mic, Globe, AlertCircle, Download } from 'lucide-react';
import styles from './HROps.module.css';

const DOCUMENTS = [
    { id: 1, title: 'Employee Handbook 2026', type: 'PDF', size: '2.4 MB', date: 'Jan 1, 2026' },
    { id: 2, title: 'Code of Conduct', type: 'PDF', size: '1.1 MB', date: 'Dec 15, 2025' },
    { id: 3, title: 'Remote Work Policy', type: 'PDF', size: '0.8 MB', date: 'Nov 20, 2025' },
    { id: 4, title: 'Leave & Attendance Policy', type: 'PDF', size: '1.5 MB', date: 'Oct 05, 2025' },
];

const ANNOUNCEMENTS = [
    { id: 1, title: 'Annual Performance Review Cycle', date: '2 days ago', priority: 'High', content: 'The 2025 performance review cycle begins next week. Please ensure all self-assessments are completed.' },
    { id: 2, title: 'New Health Insurance Benefits', date: '5 days ago', priority: 'Medium', content: 'We are switching to a new provider starting next month. View the attached guide for coverage details.' },
];

const HROps = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>HR Operations</h1>
                <button className={styles.primaryBtn}>+ Create Announcement</button>
            </div>

            <div className={styles.grid}>
                <div className={styles.mainColumn}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <AlertCircle size={20} /> Latest Announcements
                        </h2>
                        <div className={styles.announcementList}>
                            {ANNOUNCEMENTS.map(item => (
                                <div key={item.id} className={styles.announcementCard}>
                                    <div className={styles.announcementHeader}>
                                        <h3 className={styles.announcementTitle}>{item.title}</h3>
                                        <span className={`${styles.priority} ${styles[item.priority.toLowerCase()]}`}>
                                            {item.priority}
                                        </span>
                                    </div>
                                    <p className={styles.announcementContent}>{item.content}</p>
                                    <div className={styles.announcementMeta}>{item.date}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <FileText size={20} /> Policy Documents
                        </h2>
                        <div className={styles.documentGrid}>
                            {DOCUMENTS.map(doc => (
                                <div key={doc.id} className={styles.docCard}>
                                    <div className={styles.docIcon}>
                                        <FileText size={24} />
                                    </div>
                                    <div className={styles.docInfo}>
                                        <div className={styles.docTitle}>{doc.title}</div>
                                        <div className={styles.docMeta}>{doc.type} • {doc.size}</div>
                                    </div>
                                    <button className={styles.downloadBtn}>
                                        <Download size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className={styles.sideColumn}>
                    <div className={styles.quickLinks}>
                        <h3>Quick Actions</h3>
                        <button className={styles.actionLink}>
                            <Bookmark size={18} /> Generate Offer Letter
                        </button>
                        <button className={styles.actionLink}>
                            <Mic size={18} /> Schedule Interview
                        </button>
                        <button className={styles.actionLink}>
                            <Globe size={18} /> Post Job to LinkedIn
                        </button>
                    </div>

                    <div className={styles.statsWidget}>
                        <h3>Compliance Status</h3>
                        <div className={styles.complianceItem}>
                            <span>GDPR Training</span>
                            <span className={styles.success}>98% Complete</span>
                        </div>
                        <div className={styles.complianceItem}>
                            <span>Security Awareness</span>
                            <span className={styles.warning}>85% Complete</span>
                        </div>
                        <div className={styles.complianceItem}>
                            <span>POSH Certification</span>
                            <span className={styles.success}>100% Complete</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HROps;
