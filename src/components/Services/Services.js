"use client";

import Title from "@/layouts/Title";
import React from "react";
import Container from "@/layouts/Container";
import styles from "./Services.module.css";
import Card from "./Card";
import { useTextRevealAnimation } from "@/hooks/useTextRevealAnimation";
import { useScroll } from "@/layouts/ScrollContext";
import InfiniteScrollCarousel from "@/layouts/InfiniteScrollCarousel";

const OFFERINGS_ONE = [
  {
    id: 1,
    title: "YouTube Videos",
    description:
      "YouTube videos made more engaging than ever for longer watch time and more subscribers.",
  },
  {
    id: 2,
    title: "Short Form Videos",
    description:
      "Nail your Reels, TikToks, LinkedIn and YouTube shorts to optimize engagement and shareability.",
  },
  {
    id: 3,
    title: "Podcast Editing",
    description:
      "Podcasts edited to perfection for clear sound, engaging flow, and a loyal audience.",
  },
];

const OFFERINGS_TWO = [
  {
    id: 4,
    title: "VLOGS",
    description:
      "Vlogs crafted for smooth storytelling, vibrant visuals, and an audience that keeps coming back.",
  },
  {
    id: 5,
    title: "Ad Creatives & VSLs",
    description:
      "High-converting ad creatives and VSLs crafted to grab attention, drive action, and boost sales.",
  },
  {
    id: 6,
    title: "LinkedIn Videos",
    description:
      "We interview you once and turn it into 12 punchy LinkedIn videos that build trust, authority, and inbound leads.",
  },
];

const VIDEO_CATEGORIES = [
  { id: 1, name: "Talking Head Videos" },
  { id: 2, name: "Vlogs" },
  { id: 3, name: "Podcast Videos" },
  { id: 4, name: "Social Media Reels / TikToks" },
  { id: 5, name: "Social Media ADs" },
  { id: 6, name: "Commercial Videos" },
  { id: 7, name: "LinkedIn Videos" },
  { id: 8, name: "Travel Videos" },
  { id: 9, name: "Real Estate Content" },
  { id: 10, name: "Gaming Videos" },
  { id: 11, name: "Courses" },
  { id: 12, name: "Wedding Videos" },
  { id: 13, name: "Event Highlights" },
];

// Tag background colors pattern: 1 -> 2 -> 3 -> 2 -> repeat
const TAG_COLORS = [
  "rgba(180, 212, 41, 0.5)",
  "rgba(180, 212, 41, 0.2)",
  "rgba(180, 212, 41, 0.1)",
  "rgba(180, 212, 41, 0.2)",
];

function Services() {
  const { isLoading } = useScroll();
  const titleRef = useTextRevealAnimation({
    isLoading: isLoading,
  });

  return (
    <div className={styles.servicesSection}>
      <Container>
        <div ref={titleRef}>
          <Title>
            <span>Explore</span> what we offer.
          </Title>
        </div>

        <div className={styles.carouselWrapper}>
          <div id="overlay" className={styles.categories}>
            <InfiniteScrollCarousel axis="x" speed={0.4}>
              {VIDEO_CATEGORIES.map((category, idx) => (
                <div
                  key={category.id}
                  className={styles.category}
                  style={{
                    backgroundColor: TAG_COLORS[idx % TAG_COLORS.length],
                  }}
                >
                  {category.name}
                </div>
              ))}
            </InfiniteScrollCarousel>
          </div>

          <div id="overlay" className={styles.categories}>
            <InfiniteScrollCarousel axis="x" speed={0.4} direction="reverse">
              {VIDEO_CATEGORIES.map((category, idx) => (
                <div
                  key={category.id}
                  className={styles.category}
                  style={{
                    backgroundColor: TAG_COLORS[idx % TAG_COLORS.length],
                  }}
                >
                  {category.name}
                </div>
              ))}
            </InfiniteScrollCarousel>
          </div>
        </div>

        <div className={styles.wrapper}>
          <div>
            {OFFERINGS_ONE.map((offer) => (
              <Card key={offer.id} data={offer} right />
            ))}
          </div>

          <div>
            {OFFERINGS_TWO.map((offer) => (
              <Card key={offer.id} data={offer} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Services;
