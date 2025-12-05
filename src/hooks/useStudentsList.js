import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const useStudentList = () => {
    const { 
        students, 
        defaultFields,
        customFields,
        fetchAllFields, 
        fetchStudents, 
        addStudent, 
        editStudent, 
        deleteStudent, 
        error 
    } = useAppContext();

    const [loading, setLoading] = useState(false);
    
    // Combine default and custom fields
    const allFields = [...defaultFields, ...customFields];

    useEffect(() => {
        fetchAllFields();
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        await fetchStudents();
        setLoading(false);
    };

    const handleAddStudent = async (data) => {
        setLoading(true);
        await addStudent(data);
        setLoading(false);
    };

    const handleEditStudent = async (data) => {
        setLoading(true);
        await editStudent(data);
        setLoading(false);
    };

    const handleDeleteStudent = async (id) => {
        setLoading(true);
        await deleteStudent(id);
        setLoading(false);
    };

    return {
        students,
        defaultFields,
        customFields,
        allFields,
        error,
        loading,
        handleAddStudent,
        handleEditStudent,
        handleDeleteStudent,
    };
};

export default useStudentList;