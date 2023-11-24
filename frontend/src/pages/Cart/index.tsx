import React, { useEffect } from "react";
import InCartCourse from "./InCartCourse";
import OutCartCourse from "./OutCartCourse";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { cartActions, invoiceActions } from "../../redux/slices";
import { toast } from "react-hot-toast";

const getPercentDiscount = (subTotal: number, subTotalRetail: number) => {
    return Math.ceil((subTotal / subTotalRetail) * 100);
};
const Cart: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const carts = useAppSelector((state) => state.cartSlice.userCart);
    const subTotal = useAppSelector((state) => state.cartSlice.subTotal);
    const subTotalRetail = useAppSelector((state) => state.cartSlice.subTotalRetail);
    const isGetLoading = useAppSelector((state) => state.cartSlice.isGetLoading);
    const discount = useAppSelector((state) => state.cartSlice.discount) || 0;
    const handleCheckout = () => {
        dispatch(invoiceActions.createInvoice()).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload?.message);
                navigate("/checkout");
            } else {
                if (response.payload) toast.error(response.payload?.message);
            }
        });
    };
    const handleRemoveFromCart = (cartDetailId: number) => {
        dispatch(cartActions.removeCourseFromCart(cartDetailId)).then((response) => {
            if (response.payload?.status_code === 200) {
                dispatch(cartActions.getAllCart());
                toast.success(response.payload.message);
            } else {
                if (response.payload) toast.error(response.payload?.message);
            }
        });
    };
    const handleChangeSaveForLater = (cartDetailId: number) => {
        dispatch(cartActions.changeSaveForLater(cartDetailId)).then((response) => {
            if (response.payload?.status_code === 200) {
                dispatch(cartActions.getAllCart());
                toast.success(response.payload.message);
            } else {
                if (response.payload) toast.error(response.payload?.message);
            }
        });
    };
    const getDiscount = (code: string) => {
        setTimeout(() => {
            dispatch(cartActions.getDiscount(code));
        }, 3000);
    };
    useEffect(() => {
        dispatch(cartActions.getAllCart());
        // dispatch(cartAction.getAllCoupon());
    }, [dispatch]);
    return (
        <>
            <div className="hidden  w-full h-[80px] bg-background mt-[100px] laptop:flex"></div>
            <div className=" flex flex-col laptop:flex-row ">
                <div className="w-full flex flex-col  h-fit gap-4 ">
                    <div className="w-full flex flex-col  h-fit gap-4 p-4 ">
                        <p className="text-black font-OpenSans text-2xl">My cart</p>
                        {carts.cart_items.map((cartItem) => {
                            if (!cartItem.saved_for_later)
                                return (
                                    <InCartCourse
                                        cartItem={cartItem}
                                        handleChangeSaveForLater={handleChangeSaveForLater}
                                        handleRemoveFromCart={handleRemoveFromCart}
                                    />
                                );
                        })}
                    </div>

                    <div className="w-full flex flex-col  h-fit gap-4 p-4 ">
                        <p className="text-black font-OpenSans text-2xl">Saved for later</p>
                        {carts.cart_items.map((cartItem) => {
                            if (cartItem.saved_for_later)
                                return (
                                    <OutCartCourse
                                        cartItem={cartItem}
                                        handleChangeSaveForLater={handleChangeSaveForLater}
                                        handleRemoveFromCart={handleRemoveFromCart}
                                    />
                                );
                        })}
                    </div>
                </div>

                <div className="flex flex-col w-full md:w-2/3 h-fit gap-4 p-4">
                    <p className="text-black font-OpenSans text-2xl">Purchase Resume</p>
                    <div className="flex flex-col p-4 gap-4 text-lg font-semibold shadow-md border rounded-sm">
                        <div className="flex flex-row justify-between">
                            <p className="text-gray-600">Subtotal (2 Items)</p>
                            {subTotal < subTotalRetail ? (
                                <div>
                                    <p className="text-end text-lightblue text-2xl font-bold">
                                        đ{subTotal.toLocaleString()}{" "}
                                        <span className="text-gray-600 font-normal text-sm line-through">
                                            đ{subTotalRetail.toLocaleString()}
                                        </span>
                                    </p>
                                    <p className="text-gray-600 text-sm font-normal text-end">
                                        {getPercentDiscount(subTotal, subTotalRetail)}% off
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-end text-gray-600 text-2xl font-bold">
                                        đ{subTotalRetail.toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-row items-center justify-between">
                            <p className="text-gray-600">Discount Coupon</p>
                            <input
                                type="text"
                                onChange={(e) => {
                                    getDiscount(e.target.value);
                                }}
                                placeholder="Optional..."
                                className="input input-bordered input-info input-md w-full max-w-xs"
                            />
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="text-gray-600 text-3xl font-bold">Total</p>
                            <div>
                                <p className="text-end text-lightblue text-3xl font-bold">
                                    đ
                                    {discount
                                        ? (subTotal * (1 - discount)).toLocaleString()
                                        : subTotal.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="transition-colors text-center text-sm bg-bluelogo hover:bg-background hover:text-bluelogo hover:border-bluelogo hover:border p-2 rounded-sm w-full text-white text-hover shadow-md"
                                onClick={handleCheckout}
                                aria-disabled={isGetLoading}
                            >
                                <span>{isGetLoading ? "LOADING..." : "CHECKOUT"}</span>
                            </button>
                            <Link
                                className="transition-colors text-center text-sm bg-white border hover:text-white hover:bg-gray-600 border-gray-600  p-2 rounded-sm w-full text-gray-700 text-hover shadow-md"
                                to="/"
                                aria-disabled={isGetLoading}
                            >
                                <span>ADD MORE PRODUCTS</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden  w-full h-[10px] bg-background mt-[100px] laptop:flex"></div>
        </>
    );
};

export default Cart;
