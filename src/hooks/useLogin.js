import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { createUserIfNotExistService, loginAPI } from "../services/services";

const useLogin = () => {
    const navigate = useNavigate();

    const { setUser } = useAppContext();
    createUserIfNotExistService();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);

            // Validate inputs
            if (!email || !password) {
                throw new Error("Email and password are required");
            }

            // API call
            const response = await loginAPI({ email, password });

            setUser(response)

            // Store in localStorage for persistence
            localStorage.setItem("user", JSON.stringify(response));

            // Navigate to dashboard
            if (response.role == "admin")
                navigate("/students");
            if (response.role == "student")
                navigate("/my_details");

            return { success: true, data: response };
        } catch (err) {
            console.log(err)
            const errorMessage = err || err.response?.data?.message || err.message || "Login failed";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        login
    };
};

export default useLogin;