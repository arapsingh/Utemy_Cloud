import { Lesson } from "./lesson";
export type SectionRender = {
    title: string;
    updated_at: string;
    lessons: Lesson[];
};
export type Section = {
    course_id?: number;
    order?: number;
    id: number;
    title: string;
    lessons?: Lesson[];
};
