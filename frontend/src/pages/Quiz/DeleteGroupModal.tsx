import React from "react";
import { WarningIcon } from "../../assets/icons";
import { useAppSelector } from "../../hooks/hooks";
import { QuizGroupType } from "../../types/quiz";

type DeleteGroupModalProps = {
    group: QuizGroupType;
    handleCancel: () => void;
};

const DeleteGroupModal: React.FC<DeleteGroupModalProps> = (props: DeleteGroupModalProps) => {
    const handleDelete = () => {
        console.log(props.group);
    };
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading) ?? false;
    return (
        <>
            <div className="fixed z-50 w-full h-full top-0 bottom-0 right-0 left-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-4 w-[400px] flex flex-col items-center justify-center rounded-lg">
                    <div className="w-[60px] h-[60px] rounded-full border border-black bg-[#FFFF00] mb-4 flex justify-center items-center">
                        <WarningIcon />
                    </div>
                    <div className="mb-2 text-center flex-col flex">
                        <p className="text-2xl mb-1 font-medium">Bạn chắc chắn muốn xóa</p>
                        <span className=" text-lg font-bold text-black">{props.group.title}</span>
                        <span className="text-xl">Hành động này không thể hoàn tác</span>
                    </div>
                    <div className="">
                        <button className="text-white btn btn-error text-lg" onClick={handleDelete}>
                            {isLoading ? "Loading..." : " Có, tôi muốn xóa "}
                        </button>
                        <button className="btn text-lg ml-2 text-black" onClick={props.handleCancel}>
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeleteGroupModal;
