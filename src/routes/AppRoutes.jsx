import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => (
  <Routes>
    <Route path="/*" element={<AdminRoutes />} />
  </Routes>
);

export default AppRoutes;