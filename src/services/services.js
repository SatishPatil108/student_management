// ========== FIELD SERVICES ==========
export const createUserIfNotExistService = () => {
    if (!localStorage.getItem("users"))
        localStorage.setItem("users", JSON.stringify([{
            "id": "admin-1",
            "role": "admin",
            "email": "admin@school.com",
            "password": "admin123",
            "name": "Super Admin"
        }]));
}
export const saveCustomFieldsService = async (fields) => {
    try {
        localStorage.setItem("customFields", JSON.stringify(fields));
        return {
            success: true,
            message: "Custom fields saved successfully",
            data: fields
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const removeFieldService = async (id) => {
    try {
        let customFields = JSON.parse(localStorage.getItem("customFields")) || [];
        const exists = customFields.some(f => f.id === id);

        if (exists) {
            customFields = customFields.filter(f => f.id !== id);
            localStorage.setItem("customFields", JSON.stringify(customFields));
        }

        return {
            success: exists,
            message: exists ? "Field removed" : "Field not found",
            data: { id }
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const postFieldService = async () => {
    try {
        let customFields = JSON.parse(localStorage.getItem("customFields")) || [];
        const field = {
            id: `cf-${Date.now()}`,
            label: "",
            key: "",
            type: "text",
            required: false,
            options: [],
            defaultValue: ""
        };

        customFields.push(field);
        localStorage.setItem("customFields", JSON.stringify(customFields));

        return {
            success: true,
            message: "Field added successfully",
            data: field
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getAllFieldsService = async () => {
    try {
        let defaultFields = JSON.parse(localStorage.getItem("defaultFields")) || [
            {
                id: "sys-1",
                label: "Full Name",
                key: "name",
                type: "text",
                required: true,
                options: [],
                defaultValue: "",
                isSystem: true
            },
            {
                id: "sys-2",
                label: "Email Address",
                key: "email",
                type: "email",
                required: true,
                options: [],
                defaultValue: "",
                isSystem: true
            },
            {
                id: "sys-3",
                label: "Phone Number",
                key: "phone",
                type: "tel",
                required: true,
                options: [],
                defaultValue: "",
                isSystem: true
            }
        ];

        let customFields = JSON.parse(localStorage.getItem("customFields")) || [];

        localStorage.setItem("defaultFields", JSON.stringify(defaultFields));
        localStorage.setItem("customFields", JSON.stringify(customFields));

        return {
            success: true,
            message: "Fields fetched successfully",
            data: { defaultFields, customFields }
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ========== STUDENT SERVICES ==========

export const getStudentsService = async () => {
    try {
        let students = JSON.parse(localStorage.getItem("students")) || [];
        return {
            success: true,
            data: students
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const postStudentsService = async (data) => {
    try {
        let students = JSON.parse(localStorage.getItem("students")) || [];
        let users = JSON.parse(localStorage.getItem("users"));
        if (!users) {
            createUserIfNotExistService();
            users = JSON.parse(localStorage.getItem("users"));
        }
        let maxId = JSON.parse(localStorage.getItem("maxStudentId")) || 0;
        const student = { id: maxId + 1, ...data };
        const paddedId = String(student.id).padStart(3, "0"); // 3 digits min
        const user = {
            id: "student-" + student.id,
            role: "student",
            email: student.email,
            password: student.email.split("@")[0] + paddedId,
            name: student.name,
        };
        students.push(student);
        users.push(user);

        localStorage.setItem("students", JSON.stringify(students));
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("maxStudentId", maxId + 1);

        return { success: true, message: "Student added", data: student };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const putStudentsService = async (data) => {
    try {
        let students = JSON.parse(localStorage.getItem("students")) || [];
        const exists = students.some(s => s.id === data.id);

        if (exists) {
            students = students.map(s => s.id === data.id ? data : s);
            localStorage.setItem("students", JSON.stringify(students));
        }

        return {
            success: exists,
            message: exists ? "Updated successfully" : "Not found",
            data
        };

    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const deleteStudentService = async (id) => {
    try {
        let students = JSON.parse(localStorage.getItem("students")) || [];
        const exists = students.some(s => s.id === id);

        if (exists) {
            students = students.filter(s => s.id !== id);
            localStorage.setItem("students", JSON.stringify(students));
        }

        return {
            success: exists,
            message: exists ? "Student deleted" : "Student not found",
            data: { id }
        };

    } catch (error) {
        return { success: false, message: error.message };
    }
};


export const loginAPI = (data) => {
    return new Promise((resolve, reject) => {
        const users = JSON.parse(localStorage.getItem("users"));
        const index = users.findIndex(user => user.email == data.email && user.password == data.password)
        if (index == -1)
            reject("invalid credentials")
        resolve(users[index])
    })

}

export const getDetails = (email) => {
    return new Promise((resolve, reject) => {
        let students = JSON.parse(localStorage.getItem("students")) || [];
        const index = students.findIndex(student => student.email == email)
        console.log(students, index, email)
        if (index == -1)
            reject("no details found")
        resolve(students[index])
    })
}