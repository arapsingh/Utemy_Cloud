import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { cartActions } from "../../redux/slices";
import toast from "react-hot-toast";

type GuestButtonProps = {
    isLogin: boolean;
    course_id: number | undefined;
};

const GuestButton: React.FC<GuestButtonProps> = ({ isLogin, course_id }) => {
    const dispatch = useAppDispatch();
    console.log("course_id", course_id);
    const isCourseInCart = useAppSelector((state) => state.cartSlice.isCourseInCart);
    console.log("isCourseInCart", isCourseInCart);
    const carts = useAppSelector((state) => state.cartSlice.userCart);
    console.log(carts);
    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading) ?? false;
    const handleGetItClick = () => {
        if (!isLogin || isCourseInCart) {
            return;
        } else {
            dispatch(cartActions.addCourseToCart(Number(course_id))).then((response) => {
                if (response.payload?.status_code === 200) {
                    dispatch(cartActions.getAllCart()).then((response) => {
                        if (response.payload?.status_code === 200) dispatch(cartActions.setIsCourseInCart(course_id));
                    });
                    toast.success(response.payload.message);
                } else {
                    if (response.payload) toast.error(response.payload.message);
                }
            });
        }
    };
    useEffect(() => {
        console.log("dispatch");
        dispatch(cartActions.getAllCart());
        dispatch(cartActions.setIsCourseInCart(course_id));
    }, [dispatch, course_id]);
    return (
        <>
            <Link to={`${isLogin ? (isCourseInCart ? "/cart" : "") : "/signup"}`}>
                <button
                    onClick={handleGetItClick}
                    className="btn btn-primary bg-backgroundHover border-backgroundHover hover:bg-backgroundHover hover:border-backgroundHover text-black text-lg"
                >
                    <span>{isGetLoading ? "Loading..." : isCourseInCart ? "Go to cart" : "Get it"}</span>
                </button>
            </Link>
        </>
    );
};

export default GuestButton;
