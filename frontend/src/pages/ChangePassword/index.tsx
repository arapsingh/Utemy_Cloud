import React, { useRef } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { ChangePassword as ChangePasswordType } from "../../types/auth";
import { useAppDispatch } from "../../hooks/hooks";
import { authActions } from "../../redux/slices";
import { useAppSelector } from "../../hooks/hooks";
import { Link } from "react-router-dom";
import { changePasswordValidationSchema } from "../../validations/auth";
import toast from "react-hot-toast";

const ChangePassword: React.FC = () => {
    const isLoading = useAppSelector((state) => state.authSlice.isLoading);

    const dispatch = useAppDispatch();

    const formikRef = useRef(null);

    const initialValue: ChangePasswordType = {
        current_password: "",
        new_password: "",
        confirm_password: "",
    };

    const handleOnSubmit = (values: ChangePasswordType) => {
        dispatch(authActions.changePassword(values))
            .then((response) => {
                if (response.payload) {
                    if (response.payload.status_code !== 200) {
                        toast.error(response.payload.message);
                    } else {
                        toast.success(response.payload.message);
                    }
                }
            })
            .catch((error: any) => {
                toast.error(error);
            });
    };
    return (
        <div className="container mx-auto">
            <div className="flex items-center justify-center mt-[100px] py-10">
                <div className="bg-footer m-4 rounded-xl shadow-lg p-4">
                    <h1 className="font-bold text-[32px] text-center text-title">CHANGE PASSWORD</h1>
                    <Formik
                        initialValues={initialValue}
                        validationSchema={changePasswordValidationSchema}
                        onSubmit={handleOnSubmit}
                        innerRef={formikRef}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit}>
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="current_password" className="text-sm mb-1 tablet:text-xl">
                                        Current Password
                                    </label>
                                    <Field
                                        type="password"
                                        name="current_password"
                                        className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                            formik.errors.current_password &&
                                            formik.touched.current_password &&
                                            "border-error"
                                        } `}
                                    />
                                    <ErrorMessage
                                        name="current_password"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="new_password" className="text-sm mb-1 tablet:text-xl">
                                        New Password
                                    </label>
                                    <Field
                                        type="password"
                                        name="new_password"
                                        className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                            formik.errors.new_password && formik.touched.new_password && "border-error"
                                        }`}
                                    />
                                    <ErrorMessage
                                        name="new_password"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="confirm_password" className="text-sm mb-1 tablet:text-xl">
                                        Confirm Password
                                    </label>
                                    <Field
                                        type="password"
                                        name="confirm_password"
                                        className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                            formik.errors.confirm_password &&
                                            formik.touched.confirm_password &&
                                            "border-error"
                                        }`}
                                    />
                                    <ErrorMessage
                                        name="confirm_password"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="flex justify-end mb-3">
                                    <button
                                        type="submit"
                                        name="save_button"
                                        className="text-white btn btn-info text-lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading && <span className="loading loading-spinner"></span>}
                                        {isLoading ? "Loading..." : "Save"}
                                    </button>
                                    <Link to={"/"}>
                                        <button type="submit" className="btn text-lg ml-2" disabled={isLoading}>
                                            Cancel
                                        </button>
                                    </Link>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
