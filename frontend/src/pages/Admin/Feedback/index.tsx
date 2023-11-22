import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { feedbackActions } from "../../../redux/slices";
import { Pagination } from "../../../components";
import FeedbackCard from "./FeedbackCard";
// import {
//     Typography,
//     Card,
//     CardHeader,
//     CardBody,
//     IconButton,
//     Menu,
//     MenuHandler,
//     MenuList,
//     MenuItem,
//     Avatar,
//     Tooltip,
//     Progress,
// } from "@material-tailwind/react";
// import {
//     EllipsisVerticalIcon,
//     ArrowUpIcon,
//     BanknotesIcon,
//     UserPlusIcon,
//     UsersIcon,
//     ChartBarIcon,
//     BellIcon, // orderoverview
//     PlusCircleIcon,
//     ShoppingCartIcon,
//     CreditCardIcon,
//     LockOpenIcon,
// } from "@heroicons/react/24/outline";

export function FeedbackAdmin() {
    const feedbacks = useAppSelector((state) => state.feedbackSlice.feedbacks);
    const totalRecord = useAppSelector((state) => state.feedbackSlice.totalRecord);
    const totalPage = useAppSelector((state) => state.feedbackSlice.totalPage);
    const [pageIndex, setPageIndex] = useState(1);
    const dispatch = useAppDispatch();
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        return;
    };
    useEffect(() => {
        dispatch(feedbackActions.getAllFeedbacks(pageIndex));
    }, [dispatch, pageIndex]);
    return (
        <>
            <div className="pt-[15px] flex flex-col items-center min-h-screen bg-background_2 ">
                <Toaster />

                {feedbacks.length === 0 ? (
                    <p className="mt-4 text-2xl text-error text-center font-bold">Such empty!!!</p>
                ) : (
                    <p className="mt-4 text-2xl text-center font-bold">There are {totalRecord} feedback(s) </p>
                )}
                <div className="flex my-1  flex-col justify-between w-3/4 px-10 gap">
                    <div>
                        {feedbacks.map((feedback, index) => {
                            return (
                                <div className="w-full my-1 max-w-xs tablet:max-w-full " key={index}>
                                    <FeedbackCard feedback={feedback} />
                                </div>
                            );
                        })}
                    </div>
                    {/* absolute bottom-10 right-[200px] */}
                    {totalPage > 1 && (
                        <div className="flex  justify-end my-4 self-end">
                            <Pagination
                                handleChangePageIndex={handleChangePageIndex}
                                totalPage={totalPage}
                                currentPage={pageIndex}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default FeedbackAdmin;
