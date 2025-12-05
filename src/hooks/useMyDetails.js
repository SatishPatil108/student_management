import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getDetails } from "../services/services";

const useMyDetails = () => {
    const { user, myDetails, setMyDetails } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMyDetails = async () => {
        if (!user?.email) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const res = await getDetails(user.email);
            setMyDetails(res);
        } catch (err) {
            setError(err.message || "Failed to fetch details");
            console.error("Error fetching details:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchMyDetails();

    }, [user?.email, setMyDetails]);
    const refreshDetails = () => {
        if (user?.email) {
            fetchMyDetails();
        }
    }
    return {
        myDetails,
        loading,
        error,
        refreshDetails
    };
};

export default useMyDetails;