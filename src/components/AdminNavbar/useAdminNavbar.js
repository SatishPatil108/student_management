import { useAppContext } from "../../context/AppContext";

// useAdminNavbar.js
const useAdminNavbar = () => {
    const { user } = useAppContext();
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

    const viewLink = [
        { name: 'Default View', path: '/students' },
        { name: 'Gallery View', path: '/gallery' },
        { name: 'Kanban', path: '/kanban' },
        { name: 'Timeline', path: '/timeline' },
        { name: 'Calendar', path: '/calendar' },
    ]

    return { navLinks, viewLink };
};

export default useAdminNavbar;