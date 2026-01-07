import React, { useState } from 'react';
import { User, MapPin, Phone, Plus, Trash2, Save, ArrowLeft, Heart, Calendar, Mail, Globe, Hash } from 'lucide-react';

const PersonalInformation = () => {
    // State for Emergency Contacts to handle dynamic addition/removal
    const [emergencyContacts, setEmergencyContacts] = useState([
        { id: 1, name: '', relationship: '', phone: '' }
    ]);

    const addContact = () => {
        setEmergencyContacts([...emergencyContacts, { id: Date.now(), name: '', relationship: '', phone: '' }]);
    };

    const removeContact = (id) => {
        if (emergencyContacts.length > 1) {
            setEmergencyContacts(emergencyContacts.filter(c => c.id !== id));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-12">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-8 -mb-8"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Personal Information</h1>
                    <p className="text-indigo-100 text-lg">
                        Please update your personal details to complete your file.
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Basic Details Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    <div className="px-8 py-6 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <User size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Basic Details</h3>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-gray-600 ml-1">Full Name <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input type="text" className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-gray-700" placeholder="e.g. John Doe" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 ml-1">Email <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input type="email" className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-gray-700" placeholder="john@company.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 ml-1">Phone Number <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input type="tel" className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-gray-700" placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 ml-1">Date of Birth <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input type="date" className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-gray-700" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 ml-1">Gender <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <User size={18} />
                                </div>
                                <select className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-gray-700 appearance-none">
                                    <option>Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 ml-1">Marital Status</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <Heart size={18} />
                                </div>
                                <select className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-gray-700 appearance-none">
                                    <option>Select Status</option>
                                    <option>Single</option>
                                    <option>Married</option>
                                    <option>Divorced</option>
                                    <option>Widowed</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 ml-1">Blood Group</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <Hash size={18} />
                                </div>
                                <select className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-gray-700 appearance-none">
                                    <option>Select Group</option>
                                    <option>A+</option>
                                    <option>O+</option>
                                    <option>B+</option>
                                    <option>AB+</option>
                                    <option>A-</option>
                                    <option>O-</option>
                                    <option>B-</option>
                                    <option>AB-</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Address Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    <div className="px-8 py-6 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <MapPin size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Current Address</h3>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600 ml-1">Street Address <span className="text-red-500">*</span></label>
                            <input type="text" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-gray-700" placeholder="123 Main St, Apt 4B" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 ml-1">City <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-gray-700" placeholder="New York" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 ml-1">State/Province <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-gray-700" placeholder="NY" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 ml-1">Zip/Postal Code <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-gray-700" placeholder="10001" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Emergency Contacts Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    <div className="px-8 py-6 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                                <Phone size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Emergency Contacts</h3>
                        </div>
                        <button
                            onClick={addContact}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                        >
                            <Plus size={16} /> Add Contact
                        </button>
                    </div>

                    <div className="p-8 space-y-6">
                        {emergencyContacts.map((contact) => (
                            <div key={contact.id} className="p-6 rounded-2xl bg-gray-50/80 border border-gray-100 relative group hover:border-indigo-100 hover:bg-white transition-all duration-300 shadow-sm">
                                {emergencyContacts.length > 1 && (
                                    <button
                                        onClick={() => removeContact(contact.id)}
                                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="Remove Contact"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Contact Name</label>
                                        <input type="text" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium" placeholder="Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Relationship</label>
                                        <input type="text" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium" placeholder="e.g. Spouse" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                                        <input type="tel" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-medium" placeholder="+1..." />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <button className="px-8 py-4 text-gray-600 font-bold rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center gap-2">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <button className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center gap-2">
                        <Save size={20} /> Save & Continue
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PersonalInformation;
