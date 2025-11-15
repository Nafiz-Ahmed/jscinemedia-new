"use client";

import React, { useState, useEffect } from "react";
import styles from "./Work.module.css";
import Container from "@/layouts/Container";
import Title from "@/layouts/Title";
import Grid from "@/layouts/Grid";
import Video from "../VideoPlayer/Video";
import CustomTab from "../CustomTab/CustomTab";
import { useTextRevealAnimation } from "@/hooks/useTextRevealAnimation";
import { useScroll } from "@/layouts/ScrollContext";

const VIDEOS_DATA_TYPE_1 = [
  {
    id: 1,
    title: "YouTube 1",
    playbackId: "hmxBOg3HaJ5fQt2PXuxnlOqexaQ00W26OvviWBRCVGBw",
    poster: null,
    aspectRatio: "16:9",
    thumbnailTime: 10,
  },
  {
    id: 2,
    title: "YouTube 2",
    playbackId: "2qBj9oqqfya7gbj2sOym9ZuZdtV02kuhfFWFVN301815g",
    poster: null,
    aspectRatio: "16:9",
    thumbnailTime: 5,
  },
  {
    id: 3,
    title: "YouTube 3",
    playbackId: "5tHkEqWaYTKOwgS4NJ7rSViFdDX0001Zgg2CqzZYdlHrQ",
    poster: null,
    aspectRatio: "16:9",
    thumbnailTime: 81,
  },
  {
    id: 4,
    title: "YouTube 4",
    playbackId: "ltDd7gahKJMvwWLXb7ljLuxIMq00WsluZOCe7FCbU7zE",
    poster: null,
    aspectRatio: "16:9",
    thumbnailTime: 2,
  },
];

const VIDEOS_DATA_TYPE_2 = [
  {
    id: 1,
    title: "Reels 1",
    playbackId: "CSl4KLDPtWZt2UJ9Jf02M6GpPEA1qWXzBhDWTbJrsrgw",
    poster: null,
    aspectRatio: "9:16",
    thumbnailTime: 20,
  },
  {
    id: 2,
    title: "Reels 2",
    playbackId: "ILFe02qfgN01RfnDx8b3xkc544YkxhLxynEGvUReDkqGw",
    poster: null,
    aspectRatio: "9:16",
    thumbnailTime: 10,
  },
  {
    id: 3,
    title: "Reels 3",
    playbackId: "aKS1KSoiDchKRt8UUnDm65golXoVUNLMlrYjem4nPPE",
    poster: null,
    aspectRatio: "9:16",
    thumbnailTime: 2,
  },
  {
    id: 4,
    title: "Reels 4",
    playbackId: "9VP009cC1naNfFz9g6V9j1gst01ZH7ZWjbf2a2VadyY02k",
    poster: null,
    aspectRatio: "9:16",
    thumbnailTime: 4,
  },
];

const VIDEOS_DATA_TYPE_3 = [
  {
    id: 1,
    title: "Podcast 1",
    playbackId: "otJaDN8UmOcK87Xs24XSxgWQ6s0018I0102wyI92MBmvYg",
    poster: null,
    aspectRatio: "16:9",
    thumbnailTime: 7,
  },
  {
    id: 2,
    title: "Podcast 2",
    playbackId: "42yAN2l7K9XyOg6mO7Ce01MZDXfok4hsLsELzRum9nu8",
    poster: null,
    aspectRatio: "16:9",
    thumbnailTime: 8,
  },
  {
    id: 3,
    title: "Podcast 3",
    playbackId: "xCIQJNzYyaoDv7X7naFq01LvYeoELmHKjgjnUEX202tao",
    poster: null,
    aspectRatio: "16:9",
    thumbnailTime: 9,
  },
  {
    id: 4,
    title: "Podcast 4",
    playbackId: "qaOK01UvtEqqjPhh1MrOm8PPwO4dCgdjOW02xV7a48StU",
    poster: null,
    aspectRatio: "16:9",
    thumbnailTime: 10,
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
                    <Video
                      playbackId={video.playbackId}
                      thumbnailTime={video.thumbnailTime}
                      aspectRatio={video.aspectRatio}
                      poster={video.poster}
                      preload="none"
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
