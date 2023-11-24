import React from "react";
import { WarningIcon } from "../assets/icons";
import { useAppSelector } from "../hooks/hooks";

type DeleteModalProps = {
    handleDelete: () => void;
    handleCancel: () => void;
};

const DeleteModal: React.FC<DeleteModalProps> = (props: DeleteModalProps) => {
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading) ?? false;
    return (
        <>
            <div className="fixed z-50 w-full h-full top-0 bottom-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-4 w-[400px] flex flex-col items-center justify-center rounded-lg">
                    <div className="w-[60px] h-[60px] rounded-full border border-black bg-[#FFFF00] mb-4 flex justify-center items-center">
                        <WarningIcon />
                    </div>
                    <div className="mb-2 text-center">
                        <p className="text-3xl mb-1 font-medium">ARE YOU SURE?</p>
                        <span className="text-xl">You won't be able to revert it</span>
                    </div>
                    <div className="">
                        <button className="text-white btn btn-error text-lg" onClick={props.handleDelete}>
                            {isLoading ? "Loading..." : " Yes, delete it "}
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

export default DeleteModal;
