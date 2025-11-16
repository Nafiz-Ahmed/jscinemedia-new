"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./Slide.module.css";
import Image from "next/image";
import Video from "../VideoPlayer/Video";
import InfiniteScrollCarousel from "../../layouts/InfiniteScrollCarousel";

const CLIENT_DATA = [
  {
    id: 1,
    name: "Joe Sinclair",
    role: "Co-founder/NattyPLUS",
    photo: "/images/TestimonialImages/avater1.jpg",
    video: "I4yjCR3AjOP4ozKXf701WX4DE6NaIoed9UuqUTksWYVQ",
    poster: "/images/TestimonialImages/Image1.jpg",
  },
  {
    id: 2,
    name: "James Barker",
    role: "Founder/GTM Hive",
    photo: "/images/TestimonialImages/avater2.jpg",
    video: "5IDKG2e00x702zA201TzEumSQlV18twudMqoCq91nBKwMM",
    poster: "/images/TestimonialImages/Image2.jpg",
  },
  {
    id: 3,
    name: "Ali Dar",
    role: "Senior Academic & Career Strategist",
    photo: "/images/TestimonialImages/avater3.jpg",
    video: "WWnwvHlQw9tCoCbzQ94iQxDTsjQQ5dBN4LFPfIr9T1o",
    poster: "/images/TestimonialImages/Image3.jpg",
  },
  {
    id: 4,
    name: "Gavin Speaks",
    role: "Spiritual Life Coach & Consciousness Mentor",
    photo: "/images/TestimonialImages/avater4.png",
    video: "Uw79TttQmTsUljSgoKv1Eyn024BjqtBwUtXVDfi2IQ6E",
    poster: "/images/TestimonialImages/Image4.png",
  },
  {
    id: 5,
    name: "Derek",
    role: "Owner of Functional Decor",
    photo: "/images/TestimonialImages/avater5.jpg",
    video: "BYxX402Lnm95q87RTkgLwJtiXqAroRwAZntsJeN01DXKQ",
    poster: "/images/TestimonialImages/Image5.jpg",
  },
  {
    id: 6,
    name: "Jessica Phillips",
    role: "Founder & CEO, The Social Standard",
    photo: "/images/TestimonialImages/avater6.png",
    video: "rhr2sKVJHVU5wzBwtkz2NEWM3dJwiwTbyqyZWZVi4YY",
    poster: "/images/TestimonialImages/Image6.png",
  },
];

function Slide() {
  const [aspectRatios, setAspectRatios] = useState({});
  const [playingVideos, setPlayingVideos] = useState(new Set());
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const resumeTimeoutRef = useRef(null);

  // Tweakable configuration
  const CAROUSEL_LOCK_ENABLED = true; // Set to false to disable carousel locking
  const RESUME_DELAY_MS = 1000; // Delay before carousel resumes after all videos stop

  // Handle video play/pause state changes
  const handleVideoPlayStateChange = useCallback((videoId, isPlaying) => {
    setPlayingVideos((prev) => {
      const newSet = new Set(prev);
      if (isPlaying) {
        newSet.add(videoId);
      } else {
        newSet.delete(videoId);
      }
      return newSet;
    });
  }, []);

  // Control auto-scroll based on video playback
  useEffect(() => {
    if (!CAROUSEL_LOCK_ENABLED) return;

    // Clear any pending resume timeout
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }

    if (playingVideos.size > 0) {
      // At least one video is playing - stop auto-scroll immediately
      setShouldAutoScroll(false);
      console.log("Auto-scroll disabled - video playing");
    } else {
      // No videos playing - resume auto-scroll after delay
      resumeTimeoutRef.current = setTimeout(() => {
        setShouldAutoScroll(true);
        console.log("Auto-scroll enabled - no videos playing");
      }, RESUME_DELAY_MS);
    }

    // Cleanup
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [playingVideos, CAROUSEL_LOCK_ENABLED, RESUME_DELAY_MS]);

  return (
    <div className={`${styles.carouselWrapper}`}>
      <div id="overlay" className={styles.container}>
        <InfiniteScrollCarousel
          axis="x"
          gap={20}
          speed={1}
          pauseOnHover={shouldAutoScroll} // Only pause on hover when auto-scroll is active
          dragAble={true}
          wheelGesture={true}
          shouldAutoScroll={shouldAutoScroll}
        >
          {CLIENT_DATA.map((client) => {
            const aspectRatio = aspectRatios[client.id] || "9/16";

            return (
              <div key={client.id} className={styles.slide}>
                <div
                  className={styles.slideContent}
                  data-aspect={aspectRatio}
                  style={{
                    aspectRatio: aspectRatio,
                    width: aspectRatio === "16/9" ? "533px" : "300px",
                  }}
                >
                  <Video
                    playbackId={client.video}
                    poster={client.poster}
                    aspectRatio={aspectRatio}
                    preload="auto"
                    onPlayStateChange={handleVideoPlayStateChange}
                  />
                </div>

                <div className={styles.clientsData}>
                  <div className={styles.client}>
                    <div className={styles.clientPhoto}>
                      <Image
                        src={client.photo}
                        alt={`${client.name} - ${client.role}`}
                        width={50}
                        height={50}
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className={styles.clientInfo}>
                      <div className={styles.clientName}>{client.name}</div>
                      <div className={styles.clientRole}>{client.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScrollCarousel>
      </div>
    </div>
  );
}

export default Slide;
