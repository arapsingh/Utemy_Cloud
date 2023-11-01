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
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./routes/PrivateRoutes";

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
                        </Route>
                        <Route path="/" element={<HomePage />}></Route>
                        <Route path="/login" element={<Login />}></Route>
                        <Route path="/signup" element={<Signup />}></Route>
                        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
                        <Route path="/reset-password/:token" element={<ResetPassword />}></Route>
                        <Route path="/verify-email/:token" element={<Verify />}></Route>
                        <Route path="/check-mail" element={<CheckMail />}></Route>
                    </Routes>
                    <Footer />
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
