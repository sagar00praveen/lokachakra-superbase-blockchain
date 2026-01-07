import React from 'react';
import { cn } from '../../lib/utils';
import { ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, count, subtitle, icon: Icon, className, iconBgClass }) => {
    return (
        <div className={cn("bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300", className)}>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 mb-1 tracking-wide">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">{count}</h3>

                    <div className="flex items-center gap-2">
                        <span className={cn("text-xs font-medium px-2.5 py-1 rounded-lg",
                            subtitle.includes("0") && !subtitle.includes("active") ? "bg-red-50 text-red-600" :
                                subtitle.includes("progress") ? "bg-amber-50 text-amber-600" :
                                    "bg-emerald-50 text-emerald-600"
                        )}>
                            {subtitle}
                        </span>
                    </div>
                </div>

                {Icon && (
                    <div className={cn("p-3.5 rounded-xl shadow-inner", iconBgClass || "bg-gray-50 text-gray-400")}>
                        <Icon size={24} strokeWidth={2.5} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
