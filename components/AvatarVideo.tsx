"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {Slider} from "@/components/ui/slider";
import {Spinner} from "@/components/ui/spinner";
import { Play, Pause, RotateCw } from "lucide-react";

type AvatarVideoProps = {
  videoUrl: string | null;
};

export function AvatarVideo({ videoUrl }: AvatarVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    if (videoUrl && videoRef.current) {
      videoRef.current.src = videoUrl;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error("Error playing video:", e));
    }
  }, [videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateProgress = () => {
        if (!isSeeking) setCurrentTime(video.currentTime);
      };

      const setVideoData = () => {
        setDuration(video.duration);
        setCurrentTime(video.currentTime);
      };

      const handleBuffering = () => {
        setIsBuffering(true);
      };

      const handleCanPlay = () => {
        setIsBuffering(false);
      };

      video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("loadedmetadata", setVideoData);
      video.addEventListener("waiting", handleBuffering);
      video.addEventListener("canplay", handleCanPlay);

      return () => {
        video.removeEventListener("timeupdate", updateProgress);
        video.removeEventListener("loadedmetadata", setVideoData);
        video.removeEventListener("waiting", handleBuffering);
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [isSeeking]);

  function togglePlayPause() {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }

  function handleSeekStart() {
    setIsSeeking(true);
  }

  function handleSeekEnd(value: number | number[]) {
    setIsSeeking(false);
    if (videoRef.current && typeof value === "number") {
      videoRef.current.currentTime = value;
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true));
      }
    }
  }

  function handleSliderChange(value: number | number[]) {
    if (typeof value === "number") {
      setCurrentTime(value);
    }
  }

  function formatTime(seconds: number) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full bg-gray-100 dark:bg-gray-800"
      />

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner className="w-12 h-12 text-white" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Slider
          value={[currentTime]}
          max={duration || 1}
          step={0.1}
          onValueChange={(value) => handleSliderChange(value[0])}
          onValueCommit={(value) => handleSeekEnd(value[0])}
          onPointerDown={handleSeekStart}
          className="w-full cursor-pointer"
        />

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={togglePlayPause}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>

            <div className="text-white text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              videoRef.current && (videoRef.current.currentTime = 0)
            }
            className="text-white hover:bg-white/20"
          >
            <RotateCw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
