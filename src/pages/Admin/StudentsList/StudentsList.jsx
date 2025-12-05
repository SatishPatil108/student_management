import React, { useEffect, useState } from 'react'
import CustomDrawer from '../../../components/CustomDrawer/CustomDrawer';
import {
    Plus,
    Eye,
    Edit2,
    Trash2,
    User,
    Mail,
    Phone,
    Users,
    UserPlus,
    X,
    Check
} from 'lucide-react';
import useStudentList from '../../../hooks/useStudentsList';

const StudentsList = () => {
    const { 
        students, 
        allFields,
        handleAddStudent, 
        handleEditStudent, 
        handleDeleteStudent 
    } = useStudentList();
    
    // drawer and other state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [firstError, setFirstError] = useState(null);

    // Initialize form based on fields
    const initializeForm = () => {
        const initialForm = {};
        allFields.forEach(field => {
            initialForm[field.key] = '';
        });
        return initialForm;
    };

    // Form states
    const [studentForm, setStudentForm] = useState(initializeForm());

    // Handle change for form inputs
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === 'file') {
            setStudentForm({ ...studentForm, [name]: files[0] });
        } else {
            setStudentForm({ ...studentForm, [name]: value });
        }
    };

    // Add Student
    const handleAddBtnClick = () => {
        setEditingStudent(false);
        setShowForm(true);
        setIsDrawerOpen(true);
        resetForm();
    };

    const resetForm = () => {
        setStudentForm(initializeForm());
        setErrors({});
        setFirstError(null);
    };

    // Validation based on field configurations
    const validateForm = () => {
        let isValid = true;
        const errors = {};

        allFields.forEach(field => {
            const value = studentForm[field.key] || '';
            
            if (field.required && !value.trim()) {
                errors[field.key] = `${field.label} is required.`;
                isValid = false;
            } else if (field.type === 'email' && value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors[field.key] = "Enter a valid email address.";
                    isValid = false;
                }
            } else if (field.type === 'tel' && value.trim()) {
                const phoneRegex = /^\d{10}$/;
                if (!phoneRegex.test(value)) {
                    errors[field.key] = "Phone number must be exactly 10 digits.";
                    isValid = false;
                }
            }
        });

        return { errors, isValid };
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const validation = validateForm();

        if (!validation.isValid) {
            setErrors(validation.errors);
            const firstErrorKey = Object.keys(validation.errors)[0];
            setFirstError(firstErrorKey);
            return;
        }

        if (editingStudent) {
            handleEditStudent(studentForm);
        } else {
            handleAddStudent(studentForm);
        }

        resetForm();
        setShowForm(false);
        setIsDrawerOpen(false);
    };

    useEffect(() => {
        if (firstError) {
            const el = document.querySelector(`[name="${firstError}"]`);
            if (el) {
                setTimeout(() => {
                    el.focus();
                    el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
            }
        }
    }, [firstError]);

    // Handle edit student
    const handleEditBtnClick = (student) => {
        const formData = { ...student };
        
        // Ensure all fields are present in the form
        allFields.forEach(field => {
            if (!(field.key in formData)) {
                formData[field.key] = '';
            }
        });
        
        setStudentForm(formData);
        setEditingStudent(true);
        setShowForm(true);
        setIsDrawerOpen(true);
    };

    // Handle view student details
    const handleViewStudent = (student) => {
        const formData = { ...student };
        
        // Ensure all fields are present in the form
        allFields.forEach(field => {
            if (!(field.key in formData)) {
                formData[field.key] = '';
            }
        });
        
        setStudentForm(formData);
        setEditingStudent(false);
        setShowForm(false);
        setIsDrawerOpen(true);
    };

    // Handle delete student
    const handleDeleteBtnClick = (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            handleDeleteStudent(id);
        }
    };

    // Render input field based on type
    const renderInputField = (field) => {
        const commonProps = {
            name: field.key,
            value: studentForm[field.key] || '',
            onChange: handleChange,
            autoFocus: firstError === field.key,
            placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
            className: `w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700
                placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                ${errors[field.key] 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-300 dark:border-gray-600 focus:ring-purple-500 hover:border-purple-400"
                }`,
        };

        switch (field.type) {
            case 'email':
                return <input type="email" {...commonProps} />;
            case 'tel':
                return <input type="tel" {...commonProps} />;
            case 'number':
                return <input type="number" {...commonProps} />;
            case 'textarea':
                return <textarea {...commonProps} rows={3} />;
            case 'select':
                return (
                    <select {...commonProps}>
                        <option value="">Select {field.label}</option>
                        {field.options?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            case 'file':
                return <input type="file" {...commonProps} />;
            default:
                return <input type="text" {...commonProps} />;
        }
    };

    // Get icon for field type
    const getFieldIcon = (type) => {
        switch (type) {
            case 'email':
                return <Mail className="h-5 w-5 text-gray-400" />;
            case 'tel':
                return <Phone className="h-5 w-5 text-gray-400" />;
            default:
                return <User className="h-5 w-5 text-gray-400" />;
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                Students
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                                Manage your students and their information
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleAddBtnClick}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Student
                    </button>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Student
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Contact Information
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 shrink-0 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                                                <User className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {student.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    Student ID: #{student.id.toString().padStart(4, '0')}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white mb-1">
                                            <Mail className="w-4 h-4" />
                                            {student.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <Phone className="w-4 h-4" />
                                            {student.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleViewStudent(student)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleEditBtnClick(student)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBtnClick(student.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {students.length === 0 && (
                    <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 text-gray-400 dark:text-gray-500 mb-4">
                            <UserPlus className="w-full h-full" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No students found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by adding your first student</p>
                        <button
                            onClick={handleAddBtnClick}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            <Plus className="w-5 h-5" />
                            Add Student
                        </button>
                    </div>
                )}
            </div>

            {/* Drawer */}
            <CustomDrawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    resetForm();
                }}
                title={showForm ? (editingStudent ? "Edit Student" : "Add New Student") : "Student Details"}
                footer={
                    showForm ? (
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDrawerOpen(false);
                                    resetForm();
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                            >
                                <Check className="w-4 h-4" />
                                {editingStudent ? 'Update Student' : 'Save Student'}
                            </button>
                        </div>
                    ) : null
                }
            >
                {showForm ? (
                    <form
                        className="flex-1 overflow-y-auto space-y-6 p-1"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {allFields.map((field) => (
                                <div 
                                    key={field.id} 
                                    className={field.type === 'textarea' ? 'lg:col-span-2' : ''}
                                >
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            {getFieldIcon(field.type)}
                                        </div>
                                        {renderInputField(field)}
                                    </div>
                                    {errors[field.key] && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                            {errors[field.key]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 shrink-0 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                                <User className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {studentForm.name}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">Student Profile</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {allFields.map((field) => (
                                studentForm[field.key] && (
                                    <div key={field.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                                            {getFieldIcon(field.type)}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{field.label}</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {studentForm[field.key]}
                                            </p>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                )}
            </CustomDrawer>
        </div>
    )
}

export default StudentsList;