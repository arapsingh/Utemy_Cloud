import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { courseActions, lessonActions } from "../../redux/slices";
import NotFound from "../NotFound";
import { Course } from "../../types/course";
import { VideoPlayer, Accordion, Spin, WatchVideoHeader } from "../../components";
import { Section } from "../../types/section";
import constants from "../../constants";
import { Lesson } from "../../types/lesson";

// import { orderLesson } from "../../types/lesson";
const WatchVideo: React.FC = () => {
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const courseDetail: Course = useAppSelector((state) => state.courseSlice.courseDetail);
    const lesson = useAppSelector((state) => state.lessonSlice.lesson);
    console.log("lesson", lesson);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);

    // const orderLesson: orderLesson[] = useAppSelector((state) => state.courseSlice.orderLesson);
    const [isDisplayBtn] = useState<boolean>(false);
    const handleChangeLesson = (lesson: Lesson) => {
        dispatch(lessonActions.setLesson(lesson));
    };
    const role: string = useAppSelector((state) => state.courseSlice.role) ?? "";

    const dispatch = useAppDispatch();

    const { slug } = useParams();
    useEffect(() => {
        dispatch(courseActions.getCourseDetail(slug as string)).then((response) => {
            if (!response.payload || !response.payload.data || response.payload.status_code !== 200) {
                setIsNotFound(true);
            } else {
                dispatch(courseActions.getRightOfCourse(response.payload?.data.course_id));
            }
            const lessonList = response.payload?.data?.sections![0].Lesson;
            console.log("first", lessonList);
            if (lessonList && lessonList.length > 0) {
                console.log("sau first");
                dispatch(lessonActions.setLesson(lessonList[0] as Lesson));
            }
        });
    }, [dispatch, slug]);
    if (role === constants.util.ROLE_USER) return <NotFound />;
    if (isNotFound) return <NotFound />;

    return (
        <>
            {isLoading && <Spin />}
            <WatchVideoHeader course={courseDetail} role={role} />

            <div className="container mx-auto mt-[100px] mb-[100px]">
                <div className="mt-[32px]">
                    <div className="flex flex-col laptop:flex-row justify-center gap-4">
                        <VideoPlayer sourse={lesson.url_video ? lesson.url_video : ""} />
                        <div className="flex-2 w-full mt-[-8px] laptop:w-[540px] laptop:max-h-[480px] laptop:mt-0 laptop:overflow-y-auto">
                            {courseDetail.sections?.map((section: Section, index) => {
                                return (
                                    <Accordion
                                        disable={true}
                                        key={index}
                                        source={lesson.url_video}
                                        handleChangeLesson={handleChangeLesson}
                                        isDisplayBtn={isDisplayBtn}
                                        section={section}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="my-4 ml-10 w-1/2 description-course">
                    <h2 className=" tablet:text-2xl font-bold mb-3">Mô tả bài học</h2>
                    <div className="" dangerouslySetInnerHTML={{ __html: lesson.description }}></div>
                </div>
            </div>
        </>
    );
};

export default WatchVideo;
