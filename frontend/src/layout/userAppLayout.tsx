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
            {/* <Routes>
                <Route element={<PrivateRoute />}>
                    <Route path="/change-password" element={<ChangePassword />}></Route>
                    <Route path="/my-courses" element={<MyCourses />}></Route>
                    <Route path="/my-enrolled-courses" element={<MyEnrolledCourse />}></Route>
                    <Route path="/create-course" element={<CreateCourse />}></Route>
                    <Route path="/cart" element={<Cart />}></Route>
                    <Route path="/my-courses/edit/:course_id" element={<EditCourse />}></Route>
                    <Route path="/course-detail/:slug/watch" element={<WatchVideo />}></Route>
                    <Route path="/checkout" element={<Checkout />}></Route>
                    <Route path="/checkout/vnpay_return" element={<VnPayReturn />}></Route>
                </Route>
                <Route index element={<HomePage />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/all-courses" element={<AllCourses />}></Route>
                <Route path="/signup" element={<Signup />}></Route>
                <Route path="/forgot-password" element={<ForgotPassword />}></Route>
                <Route path="/reset-password/:token" element={<ResetPassword />}></Route>
                <Route path="/verify-email/:token" element={<Verify />}></Route>
                <Route path="/check-mail" element={<CheckMail />}></Route>
                <Route path="/course-detail/:slug" element={<CourseDetail isLogin={isLogin} />}></Route>
                <Route path="/*" element={<NotFound />}></Route>
            </Routes> */}
            <Footer />
        </div>
    );
};
export default UserAppLayout;
