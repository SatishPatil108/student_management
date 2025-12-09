import React, { useState } from 'react';
import useStudentList from '../../hooks/useStudentsList';

const GalleryView = () => {
  const { students } = useStudentList();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  
  const uniqueYears = [...new Set(students?.map(s => s.passing_year).filter(Boolean))].sort();
  
  const filteredStudents = students?.filter(student => {
    const matchesSearch = !searchTerm || 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = !filterYear || student.passing_year === filterYear;
    
    return matchesSearch && matchesYear;
  }) || [];
  
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
            Student Gallery
          </h1>
          <p className="text-gray-600">
            Browse through our student directory
          </p>
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
            Showing <span className="font-bold">{filteredStudents.length}</span> of{' '}
            <span className="font-bold">{students.length}</span> students
          </div>
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-xl">
                    {student.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {student.name}
                    </h3>
                    <p className="text-blue-100 text-sm">ID: {student.id}</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Marks</span>
                    <span className="text-lg font-bold text-green-600">
                      {student.marks}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, parseInt(student.marks) || 0)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800 truncate">{student.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800">{student.phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="text-gray-800">{student.city}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Passing Year</p>
                    <p className="text-gray-800 font-medium">{student.passing_year}</p>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Status: {parseInt(student.marks) >= 75 ? 'Distinction' : 'Pass'}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Year {student.passing_year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👨‍🎓</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No students match your search
            </h3>
            <p className="text-gray-500">
              Try different search terms or clear the filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryView;