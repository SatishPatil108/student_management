import React, { useState } from 'react';
import useStudentList from '../../hooks/useStudentsList';
import { Search, Filter, Calendar, Phone, Mail, MapPin, Award } from 'lucide-react';

const KanbanView = () => {
  const { students } = useStudentList();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const uniqueYears = [...new Set(students?.map(s => s.passing_year).filter(Boolean))].sort();
  
  const filteredStudents = students?.filter(student => {
    const matchesSearch = !searchTerm || 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = !filterYear || student.passing_year === filterYear;
    
    // Tab filtering
    const marks = parseInt(student.marks) || 0;
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'distinction' && marks >= 80) ||
      (activeTab === 'good' && marks >= 60 && marks < 80) ||
      (activeTab === 'average' && marks < 60);
    
    return matchesSearch && matchesYear && matchesTab;
  }) || [];
  
  const tabs = [
    { id: 'all', label: 'All Students', count: students?.length || 0 },
    { id: 'distinction', label: 'Distinction', count: students?.filter(s => parseInt(s.marks) >= 80).length || 0 },
    { id: 'good', label: 'Good', count: students?.filter(s => parseInt(s.marks) >= 60 && parseInt(s.marks) < 80).length || 0 },
    { id: 'average', label: 'Average', count: students?.filter(s => parseInt(s.marks) < 60).length || 0 },
  ];
  
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
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Student Kanban View
          </h1>
          <p className="text-gray-600">
            View students organized by performance categories
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="font-medium">{tab.label}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-700">
            Showing <span className="font-bold">{filteredStudents.length}</span> students
            {activeTab !== 'all' && (
              <span className="ml-2 text-sm text-blue-600">
                ({tabs.find(t => t.id === activeTab)?.label})
              </span>
            )}
          </div>
        </div>
        
        {/* Kanban Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student) => {
            const marks = parseInt(student.marks) || 0;
            const cardColor = 
              marks >= 80 ? 'border-emerald-500' :
              marks >= 60 ? 'border-amber-500' :
              'border-blue-500';
            
            return (
              <div
                key={student.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${cardColor} hover:shadow-lg transition-shadow`}
              >
                {/* Card Header */}
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                      marks >= 80 ? 'bg-emerald-500' :
                      marks >= 60 ? 'bg-amber-500' :
                      'bg-blue-500'
                    }`}>
                      {student.name?.charAt(0) || 'S'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 truncate">{student.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{student.passing_year}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Performance Indicator */}
                <div className="px-4 pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Marks</span>
                    <span className={`text-lg font-bold ${
                      marks >= 80 ? 'text-emerald-600' :
                      marks >= 60 ? 'text-amber-600' :
                      'text-blue-600'
                    }`}>
                      {student.marks}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        marks >= 80 ? 'bg-emerald-500' :
                        marks >= 60 ? 'bg-amber-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, marks)}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="px-4 pb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} className="text-blue-500" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} className="text-green-500" />
                    <span>{student.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-red-500" />
                    <span>{student.city}</span>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      ID: {student.id}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      marks >= 80 ? 'bg-emerald-100 text-emerald-800' :
                      marks >= 60 ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {marks >= 80 ? 'Distinction' :
                       marks >= 60 ? 'Good' : 'Average'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No students found in this category
            </h3>
            <p className="text-gray-500">
              Try selecting a different category or adjust your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanView;