import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "plyr/dist/plyr.min.mjs";
import React, { useEffect, useRef } from "react";

const AZURE_BLOB_STORAGE_URL = process.env.AZURE_BLOB_STORAGE_URL || "https://consolelake.blob.core.windows.net/users/";

type VideoJSType = {
    source: string;
};

export const VideoJS: React.FC<VideoJSType> = (props) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const updateQuality = (newQuality: any) => {
        if (Hls.isSupported()) {
            window.hls.levels.forEach((level: any, levelIndex: any) => {
                if (level.height === newQuality) {
                    window.hls.currentLevel = levelIndex;
                }
            });
        }
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        console.log("url storage blog:", AZURE_BLOB_STORAGE_URL);
        if (videoElement) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(props.source);
                hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                    window.hls = hls;
                    const availableQualities = hls.levels.map((l) => l.height);
                    const defaultOptions: Plyr.Options = {
                        controls: [
                            "restart", // Restart playback
                            "rewind", // Rewind by the seek time (default 10 seconds)
                            "play", // Play/pause playback
                            "fast-forward", // Fast forward by the seek time (default 10 seconds)
                            "progress", // The progress bar and scrubber for playback and buffering
                            "current-time", // The current time of playback
                            "duration", // The full duration of the media
                            "mute", // Toggle mute
                            "volume", // Volume control
                            "captions", // Toggle captions
                            "settings", // Settings menu
                            "pip", // Picture-in-picture (currently Safari only)
                            "airplay", // Airplay (currently Safari only)
                            "fullscreen", // Toggle fullscreen
                        ],

                        quality: {
                            default: availableQualities[availableQualities.length - 1],
                            options: availableQualities,
                            forced: true,
                            onChange: (event) => updateQuality(event),
                        },
                    };
                    new Plyr(videoElement, defaultOptions);
                });

                hls.attachMedia(videoElement);
            }
        }
    }, [props.source]);
    const isAzureBlobStorageUrl = (url: string): boolean => {
        return url.startsWith(AZURE_BLOB_STORAGE_URL);
    };
    const renderVideoElement = () => {
        if (isAzureBlobStorageUrl(props.source)) {
            return (
                <video className="w-full h-[480px]" ref={videoRef} controls>
                    {/* <source src={props.source} type="video/mp4" />
                    Your browser does not support the video tag. */}
                </video>
            );
        } else {
            return <video className="w-full h-[480px]" ref={videoRef} controls></video>;
        }
    };

    return <div className="w-full flex-1 shrink-0 text-white">{renderVideoElement()}</div>;
};

export default VideoJS;
