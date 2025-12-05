import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
    Upload, Plus, Trash2, ChevronDown, ChevronUp, X, Check, 
    List, Type, Hash, Calendar, Lock, User, Mail, Phone 
} from 'lucide-react';
import useCustomFields from '../../../hooks/useCustomFields';

const CustomFields = () => {
    const {
        fields,
        defaultFields,
        error,
        addField,           // Changed from addNewField
        removeField,
        updateField,
        addOption,
        updateOption,
        removeOption,
        saveCustomFields    // This function doesn't take parameters
    } = useCustomFields();

    const [expandedField, setExpandedField] = useState(null);
    const [saveStatus, setSaveStatus] = useState({ type: null, message: '' });

    const fieldTypes = useMemo(() => [
        { value: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
        { value: 'number', label: 'Number', icon: <Hash className="w-4 h-4" /> },
        { value: 'date', label: 'Date', icon: <Calendar className="w-4 h-4" /> },
        { value: 'dropdown', label: 'Dropdown', icon: <List className="w-4 h-4" /> },
        { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
        { value: 'tel', label: 'Phone', icon: <Phone className="w-4 h-4" /> },
        { value: 'file', label: 'File Upload', icon: <Upload className="w-4 h-4" /> },
    ], []);

    const toggleExpand = useCallback((fieldId) => {
        setExpandedField(prev => prev === fieldId ? null : fieldId);
    }, []);

    const generateKeyFromLabel = useCallback((label) => {
        if (!label || label.trim() === '') return 'untitled_field';
        return label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    }, []);

    const handleLabelChange = useCallback((fieldId, label) => {
        const key = generateKeyFromLabel(label);
        updateField(fieldId, { label, key });
    }, [generateKeyFromLabel, updateField]);

    const handleDefaultValueChange = useCallback((fieldId, value) => {
        updateField(fieldId, { defaultValue: value });
    }, [updateField]);

    const renderFieldIcon = useCallback((type) => {
        switch (type) {
            case 'text': return <Type className="w-4 h-4" />;
            case 'number': return <Hash className="w-4 h-4" />;
            case 'date': return <Calendar className="w-4 h-4" />;
            case 'dropdown': return <List className="w-4 h-4" />;
            case 'email': return <Mail className="w-4 h-4" />;
            case 'tel': return <Phone className="w-4 h-4" />;
            case 'file': return <Upload className="w-4 h-4" />;
            default: return <Type className="w-4 h-4" />;
        }
    }, []);

    const handleTypeChange = useCallback((fieldId, newType) => {
        const updates = { type: newType };
        // Clear options if changing from dropdown to another type
        if (newType !== 'dropdown') {
            updates.options = [];
            updates.defaultValue = '';
        }
        updateField(fieldId, updates);
    }, [updateField]);

    const renderDefaultValueInput = useCallback((field) => {
        switch (field.type) {
            case 'text':
            case 'number':
            case 'email':
            case 'tel':
                return (
                    <input
                        type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
                        value={field.defaultValue || ''}
                        onChange={(e) => handleDefaultValueChange(field.id, e.target.value)}
                        placeholder="Enter default value"
                        className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                        aria-label={`Default value for ${field.label || 'field'}`}
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        value={field.defaultValue || ''}
                        onChange={(e) => handleDefaultValueChange(field.id, e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                        aria-label={`Default date for ${field.label || 'field'}`}
                    />
                );
            case 'dropdown':
                return (
                    <select
                        value={field.defaultValue || ''}
                        onChange={(e) => handleDefaultValueChange(field.id, e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                        aria-label={`Default option for ${field.label || 'field'}`}
                    >
                        <option value="">Select default value</option>
                        {(field.options || []).map((option, index) => (
                            <option key={index} value={option}>
                                {option || `Option ${index + 1}`}
                            </option>
                        ))}
                    </select>
                );
            case 'file':
                return (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Default value not available for file upload fields
                    </div>
                );
            default:
                return null;
        }
    }, [handleDefaultValueChange]);

    const handleSave = useCallback(async () => {
        try {
            setSaveStatus({ type: 'loading', message: 'Saving fields...' });
            
            const result = await saveCustomFields();
            console.log(result)
            
            if (result) {
                alert("Fields saved successfully!")
                setSaveStatus({ type: 'success', message: 'Fields saved successfully!' });
                // Clear success message after 3 seconds
                setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
            } else {
                setSaveStatus({ type: 'error', message: 'Failed to save fields. Please try again.' });
            }
        } catch (error) {
            console.error('Failed to save fields:', error);
            setSaveStatus({ type: 'error', message: 'An error occurred while saving fields.' });
        }
        console.log(saveStatus)
    }, [saveCustomFields]);

    // Show error from hook if exists
    useEffect(() => {
        if (error) {
            setSaveStatus({ type: 'error', message: error });
        }
    }, [error]);

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                            Custom Fields
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
                            Manage custom fields for student information
                        </p>
                    </div>
                    <button
                        onClick={addField}  // Changed from addNewField to addField
                        className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 md:py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 min-h-11"
                        aria-label="Add new field"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Add New Field</span>
                    </button>
                </div>

                {/* Save Status Messages */}
                {saveStatus.type && (
                    <div className={`mb-4 p-4 rounded-lg ${saveStatus.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 
                        saveStatus.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 
                        'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'}`}>
                        <div className="flex items-center gap-3">
                            {saveStatus.type === 'success' && (
                                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                            )}
                            {saveStatus.type === 'error' && (
                                <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                            )}
                            {saveStatus.type === 'loading' && (
                                <div className="w-5 h-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                            )}
                            <p className={`text-sm font-medium ${saveStatus.type === 'success' ? 'text-green-800 dark:text-green-300' : 
                                saveStatus.type === 'error' ? 'text-red-800 dark:text-red-300' : 
                                'text-blue-800 dark:text-blue-300'}`}>
                                {saveStatus.message}
                            </p>
                        </div>
                    </div>
                )}

                {/* Stats Cards - Responsive grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                                <Type className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">System Fields</p>
                                <p className="text-base sm:text-lg md:text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    {defaultFields?.length || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                                <List className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">Custom Fields</p>
                                <p className="text-base sm:text-lg md:text-2xl font-bold text-green-700 dark:text-green-300">
                                    {fields?.length || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">Required Fields</p>
                                <p className="text-base sm:text-lg md:text-2xl font-bold text-purple-700 dark:text-purple-300">
                                    {[...(defaultFields || []), ...(fields || [])].filter(f => f?.required).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400">Total Fields</p>
                                <p className="text-base sm:text-lg md:text-2xl font-bold text-orange-700 dark:text-orange-300">
                                    {(defaultFields?.length || 0) + (fields?.length || 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* System Fields */}
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        System Fields (Read Only)
                    </h3>
                    <div className="space-y-3">
                        {defaultFields?.length === 0 ? (
                            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-500 dark:text-gray-400">No system fields available</p>
                            </div>
                        ) : (
                            defaultFields?.map((field) => (
                                <div
                                    key={field.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0">
                                            {field.type === 'email' ? (
                                                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                                            ) : field.type === 'tel' ? (
                                                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                                            ) : (
                                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                                    {field.label}
                                                </h4>
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded whitespace-nowrap">
                                                    {field.type}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-1 mt-1">
                                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    Key: {field.key}
                                                </span>
                                                {field.required && (
                                                    <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded whitespace-nowrap">
                                                        Required
                                                    </span>
                                                )}
                                                <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded whitespace-nowrap">
                                                    System
                                                </span>
                                            </div>
                                        </div>
                                        <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Custom Fields */}
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Custom Fields
                    </h3>
                    <div className="space-y-3">
                        {!fields || fields.length === 0 ? (
                            <div className="text-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500 mb-3 sm:mb-4">
                                    <List className="w-full h-full" />
                                </div>
                                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No custom fields added
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 px-4 max-w-md mx-auto">
                                    Add custom fields to collect additional information from students
                                </p>
                                <button
                                    onClick={addField}  // Changed from addNewField to addField
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 min-h-11"
                                    aria-label="Add first custom field"
                                >
                                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>Add Your First Field</span>
                                </button>
                            </div>
                        ) : (
                            fields.map((field) => (
                                <div
                                    key={field.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                                >
                                    <div
                                        className="flex items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors min-h-[72px]"
                                        onClick={() => toggleExpand(field.id)}
                                        aria-expanded={expandedField === field.id}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && toggleExpand(field.id)}  // Fixed: onKeyPress → onKeyDown
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg shrink-0">
                                                {renderFieldIcon(field.type)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                                    {field.label || 'Untitled Field'}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded truncate max-w-[120px] sm:max-w-none">
                                                        {field.key}
                                                    </span>
                                                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded whitespace-nowrap">
                                                        {field.type}
                                                    </span>
                                                    {field.required && (
                                                        <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded whitespace-nowrap">
                                                            Required
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Are you sure you want to delete this field?')) {
                                                        removeField(field.id);
                                                    }
                                                }}
                                                className="p-1.5 sm:p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-h-9 min-w-9 flex items-center justify-center"
                                                aria-label={`Delete ${field.label || 'field'}`}
                                                title="Delete field"
                                            >
                                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                            {expandedField === field.id ? (
                                                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            )}
                                        </div>
                                    </div>

                                    {expandedField === field.id && (
                                        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Field Label *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={field.label || ''}
                                                        onChange={(e) => handleLabelChange(field.id, e.target.value)}
                                                        placeholder="Enter field label"
                                                        className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                                                        aria-required="true"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Field Type *
                                                    </label>
                                                    <select
                                                        value={field.type}
                                                        onChange={(e) => handleTypeChange(field.id, e.target.value)}
                                                        className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                                                        aria-required="true"
                                                    >
                                                        {fieldTypes.map((type) => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="flex items-center">
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.required || false}
                                                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                            className="sr-only"
                                                        />
                                                        <div className={`relative w-10 h-5 rounded-full transition-colors ${field.required ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${field.required ? 'transform translate-x-5' : ''}`} />
                                                        </div>
                                                        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Required
                                                        </span>
                                                    </label>
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Default Value
                                                    </label>
                                                    {renderDefaultValueInput(field)}
                                                </div>

                                                {field.type === 'dropdown' && (
                                                    <div className="md:col-span-2">
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                Dropdown Options
                                                            </label>
                                                            <button
                                                                type="button"
                                                                onClick={() => addOption(field.id)}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-md transition-colors whitespace-nowrap"
                                                                aria-label="Add option"
                                                            >
                                                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                Add Option
                                                            </button>
                                                        </div>

                                                        <div className="space-y-2">
                                                            {(field.options || []).map((option, index) => (
                                                                <div key={index} className="flex items-center gap-2">
                                                                    <div className="flex-1">
                                                                        <input
                                                                            type="text"
                                                                            value={option || ''}
                                                                            onChange={(e) => updateOption(field.id, index, e.target.value)}
                                                                            placeholder={`Option ${index + 1}`}
                                                                            className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                                                                            aria-label={`Option ${index + 1}`}
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeOption(field.id, index)}
                                                                        className="p-1.5 sm:p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-h-9 min-w-9 flex items-center justify-center"
                                                                        disabled={(field.options || []).length <= 1}
                                                                        aria-label={`Remove option ${index + 1}`}
                                                                        title="Remove option"
                                                                    >
                                                                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                                                    Field Preview
                                                </h5>
                                                <div className="max-w-md">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {field.label || 'Field Label'} {field.required && <span className="text-red-500">*</span>}
                                                    </label>
                                                    {field.type === 'text' && (
                                                        <input
                                                            type="text"
                                                            placeholder="Enter text here"
                                                            className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                                                            disabled
                                                            aria-label="Field preview"
                                                        />
                                                    )}
                                                    {field.type === 'number' && (
                                                        <input
                                                            type="number"
                                                            placeholder="Enter number here"
                                                            className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                                                            disabled
                                                            aria-label="Field preview"
                                                        />
                                                    )}
                                                    {field.type === 'date' && (
                                                        <input
                                                            type="date"
                                                            className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                                                            disabled
                                                            aria-label="Field preview"
                                                        />
                                                    )}
                                                    {field.type === 'dropdown' && (
                                                        <select
                                                            className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                                                            disabled
                                                            aria-label="Field preview"
                                                        >
                                                            <option value="">Select an option</option>
                                                            {(field.options || []).map((option, index) => (
                                                                <option key={index} value={option}>
                                                                    {option || `Option ${index + 1}`}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                    {field.type === 'file' && (
                                                        <div className="px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm sm:text-base">
                                                            <button
                                                                type="button"
                                                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                                                                disabled
                                                            >
                                                                <Upload className="w-4 h-4" />
                                                                <span>Choose file</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {fields && fields.length > 0 && (
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                        type="button"
                        className="order-2 sm:order-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors min-h-11"
                        onClick={() => {
                            setExpandedField(null);
                            setSaveStatus({ type: null, message: '' });
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saveStatus.type === 'loading'}
                        className="order-1 sm:order-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors min-h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saveStatus.type === 'loading' ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Save Custom Fields</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomFields;