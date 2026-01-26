import { Users, Monitor, FileText, Shield } from './Icons';

/**
 * Portal card icons configuration
 * Maps each portal type to its corresponding icon component and styling
 */
export const portalIcons = {
    hr: {
        icon: Users,
        className: 'hr-icon',
    },
    it: {
        icon: Monitor,
        className: 'it-icon',
    },
    candidate: {
        icon: FileText,
        className: 'candidate-icon',
    },
    admin: {
        icon: Shield,
        className: 'admin-icon',
    },
};

/**
 * Portal metadata for display
 */
export const portalInfo = {
    hr: {
        title: 'HR Portal',
        subtitle: 'HR',
        formTitle: 'HR Login',
        formSubtitle: 'Access HR management system',
    },
    it: {
        title: 'IT Portal',
        subtitle: 'Technical Support',
        formTitle: 'IT Login',
        formSubtitle: 'Access IT support dashboard',
    },
    candidate: {
        title: 'Candidate Portal',
        subtitle: 'Job Applications',
        formTitle: 'Candidate Login',
        formSubtitle: 'View your applications',
    },
    admin: {
        title: 'Admin Portal',
        subtitle: 'System Administration',
        formTitle: 'Admin Login',
        formSubtitle: 'Restricted access only',
        isRestricted: true,
    },
};

export default portalInfo;
