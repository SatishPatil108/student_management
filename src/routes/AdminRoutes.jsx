import { Navigate, Route, Routes, } from "react-router-dom";
import AdminNavbar from '../components/AdminNavbar/AdminNavbar';
import AdminLoginPage from '../pages/Admin/AdminLogin/AdminLoginPage';
import MyDetails from '../pages/Admin/AdminLogin/MyDetails';
import LogoutPage from '../pages/Admin/AdminLogin/LogoutPage';
import StudentsList from "../pages/Admin/StudentsList/StudentsList";
import CustomFields from "../pages/Admin/CustomFields/CustomFields";

const AdminRoutes = () => {

    return (
        <>
            <AdminNavbar />
            <Routes>
                <Route path="my_details" element={<MyDetails />} />
                <Route path="login" element={<AdminLoginPage />} />
                <Route path="students" element={<StudentsList />} />
                <Route path="custom_fields" element={<CustomFields />} />
                <Route path="logout" element={<LogoutPage />} />


            </Routes>
        </>
    )
}

export default AdminRoutes
