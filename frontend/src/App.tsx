import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import { authActions } from "./redux/slices";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Verify from "./pages/VerifyEmail";
import CheckMail from "./pages/CheckMail";
import ChangePassword from "./pages/ChangePassword";
import MyCourses from "./pages/MyCourse";
import CreateCourse from "./pages/CreateCourse";
import MyEnrolledCourse from "./pages/MyEnrolledCourse";
import CourseDetail from "./pages/CourseDetail";
import Cart from "./pages/Cart";
import EditCourse from "./pages/EditCourse";
import NotFound from "./pages/NotFound";
import AllCourses from "./pages/AllCourse";
import WatchVideo from "./pages/WatchVideo";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./routes/PrivateRoutes";
import MyProfile from "./pages/MyProfile";

function App() {
    const dispatch = useAppDispatch();

    const isLogin = useAppSelector((state) => state?.authSlice?.isLogin) ?? false;

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
            dispatch(authActions.getMe());
        }
    }, [dispatch]);
    return (
        <div className="App">
            <BrowserRouter>
                <div className="flex flex-col min-h-screen">
                    <Header isLogin={isLogin} />

                    <Routes>
                        <Route element={<PrivateRoute />}>
                            <Route path="/change-password" element={<ChangePassword />}></Route>
                            <Route path="/my-courses" element={<MyCourses />}></Route>
                            <Route path="/my-enrolled-courses" element={<MyEnrolledCourse />}></Route>
                            <Route path="/create-course" element={<CreateCourse />}></Route>
                            <Route path="/cart" element={<Cart />}></Route>
                            <Route path="/my-courses/edit/:course_id" element={<EditCourse />}></Route>
                            <Route path="/course-detail/:slug/watch" element={<WatchVideo />}></Route>
                            <Route path="/my-profile" element={<MyProfile />}></Route>
                        </Route>
                        <Route path="/" element={<HomePage />}></Route>
                        <Route path="/login" element={<Login />}></Route>
                        <Route path="/all-courses" element={<AllCourses />}></Route>
                        <Route path="/signup" element={<Signup />}></Route>
                        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
                        <Route path="/reset-password/:token" element={<ResetPassword />}></Route>
                        <Route path="/verify-email/:token" element={<Verify />}></Route>
                        <Route path="/check-mail" element={<CheckMail />}></Route>
                        <Route path="/course-detail/:slug" element={<CourseDetail isLogin={isLogin} />}></Route>
                        <Route path="/*" element={<NotFound />}></Route>
                    </Routes>
                    <Footer />
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
