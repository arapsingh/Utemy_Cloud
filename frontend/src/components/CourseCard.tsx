import { FC, useState } from "react";
import { Link } from "react-router-dom";
import ThreeDotIcon from "../assets/icons/ThreedotIcon";
import EditIcon from "../assets/icons/EditIcon";
import DeleteIcon from "../assets/icons/DeleteIcon";
import { User } from "../types/user";
import CompleteIcon from "../assets/icons/CompleteIcon";
import TotalRating from "./TotalRating";

type Course = {
    id: number;
    slug: string;
    title: string;
    summary: string;
    thumbnail: string;
    author: User;
    rating?: number;
    status?: boolean;
    numberOfSection?: number;
    attendees?: number;
    isEditCourse: boolean;
    createdAt?: string;
    handleDeleteCourse?: (courseId: number) => void;
    handleEditCourse?: (id: number) => void;
};

const CourseCard: FC<Course> = (props: Course) => {
    const [isDisplayDropDown, setIsDisplayDropDown] = useState<boolean>(false);
    const hasSection = props.numberOfSection !== undefined;
    const hasAttendee = props.attendees !== undefined;
    return (
        <div className="py-2">
            <div className="flex flex-col gap-2 tablet:gap-4 tablet:flex-row rounded-2xl hover:bg-backgroundHover/10 transition ease-in-out hover:shadow-lg duration-200 shadow-lg">
                <div className="h-48 bg-gray-400 rounded-lg tablet:w-64 shrink-0">
                    <Link to={`/course-detail/${props.slug}`}>
                        <img src={props.thumbnail} alt={props.title} className="w-full h-full rounded-lg" />
                    </Link>
                </div>
                <div className="flex justify-between tablet:flex-1 px-2 pb-2 tablet:px-0">
                    <div className="w-[90%] tablet:w-full">
                        <h2 className="tablet:w-[300px] xl:w-[600px] text-xl font-bold text-title truncate ...">
                            {props.title}
                        </h2>
                        <p className="text-base italic">{props.summary}</p>
                        <p className="text-base font-bold">
                            <span>Author: </span>
                            <Link to={`/profile/${props.author.user_id}`} className="text-blue-600 font-normal">
                                {props.author.first_name + " " + props.author.last_name}
                            </Link>
                        </p>

                        <div className="text-base flex items-center gap-1">
                            <span className=" font-bold">Rating: </span>
                            <TotalRating ratingId={props.id} totalScore={props.rating as number} isForCourse={false} />
                            <span>{props.rating}</span>
                        </div>

                        <p className="text-base font-bold flex gap-1">
                            Status:{" "}
                            {props.status === true ? (
                                <span className="font-normal flex gap-1">
                                    Completed <CompleteIcon />
                                </span>
                            ) : (
                                <span className="font-normal">Uncomplete</span>
                            )}
                        </p>
                        {hasAttendee && (
                            <p className="text-base font-bold">
                                Attendees: <span className="font-normal">{props.attendees}</span>
                            </p>
                        )}
                        {hasSection && (
                            <p className="text-base font-bold">
                                Number of sections: <span className="font-normal">{props.numberOfSection}</span>
                            </p>
                        )}
                        {props.createdAt && (
                            <p className="text-base font-bold">
                                Created at: <span className="font-normal">{props.createdAt}</span>
                            </p>
                        )}
                    </div>

                    {props.isEditCourse ? (
                        <div
                            className="w-[33px] h-[33px] rounded-full bg-slate-200 hover:bg-slate-400 ml-auto flex justify-center items-center relative shrink-0 cursor-pointer tablet:m-1"
                            onClick={() => setIsDisplayDropDown(!isDisplayDropDown)}
                        >
                            <ThreeDotIcon />
                            <div
                                className={`shadow-lg p-2 rounded-lg absolute top-10 right-0 bg-white ${
                                    isDisplayDropDown ? "block" : "hidden"
                                }`}
                            >
                                <div
                                    className="flex items-center p-2 rounded-lg hover:bg-backgroundHover cursor-pointer"
                                    onClick={() => {
                                        if (props.handleEditCourse) props.handleEditCourse(props.id);
                                    }}
                                >
                                    <EditIcon />
                                    <span className="ml-2">Edit</span>
                                </div>
                                <div
                                    className="flex items-center p-2 rounded-lg hover:bg-backgroundHover cursor-pointer"
                                    onClick={() => {
                                        if (props.handleDeleteCourse) props.handleDeleteCourse(props.id);
                                    }}
                                >
                                    <DeleteIcon />
                                    <span className="ml-2">Delete</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
