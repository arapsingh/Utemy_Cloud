import React from "react";
// import { Category } from "../../types/course";
import { useNavigate } from "react-router";
import { User } from "../../types/user";
import { TotalRating } from "../../components";
import { Category } from "../../types/category";

interface CardVideoProps {
    for: string;
    courseId: number;
    thumbnail: string;
    title: string;
    author: User;
    rating: number;
    categories: Category[];
    slug?: string;
}

const CardVideo: React.FC<CardVideoProps> = (props) => {
    const ratingId = `${props.courseId}${props.for === "rate" ? "1" : "2"}`;
    const navigate = useNavigate();
    return (
        <div
            className="rounded-lg bg-background shadow-lg flex flex-col hover:scale-95 hover:duration-300 cursor-pointer w-[200px]"
            onClick={() => navigate(`/course-detail/${props.slug}`)}
        >
            <img
                src={props.thumbnail}
                alt={props.title}
                className="w-full h-[140px] rounded-t-lg bg-black object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
                <h2 className="font-bold text-title text-lg  whitespace-wrap line-clamp-2">{props.title}</h2>
                <div className="items-end">
                    <div className="font-medium mt-1">{props.author.first_name + " " + props.author.last_name}</div>
                    <div className="font-medium mt-1">
                        {props.rating}{" "}
                        <TotalRating ratingId={Number(ratingId)} isForCourse={false} totalScore={props.rating} />
                    </div>
                    <div className="categori flex flex-wrap gap-1">
                        {props.categories &&
                            props.categories.map((category: any) => (
                                <div key={category.id} className="mt-1 badge badge-outline">
                                    {category.title}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardVideo;
