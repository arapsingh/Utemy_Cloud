import React, { useState } from "react";
import QuizGroupCard from "./QuizGroupCard";
import QuizCard from "./QuizCard";
import { QuizGroupType, QuizType } from "../../types/quiz";
import QuizEditPopup from "./QuizEditPopup";
import QuizAddPopup from "./QuizAddPopup";
import DeleteGroupModal from "./DeleteGroupModal";
import DeleteQuizModal from "./DeleteQuizModal";
import QuizGroupAddPopup from "./QuizGroupAddPopup";
import QuizGroupEditPopup from "./QuizGroupEditPopup";

const data: QuizType[] = [
    {
        quiz_id: 1,
        quiz_group_id: 1,
        type: 1,
        question: "Con voi có màu gì",
        updated_at: new Date().toString(),
        quiz_answer: [
            {
                quiz_answer_id: 1,
                answer: "Câu trả lời",
                is_correct: true,
            },
            {
                quiz_answer_id: 2,
                answer: "Câu trả sai 1",
                is_correct: false,
            },
            {
                quiz_answer_id: 3,
                answer: "Câu trả sai 2",
                is_correct: false,
            },
            {
                quiz_answer_id: 4,
                answer: "Câu trả sai 3",
                is_correct: false,
            },
        ],
    },
    {
        quiz_id: 2,
        quiz_group_id: 1,
        type: 1,
        question: "Con chó có màu gì",
        updated_at: new Date().toString(),
        quiz_answer: [
            {
                quiz_answer_id: 5,
                answer: "Câu trả lời",
                is_correct: true,
            },
            {
                quiz_answer_id: 6,
                answer: "Câu trả sai 1",
                is_correct: false,
            },
            {
                quiz_answer_id: 7,
                answer: "Câu trả sai 2",
                is_correct: false,
            },
            {
                quiz_answer_id: 8,
                answer: "Câu trả sai 3",
                is_correct: false,
            },
        ],
    },
    {
        quiz_id: 3,
        quiz_group_id: 1,
        type: 1,
        question: "Con gà có màu gì",
        updated_at: new Date().toString(),
        quiz_answer: [
            {
                quiz_answer_id: 9,
                answer: "Câu trả lời",
                is_correct: true,
            },
            {
                quiz_answer_id: 10,
                answer: "Câu trả sai 1",
                is_correct: false,
            },
            {
                quiz_answer_id: 11,
                answer: "Câu trả sai 2",
                is_correct: false,
            },
            {
                quiz_answer_id: 12,
                answer: "Câu trả sai 3",
                is_correct: false,
            },
        ],
    },
];

const dataGroup: QuizGroupType[] = [
    {
        quiz_group_id: 1,
        title: "Bộ câu hỏi 1 Bộ câu hỏi 1 Bộ câu hỏi 1 Bộ câu hỏi 1",
        description: "Đây là bộ câu hỏi về chủ đề 1",
    },
    {
        quiz_group_id: 2,
        title: "Bộ câu hỏi 2",
        description:
            "Đây là bộ câu hỏi về chủ đề 2 Đây là bộ câu hỏi về chủ đề 2 Đây là bộ câu hỏi về chủ đề 2 Đây là bộ câu hỏi về chủ đề 2",
    },
    {
        quiz_group_id: 3,
        title: "Bộ câu hỏi 3",
        description: "Đây là bộ câu hỏi về chủ đề 3",
    },
];

const QuizHome: React.FC = () => {
    const [openEditPopup, setOpenEditPopup] = useState(false);
    const [openAddPopup, setOpenAddPopup] = useState(false);
    const [openEditGroupPopup, setOpenEditGroupPopup] = useState(false);
    const [openAddGroupPopup, setOpenAddGroupPopup] = useState(false);
    const [openDeleteQuizModal, setOpenDeleteQuizModal] = useState(false);
    const [openDeleteGroupModal, setOpenDeleteGroupModal] = useState(false);
    const [editQuiz, setEditQuiz] = useState<QuizType>(data[0]);
    const [editGroup, setEditGroup] = useState<QuizGroupType>(dataGroup[0]);
    const [groupId, setGroupId] = useState(1);
    console.log(setGroupId);
    console.log(openEditGroupPopup);
    //edit quiz
    const handleOpenEditQuiz = (quiz: QuizType) => {
        setEditQuiz(quiz);
        setOpenEditPopup(true);
    };
    const handleCancelEdit = () => {
        setOpenEditPopup(false);
    };
    //edit group
    const handleOpenEditGroup = (group: QuizGroupType) => {
        setEditGroup(group);
        setOpenEditGroupPopup(true);
    };
    const handleCancelEditGroup = () => {
        setOpenEditGroupPopup(!openEditGroupPopup);
    };

    //delete quiz
    const handleOpenDeleteQuiz = (quiz: QuizType) => {
        setEditQuiz(quiz);
        setOpenDeleteQuizModal(true);
    };
    const handleToggleDeleteQuiz = () => {
        setOpenDeleteQuizModal(!openDeleteQuizModal);
    };
    //delete group
    const handleOpenDeleteGroup = (group: QuizGroupType) => {
        setEditGroup(group);
        setOpenDeleteGroupModal(true);
    };
    const handleToggleDeleteGroup = () => {
        setOpenDeleteGroupModal(!openDeleteGroupModal);
    };
    //add quiz
    const handleToggleAdd = () => {
        setOpenAddPopup(!openAddPopup);
    };
    //add group
    const handleToggleAddGroup = () => {
        setOpenAddGroupPopup(!openAddGroupPopup);
    };
    return (
        <>
            {/* {isLoading && <Spin />} */}
            {openEditPopup && <QuizEditPopup quiz={editQuiz} handleCancelEdit={handleCancelEdit} />}
            {openAddPopup && <QuizAddPopup groupId={groupId} handleCancelAdd={handleToggleAdd} />}
            {openDeleteQuizModal && <DeleteQuizModal quiz={editQuiz} handleCancel={handleToggleDeleteQuiz} />}
            {openDeleteGroupModal && <DeleteGroupModal group={editGroup} handleCancel={handleToggleDeleteGroup} />}
            {openEditGroupPopup && <QuizGroupEditPopup group={editGroup} handleCancelEdit={handleCancelEditGroup} />}
            {openAddGroupPopup && <QuizGroupAddPopup handleCancelAdd={handleToggleAddGroup} />}
            <div className=" w-full h-[100vh] mx-auto mt-[100px]  justify-center flex  ">
                <div className="w-1/4 bg-white  shadow-lg pt-[20px]">
                    <div className="h-[10%] flex items-center justify-between text-black border-b mx-3">
                        <div>
                            <h1 className="text-2xl text-black font-bold ">Bộ câu hỏi</h1>
                            <h1 className="text-lg text-black ">Chọn để hiển thị các câu hỏi bên phải</h1>
                        </div>
                        <button
                            type="button"
                            onClick={handleToggleAddGroup}
                            className="btn btn-info text-white hover:bg-lightblue/80"
                        >
                            Thêm
                        </button>
                    </div>
                    <div className="h-[90%] overflow-auto w-[98%] justify-center grid-rows-1">
                        {dataGroup.length > 0 &&
                            dataGroup.map((group) => {
                                return (
                                    <QuizGroupCard
                                        group={group}
                                        handleOpenDelete={handleOpenDeleteGroup}
                                        handleOpenEdit={handleOpenEditGroup}
                                    />
                                );
                            })}
                    </div>
                </div>
                <div className="w-1/2 h-full bg-footer shadow-lg pt-[20px]">
                    <div className="h-[10%] flex  items-center justify-between mx-3 pl-5 text-black border-b">
                        <div>
                            <h1 className="text-xl text-black ">
                                Thanh search bar: Chọn một bộ câu hỏi để xem các câu hỏi
                            </h1>
                        </div>
                        <div className="gap-2 flex">
                            <button
                                type="button"
                                onClick={handleToggleAdd}
                                className="btn border-1 border-gray-600 text-black "
                            >
                                Làm mới
                            </button>
                            <button
                                type="button"
                                onClick={handleToggleAdd}
                                className="btn btn-info text-white hover:bg-lightblue/80"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                    <div className="h-[90%] flex flex-col  overflow-auto">
                        {data.length > 0 &&
                            data.map((data) => {
                                return (
                                    <QuizCard
                                        quiz={data}
                                        handleOpenEdit={handleOpenEditQuiz}
                                        handleOpenDelete={handleOpenDeleteQuiz}
                                    />
                                );
                            })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuizHome;
