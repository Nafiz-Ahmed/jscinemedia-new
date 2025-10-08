"use client";
import { useEffect, useState, useRef } from "react";
import { useScroll } from "@/layouts/ScrollContext";
import MuxPlayer from "@mux/mux-player-react";
import { TailChase } from "ldrs/react";
import styles from "./Video.module.css";

const Video = ({
  playbackId,
  autoPlay = false,
  loop = false,
  controls = true,
  thumbnailTime = 0, // default to 0s if not provided
  poster = null, // optional custom poster URL
  className = "",
  setVisible,
  onVideoLoad,
  maxWidth = true,
  aspectRatioSet,
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const { refresh } = useScroll();
  const hasCalledLoad = useRef(false);

  // Generate thumbnail URL immediately. Prefer provided poster.
  const generatedPosterUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${thumbnailTime}&width=640`;
  const posterUrl = poster || generatedPosterUrl;

  // Preload the poster image and get aspect ratio
  useEffect(() => {
    const img = new Image();
    // Use CORS anonymous in case of external images
    img.crossOrigin = "anonymous";
    img.src = posterUrl;

    img.onload = () => {
      // Calculate aspect ratio from poster dimensions
      if (img.width && img.height) {
        const ratio = img.width / img.height;
        let calculatedRatio;

        if (ratio >= 1.2) {
          calculatedRatio = "16/9";
        } else if (ratio <= 0.8) {
          calculatedRatio = "9/16";
        } else {
          calculatedRatio = "1/1";
        }

        // Set both aspect ratio and ready state together
        setAspectRatio(calculatedRatio);
        setIsReady(true);

        // Call onVideoLoad once
        if (onVideoLoad && !hasCalledLoad.current) {
          hasCalledLoad.current = true;
          onVideoLoad();
        }
      }
    };

    img.onerror = () => {
      // Fallback if image fails to load
      setAspectRatio("16/9");
      setIsReady(true);
      if (onVideoLoad && !hasCalledLoad.current) {
        hasCalledLoad.current = true;
        onVideoLoad();
      }
    };
  }, [playbackId, thumbnailTime, posterUrl, onVideoLoad]);

  const handleLoadedMetadata = (event) => {
    const video = event.target;
    if (video.videoWidth && video.videoHeight) {
      const ratio = video.videoWidth / video.videoHeight;

      if (ratio >= 1.2) {
        setAspectRatio("16/9");
      } else if (ratio <= 0.8) {
        setAspectRatio("9/16");
      } else {
        setAspectRatio("1/1");
      }
    }
    setVideoLoaded(true);
    if (setVisible) setVisible(true);
    refresh();
  };

  // Show loading state until aspect ratio is determined and ready
  if (!isReady || !aspectRatio) {
    // Reserve layout space to prevent layout shift by using the expected aspect ratio
    // and forcing the container to fill available width from the grid.
    return (
      <div
        className={`${styles.muxVideoContainer} ${styles.skeleton} ${className}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: "200px",
          aspectRatio: aspectRatioSet == 2 ? "16/9" : "9/16",
          position: "relative",
          overflow: "hidden",
          ...(maxWidth && {
            maxWidth: aspectRatioSet == 2 ? "550px" : "280px",
          }),
        }}
      >
        <TailChase color="var(--accent-color)" size={40} />
      </div>
    );
  }

  return (
    <div
      className={`${styles.muxVideoContainer} ${
        videoLoaded ? styles.loaded : ""
      } ${className}`}
      style={{
        aspectRatio: aspectRatio,
        ...(maxWidth && {
          maxWidth: aspectRatio === "9/16" ? "280px" : "550px",
        }),
      }}
    >
      <MuxPlayer
        streamType="on-demand"
        playbackId={playbackId}
        poster={posterUrl}
        autoPlay={autoPlay}
        loop={loop}
        controls={controls}
        thumbnailTime={thumbnailTime}
        onLoadedMetadata={handleLoadedMetadata}
        primaryColor="var(--accent-color)"
        accentColor="white"
        secondaryColor="transparent"
        preload="metadata"
        muted={autoPlay}
        playsInline={true}
        crossOrigin="anonymous"
        disablePictureInPicture={false}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
};

export default Video;
