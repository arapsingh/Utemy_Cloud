import { Course } from "./course";

export type InvoiceItem = {
    invoice_detail_id: number;
    retail_price: number;
    paid_price: number;
    course: Course;
};
export type Invoice = {
    invoice_id: number;
    user_id: number;
    total_money: number;
    created_at: Date | string;
    invoice_items: InvoiceItem[];
};
