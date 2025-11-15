"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  preload = "metadata",
  playButtonColor = "red",
  progressBarColor = "#ff0000",
  loadingSpinnerColor = "#ffffff",
  onError,
  onLoadStart,
  onCanPlay,
  ...rest
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [posterUrl, setPosterUrl] = useState(null);
  const playerRef = useRef(null);
  const maxRetries = 3;

  // Calculate aspect ratio value
  const getAspectRatioValue = useCallback(() => {
    if (!aspectRatio) return "16/9";
    return aspectRatio.replace(":", "/");
  }, [aspectRatio]);

  // Calculate thumbnail width based on aspect ratio
  const getThumbnailWidth = useCallback(() => {
    if (aspectRatio === "9:16") return 1200;
    return 1920;
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
        setIsLoading(false);
        setHasError(true);
      };
      img.src = thumbnailUrl;
    }
  }, [playbackId, thumbnailTime, poster, getThumbnailWidth]);

  // Handle player errors with retry logic
  const handleError = useCallback(
    (error) => {
      console.error("Mux Player Error:", error);
      setHasError(true);

      if (onError) {
        onError(error);
      }

      // Automatic retry with exponential backoff
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          setHasError(false);
          if (playerRef.current) {
            playerRef.current.load();
          }
        }, delay);
      }
    },
    [onError, retryCount]
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

      {!isLoading && hasError && retryCount >= maxRetries && (
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
            <p className={styles.errorText}>Failed to load video</p>
            <button
              className={styles.retryButton}
              onClick={() => {
                setRetryCount(0);
                setHasError(false);
                if (playerRef.current) {
                  playerRef.current.load();
                }
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        autoPlay={autoPlay}
        loop={loop}
        controls={controls}
        muted={muted}
        poster={posterUrl}
        preload={preload}
        className={styles.muxPlayer}
        onError={handleError}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        style={{
          opacity: isLoading || (hasError && retryCount >= maxRetries) ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
        accentColor={"var(--accent-color)"}
        primaryColor="white"
        secondaryColor="transparent"
        {...rest}
      />
    </div>
  );
}
