"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_config_1 = require("../configs/nodemailer.config");
const sendMail = (mailOptions) => {
    nodemailer_config_1.transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
            return false;
        }
        return true;
    });
    return true;
};
exports.sendMail = sendMail;
