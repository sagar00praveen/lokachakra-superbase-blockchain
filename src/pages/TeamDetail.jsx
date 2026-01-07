import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TeamDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in-up">
            <button
                onClick={() => navigate('/admin/teams')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
                <ArrowLeft size={20} />
                Back to Overview
            </button>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 capitalize">
                    {id} Team Details
                </h1>
                <p className="text-gray-500">
                    This is a placeholder for the {id} team detailed view.
                    The metrics and specific data for this team will be displayed here.
                </p>
            </div>
        </div>
    );
};

export default TeamDetail;
