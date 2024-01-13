"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seed = async () => {
    const hashedPassword = await bcryptjs_1.default.hash("2011069020110701", _1.default.general.HASH_SALT);
    const createAdmin = await _1.default.db.user.create({
        data: {
            first_name: "UTEMY",
            last_name: "ADMIN",
            email: "utemyvietnam@gmail.com",
            is_verify: true,
            is_admin: true,
            password: hashedPassword,
        },
    });
    console.log(createAdmin);
};
seed()
    .then(async () => {
    await _1.default.db.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await _1.default.db.$disconnect();
    process.exit(1);
});
