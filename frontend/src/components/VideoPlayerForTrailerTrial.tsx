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
        if (window.hls && window.hls.levels) {
            window.hls.levels.forEach((level: any, levelIndex: any) => {
                if (level.height === newQuality) {
                    window.hls.currentLevel = levelIndex;
                }
            });
        }
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            if (Hls.isSupported() && !isAzureBlobStorageUrl(props.source)) {
                const hls = new Hls();
                hls.loadSource(props.source);
                hls.attachMedia(videoElement);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    window.hls = hls;
                    const availableQualities = hls.levels.map((l) => l.height);
                    const defaultOptions: Plyr.Options = {
                        controls: [
                            "restart",
                            "rewind",
                            "play",
                            "fast-forward",
                            "progress",
                            "current-time",
                            "duration",
                            "mute",
                            "volume",
                            "captions",
                            "settings",
                            "pip",
                            "airplay",
                            "fullscreen",
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
            } else {
                const availableQualities = [360, 720];
                // Initialize Plyr for Azure Blob Storage URL
                const defaultOptions: Plyr.Options = {
                    controls: [
                        "restart",
                        "rewind",
                        "play",
                        "fast-forward",
                        "progress",
                        "current-time",
                        "duration",
                        "mute",
                        "volume",
                        "captions",
                        "settings",
                        "pip",
                        "airplay",
                        "fullscreen",
                    ],
                    quality: {
                        default: availableQualities[availableQualities.length - 1],
                        options: availableQualities,
                        forced: true,
                        onChange: (event) => updateQuality(event),
                    },
                };
                new Plyr(videoElement, defaultOptions);
            }
        }
    }, [props.source]);

    const isAzureBlobStorageUrl = (url: string): boolean => {
        return url.startsWith(AZURE_BLOB_STORAGE_URL);
    };

    const renderVideoElement = () => {
        return (
            <video className="w-full h-[480px]" ref={videoRef} controls>
                <source src={props.source} type={isAzureBlobStorageUrl(props.source) ? "video/mp4" : "application/x-mpegURL"} />
                Your browser does not support the video tag.
            </video>
        );
    };

    return (
        <div className="w-full flex-1 shrink-0 text-white">
            {renderVideoElement()}
        </div>
    );
};

export default VideoJS;
