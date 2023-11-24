import React from "react";
import { useAppSelector } from "../../../hooks/hooks";
import { CheckIcon } from "@heroicons/react/24/outline";

type ActiveUserModalProps = {
    handleActive: () => void;
    handleCancel: () => void;
};

const ActiveUserModal: React.FC<ActiveUserModalProps> = (props: ActiveUserModalProps) => {
    const isLoading = useAppSelector((state) => state.userSlice.isLoading) ?? false;
    return (
        <>
            <div className="fixed z-50 w-full h-full top-0 bottom-0 right-0 left-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-4 w-[400px] flex flex-col items-center justify-center rounded-lg">
                    <div className="w-[60px] h-[60px] rounded-full border border-black bg-green-700 mb-4 flex justify-center text-white items-center">
                        <CheckIcon className="w-6 h-6" />
                    </div>
                    <div className="mb-2 text-center">
                        <p className="text-3xl mb-1 font-medium">ARE YOU SURE?</p>
                        <span className="text-xl">Do you really want to active this user ?</span>
                    </div>
                    <div className="">
                        <button className="text-white btn btn-info text-lg" onClick={props.handleActive}>
                            {isLoading ? "Loading..." : " Yes, active it "}
                        </button>
                        <button className="btn text-lg ml-2" onClick={props.handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ActiveUserModal;
