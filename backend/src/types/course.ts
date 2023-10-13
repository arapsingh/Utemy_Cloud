import { Author } from "./user";
import { Section } from "./section";
export type CourseDetail = {
    id: number;
    title: string;
    slug: string;
    categories: Category[];
    status: boolean;
    description: string;
    thumbnail: string;
    summary: string;
    is_delete: boolean;
    created_at: Date;
    updated_at: Date;
    sections: Section[];
    total_rating: number;
    number_of_rating: number;
    number_of_enrolled: number;
    author: Author;
    price: number;
    sale_price: number;
    sale_until: Date;
};

export type CourseInfo = {
    id: number;
    title: string;
    summary: string;
    thumbnail: string;
    rating: number;
    author: Author;
    category: string[];
    number_section: number;
    slug: string;
    attendees: number;
};

export type CourseEdit = {
    id: number;
    slug: string;
    title: string;
    categories: Category[];
    summary: string;
    thumbnail: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    status: boolean;
};

export type Category = {
    id: number;
    title?: string;
    url_image: string;
    description: string;
};

export type OutstandingCourse = {
    id: number;
    thumbnail: string;
    title: string;
    slug: string;
    categories: Category[];
    author: Author;
    created_at: Date;
    updated_at: Date;
};

export type CourseCard = {
    id: number;
    slug: string;
    title: string;
    categories: Category[];
    summary: string;
    author: Author;
    rating: number;
    attendees: number;
    number_section: number;
    thumbnail: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    status: boolean;
};
