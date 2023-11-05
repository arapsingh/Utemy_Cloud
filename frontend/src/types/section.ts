import { Lesson } from "./lesson";
export type SectionRender = {
    title: string;
    updated_at: string;
    lessons: Lesson[];
};
export type Section = {
    id: number;
    title: string;
    Lesson?: Lesson[];
};
export type AddSection = {
    course_id: number;
    title: string;
};
export type EditSection = {
    title: string;
    section_id: number;
};
