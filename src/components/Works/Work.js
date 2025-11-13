"use client";

import React, { useState, useEffect, useMemo } from "react";
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
    poster: null, // optional custom poster URL
    thumbnailTime: 0,
  },
  {
    id: 2,
    title: "YouTube 2",
    playbackId: "2qBj9oqqfya7gbj2sOym9ZuZdtV02kuhfFWFVN301815g",
    poster: null,
    thumbnailTime: 0,
  },
  {
    id: 3,
    title: "YouTube 3",
    playbackId: "5tHkEqWaYTKOwgS4NJ7rSViFdDX0001Zgg2CqzZYdlHrQ",
    poster: null,
    thumbnailTime: 81,
  },
  {
    id: 4,
    title: "YouTube 4",
    playbackId: "ltDd7gahKJMvwWLXb7ljLuxIMq00WsluZOCe7FCbU7zE",
    poster: null,
    thumbnailTime: 2,
  },
];

const VIDEOS_DATA_TYPE_2 = [
  {
    id: 1,
    title: "Reels 1",
    playbackId: "CSl4KLDPtWZt2UJ9Jf02M6GpPEA1qWXzBhDWTbJrsrgw",
    poster: null,
    thumbnailTime: 0,
  },
  {
    id: 2,
    title: "Reels 2",
    playbackId: "ILFe02qfgN01RfnDx8b3xkc544YkxhLxynEGvUReDkqGw",
    poster: null,
    thumbnailTime: 0,
  },
  {
    id: 3,
    title: "Reels 3",
    playbackId: "aKS1KSoiDchKRt8UUnDm65golXoVUNLMlrYjem4nPPE",
    poster: null,
    thumbnailTime: 2,
  },
  {
    id: 4,
    title: "Reels 4",
    playbackId: "9VP009cC1naNfFz9g6V9j1gst01ZH7ZWjbf2a2VadyY02k",
    poster: null,
    thumbnailTime: 4,
  },
];

const VIDEOS_DATA_TYPE_3 = [
  {
    id: 1,
    title: "Podcast 1",
    playbackId: "otJaDN8UmOcK87Xs24XSxgWQ6s0018I0102wyI92MBmvYg",
    poster: null,
    thumbnailTime: 0,
  },
  {
    id: 2,
    title: "Podcast 2",
    playbackId: "42yAN2l7K9XyOg6mO7Ce01MZDXfok4hsLsELzRum9nu8",
    poster: null,
    thumbnailTime: 0,
  },
  {
    id: 3,
    title: "Podcast 3",
    playbackId: "xCIQJNzYyaoDv7X7naFq01LvYeoELmHKjgjnUEX202tao",
    poster: null,
    thumbnailTime: 0,
  },
  {
    id: 4,
    title: "Podcast 4",
    playbackId: "qaOK01UvtEqqjPhh1MrOm8PPwO4dCgdjOW02xV7a48StU",
    poster: null,
    thumbnailTime: 0,
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
  const [loadedVideos, setLoadedVideos] = useState({});
  const [renderedTypes, setRenderedTypes] = useState(new Set([1])); // Track which types have been rendered

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

  const handleVideoLoad = (typeId, videoId) => {
    setLoadedVideos((prev) => ({
      ...prev,
      [typeId]: {
        ...(prev[typeId] || {}),
        [videoId]: true,
      },
    }));
  };

  // Mark current type as rendered
  useEffect(() => {
    setRenderedTypes((prev) => new Set([...prev, currentType]));
  }, [currentType]);

  // Check if current type videos are loaded
  const isCurrentTypeLoaded = useMemo(() => {
    const typeLoaded = loadedVideos[currentType] || {};
    return Object.keys(typeLoaded).length > 0;
  }, [loadedVideos, currentType]);

  // Render all video types but only show current one
  const renderVideoType = (typeId, videos) => {
    const isActive = typeId === currentType;
    const hasBeenRendered = renderedTypes.has(typeId);

    // Only render if it's active or has been rendered before (for caching)
    if (!hasBeenRendered) return null;

    // Determine columns based on video type
    // Type 2 is Reels (portrait), others are landscape
    const columns = typeId === 2 ? 4 : 2;

    return (
      <div
        key={typeId}
        style={{
          display: isActive ? "block" : "none",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <Grid columns={columns}>
          <>
            {videos.map((video) => (
              <div className={styles.video} key={`${typeId}-${video.id}`}>
                <Video
                  playbackId={video.playbackId}
                  poster={video.poster}
                  onVideoLoad={() => handleVideoLoad(typeId, video.id)}
                  aspectRatioSet={columns}
                  thumbnailTime={video.thumbnailTime}
                />
              </div>
            ))}
          </>
        </Grid>
      </div>
    );
  };

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
              <>
                {/* Render all video types for caching */}
                {renderVideoType(1, VIDEOS_DATA_TYPE_1)}
                {renderVideoType(2, VIDEOS_DATA_TYPE_2)}
                {renderVideoType(3, VIDEOS_DATA_TYPE_3)}
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Work;
