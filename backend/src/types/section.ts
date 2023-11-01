import { Lesson } from "./lesson";

export type Section = {
    title: string;
    updated_at: Date;
    id: number;
    Lesson: Lesson[];
};
