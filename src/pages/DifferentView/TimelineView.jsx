import React, { useState } from 'react';
import useStudentList from '../../hooks/useStudentsList';
import { Calendar, User, Mail, Phone, MapPin, Award } from 'lucide-react';

const TimelineView = () => {
    const { students } = useStudentList();
    const [searchTerm, setSearchTerm] = useState('');

    if (!students) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading students...</p>
                </div>
            </div>
        );
    }

    // Sort students by passing year (latest first)
    const sortedStudents = [...students].sort((a, b) => {
        const yearA = parseInt(a.passing_year) || 0;
        const yearB = parseInt(b.passing_year) || 0;
        return yearB - yearA;
    });

    const filteredStudents = sortedStudents.filter(student => {
        return !searchTerm ||
            student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.city?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Group by month/year for timeline
    const getTimelineDate = (student) => {
        const year = student.passing_year || 'Unknown';
        return `${year}`;
    };

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        Student Timeline
                    </h1>
                    <p className="text-gray-600">
                        Student achievements through the years
                    </p>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 bg-blue-200 h-full"></div>

                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">📅</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No students found
                            </h3>
                            <p className="text-gray-500">
                                Try adjusting your search
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {filteredStudents.map((student, index) => {
                                const marks = parseInt(student.marks) || 0;
                                const isEven = index % 2 === 0;

                                return (
                                    <div key={student.id} className="relative">
                                        {/* Timeline Node */}
                                        <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-blue-500 rounded-full z-10"></div>

                                        {/* Timeline Content */}
                                        <div className={`ml-16 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12' : 'md:ml-1/2 md:pl-12'}`}>
                                            {/* Timeline Date */}
                                            <div className={`mb-4 ${isEven ? 'md:text-right' : ''}`}>
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                    <Calendar size={14} />
                                                    <span className="font-semibold">{getTimelineDate(student)}</span>
                                                </div>
                                            </div>

                                            {/* Student Card */}
                                            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                                <div className="p-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                                            {student.name?.charAt(0) || 'S'}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-gray-800 text-lg">{student.name}</h3>
                                                            <div className="flex items-center gap-3 mt-2">
                                                                <div className={`px-2 py-1 rounded text-sm font-medium ${marks >= 80 ? 'bg-purple-100 text-purple-800' :
                                                                        marks >= 60 ? 'bg-green-100 text-green-800' :
                                                                            'bg-blue-100 text-blue-800'
                                                                    }`}>
                                                                    {student.marks}% Marks
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    ID: {student.id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Details */}
                                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Mail size={14} />
                                                            <span className="truncate">{student.email}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Phone size={14} />
                                                            <span>{student.phone}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <MapPin size={14} />
                                                            <span>{student.city}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Award size={14} />
                                                            <span>Passed: {student.passing_year}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimelineView;