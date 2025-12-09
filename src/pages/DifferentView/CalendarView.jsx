import React, { useState } from 'react';
import useStudentList from '../../hooks/useStudentsList';

const CalendarView = () => {
  const { students } = useStudentList();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  // Get students for selected date (simplified)
  const getStudentsForDate = (date) => {
    // For demo, distribute students across month based on ID
    const dayOfMonth = date.getDate();
    return students.filter(student => {
      const studentDay = (student.id % 28) + 1;
      return studentDay === dayOfMonth;
    });
  };

  // Generate calendar
  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const days = [];
    
    // Previous month
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1, prevMonthDays - i);
      days.push({
        date,
        isCurrentMonth: false,
        students: []
      });
    }
    
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      days.push({
        date,
        isCurrentMonth: true,
        students: getStudentsForDate(date)
      });
    }
    
    // Next month
    const totalCells = 42; // 6 weeks
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(currentYear, currentMonth + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        students: []
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendar();
  const selectedDayStudents = getStudentsForDate(selectedDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Student Calendar
          </h1>
          <p className="text-gray-600">
            View student distribution across the month
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-blue-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-blue-700 rounded"
                  >
                    ←
                  </button>
                  <h2 className="text-xl font-bold">
                    {monthNames[currentMonth]} {currentYear}
                  </h2>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-blue-700 rounded"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b">
                {dayNames.map(day => (
                  <div key={day} className="p-3 text-center font-semibold text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((dayData, index) => {
                  const dayIsToday = isToday(dayData.date);
                  const dayIsSelected = isSelected(dayData.date);

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(dayData.date)}
                      className={`min-h-[100px] border border-gray-100 p-2 cursor-pointer transition-colors
                        ${!dayData.isCurrentMonth ? 'bg-gray-50' : ''}
                        ${dayIsToday ? 'bg-blue-50' : ''}
                        ${dayIsSelected ? 'bg-blue-100 border-blue-300' : ''}
                        hover:bg-gray-50`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium ${
                          dayData.isCurrentMonth
                            ? dayIsToday ? 'text-blue-600' : 'text-gray-800'
                            : 'text-gray-400'
                        }`}>
                          {dayData.date.getDate()}
                        </span>
                        {dayIsToday && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">
                            Today
                          </span>
                        )}
                      </div>

                      {/* Student Dots */}
                      <div className="flex flex-wrap gap-1">
                        {dayData.students.slice(0, 4).map((student, idx) => {
                          const marks = parseInt(student.marks) || 0;
                          return (
                            <div
                              key={idx}
                              title={`${student.name} - ${student.marks}%`}
                              className={`w-2 h-2 rounded-full ${
                                marks >= 80 ? 'bg-purple-500' :
                                marks >= 60 ? 'bg-green-500' :
                                'bg-blue-500'
                              }`}
                            ></div>
                          );
                        })}
                        {dayData.students.length > 4 && (
                          <span className="text-xs text-gray-500">
                            +{dayData.students.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Day Students */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>

            {selectedDayStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No students for this day
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDayStudents.map(student => {
                  const marks = parseInt(student.marks) || 0;
                  return (
                    <div
                      key={student.id}
                      className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          marks >= 80 ? 'bg-purple-500' :
                          marks >= 60 ? 'bg-green-500' :
                          'bg-blue-500'
                        }`}>
                          {student.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{student.name}</h4>
                          <p className="text-sm text-gray-600">ID: {student.id}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Marks</span>
                          <span className={`font-bold ${
                            marks >= 80 ? 'text-purple-600' :
                            marks >= 60 ? 'text-green-600' :
                            'text-blue-600'
                          }`}>
                            {student.marks}%
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 truncate">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Color Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <div>
                <p className="font-medium">Distinction</p>
                <p className="text-sm text-gray-600">80% and above</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <div>
                <p className="font-medium">Good</p>
                <p className="text-sm text-gray-600">60% - 79%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <div>
                <p className="font-medium">Average</p>
                <p className="text-sm text-gray-600">Below 60%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;