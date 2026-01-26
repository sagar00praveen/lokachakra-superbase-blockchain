import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Mail, Phone, Edit2, X } from 'lucide-react';
import { fetchEmployees } from '../services/api';
import styles from './Employees.module.css';

const Employees = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [employees, setEmployees] = useState([]);

    React.useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await fetchEmployees();
                if (data && data.length > 0) {
                    setEmployees(data);
                }
            } catch (error) {
                console.error("Failed to fetch employees", error);
            }
        };
        loadEmployees();
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        role: '',
        department: '',
        email: '',
        password: '',
        phone: '',
        status: 'Active',
        joinDate: new Date().toISOString().split('T')[0]
    });

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = filterDept === 'All' || emp.department === filterDept;
        return matchesSearch && matchesDept;
    });

    const departments = ['All', ...new Set(employees.map(e => e.department))];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddEmployee = (e) => {
        e.preventDefault();
        const employee = {
            id: employees.length + 101, // Simple ID generation
            ...newEmployee,
            supervisor: 'Unassigned', // Default
        };

        setEmployees(prev => [...prev, employee]);
        setIsModalOpen(false);
        setNewEmployee({
            name: '',
            role: '',
            department: '',
            email: '',
            password: '',
            phone: '',
            status: 'Active',
            joinDate: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Employee Directory</h1>
                <div className={styles.actions}>
                    <div className={styles.searchBox}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className={styles.input}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className={styles.filterSelect}
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <button
                        className={styles.addBtn}
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Create Employee
                    </button>

                </div>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Contact</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(emp => (
                            <tr key={emp.id}>
                                <td>
                                    <div className={styles.userCell}>
                                        <div className={styles.avatar}>{emp.name.charAt(0)}</div>
                                        <div>
                                            <div className={styles.userName}>{emp.name}</div>
                                            <div className={styles.userEmail}>{emp.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{emp.role}</td>
                                <td>{emp.department}</td>
                                <td>
                                    <span className={`${styles.status} ${styles[emp.status.replace(' ', '').toLowerCase()]}`}>
                                        {emp.status}
                                    </span>
                                </td>
                                <td>{new Date(emp.joinDate).toLocaleDateString()}</td>
                                <td>
                                    <div className={styles.contactIcons}>
                                        <button className={styles.iconBtn}><Mail size={16} /></button>
                                        <button className={styles.iconBtn}><Phone size={16} /></button>
                                    </div>
                                </td>
                                <td>
                                    <button className={styles.iconBtn}><MoreVertical size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Employee Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={(e) => {
                    if (e.target === e.currentTarget) setIsModalOpen(false);
                }}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Add New Employee</h2>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddEmployee}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup}>
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newEmployee.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Role</label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={newEmployee.role}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g. Designer"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Department</label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={newEmployee.department}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g. Product"
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newEmployee.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="john@company.com"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={newEmployee.password}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter password"
                                        minLength="6"
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Start Date</label>
                                        <input
                                            type="date"
                                            name="joinDate"
                                            value={newEmployee.joinDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Status</label>
                                        <select
                                            name="status"
                                            value={newEmployee.status}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="On Leave">On Leave</option>
                                            <option value="Terminated">Terminated</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.formActions}>
                                    <button
                                        type="button"
                                        className={styles.cancelBtn}
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.submitBtn}
                                    >
                                        Create Employee
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
