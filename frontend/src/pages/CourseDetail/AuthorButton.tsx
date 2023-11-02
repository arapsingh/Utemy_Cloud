import React from "react";
import { Link } from "react-router-dom";
import { EditIcon, WatchVideoIcon, DeleteIcon } from "../../assets/icons";
import { Course as CourseDetailType } from "../../types/course";
import { useAppDispatch } from "../../hooks/hooks";
import { lessonActions } from "../../redux/slices";
type AuthorButtonProps = {
    handleDelete(): void;
    courseDetail: CourseDetailType;
};

const AuthorButton: React.FC<AuthorButtonProps> = (props) => {
    const dispatch = useAppDispatch();
    const clearUrlVideo = () => {
        dispatch(lessonActions.setNowUrlVideo(""));
    };
    return (
        <>
            {props.courseDetail.number_of_section > 0 && (
                <Link to={`/course-detail/${props.courseDetail.slug}/watch`} onClick={clearUrlVideo}>
                    <button className="text-white btn btn-primary text-lg">
                        <WatchVideoIcon />
                        <span>Learn Now</span>
                    </button>
                </Link>
            )}
            <Link to={`/my-courses/edit/${props.courseDetail.course_id}`}>
                <button className="btn btn-primary text-white text-lg">
                    <EditIcon color="#ffffff" />

                    <span>Edit</span>
                </button>
            </Link>
            <button
                className="btn btn-error text-lg"
                onClick={() => {
                    props.handleDelete();
                }}
            >
                <DeleteIcon color="#000000" />
                <span>Delete</span>
            </button>
        </>
    );
};

export default AuthorButton;
