import { createContext, useContext, useState } from "react";
import {
    getAllFieldsAPI,
    postFieldAPI,
    removeFieldAPI,
    saveCustomFieldsAPI,
    getStudentsAPI,
    postStudentAPI,
    putStudentAPI,
    deleteStudentAPI
} from "../api/api";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);
    const [students, setStudents] = useState([]);
    const [defaultFields, setDefaultFields] = useState([]);
    const [myDetails, setMyDetails] = useState(null);
    const [customFields, setCustomFields] = useState([]);
    const [error, setError] = useState(null);

    // ------- FIELD METHODS -------

    const fetchAllFields = async () => {
        try {
            const response = await getAllFieldsAPI();
            if (response.success) {
                setDefaultFields(response.data.defaultFields);
                setCustomFields(response.data.customFields);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const addField = async () => {
        const res = await postFieldAPI();
        if (res.success) {
            setCustomFields(prev => [...prev, res.data]);
        } else setError(res.message);
    };

    const removeField = async (id) => {
        const res = await removeFieldAPI(id);
        if (res.success) {
            setCustomFields(prev => prev.filter(f => f.id !== id));
        } else setError(res.message);
    };

    const saveCustomFields = async (fields) => {
        const res = await saveCustomFieldsAPI(fields);
        if (res.success) {
            setCustomFields(res.data);
            return true;
        } else setError(res.message);
        return false;

    };

    const updateField = (id, updates) => {
        setCustomFields(prev =>
            prev.map(f => f.id === id ? { ...f, ...updates } : f)
        );
    };

    // ------- OPTION HELPERS -------

    const addOption = (fieldId) => {
        updateField(fieldId, {
            options: [
                ...customFields.find(f => f.id === fieldId).options,
                ""
            ]
        });
    };

    const updateOption = (fieldId, index, value) => {
        updateField(fieldId, {
            options: customFields
                .find(f => f.id === fieldId)
                .options.map((opt, i) => (i === index ? value : opt))
        });
    };

    const removeOption = (fieldId, index) => {
        updateField(fieldId, {
            options: customFields
                .find(f => f.id === fieldId)
                .options.filter((_, i) => i !== index)
        });
    };

    // ------- STUDENTS -------

    const fetchStudents = async () => {
        const res = await getStudentsAPI();
        if (res.success) setStudents(res.data);
        else setError(res.message);
    };

    const addStudent = async (data) => {
        const res = await postStudentAPI(data);
        if (res.success) setStudents(prev => [...prev, res.data]);
        else setError(res.message);
    };

    const editStudent = async (data) => {
        const res = await putStudentAPI(data);
        if (res.success) {
            setStudents(prev =>
                prev.map(s => (s.id === data.id ? data : s))
            );
        } else setError(res.message);
    };

    const deleteStudent = async (id) => {
        const res = await deleteStudentAPI(id);
        if (res.success) {
            setStudents(prev => prev.filter(s => s.id !== id));
        } else setError(res.message);
    };

    return (
        <AppContext.Provider value={{
            students, defaultFields, customFields, error, user, myDetails,
            fetchAllFields, addField, removeField, saveCustomFields,
            updateField, addOption, updateOption, removeOption,
            fetchStudents, addStudent, editStudent, deleteStudent, setUser, setMyDetails
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);