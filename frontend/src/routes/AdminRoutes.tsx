import Cookies from "js-cookie";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";
import Sidebar from "../components/Sidebar/Sidebar";
import FooterAdmin from "../components/Footer/FooterAdmin";
import { AdminNavbar } from "../components/Navbar/AdminNavbar";
// import Header from "../components/Header";

// import Footer from "../components/Footer";

const AdminRoute: React.FC = () => {
    const accessToken = Cookies.get("accessToken");
    const isAdmin = useAppSelector((state) => state.authSlice.user.is_admin);
    return isAdmin && accessToken ? (
        <>
            {/* <Header isLogin={true} /> */}
            <Sidebar />
            <div className="relative  bg-blueGray-100">
                {/* Header */}
                <div className="px-4  ml-80">
                    <AdminNavbar />
                    <Outlet />
                    <FooterAdmin />
                </div>
            </div>
        </>
    ) : (
        <Navigate to={"/"} />
    );
};

export default AdminRoute;
