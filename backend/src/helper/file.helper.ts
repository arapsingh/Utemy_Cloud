import configs from "../configs";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import ffmpegpath from "@ffmpeg-installer/ffmpeg";
import ffprobePath from "@ffprobe-installer/ffprobe";
ffmpeg.setFfmpegPath(ffmpegpath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

const bandwidthCalculation = (inputVideo: Express.Multer.File): Promise<number> => {
    return new Promise((resolve, rejects) => {
        ffmpeg.ffprobe(inputVideo.path, (error, metadata) => {
            if (error) {
                rejects(error);
            } else {
                const bandwidth: number = inputVideo.size / (metadata.format.duration as number);
                resolve(bandwidth);
            }
        });
    });
};

const createFileM3U8AndTS = async (
    inputFileVideo: Express.Multer.File,
    resolutions: string[],
    outputFolderPath: string,
    uuid: string,
) => {
    // mỗi video ứng với 1 uuid
    resolutions.map((resolution) => {
        const videoFolderPath = path.join(outputFolderPath, uuid, `video_${resolution}`); //folder path để chứa resolution của 1 video

        if (!fs.existsSync(videoFolderPath)) {
            fs.mkdirSync(videoFolderPath, { recursive: true });
        } // nếu folder trên ko tồn tại thì tạo
        const videoPath = path.join(videoFolderPath, `video_${resolution}.m3u8`); // địa chỉ file m3u8 của mỗi resolution, video path = folder path + tên file

        ffmpeg(inputFileVideo.path)
            .output(videoPath)
            .outputOptions([`-s ${resolution}`, "-c:v h264", "-c:a aac", "-f hls", "-hls_time 10", "-hls_list_size 0"])
            .on("progress", (progress) => {
                // In thông tin tiến trình xử lý video
                console.log(` Progress ${JSON.stringify(progress)}`);
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
const createMainM3U8 = async (
    inputFileVideo: Express.Multer.File,
    resolutions: string[],
    outputFolderPath: string,
    uuid: string,
) => {
    const outputMainM3U8 = path.resolve(outputFolderPath, uuid, `main.m3u8`); //tạo output là path dẫn đến file main.m3u8

    const bandwidth = bandwidthCalculation(inputFileVideo);
    //với mỗi resolution tạo 1 stream info làm nội dung trong file main.m3u8
    const streamInfoArray = resolutions.map((resolution) => {
        return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\nvideo_${resolution}/video_${resolution}.m3u8`;
    });

    //nội dung cuối cùng của file m3u8, gồm streamInfoArray nối với nhau và các chuỗi nối với nhau cách nhau bởi dấu \n
    const mainM3U8Content = "#EXTM3U\n#EXT-X-VERSION:3\n" + streamInfoArray.join("\n");

    //tạo file main và ghi nội dung vào file main
    fs.writeFileSync(outputMainM3U8, mainM3U8Content);
    //trả về url của video là path tơi file main
    const urlVideo = configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS + `//${uuid}//main.m3u8`;
    return urlVideo;
};
const destroyedVideoIfFailed = async (filePath: string): Promise<boolean> => {
    try {
        if (filePath) {
            const folderPath = path.dirname(filePath);
            fs.rmSync(folderPath, { recursive: true });
            return true;
        } else return false;
    } catch (error) {
        console.log(error);
        return false;
    }
};
const destroyedFileIfFailed = async (filePath: string): Promise<boolean> => {
    try {
        if (filePath) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
};
const FileHelper = {
    createFileM3U8AndTS,
    destroyedVideoIfFailed,
    destroyedFileIfFailed,
};
export default FileHelper;
