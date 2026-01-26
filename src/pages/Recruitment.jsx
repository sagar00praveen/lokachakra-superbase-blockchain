import React, { useState } from 'react';
import { Plus, MoreHorizontal, Calendar, User } from 'lucide-react';
import { fetchCandidates } from '../services/api';
import styles from './Recruitment.module.css';

const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

const CandidateCard = ({ candidate }) => (
    <div className={styles.candidateCard}>
        <div className={styles.cardHeader}>
            <span className={styles.candidateName}>{candidate.name}</span>
            <button className={styles.moreBtn}><MoreHorizontal size={16} /></button>
        </div>
        <div className={styles.cardBody}>
            <div className={styles.roleApplied}>Senior Frontend Dev</div>
            <div className={styles.score}>Score: {candidate.score}</div>
        </div>
        <div className={styles.cardFooter}>
            <div className={styles.meta}>
                <Calendar size={14} />
                <span>2d ago</span>
            </div>
            <div className={styles.avatar}>{candidate.name.charAt(0)}</div>
        </div>
    </div>
);

const Recruitment = () => {
    const [candidates, setCandidates] = useState([]);

    React.useEffect(() => {
        const loadCandidates = async () => {
            try {
                const data = await fetchCandidates();
                if (data) setCandidates(data);
            } catch (error) {
                console.error("Failed to load candidates", error);
            }
        };
        loadCandidates();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Recruitment Pipeline</h1>
                <button className={styles.addBtn}>
                    <Plus size={18} />
                    <span>Add Candidate</span>
                </button>
            </div>

            <div className={styles.board}>
                {STAGES.map(stage => (
                    <div key={stage} className={styles.column}>
                        <div className={styles.columnHeader}>
                            <h3 className={styles.columnTitle}>{stage}</h3>
                            <span className={styles.count}>
                                {candidates.filter(c => c.stage === stage).length}
                            </span>
                        </div>
                        <div className={styles.columnContent}>
                            {candidates
                                .filter(c => c.stage === stage)
                                .map(candidate => (
                                    <CandidateCard key={candidate.id} candidate={candidate} />
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recruitment;
