import Feedback from "../pages/Feedback";

export type Feedback = {
    feedback_id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    url_avatar: string;
    content: string;
    created_at: string | Date;
};
export type FeedbackContent = {
    content: string;
}