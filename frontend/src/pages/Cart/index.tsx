import React from "react";
import InCartCourse from "./InCartCourse";
import OutCartCourse from "./OutCartCourse";
import { Link } from "react-router-dom";
const Cart: React.FC = () => {
    return (
        <>
            <div className="hidden  w-full h-[80px] bg-background mt-[100px] laptop:flex"></div>
            <div className=" flex flex-col laptop:flex-row ">
                <div className="w-full flex flex-col  h-fit gap-4 ">
                    <div className="w-full flex flex-col  h-fit gap-4 p-4 ">
                        <p className="text-navy text-2xl">My cart</p>
                        <InCartCourse />
                        <InCartCourse />
                        <InCartCourse />
                    </div>

                    <div className="w-full flex flex-col  h-fit gap-4 p-4 ">
                        <p className="text-navy text-2xl">Saved for later</p>
                        <OutCartCourse />
                    </div>
                </div>

                <div className="flex flex-col w-full md:w-2/3 h-fit gap-4 p-4">
                    <p className="text-navy text-2xl">Purchase Resume</p>
                    <div className="flex flex-col p-4 gap-4 text-lg font-semibold shadow-md border rounded-sm">
                        <div className="flex flex-row justify-between">
                            <p className="text-gray-600">Subtotal (2 Items)</p>
                            <div>
                                <p className="text-end text-lightblue text-2xl font-bold">
                                    đ3.90 <span className="text-gray-600 font-normal text-sm line-through">đ99</span>
                                </p>
                                <p className="text-gray-600 text-sm font-normal text-end">50% off</p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center justify-between">
                            <p className="text-gray-600">Discount Coupon</p>
                            <input
                                type="text"
                                placeholder="Optional..."
                                className="input input-bordered input-info input-md w-full max-w-xs"
                            />
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="text-gray-600 text-3xl font-bold">Total</p>
                            <div>
                                <p className="text-end text-lightblue text-3xl font-bold">đ103.88</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                className="transition-colors text-center text-sm bg-bluelogo hover:bg-background hover:text-bluelogo hover:border-bluelogo hover:border p-2 rounded-sm w-full text-white text-hover shadow-md"
                                to="/checkout"
                            >
                                <span>CHECKOUT</span>
                            </Link>
                            <Link
                                className="transition-colors text-center text-sm bg-white border hover:text-white hover:bg-gray-600 border-gray-600  p-2 rounded-sm w-full text-gray-700 text-hover shadow-md"
                                to="/"
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
