export type QuizType = {
    quiz_id: number;
    question: string;
    quiz_group_id?: number;
    type: number;
    updated_at?: string;
    quiz_answer: QuizAnswerType[];
};
export type QuizAnswerType = {
    quiz_answer_id?: number;
    answer: string;
    is_correct: boolean;
};

export type QuizGroupType = {
    quiz_group_id?: number;
    title: string;
    description: string;
};
