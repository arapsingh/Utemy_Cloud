"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ffmpeg_1 = __importDefault(require("@ffmpeg-installer/ffmpeg"));
const ffprobe_1 = __importDefault(require("@ffprobe-installer/ffprobe"));
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.default.path);
fluent_ffmpeg_1.default.setFfprobePath(ffprobe_1.default.path);
const bandwidthCalculation = (inputVideo) => {
    return new Promise((resolve, rejects) => {
        fluent_ffmpeg_1.default.ffprobe(inputVideo.path, (error, metadata) => {
            if (error) {
                rejects(error);
            }
            else {
                const bandwidth = inputVideo.size / metadata.format.duration;
                resolve(bandwidth);
            }
        });
    });
};
const createFileM3U8AndTS = async (inputFileVideo, resolutions, outputFolderPath, uuid) => {
    // mỗi video ứng với 1 uuid
    resolutions.map((resolution) => {
        const videoFolderPath = path_1.default.join(outputFolderPath, uuid, `video_${resolution}`); //folder path để chứa resolution của 1 video
        if (!fs_1.default.existsSync(videoFolderPath)) {
            fs_1.default.mkdirSync(videoFolderPath, { recursive: true });
        } // nếu folder trên ko tồn tại thì tạo
        const videoPath = path_1.default.join(videoFolderPath, `video_${resolution}.m3u8`); // địa chỉ file m3u8 của mỗi resolution, video path = folder path + tên file
        (0, fluent_ffmpeg_1.default)(inputFileVideo.path)
            .output(videoPath)
            .outputOptions([`-s ${resolution}`, "-c:v h264", "-c:a aac", "-f hls", "-hls_time 10", "-hls_list_size 0"])
            .on("progress", (progress) => {
            // In thông tin tiến trình xử lý video
            // console.log(` Progress ${JSON.stringify(progress)}`);
        })
            .on("end", () => {
            console.log(`Conversion to m3u8 completed.`);
        })
            .on("error", (err) => {
            console.error(`Error: ${err}`);
        })
            .run();
        //.save(videoPath);
    });
    // thực hiện tạo file main m3u8
    const urlVideo = createMainM3U8(inputFileVideo, resolutions, outputFolderPath, uuid);
    return urlVideo;
};
const createMainM3U8 = async (inputFileVideo, resolutions, outputFolderPath, uuid) => {
    const outputMainM3U8 = path_1.default.resolve(outputFolderPath, uuid, `main.m3u8`); //tạo output là path dẫn đến file main.m3u8
    const bandwidth = bandwidthCalculation(inputFileVideo);
    //với mỗi resolution tạo 1 stream info làm nội dung trong file main.m3u8
    const streamInfoArray = resolutions.map((resolution) => {
        return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\nvideo_${resolution}/video_${resolution}.m3u8`;
    });
    //nội dung cuối cùng của file m3u8, gồm streamInfoArray nối với nhau và các chuỗi nối với nhau cách nhau bởi dấu \n
    const mainM3U8Content = "#EXTM3U\n#EXT-X-VERSION:3\n" + streamInfoArray.join("\n");
    //tạo file main và ghi nội dung vào file main
    fs_1.default.writeFileSync(outputMainM3U8, mainM3U8Content);
    //trả về url của video là path tơi file main
    const urlVideo = configs_1.default.general.PATH_TO_PUBLIC_FOLDER_VIDEOS + `//${uuid}//main.m3u8`;
    return urlVideo;
};
const destroyedVideoIfFailed = async (filePath) => {
    try {
        if (filePath) {
            const folderPath = path_1.default.dirname(filePath);
            fs_1.default.rmSync(folderPath, { recursive: true });
            return true;
        }
        else
            return false;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
const destroyedFileIfFailed = async (filePath) => {
    try {
        if (filePath) {
            fs_1.default.unlinkSync(filePath);
            return true;
        }
        return false;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
const FileHelper = {
    createFileM3U8AndTS,
    destroyedVideoIfFailed,
    destroyedFileIfFailed,
};
exports.default = FileHelper;
