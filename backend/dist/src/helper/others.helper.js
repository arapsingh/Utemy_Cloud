"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const countBlank = (question) => {
    const regex = new RegExp("\\$\\[\\.\\.\\.\\]\\$", "g");
    // Sử dụng match() để tìm tất cả các kết quả khớp với biểu thức chính quy
    const matches = question.match(regex);
    if (matches) {
        const num = matches.length;
        return num;
    }
    else
        return 0;
};
const others = { countBlank };
exports.default = others;
