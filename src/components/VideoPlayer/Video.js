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
  fillContainer = false,
  onAspectRatioDetected, // NEW: Callback to inform parent of aspect ratio
  onPlayStatusChange, // NEW: Callback to inform parent of play/pause status
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [detectedAspectRatio, setDetectedAspectRatio] = useState(null);
  const { refresh } = useScroll();
  const hasCalledLoad = useRef(false);
  const playerRef = useRef(null);
  const retryCount = useRef(0);
  const MAX_RETRIES = 3;

  // Generate high-resolution Mux thumbnail URL as fallback
  // Using 1920px width ensures good quality for both orientations
  const generatedPosterUrl = playbackId
    ? `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${thumbnailTime}&width=1920&fit_mode=smartcrop`
    : null;

  // Use provided poster or fallback to Mux thumbnail
  const posterUrl = poster || generatedPosterUrl;

  // Detect aspect ratio from Mux thumbnail
  useEffect(() => {
    if (!playbackId || !generatedPosterUrl || poster) {
      // If custom poster is provided, skip detection
      setIsReady(true);
      if (onVideoLoad && !hasCalledLoad.current) {
        hasCalledLoad.current = true;
        onVideoLoad();
      }
      return;
    }

    let isCancelled = false;
    const img = new Image();

    // Don't use crossOrigin for Mux images to avoid CORS issues
    const loadTimeout = setTimeout(() => {
      if (isCancelled) return;
      console.warn("Thumbnail load timeout, assuming 9:16");
      setDetectedAspectRatio("9/16");
      if (onAspectRatioDetected) onAspectRatioDetected("9/16");
      setIsReady(true);
      if (onVideoLoad && !hasCalledLoad.current) {
        hasCalledLoad.current = true;
        onVideoLoad();
      }
    }, 3000);

    img.onload = () => {
      if (isCancelled) return;
      clearTimeout(loadTimeout);

      const ratio = img.width / img.height;
      let aspectRatio = "9/16"; // Default

      if (ratio >= 1.5) {
        aspectRatio = "16/9"; // Landscape
      } else if (ratio <= 0.67) {
        aspectRatio = "9/16"; // Portrait
      } else {
        aspectRatio = "1/1"; // Square
      }

      setDetectedAspectRatio(aspectRatio);
      if (onAspectRatioDetected) onAspectRatioDetected(aspectRatio);
      setIsReady(true);

      if (onVideoLoad && !hasCalledLoad.current) {
        hasCalledLoad.current = true;
        onVideoLoad();
      }
    };

    img.onerror = () => {
      if (isCancelled) return;
      clearTimeout(loadTimeout);
      console.warn("Failed to load thumbnail, assuming 9:16");
      setDetectedAspectRatio("9/16");
      if (onAspectRatioDetected) onAspectRatioDetected("9/16");
      setIsReady(true);
      if (onVideoLoad && !hasCalledLoad.current) {
        hasCalledLoad.current = true;
        onVideoLoad();
      }
    };

    img.src = generatedPosterUrl;

    return () => {
      isCancelled = true;
      clearTimeout(loadTimeout);
    };
  }, [
    playbackId,
    generatedPosterUrl,
    poster,
    onVideoLoad,
    onAspectRatioDetected,
  ]);

  // Handle metadata loaded
  const handleLoadedMetadata = useCallback(
    (event) => {
      try {
        const video = event.target;

        // Double-check aspect ratio from actual video metadata
        if (video?.videoWidth && video?.videoHeight) {
          const ratio = video.videoWidth / video.videoHeight;
          let aspectRatio = "9/16";

          if (ratio >= 1.5) {
            aspectRatio = "16/9";
          } else if (ratio <= 0.67) {
            aspectRatio = "9/16";
          } else {
            aspectRatio = "1/1";
          }

          if (aspectRatio !== detectedAspectRatio) {
            setDetectedAspectRatio(aspectRatio);
            if (onAspectRatioDetected) onAspectRatioDetected(aspectRatio);
          }
        }

        setVideoLoaded(true);
        setHasError(false);
        setErrorMessage("");
        retryCount.current = 0;

        if (setVisible) setVisible(true);
        if (refresh) refresh();
      } catch (err) {
        console.error("Error in handleLoadedMetadata:", err);
      }
    },
    [setVisible, refresh, detectedAspectRatio, onAspectRatioDetected]
  );

  // Handle player errors with retry logic
  const handleError = useCallback((event) => {
    const errorCode = event?.detail?.errorCode;
    const errorMsg = event?.detail?.errorMessage || "Unknown error";

    console.error("Mux Player Error:", {
      code: errorCode,
      message: errorMsg,
      event,
    });

    let userMessage = "Error playing video. ";

    if (errorCode === 4) {
      userMessage += "Network error. Please check your connection.";
    } else if (errorMsg.includes("DECODE")) {
      userMessage +=
        "Video format not supported. Please try a different browser.";
    } else if (errorMsg.includes("NETWORK")) {
      userMessage += "Network error. Please try again.";
    } else {
      userMessage += "Please try again later.";
    }

    setErrorMessage(userMessage);
    setHasError(true);

    // Retry for network errors
    if (retryCount.current < MAX_RETRIES && errorMsg.includes("NETWORK")) {
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

  const handlePlay = useCallback(() => {
    setHasError(false);
    setErrorMessage("");
    if (onPlayStatusChange) onPlayStatusChange(true);
  }, [onPlayStatusChange]);

  const handleStalled = useCallback(() => {
    console.log("Video buffering...");
  }, []);

  const handlePause = useCallback(() => {
    if (onPlayStatusChange) onPlayStatusChange(false);
  }, [onPlayStatusChange]);

  const handleEnded = useCallback(() => {
    if (onPlayStatusChange) onPlayStatusChange(false);
  }, [onPlayStatusChange]);

  // Container styles
  const containerStyles = fillContainer
    ? {
        width: "100%",
        height: "100%",
      }
    : {
        width: "100%",
      };

  // Render error state
  if (hasError && !videoLoaded) {
    return (
      <div
        className={`${styles.muxVideoContainer} ${styles.error} ${className}`}
        style={{
          ...containerStyles,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          padding: "20px",
          textAlign: "center",
          minHeight: "200px",
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
  if (!isReady) {
    return (
      <div
        className={`${styles.muxVideoContainer} ${styles.skeleton} ${className}`}
        style={{
          ...containerStyles,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: fillContainer ? "100%" : "200px",
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
      style={containerStyles}
      data-aspect-ratio={detectedAspectRatio}
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
        onPause={handlePause}
        onEnded={handleEnded}
        onStalled={handleStalled}
        primaryColor="var(--accent-color)"
        accentColor="white"
        secondaryColor="transparent"
        preload="metadata"
        muted={autoPlay}
        playsInline={true}
        disablePictureInPicture={false}
        preferPlayback="mse"
        metadata={{
          video_id: playbackId,
          video_title: "Video",
        }}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
};

export default Video;
