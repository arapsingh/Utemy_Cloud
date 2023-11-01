import { User } from "./user";

export type Course = {
    id: number;
    title: string;
    slug: string;
    status: boolean;
    description: string;
    thumbnail: string;
    summary: string;
    number_of_section: number;
    number_of_rating: number;
    number_of_enrolled: number;
    author: User;
    price: number;
    sale_price: number;
    sale_until: Date;
    average_rating: number;
};
export type NewCourse = {
    title: string;
    slug: string;
    description: string;
    summary: string;
    categories: number[];
    status: boolean;
    thumbnail: File | null;
    price: number;
};
