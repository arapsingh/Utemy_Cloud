import React from "react";
const Cart: React.FC = () => {
    return (
        <>
            <div className="hidden  w-full h-[80px] bg-background mt-[100px] laptop:flex"></div>
            <div className=" flex flex-col laptop:flex-row ">
                <div className="w-full flex flex-col  h-fit gap-4 ">
                    <div className="w-full flex flex-col  h-fit gap-4 p-4 ">
                        <p className="text-navy text-2xl">My cart</p>
                        <div className="flex flex-col p-4 text-lg font-semibold shadow-md border rounded-sm">
                            <div className="flex flex-col md:flex-row gap-3 justify-between">
                                <div className="flex flex-row gap-6 ">
                                    <div className="w-28 h-28">
                                        <img
                                            alt="cac"
                                            className="w-full h-full"
                                            src="http://localhost:3001//images//avatar//1698738997794.jpg"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-2xl text-lightblue font-bold">Tên</p>
                                        <p className="text-xs text-gray-600 font-semibold">
                                            Author: <span className="font-normal">Tác giả</span>
                                        </p>
                                        <p className="text-xs text-gray-600 font-semibold">
                                            Rating: <span className="font-normal">5</span>
                                        </p>
                                    </div>
                                </div>

                                <div className=" flex flex-row items-center text-right">
                                    <div className="flex flex-col  items-start mr-[20px]">
                                        <span className="w-full hover:underline hover:cursor-pointer hover:opacity-75">
                                            Remove
                                        </span>
                                        <span className="w-full hover:underline hover:cursor-pointer hover:opacity-75">
                                            Save for later
                                        </span>
                                        <span></span>
                                    </div>
                                    <div className="ml-[25px]">
                                        <p className="text-gray-600 font-normal text-sm line-through">
                                            đ99.99
                                            {/* <span className="text-emerald-500 ml-2">(-50% OFF)</span> */}
                                        </p>
                                        <p className="text-lightblue font-bold text-2xl">đ49.99</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row self-center gap-1"></div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col  h-fit gap-4 p-4 ">
                        <p className="text-navy text-2xl">Saved for later</p>
                        <div className="flex flex-col p-4 text-lg font-semibold shadow-md border rounded-sm">
                            <div className="flex flex-col md:flex-row gap-3 justify-between">
                                <div className="flex flex-row gap-6 ">
                                    <div className="w-28 h-28">
                                        <img
                                            alt="cac"
                                            className="w-full h-full"
                                            src="http://localhost:3001//images//avatar//1698738997794.jpg"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-2xl text-lightblue font-bold">Tên</p>
                                        <p className="text-xs text-gray-600 font-semibold">
                                            Author: <span className="font-normal">Tác giả</span>
                                        </p>
                                        <p className="text-xs text-gray-600 font-semibold">
                                            Rating: <span className="font-normal">5</span>
                                        </p>
                                    </div>
                                </div>

                                <div className=" flex flex-row items-center text-right">
                                    <div className="flex flex-col  items-start mr-[20px]">
                                        <span className="w-full hover:underline hover:cursor-pointer hover:opacity-75">
                                            Remove
                                        </span>
                                        <span className="w-full hover:underline hover:cursor-pointer hover:opacity-75">
                                            Save for later
                                        </span>
                                        <span></span>
                                    </div>
                                    <div className="ml-[25px]">
                                        <p className="text-gray-600 font-normal text-sm line-through">
                                            đ99.99
                                            {/* <span className="text-emerald-500 ml-2">(-50% OFF)</span> */}
                                        </p>
                                        <p className="text-lightblue font-bold text-2xl">đ49.99</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row self-center gap-1"></div>
                        </div>
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
                        {/* <hr className="bg-gray-200 h-0.5"> */}
                        <div className="flex flex-row justify-between">
                            <p className="text-gray-600 text-3xl font-bold">Total</p>
                            <div>
                                <p className="text-end text-lightblue text-3xl font-bold">đ103.88</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="transition-colors text-sm bg-bluelogo hover:bg-bluelogo/50 p-2 rounded-sm w-full text-white text-hover shadow-md">
                                CHECKOUT
                            </button>
                            <button className="transition-colors text-sm bg-white border hover:opacity-50 border-gray-600 p-2 rounded-sm w-full text-gray-700 text-hover shadow-md">
                                ADD MORE PRODUCTS
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden  w-full h-[10px] bg-background mt-[100px] laptop:flex"></div>
        </>
    );
};

export default Cart;
