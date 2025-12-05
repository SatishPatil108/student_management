import React, { useEffect } from 'react'
import { useAppContext } from '../../../context/AppContext'
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
    const { setUser } = useAppContext();
    const navigate = useNavigate();
    useEffect(() => {
        setUser(null);
        navigate("/login");
    }, [])

    return (
        <div>
            logout
        </div>
    )
}

export default LogoutPage
