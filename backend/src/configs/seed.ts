import configs from ".";
import bcrpyt from "bcryptjs";
const seed = async () => {
    const hashedPassword = await bcrpyt.hash("2011069020110701", configs.general.HASH_SALT);
    const createAdmin = await configs.db.user.create({
        data: {
            first_name: "UTEMY",
            last_name: "ADMIN",
            email: "utemyvietnam@gmail.com",
            is_verify: true,
            is_admin: true,
            password: hashedPassword,
        },
    });
};
