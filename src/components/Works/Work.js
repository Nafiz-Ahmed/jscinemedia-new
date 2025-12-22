"use client";

import React, { useState, useEffect } from "react";
import styles from "./Work.module.css";
import Container from "@/layouts/Container";
import Title from "@/layouts/Title";
import Grid from "@/layouts/Grid";
import VideoPlayer from "../CustomVideoPlayer/VideoPlayer";
import CustomTab from "../CustomTab/CustomTab";
import { useTextRevealAnimation } from "@/hooks/useTextRevealAnimation";
import { useScroll } from "@/layouts/ScrollContext";

const VIDEOS_DATA_TYPE_1 = [
  {
    id: 1,
    title: "YouTube 1",
    video: "/videos/yt/1.mp4",
    poster: "/videos/posters/youtube/1.webp",
    aspectRatio: "16:9",
  },
  {
    id: 2,
    title: "YouTube 2",
    video: "/videos/yt/2.mp4",
    poster: "/videos/posters/youtube/2.webp",
    aspectRatio: "16:9",
  },
  {
    id: 3,
    title: "YouTube 3",
    video: "/videos/yt/3.mp4",
    poster: "/videos/posters/youtube/3.webp",
    aspectRatio: "16:9",
  },
  {
    id: 4,
    title: "YouTube 4",
    video: "/videos/yt/4.mp4",
    poster: "/videos/posters/youtube/4.webp",
    aspectRatio: "16:9",
  },
];

const VIDEOS_DATA_TYPE_2 = [
  {
    id: 1,
    title: "Reels 1",
    video: "/videos/reels/1.mp4",
    poster: "/videos/posters/reels/1.webp",
    aspectRatio: "9:16",
  },
  {
    id: 2,
    title: "Reels 2",
    video: "/videos/reels/2.mp4",
    poster: "/videos/posters/reels/2.webp",
    aspectRatio: "9:16",
  },
  {
    id: 3,
    title: "Reels 3",
    video: "/videos/reels/3.mp4",
    poster: "/videos/posters/reels/3.webp",
    aspectRatio: "9:16",
  },
  {
    id: 4,
    title: "Reels 4",
    video: "/videos/reels/4.mp4",
    poster: "/videos/posters/reels/4.webp",
    aspectRatio: "9:16",
  },
];

const VIDEOS_DATA_TYPE_3 = [
  {
    id: 1,
    title: "Podcast 1",
    video: "/videos/podcasts/1.mp4",
    poster: "/videos/posters/podcasts/1.webp",
    aspectRatio: "16:9",
  },
  {
    id: 2,
    title: "Podcast 2",
    video: "/videos/podcasts/2.mp4",
    poster: "/videos/posters/podcasts/2.webp",
    aspectRatio: "16:9",
  },
  {
    id: 3,
    title: "Podcast 3",
    video: "/videos/podcasts/3.mp4",
    poster: "/videos/posters/podcasts/3.webp",
    aspectRatio: "16:9",
  },
  {
    id: 4,
    title: "Podcast 4",
    video: "/videos/podcasts/4.mp4",
    poster: "/videos/posters/podcasts/4.webp",
    aspectRatio: "16:9",
  },
];

const NoVideos = ({ message = "No videos available for this category" }) => (
  <div className={styles.noVideos}>
    <p className={styles.noVideosText}>{message}</p>
  </div>
);

function Work() {
  const { isLoading } = useScroll();
  const titleRef = useTextRevealAnimation({
    isLoading: isLoading,
  });

  const PROJECT_TYPES = [
    {
      id: 1,
      label: "YouTube Videos",
      accessibility: () => setCurrentType(1),
    },
    {
      id: 2,
      label: "Shorts/Reels",
      accessibility: () => setCurrentType(2),
    },
    {
      id: 3,
      label: "Podcast Videos",
      accessibility: () => setCurrentType(3),
    },
  ];

  const [currentType, setCurrentType] = useState(1);

  const getCurrentVideos = () => {
    switch (currentType) {
      case 1:
        return VIDEOS_DATA_TYPE_1;
      case 2:
        return VIDEOS_DATA_TYPE_2;
      case 3:
        return VIDEOS_DATA_TYPE_3;
      default:
        return [];
    }
  };

  const currentVideos = getCurrentVideos();

  // Determine columns based on video type
  // Type 2 is Reels (portrait), others are landscape
  const columns = currentType === 2 ? 4 : 2;

  return (
    <section className={styles.work}>
      <Container>
        <div ref={titleRef}>
          <Title>
            See <span> the impact </span> of our work.
          </Title>
        </div>
        <div className={styles.projects}>
          <div className={styles.projectSwap}>
            <CustomTab elements={PROJECT_TYPES} defaultSelected={1} />
          </div>
          <div className={styles.showProject}>
            {currentVideos.length === 0 ? (
              <NoVideos
                message={`No ${PROJECT_TYPES.find(
                  (type) => type.id === currentType
                )?.label.toLowerCase()} available`}
              />
            ) : (
              <Grid columns={columns}>
                {currentVideos.map((video) => (
                  <div
                    className={styles.video}
                    key={`${currentType}-${video.id}`}
                  >
                    <VideoPlayer
                      videoSrc={video.video}
                      posterSrc={video.poster}
                      aspectRatio={video.aspectRatio}
                    />
                  </div>
                ))}
              </Grid>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Work;
