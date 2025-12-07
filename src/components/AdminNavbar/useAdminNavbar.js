import { useAppContext } from "../../context/AppContext";

// useAdminNavbar.js
const useAdminNavbar = () => {
    const { user } = useAppContext();
    console.log(user);
    let navLinks;
    if (!user) {
        navLinks = [
            { name: 'login', path: '/login' },
        ];
    } else {
        if (user.role == "admin")
            navLinks = [
                { name: 'Students', path: '/students' },
                { name: 'Custom Fields', path: '/custom_fields' },
                { name: 'logout', path: '/logout' },
            ];
        if (user.role == "student")
            navLinks = [
                { name: 'my details', path: '/my_details' },
                { name: 'logout', path: '/logout' },
            ];
    }

    return { navLinks };
};

export default useAdminNavbar;