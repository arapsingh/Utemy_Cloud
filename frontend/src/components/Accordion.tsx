import React, { useState } from "react";
import { Section } from "../types/section";
import AddIcon from "../assets/icons/AddIcon";
import DeleteIcon from "../assets/icons/DeleteIcon";
import EditSectionIcon from "../assets/icons/EditSectionIcon";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { PlayIcon, BookOpenIcon } from "@heroicons/react/24/outline";

import { Course } from "../types/course";
import { lessonActions } from "../redux/slices";
// import { orderLesson } from "../types/lesson";
type AccordionType = {
    section: Section;
    handleDisplayAddSectionModal?: (id: number) => void;
    isDisplayBtn: boolean;
    handleDeleteSection?: (id: number) => void;
    handleDisplayDeleteModal?: (id: number, isDeleteSection: boolean) => void;
    handleDisplayEditModal?: (id: number, title: string) => void;
    handleDisplayEditLesson?: (id: number, title: string, video: string) => void;
    handleChangeSourceVideo?: (source: string) => void;
    redirectToWatchVideo?: boolean;
    source?: string;
    disable: boolean;
    // orderLesson: any;
};

const Accordion: React.FC<AccordionType> = (props) => {
    const [show, setShow] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const courseDetail: Course = useAppSelector((state) => state.courseSlice.courseDetail) ?? {};

    return (
        <>
            <div>
                <h2 id="accordion-collapse-heading-1">
                    <div
                        className={`flex items-center justify-between w-full p-4  bg-navy rounded-lg my-1 flex-wrap ${
                            show ? " shadow-xl" : ""
                        }`}
                    >
                        <div className="flex gap-2 items-center cursor-pointer" onClick={() => setShow(!show)}>
                            <svg
                                className={`w-3 h-3 ${show ? "rotate-180" : ""} shrink-0`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5 5 1 1 5"
                                />
                            </svg>
                            <span className="max-w-[400px] text-white truncate ... flex items-center gap-2">
                                <BookOpenIcon className="w-4 h-4" />
                                {props.section.title}
                            </span>
                        </div>
                        {props.isDisplayBtn && (
                            <div className="flex gap-2">
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (props.handleDisplayAddSectionModal) {
                                            props.handleDisplayAddSectionModal(props.section.id);
                                        }
                                    }}
                                >
                                    <AddIcon />
                                </div>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (props.handleDisplayEditModal) {
                                            props.handleDisplayEditModal(props.section.id, props.section.title);
                                        }
                                    }}
                                >
                                    <EditSectionIcon />
                                </div>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (props.handleDisplayDeleteModal) {
                                            props.handleDisplayDeleteModal(props.section.id, true);
                                        }
                                    }}
                                >
                                    <DeleteIcon />
                                </div>
                            </div>
                        )}
                    </div>
                </h2>
            </div>
            {show &&
                props.section.Lesson &&
                props.section.Lesson.map((lesson, index) => (
                    <div
                        className={`py-4 pl-8 pr-4 border border-black/25 rounded-lg my-2 hover:cursor-pointer flex justify-between  ${
                            lesson.url_video === props.source ? "bg-footer" : ""
                        }`}
                        onClick={() => {
                            if (props.handleChangeSourceVideo) {
                                console.log("url video", lesson.url_video);
                                props.handleChangeSourceVideo(lesson.url_video);
                            }
                            if (props.redirectToWatchVideo) {
                                dispatch(lessonActions.setNowUrlVideo(lesson.url_video));
                                navigate(`/course-detail/${courseDetail.slug}/watch`);
                            }
                        }}
                        key={`${lesson.id}`}
                    >
                        {" "}
                        <p className="flex items-center gap-2">
                            <PlayIcon className="w-4 h-4" /> {lesson.title}
                        </p>
                        {props.isDisplayBtn && (
                            <div className="flex gap-2">
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (props.handleDisplayEditLesson) {
                                            props.handleDisplayEditLesson(lesson.id, lesson.title, lesson.url_video);
                                        }
                                    }}
                                >
                                    <EditSectionIcon />
                                </div>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (props.handleDisplayDeleteModal) {
                                            props.handleDisplayDeleteModal(lesson.id, false);
                                        }
                                    }}
                                >
                                    <DeleteIcon />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
        </>
    );
};

export default Accordion;
