"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./Slide.module.css";
import Image from "next/image";
import VideoPlayer from "../CustomVideoPlayer/VideoPlayer";
import InfiniteScrollCarousel from "../../layouts/InfiniteScrollCarousel";

const CLIENT_DATA = [
  {
    id: 1,
    name: "Joe Sinclair",
    role: "Co-founder/NattyPLUS",
    photo: "/images/TestimonialImages/avater1.jpg",
    video: "/videos/testimonials/1.mp4",
    poster: "/videos/posters/testimonials/1.webp",
  },
  {
    id: 2,
    name: "James Barker",
    role: "Founder/GTM Hive",
    photo: "/images/TestimonialImages/avater2.jpg",
    video: "/videos/testimonials/2.mp4",
    poster: "/videos/posters/testimonials/2.webp",
  },
  {
    id: 3,
    name: "Ali Dar",
    role: "Senior Academic & Career Strategist",
    photo: "/images/TestimonialImages/avater3.jpg",
    video: "/videos/testimonials/3.mp4",
    poster: "/videos/posters/testimonials/3.webp",
  },
  {
    id: 4,
    name: "Gavin Speaks",
    role: "Spiritual Life Coach & Consciousness Mentor",
    photo: "/images/TestimonialImages/avater4.png",
    video: "/videos/testimonials/4.mp4",
    poster: "/videos/posters/testimonials/4.webp",
  },
  {
    id: 5,
    name: "Derek",
    role: "Owner of Functional Decor",
    photo: "/images/TestimonialImages/avater5.jpg",
    video: "/videos/testimonials/5.mp4",
    poster: "/videos/posters/testimonials/5.webp",
  },
  {
    id: 6,
    name: "Jessica Phillips",
    role: "Founder & CEO, The Social Standard",
    photo: "/images/TestimonialImages/avater6.png",
    video: "/videos/testimonials/6.mp4",
    poster: "/videos/posters/testimonials/6.webp",
  },
];

function Slide() {
  const [aspectRatios, setAspectRatios] = useState({});
  const [playingVideos, setPlayingVideos] = useState(new Set());
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const resumeTimeoutRef = useRef(null);

  // Tweakable configuration
  const CAROUSEL_LOCK_ENABLED = true;
  const RESUME_DELAY_MS = 1000;

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

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }

    if (playingVideos.size > 0) {
      setShouldAutoScroll(false);
      console.log("Auto-scroll disabled - video playing");
    } else {
      resumeTimeoutRef.current = setTimeout(() => {
        setShouldAutoScroll(true);
        console.log("Auto-scroll enabled - no videos playing");
      }, RESUME_DELAY_MS);
    }

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
          speed={0.5}
          pauseOnHover={shouldAutoScroll}
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
                  <VideoPlayer
                    videoId={client.id} // Added this prop
                    videoSrc={client.video}
                    posterSrc={client.poster}
                    aspectRatio={aspectRatio}
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
