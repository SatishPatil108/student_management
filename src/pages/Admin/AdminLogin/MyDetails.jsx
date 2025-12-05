import React from 'react'
import useMyDetails from '../../../hooks/useMyDetails';
import { 
    User, 
    Mail, 
    Phone, 
    Award, 
    Hash,
    RefreshCw,
    AlertCircle,
    Loader
} from 'lucide-react';

const MyDetails = () => {
    const { myDetails, loading, error, refreshDetails } = useMyDetails();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading your details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Error Loading Details</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={refreshDetails}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!myDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Details Found</h2>
                    <p className="text-gray-600 dark:text-gray-400">Your profile details are not available.</p>
                </div>
            </div>
        );
    }

    const details = [
        { icon: <Hash className="w-5 h-5" />, label: "Student ID", value: myDetails.id || "N/A", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
        { icon: <User className="w-5 h-5" />, label: "Full Name", value: myDetails.name, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
        { icon: <Mail className="w-5 h-5" />, label: "Email Address", value: myDetails.email, color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
        { icon: <Phone className="w-5 h-5" />, label: "Phone Number", value: myDetails.phone || "Not provided", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
        { icon: <Award className="w-5 h-5" />, label: "Marks", value: myDetails.marks || "Not available", color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                My Profile
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                View and manage your personal details
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={refreshDetails}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Refresh
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="h-24 w-24 shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
                                <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">
                                        {myDetails.name?.charAt(0) || "U"}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    {myDetails.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {myDetails.role || "Student"}
                                </p>
                            </div>
                        </div>
                        
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg">
                            <Hash className="w-5 h-5" />
                            <span className="font-semibold">ID: #{myDetails.id?.toString().padStart(4, '0') || '0000'}</span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {details.map((item, index) => (
                            <div 
                                key={index}
                                className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-2 rounded-lg ${item.color}`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                        {item.label}
                                    </h3>
                                </div>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Additional Information */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Account Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Account Status</p>
                                <div className="inline-flex items-center gap-2">
                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                    <span className="font-medium text-gray-900 dark:text-white">Active</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Updated</p>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {new Date().toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards (Optional) */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                {myDetails.marks || "0"}
                            </span>
                        </div>
                        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wide">
                            Total Marks
                        </h3>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-6 rounded-2xl border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-lg">
                                <User className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                                Student
                            </span>
                        </div>
                        <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 uppercase tracking-wide">
                            User Role
                        </h3>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 p-6 rounded-2xl border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
                                <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                Verified
                            </span>
                        </div>
                        <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 uppercase tracking-wide">
                            Email Status
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyDetails;