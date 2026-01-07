export const USERS = [
    { id: 1, name: 'Alice Admin', role: 'ADMIN', email: 'admin@company.com', avatar: 'A' },
    { id: 2, name: 'Bob HR', role: 'HR', email: 'hr@company.com', avatar: 'H' },
    { id: 3, name: 'Charlie IT', role: 'IT_SUPPORT', email: 'it@company.com', avatar: 'I' },
    { id: 4, name: 'Dave Candidate', role: 'CANDIDATE', email: 'candidate@company.com', avatar: 'C' },
];

export const EMPLOYEES = [
    { id: 101, name: 'Sarah Jenkins', role: 'Product Designer', department: 'Product', status: 'Active', supervisor: 'Mike Boss', joinDate: '2023-03-12', email: 'sarah@company.com' },
    { id: 102, name: 'Michael Ross', role: 'Legal Counsel', department: 'Legal', status: 'Active', supervisor: 'Jessica Pearson', joinDate: '2022-01-15', email: 'mike@company.com' },
    { id: 103, name: 'Rachel Zane', role: 'Paralegal', department: 'Legal', status: 'On Leave', supervisor: 'Michael Ross', joinDate: '2023-06-20', email: 'rachel@company.com' },
    { id: 104, name: 'Dwight Schrute', role: 'Sales Manager', department: 'Sales', status: 'Active', supervisor: 'Michael Scott', joinDate: '2020-11-05', email: 'dwight@company.com' },
    { id: 105, name: 'Jim Halpert', role: 'Sales Exec', department: 'Sales', status: 'Active', supervisor: 'Michael Scott', joinDate: '2021-02-10', email: 'jim@company.com' },
    { id: 106, name: 'Pam Beesly', role: 'Office Admin', department: 'Admin', status: 'Active', supervisor: 'Michael Scott', joinDate: '2021-04-01', email: 'pam@company.com' },
];

export const JOBS = [
    { id: 101, title: 'Senior Frontend Developer', department: 'Engineering', status: 'Active', candidates: 12 },
    { id: 102, title: 'Product Manager', department: 'Product', status: 'Active', candidates: 8 },
    { id: 103, title: 'HR Associate', department: 'HR', status: 'Closed', candidates: 45 },
];

export const CANDIDATES = [
    { id: 1, name: 'John Doe', appliedFor: 101, stage: 'Interview', score: 85 },
    { id: 2, name: 'Jane Smith', appliedFor: 101, stage: 'Screening', score: 92 },
    { id: 3, name: 'Sam Wilson', appliedFor: 102, stage: 'Offer', score: 88 },
];

export const KPIS = {
    timeToHire: '18 days',
    openPositions: 5,
    activeCandidates: 34,
    offerAcceptanceRate: '92%',
};
