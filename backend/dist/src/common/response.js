"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseError = exports.ResponseSuccess = exports.ResponseBase = void 0;
class ResponseBase {
    status_code;
    message;
    success;
    constructor(status_code, message, success) {
        this.status_code = status_code;
        this.message = message;
        this.success = success;
    }
    getStatusCode() {
        return this.status_code;
    }
}
exports.ResponseBase = ResponseBase;
class ResponseSuccess extends ResponseBase {
    data;
    constructor(status_code, message, success, data) {
        super(status_code, message, success);
        this.data = data;
    }
}
exports.ResponseSuccess = ResponseSuccess;
class ResponseError extends ResponseBase {
    constructor(status_code, message, success) {
        super(status_code, message, success);
    }
}
exports.ResponseError = ResponseError;
