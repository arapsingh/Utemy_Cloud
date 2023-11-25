import { Navigate, Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { useAppSelector } from "../hooks/hooks";

// import HomePage from "../pages/HomePage";
// import Login from "../pages/Login";
// import Signup from "../pages/Signup";
// import ForgotPassword from "../pages/ForgotPassword";
// import ResetPassword from "../pages/ResetPassword";
// import Verify from "../pages/VerifyEmail";
// import CheckMail from "../pages/CheckMail";
// import ChangePassword from "../pages/ChangePassword";
// import MyCourses from "../pages/MyCourse";
// import CreateCourse from "../pages/CreateCourse";
// import MyEnrolledCourse from "../pages/MyEnrolledCourse";
// import CourseDetail from "../pages/CourseDetail";
// import Cart from "../pages/Cart";
// import EditCourse from "../pages/EditCourse";
// import NotFound from "../pages/NotFound";
// import AllCourses from "../pages/AllCourse";
// import WatchVideo from "../pages/WatchVideo";
// import Checkout from "../pages/CheckOut";
// import VnPayReturn from "../pages/VnPayReturn";

type HeaderProps = {
    isLogin: boolean;
};

const UserAppLayout: React.FC<HeaderProps> = ({ isLogin }) => {
    const isAdmin = useAppSelector((state) => state.authSlice.user.is_admin);
    return isAdmin ? (
        <Navigate to={"/admin"} />
    ) : (
        <div className="flex flex-col min-h-screen">
            <Header isLogin={isLogin} />
            <Outlet />
            <Footer />
        </div>
    );
};
export default UserAppLayout;
