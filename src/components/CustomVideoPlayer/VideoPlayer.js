"use client";

import React, { useRef } from "react"; // 1. Import useRef
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import {
  MediaPlayer,
  MediaProvider,
  Poster,
  PlayButton,
  useMediaState, // 2. Import useMediaState
} from "@vidstack/react";

import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

import styles from "./VideoPlayer.module.css";

export default function VideoPlayer({
  videoSrc,
  type,
  posterSrc,
  aspectRatio,
  videoId,
  onPlayStateChange,
}) {
  // 3. Create a ref for the player
  const player = useRef(null);

  // 4. Access the 'canPlay' state (true when video is ready)
  const canPlay = useMediaState("canPlay", player);

  const parsedRatio = aspectRatio ? aspectRatio.replace(":", "/") : "16/9";
  const finalSrc = type ? { src: videoSrc, type: type } : videoSrc;

  return (
    <div className={styles.playerWrapper}>
      <MediaPlayer
        ref={player} // 5. Attach the ref here
        className={styles.player}
        src={finalSrc}
        aspectRatio={parsedRatio}
        load="eager"
        posterLoad="eager"
        playsInline
        style={{
          "--media-button-hover-bg": "rgba(180, 212, 41, 0.4)",
        }}
        onPlay={() => {
          if (onPlayStateChange) onPlayStateChange(videoId, true);
        }}
        onPause={() => {
          if (onPlayStateChange) onPlayStateChange(videoId, false);
        }}
      >
        <MediaProvider>
          {posterSrc && <Poster src={posterSrc} className={styles.poster} />}
        </MediaProvider>

        {/* 6. Add 'canPlay' to the condition */}
        {canPlay && (
          <div className={styles.centerButtonContainer}>
            <PlayButton className={styles.bigPlayButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 341 366"
                style={{
                  marginLeft: "5px",
                }}
              >
                <path
                  fill="#fff"
                  d="m101 20 18 10a6827 6827 0 0 1 33 18l14 9 18 9a6444 6444 0 0 0 30 17 2661 2661 0 0 1 25 14 2260 2260 0 0 0 20 12l36 20 3 2 10 5 3 2c14 8 23 18 27 34 2 14 0 28-8 40-7 9-16 14-27 20l-3 2-9 5-13 7-3 2a2154 2154 0 0 0-19 11l-27 15a6334 6334 0 0 0-29 16l-17 10a23021 23021 0 0 0-20 11l-3 2-15 8-31 18a856 856 0 0 1-25 14l-3 2c-16 8-30 13-48 8-12-4-23-12-29-23-5-11-6-20-6-32V70c0-21 0-39 15-55 27-25 56-11 83 5"
                />
              </svg>
            </PlayButton>
          </div>
        )}

        <DefaultVideoLayout icons={defaultLayoutIcons} colorScheme="dark" />
      </MediaPlayer>
    </div>
  );
}
