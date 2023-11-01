import React from "react";
import { useAppSelector } from "../../hooks/hooks";
import { Navigate } from "react-router-dom";

const CheckMail: React.FC = () => {
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);

    if (isLogin) return <Navigate to={"/"} />;

    return (
        <>
            <div className="mt-[100px] h-screen flex items-center justify-center space-x-[1rem]">
                <h3 className={`text-3xl text-bold font-Roboto text-switch`}>
                    You account haven't been verify yet, please check your email for further information...
                </h3>

                <div className="hidden tablet:block">{/* <img src={Skeleton} alt="Login img" /> */}</div>
            </div>
        </>
    );
};

export default CheckMail;
