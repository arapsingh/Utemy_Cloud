import React, { useEffect, useState } from "react";
import { CourseCard, Navbar } from "../../components";
import { DefaultAvatar } from "../../assets";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { userActions } from "../../redux/slices";
import { User } from "../../types/user";
import { useParams } from "react-router-dom";
import { Course } from "../../types/course";
import NotFound from "../NotFound";
import { useNavigate } from "react-router-dom";

const AuthorProfile: React.FC = () => {
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const navigate = useNavigate();
    const user: User = useAppSelector((state) => state.userSlice.user);
    const loginId = useAppSelector((state) => state.authSlice.user.user_id);
    let courseList: Course[] = useAppSelector((state) => state.userSlice.courses) ?? [];
    const dispatch = useAppDispatch();
    const { id } = useParams();
    useEffect(() => {
        dispatch(userActions.getAuthorProfile(Number(id))).then((response) => {
            if (response.payload && response.payload.status_code !== 200) {
                setIsNotFound(true);
            } else {
                setIsNotFound(false);
            }
        });
    }, [dispatch, id]);
    if (Number(id) === Number(loginId)) navigate("/my-profile");
    if (isNotFound) return <NotFound />;

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 mt-[100px] laptop:mt-0">
                <div className="px-4 tablet:px-[60px] flex gap-4 bg-lightblue/30 mt-4 p-4 rounded-lg">
                    <div className="w-32 h-32 rounded-full border">
                        <img
                            src={user.url_avatar || DefaultAvatar}
                            alt="Avatar"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <div className="">
                        <h1 className="text-3xl font-bold mb-2">
                            Hello from {((user.first_name as string) + " " + user.last_name) as string}
                        </h1>
                        <p className="text-lg">
                            <span className="font-bold">About me: </span>
                            {user.description}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-3 place-self-center my-3">
                    {courseList.length > 0 &&
                        courseList.map((course: Course, index) => {
                            return (
                                <div className="laptop:w-3/4 max-w-xs tablet:max-w-full place-self-center" key={index}>
                                    <CourseCard
                                        key={course.course_id}
                                        id={course.course_id}
                                        title={course.title}
                                        thumbnail={course.thumbnail}
                                        rating={course.average_rating}
                                        price={course.price}
                                        salePrice={course.sale_price}
                                        saleUntil={course.sale_until}
                                        status={course.status}
                                        attendees={course.number_of_enrolled}
                                        numberOfSection={course.number_of_section}
                                        slug={course.slug}
                                        summary={course.summary}
                                        author={course.author as User}
                                        isEditCourse={false}
                                    />
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default AuthorProfile;
