import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const useCustomFields = () => {
    const {
        defaultFields,
        customFields,
        fetchAllFields,
        addField,
        removeField,
        updateField,
        addOption,
        updateOption,
        removeOption,
        saveCustomFields,
        error,
    } = useAppContext();
    const [loading, setLoading] = useState(false);
    // Load fields on mount
    useEffect(() => {
        const loadFields = async () => {
            setLoading(true);
            try {
                await fetchAllFields();
            } catch (err) {
                console.error('Failed to load fields:', err);
            } finally {
                setLoading(false);
            }
        };
        loadFields();
    }, []);

    // Field CRUD handlers
    const handleAddField = () => addField();

    const handleRemoveField = (id) => removeField(id);

    const handleUpdateField = (id, updates) =>
        updateField(id, updates);

    const handleAddOption = (fieldId) =>
        addOption(fieldId);

    const handleUpdateOption = (fieldId, index, value) =>
        updateOption(fieldId, index, value);

    const handleRemoveOption = (fieldId, index) =>
        removeOption(fieldId, index);

    const handleSaveCustomFields = async () => {
        setLoading(true);
        try {
            const res = await saveCustomFields(customFields);
            return res;
        } catch (err) {
            console.error('Failed to save fields:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };


    return {
        fields: customFields || [],
        defaultFields: defaultFields || [],
        error,
        loading,

        addField: handleAddField,
        removeField: handleRemoveField,
        updateField: handleUpdateField,

        addOption: handleAddOption,
        updateOption: handleUpdateOption,
        removeOption: handleRemoveOption,
        saveCustomFields: handleSaveCustomFields,
    };
};

export default useCustomFields;
