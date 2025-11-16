"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useScroll } from "@/layouts/ScrollContext";
import MuxPlayer from "@mux/mux-player-react";
import styles from "./Video.module.css";

export default function Video({
  playbackId,
  autoPlay = false,
  loop = false,
  controls = true,
  muted = false,
  thumbnailTime = 0,
  poster,
  aspectRatio = "16:9",
  preload = "auto",
  playButtonColor = "red",
  progressBarColor = "#ff0000",
  loadingSpinnerColor = "#ffffff",
  onError,
  onLoadStart,
  onCanPlay,
  onPlayStateChange, // New prop to notify parent about play/pause
  ...rest
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [posterUrl, setPosterUrl] = useState(null);
  const [isBuffered, setIsBuffered] = useState(false);
  const playerRef = useRef(null);
  const retryCount = useRef(0);
  const MAX_RETRIES = 3;
  const { refresh } = useScroll();

  // Calculate aspect ratio value
  const getAspectRatioValue = useCallback(() => {
    if (!aspectRatio) return "16/9";
    return aspectRatio.replace(":", "/");
  }, [aspectRatio]);

  // Calculate thumbnail width based on aspect ratio
  const getThumbnailWidth = useCallback(() => {
    if (aspectRatio === "9:16") return 720;
    return 960;
  }, [aspectRatio]);

  // Generate thumbnail URL or use custom poster
  useEffect(() => {
    if (poster) {
      setPosterUrl(poster);
      setIsLoading(false);
    } else if (playbackId) {
      const width = getThumbnailWidth();
      const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${thumbnailTime}&width=${width}`;

      // Preload the thumbnail
      const img = new Image();
      img.onload = () => {
        setPosterUrl(thumbnailUrl);
        setIsLoading(false);
      };
      img.onerror = () => {
        console.error("Failed to load thumbnail");
        setPosterUrl(thumbnailUrl); // Still set it, Mux player will handle it
        setIsLoading(false);
      };
      img.src = thumbnailUrl;
    }
  }, [playbackId, thumbnailTime, poster, getThumbnailWidth]);

  // Handle metadata loaded
  const handleLoadedMetadata = useCallback(
    (event) => {
      try {
        setVideoLoaded(true);
        setHasError(false);
        setErrorMessage("");
        retryCount.current = 0;

        if (refresh) refresh();
      } catch (err) {
        console.error("Error in handleLoadedMetadata:", err);
      }
    },
    [refresh]
  );

  // Handle player errors with retry logic
  const handleError = useCallback(
    (event) => {
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
      } else if (errorMsg.includes("PIPELINE")) {
        userMessage += "Playback error. Retrying...";
      } else {
        userMessage += "Please try again later.";
      }

      setErrorMessage(userMessage);
      setHasError(true);

      if (onError) {
        onError(event);
      }

      // Retry for network and pipeline errors
      if (
        retryCount.current < MAX_RETRIES &&
        (errorMsg.includes("NETWORK") || errorMsg.includes("PIPELINE"))
      ) {
        retryCount.current += 1;
        console.log(
          `Retrying playback (${retryCount.current}/${MAX_RETRIES})...`
        );

        setTimeout(() => {
          if (playerRef.current) {
            try {
              setHasError(false);
              playerRef.current.play?.();
            } catch (err) {
              console.error("Error retrying playback:", err);
            }
          }
        }, 2000);
      }
    },
    [onError]
  );

  const handleLoadStart = useCallback(
    (e) => {
      if (onLoadStart) {
        onLoadStart(e);
      }
    },
    [onLoadStart]
  );

  const handleCanPlay = useCallback(
    (e) => {
      setHasError(false);
      if (onCanPlay) {
        onCanPlay(e);
      }
    },
    [onCanPlay]
  );

  const handlePlay = useCallback(() => {
    setHasError(false);
    setErrorMessage("");

    // Notify parent that video is playing
    if (onPlayStateChange) {
      onPlayStateChange(playbackId, true);
    }
  }, [onPlayStateChange, playbackId]);

  const handlePause = useCallback(() => {
    // Notify parent that video is paused
    if (onPlayStateChange) {
      onPlayStateChange(playbackId, false);
    }
  }, [onPlayStateChange, playbackId]);

  const handleStalled = useCallback(() => {
    console.log("Video buffering...");
  }, []);

  // Manual retry handler
  const handleRetry = useCallback(() => {
    setHasError(false);
    setErrorMessage("");
    retryCount.current = 0;
    if (playerRef.current) {
      playerRef.current.load();
      playerRef.current.play?.();
    }
  }, []);

  return (
    <div
      className={styles.playerContainer}
      style={{
        aspectRatio: getAspectRatioValue(),
        "--play-button-color": playButtonColor,
        "--progress-bar-color": progressBarColor,
        "--loading-spinner-color": loadingSpinnerColor,
      }}
    >
      {isLoading && (
        <div className={styles.skeleton}>
          <div className={styles.skeletonPulse}></div>
        </div>
      )}

      {hasError && !videoLoaded && (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <svg
              className={styles.errorIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
              <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
            </svg>
            <p className={styles.errorText}>{errorMessage}</p>
            <button className={styles.retryButton} onClick={handleRetry}>
              Retry
            </button>
          </div>
        </div>
      )}

      <MuxPlayer
        ref={playerRef}
        streamType="on-demand"
        playbackId={playbackId}
        poster={posterUrl}
        autoPlay={autoPlay}
        loop={loop}
        controls={controls}
        muted={autoPlay || muted} // Auto-mute if autoPlay is enabled
        preload={preload}
        thumbnailTime={thumbnailTime}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onStalled={handleStalled}
        primaryColor="var(--accent-color)"
        accentColor="white"
        secondaryColor="transparent"
        playsInline={true}
        disablePictureInPicture={false}
        preferPlayback="mse"
        metadata={{
          video_id: playbackId,
          video_title: "Video",
        }}
        className={styles.muxPlayer}
        style={{
          opacity: isLoading || (hasError && !videoLoaded) ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
        {...rest}
      />
    </div>
  );
}
