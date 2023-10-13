import { ResponseBase, ResponseError, ResponseSuccess } from "./response";
import { sendMail } from "./mail";
import { convertJoiErrorToString } from "./joiErrorConvert";
const resolutions = ["640x360", "1280x720"];

export { ResponseBase, ResponseError, ResponseSuccess, sendMail, convertJoiErrorToString, resolutions };
