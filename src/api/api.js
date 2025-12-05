import {
    deleteStudentService,
    getAllFieldsService,
    getStudentsService,
    postStudentsService,
    putStudentsService,
    postFieldService,
    removeFieldService,
    saveCustomFieldsService
} from "../services/services";

// Unified Response Structure
const responseApi = (success, data = null, message = null, error = null) => ({
    success,
    data,
    message,
    error,
});

// ===== FIELD APIS =====

export const getAllFieldsAPI = async () => {
    try {
        const res = await getAllFieldsService();
        return responseApi(res.success, res.data, res.message);
    } catch (error) {
        return responseApi(false, null, "Failed to load fields", error);
    }
};

export const postFieldAPI = async () => {
    try {
        const res = await postFieldService();
        return responseApi(res.success, res.data, res.message || "Field added");
    } catch (error) {
        return responseApi(false, null, "Failed to add field", error);
    }
};

export const removeFieldAPI = async (id) => {
    try {
        const res = await removeFieldService(id);
        return responseApi(res.success, res.data, res.message || "Field removed");
    } catch (error) {
        return responseApi(false, null, "Failed to remove field", error);
    }
};

export const saveCustomFieldsAPI = async (fields) => {
    try {
        const res = await saveCustomFieldsService(fields);
        return responseApi(res.success, res.data, res.message || "Fields saved");
    } catch (error) {
        return responseApi(false, null, "Failed to save custom fields", error);
    }
};

// ===== STUDENT APIS =====

export const getStudentsAPI = async () => {
    try {
        const res = await getStudentsService();
        return responseApi(res.success, res.data, res.data?.length ? "Students fetched" : "No students found");
    } catch (error) {
        return responseApi(false, null, "Failed to load students", error);
    }
};

export const postStudentAPI = async (data) => {
    try {
        const res = await postStudentsService(data);
        return responseApi(res.success, res.data, res.message);
    } catch (error) {
        return responseApi(false, null, "Failed to add student", error);
    }
};

export const putStudentAPI = async (data) => {
    try {
        const res = await putStudentsService(data);
        return responseApi(res.success, res.data, res.message);
    } catch (error) {
        return responseApi(false, null, "Failed to update student", error);
    }
};

export const deleteStudentAPI = async (id) => {
    try {
        const res = await deleteStudentService(id);
        return responseApi(res.success, res.data, res.message);
    } catch (error) {
        return responseApi(false, null, "Failed to delete student", error);
    }
};