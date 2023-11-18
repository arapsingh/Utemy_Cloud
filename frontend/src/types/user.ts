import { Course } from "./course";

export type User = {
    first_name: string;
    last_name: string;
    email: string;
    url_avatar?: string;
    user_id: number | undefined;
    description: string;
};

export type UpdateInformation = {
    first_name: string | undefined;
    last_name: string | undefined;
    description: string | undefined;
};
export type ChangePassword = {
    current_password: string;
    new_password: string;
    confirm_password: string;
};
export type AuthorInformation = {
    user: User;
    courses: Course[];
};