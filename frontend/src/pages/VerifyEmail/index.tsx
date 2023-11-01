import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Navigate, useParams } from "react-router-dom";
import { authActions } from "../../redux/slices";
import { Link } from "react-router-dom";

const Verify: React.FC = () => {
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);

    const dispatch = useAppDispatch();

    const { token } = useParams();

    useEffect(() => {
        dispatch(authActions.verifyEmail(token as string));
    }, [token, dispatch]);

    const errorMessage = useAppSelector((state) => state.authSlice.error) ?? "";
    const successMessage = useAppSelector((state) => state.authSlice.success) ?? "";

    if (isLogin) return <Navigate to={"/"} />;

    return (
        <>
            <div className="mt-[100px] h-screen flex items-center justify-center space-x-[1rem]">
                {errorMessage === "" && successMessage === "" && (
                    <h3 className={`text-3xl text-bold font-Roboto text-switch`}>Verification in progress...</h3>
                )}
                {errorMessage !== "" && (
                    <h3 className={`text-3xl text-error`}>
                        {errorMessage} <br />{" "}
                        <span>
                            <Link to={"/"} className="text-xl text-switch underline">
                                Back
                            </Link>
                        </span>
                    </h3>
                )}
                {successMessage !== "" && (
                    <h3 className={`text-3xl text-success`}>
                        {successMessage}
                        <br />{" "}
                        <span>
                            <Link to={"/login"} className="text-xl text-switch underline">
                                Back
                            </Link>
                        </span>
                    </h3>
                )}
                <div className="hidden tablet:block">{/* <img src={Skeleton} alt="Login img" /> */}</div>
            </div>
        </>
    );
};

export default Verify;
