import React from "react";

const InCartCourse: React.FC = () => {
    return (
        <>
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
                            <span className="w-full hover:underline hover:cursor-pointer hover:opacity-75">Remove</span>
                            <span className="w-full hover:underline hover:cursor-pointer hover:opacity-75">
                                Save for later
                            </span>
                            <span></span>
                        </div>
                        <div className="ml-[25px]">
                            <p className="text-lightblue font-bold text-2xl">đ49.99</p>
                            <p className="text-gray-600 font-normal text-sm line-through">đ99.99</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default InCartCourse;
