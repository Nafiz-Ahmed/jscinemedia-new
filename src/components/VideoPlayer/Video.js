"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useScroll } from "@/layouts/ScrollContext";
import MuxPlayer from "@mux/mux-player-react";
import { TailChase } from "ldrs/react";
import styles from "./Video.module.css";

const Video = ({
  playbackId,
  autoPlay = false,
  loop = false,
  controls = true,
  thumbnailTime = 0,
  poster = null,
  className = "",
  setVisible,
  onVideoLoad,
  maxWidth = true,
  aspectRatioSet,
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { refresh } = useScroll();
  const hasCalledLoad = useRef(false);
  const playerRef = useRef(null);
  const retryCount = useRef(0);
  const MAX_RETRIES = 3;

  // Generate thumbnail URL with proper Mux image format
  const generatedPosterUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${thumbnailTime}&width=1280`;
  const posterUrl = poster || generatedPosterUrl;

  // Helper function to determine aspect ratio
  const calculateAspectRatio = useCallback((width, height) => {
    if (!width || !height) return "16/9";

    const ratio = width / height;
    if (ratio >= 1.5) return "16/9";
    if (ratio <= 0.67) return "9/16";
    return "1/1";
  }, []);

  // Load poster and determine aspect ratio
  useEffect(() => {
    if (!posterUrl || !playbackId) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    const loadTimeout = setTimeout(() => {
      // Fallback after 5 seconds
      console.warn("Poster image load timeout, using fallback aspect ratio");
      setAspectRatio("16/9");
      setIsReady(true);
      if (onVideoLoad && !hasCalledLoad.current) {
        hasCalledLoad.current = true;
        onVideoLoad();
      }
    }, 5000);

    img.onload = () => {
      clearTimeout(loadTimeout);
      const ratio = calculateAspectRatio(img.width, img.height);
      setAspectRatio(ratio);
      setIsReady(true);

      if (onVideoLoad && !hasCalledLoad.current) {
        hasCalledLoad.current = true;
        onVideoLoad();
      }
    };

    img.onerror = () => {
      clearTimeout(loadTimeout);
      console.warn("Failed to load poster image, using fallback");
      setAspectRatio("16/9");
      setIsReady(true);
      if (onVideoLoad && !hasCalledLoad.current) {
        hasCalledLoad.current = true;
        onVideoLoad();
      }
    };

    img.src = posterUrl;

    return () => clearTimeout(loadTimeout);
  }, [playbackId, posterUrl, calculateAspectRatio, onVideoLoad]);

  // Handle metadata loaded
  const handleLoadedMetadata = useCallback(
    (event) => {
      try {
        const video = event.target;
        if (video?.videoWidth && video?.videoHeight) {
          const ratio = calculateAspectRatio(
            video.videoWidth,
            video.videoHeight
          );
          setAspectRatio(ratio);
        }
        setVideoLoaded(true);
        setHasError(false);
        setErrorMessage("");
        retryCount.current = 0;

        if (setVisible) setVisible(true);
        refresh();
      } catch (err) {
        console.error("Error in handleLoadedMetadata:", err);
      }
    },
    [calculateAspectRatio, setVisible, refresh]
  );

  // Handle player errors with retry logic
  const handleError = useCallback((event) => {
    const errorCode = event?.detail?.errorCode;
    const errorMessage = event?.detail?.errorMessage || "Unknown error";

    console.error("Mux Player Error:", {
      code: errorCode,
      message: errorMessage,
      event,
    });

    // Map Mux error codes to user-friendly messages
    let userMessage = "Error playing video. ";

    if (errorCode === 4) {
      userMessage += "Network error. Please check your connection.";
    } else if (errorMessage.includes("DECODE")) {
      userMessage +=
        "Video format not supported on this browser. Please try a different browser.";
    } else if (errorMessage.includes("NETWORK")) {
      userMessage += "Network error. Please try again.";
    } else {
      userMessage += "Please try again later.";
    }

    setErrorMessage(userMessage);
    setHasError(true);

    // Attempt retry for certain errors
    if (retryCount.current < MAX_RETRIES && errorMessage.includes("NETWORK")) {
      retryCount.current += 1;
      console.log(
        `Retrying playback (${retryCount.current}/${MAX_RETRIES})...`
      );

      setTimeout(() => {
        if (playerRef.current) {
          try {
            playerRef.current.play?.();
          } catch (err) {
            console.error("Error retrying playback:", err);
          }
        }
      }, 2000);
    }
  }, []);

  // Handle player play event
  const handlePlay = useCallback(() => {
    setHasError(false);
    setErrorMessage("");
  }, []);

  // Handle player stalled event (buffering)
  const handleStalled = useCallback(() => {
    console.log("Video stalled, buffering...");
  }, []);

  // Handle seeking
  const handleSeeking = useCallback(() => {
    // Can implement custom logic here if needed
  }, []);

  // Render error state
  if (hasError && !videoLoaded) {
    return (
      <div
        className={`${styles.muxVideoContainer} ${styles.error} ${className}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          aspectRatio: aspectRatioSet === 2 ? "16/9" : "9/16",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#1a1a1a",
          padding: "20px",
          textAlign: "center",
          ...(maxWidth && {
            maxWidth: aspectRatioSet === 2 ? "550px" : "280px",
          }),
        }}
      >
        <div style={{ color: "white", fontSize: "14px" }}>
          <p style={{ marginBottom: "10px" }}>⚠️ {errorMessage}</p>
          <button
            onClick={() => {
              setHasError(false);
              setErrorMessage("");
              retryCount.current = 0;
              if (playerRef.current) {
                playerRef.current.play?.();
              }
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--accent-color)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render loading state
  if (!isReady || !aspectRatio) {
    return (
      <div
        className={`${styles.muxVideoContainer} ${styles.skeleton} ${className}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: "200px",
          aspectRatio: aspectRatioSet === 2 ? "16/9" : "9/16",
          position: "relative",
          overflow: "hidden",
          ...(maxWidth && {
            maxWidth: aspectRatioSet === 2 ? "550px" : "280px",
          }),
        }}
      >
        <TailChase color="var(--accent-color)" size={40} />
      </div>
    );
  }

  // Render video player
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
        ref={playerRef}
        streamType="on-demand"
        playbackId={playbackId}
        poster={posterUrl}
        autoPlay={autoPlay}
        loop={loop}
        controls={controls}
        thumbnailTime={thumbnailTime}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onPlay={handlePlay}
        onStalled={handleStalled}
        onSeeking={handleSeeking}
        primaryColor="var(--accent-color)"
        accentColor="white"
        secondaryColor="transparent"
        preload="metadata"
        muted={autoPlay}
        playsInline={true}
        crossOrigin="anonymous"
        disablePictureInPicture={false}
        preferPlayback="mse"
        metadata={{
          video_id: playbackId,
          video_title: "Video",
        }}
        style={{
          width: "101%",
          height: "101%",
          backgroundColor: "transparent",
          display: "block",
          margin: "0",
          padding: "0",
        }}
      />
    </div>
  );
};

export default Video;
