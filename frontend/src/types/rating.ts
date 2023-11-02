export type Rating = {
    id: number;
    ratings: number;
    content: string;
    created_at: string;
    url_avatar: string | null;
    first_name: string;
    last_name: string;
    user_id: number;
};
export type ListRating = {
    total_page: number;
    total_record: number;
    ratings: Rating[];
};
export type RatingCourse = {
    ratings: number;
    content: string;
    course_id: number;
};
export type GetRating = {
    slug: string;
    page_index: number;
};
