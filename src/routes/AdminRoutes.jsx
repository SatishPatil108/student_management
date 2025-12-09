import { Navigate, NavLink, Route, Routes, } from "react-router-dom";
import AdminNavbar from '../components/AdminNavbar/AdminNavbar';
import AdminLoginPage from '../pages/Admin/AdminLogin/AdminLoginPage';
import MyDetails from '../pages/Admin/AdminLogin/MyDetails';
import LogoutPage from '../pages/Admin/AdminLogin/LogoutPage';
import StudentsList from "../pages/Admin/StudentsList/StudentsList";
import CustomFields from "../pages/Admin/CustomFields/CustomFields";
import GalleryView from "../pages/DifferentView/GalleryView";
import KanbanView from "../pages/DifferentView/KanbanView";
import TimelineView from "../pages/DifferentView/TimelineView";
import CalendarView from "../pages/DifferentView/CalendarView";
import useAdminNavbar from "../components/AdminNavbar/useAdminNavbar";

const AdminRoutes = () => {
    const { viewLink } = useAdminNavbar();

    return (
        <>
            <AdminNavbar />
            <Routes>
                <Route path="my_details" element={<MyDetails />} />
                <Route path="login" element={<AdminLoginPage />} />
                <Route path="students" element={<StudentsList />} />
                <Route path="gallery" element={<GalleryView />} />
                <Route path="kanban" element={<KanbanView />} />
                <Route path="timeline" element={<TimelineView />} />
                <Route path="calendar" element={<CalendarView />} />
                <Route path="custom_fields" element={<CustomFields />} />
                <Route path="logout" element={<LogoutPage />} />
            </Routes>

            {/* Fixed Bottom View Links with Scroll */}
            <div className="sticky bottom-0 left-0 right-0 bg-linear-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-t border-purple-200 dark:border-gray-700 shadow-lg z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                            View Options:
                        </span>
                        <div className="flex-1 overflow-x-auto scrollbar-custom">
                            <div className="flex items-center justify-center gap-3 lg:gap-6 min-w-max py-1">
                                {viewLink.map((link, i) => (
                                    <NavLink
                                        key={i}
                                        to={link.path}
                                        className={({ isActive }) => `
                                relative group flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 min-w-max
                                ${isActive
                                                ? 'bg-white dark:bg-gray-800 shadow-md text-purple-600 dark:text-purple-300'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                                            }
                            `}
                                    >
                                        <span className="text-sm font-medium whitespace-nowrap">
                                            {link.name}
                                        </span>
                                        <span className={`
                                absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                                h-0.5 w-0 rounded-full transition-all duration-300
                                ${({ isActive }) => isActive
                                                ? 'w-8 bg-purple-500 dark:bg-purple-400'
                                                : 'group-hover:w-4 group-hover:bg-gray-400 dark:group-hover:bg-gray-500'
                                            }
                            `} />
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-white dark:bg-gray-800 rounded-lg">
                                Scroll →
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminRoutes;